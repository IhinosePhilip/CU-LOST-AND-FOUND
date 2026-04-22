const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Item = require('../models/Item');
const User = require('../models/User');
const { protect, verifiedOnly } = require('../middleware/auth');

// @route   GET /api/items
// @desc    Get all items with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      type, 
      category, 
      location, 
      status = 'active',
      search,
      page = 1,
      limit = 20
    } = req.query;

    const query = { status };

    if (type) query.type = type;
    if (category) query.category = category;
    if (location) query.location = location;
    if (search) {
      query.$text = { $search: search };
    }

    const items = await Item.find(query)
      .populate('reportedBy', 'fullName department')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Item.countDocuments(query);

    res.json({
      success: true,
      items,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch items',
      error: error.message
    });
  }
});

// @route   GET /api/items/:id
// @desc    Get single item
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('reportedBy', 'fullName phoneNumber department level')
      .populate('claimedBy', 'fullName');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Increment views
    item.views += 1;
    await item.save();

    res.json({
      success: true,
      item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch item',
      error: error.message
    });
  }
});

// @route   POST /api/items
// @desc    Report a lost or found item
// @access  Private (verified users only)
router.post('/', [
  protect,
  verifiedOnly,
  body('type').isIn(['lost', 'found']).withMessage('Type must be lost or found'),
  body('category').notEmpty().withMessage('Category is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('dateLostOrFound').isISO8601().withMessage('Valid date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const itemData = {
      ...req.body,
      reportedBy: req.user._id
    };

    const item = await Item.create(itemData);

    // Add to user's reported items
    await User.findByIdAndUpdate(req.user._id, {
      $push: { itemsReported: item._id }
    });

    // Find potential matches
    const oppositeType = item.type === 'lost' ? 'found' : 'lost';
    const potentialMatches = await Item.find({
      type: oppositeType,
      status: 'active',
      category: item.category
    });

    const matches = [];
    for (const match of potentialMatches) {
      const score = item.calculateMatchScore(match);
      if (score >= 50) { // Threshold for notification
        matches.push({
          itemId: match._id,
          matchScore: score,
          notifiedAt: new Date()
        });
      }
    }

    if (matches.length > 0) {
      item.potentialMatches = matches;
      await item.save();
    }

    const populatedItem = await Item.findById(item._id)
      .populate('reportedBy', 'fullName department');

    res.status(201).json({
      success: true,
      message: 'Item reported successfully',
      item: populatedItem,
      matchesFound: matches.length
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to report item',
      error: error.message
    });
  }
});

// @route   PUT /api/items/:id
// @desc    Update item
// @access  Private (owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check ownership
    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    const allowedUpdates = ['title', 'description', 'color', 'brand', 'specificLocation', 'status'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('reportedBy', 'fullName department');

    res.json({
      success: true,
      message: 'Item updated successfully',
      item: updatedItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update item',
      error: error.message
    });
  }
});

// @route   POST /api/items/:id/claim
// @desc    Claim an item
// @access  Private
router.post('/:id/claim', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Item is not available for claiming'
      });
    }

    // Can't claim your own item
    if (item.reportedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot claim your own item'
      });
    }

    item.claimedBy = req.user._id;
    item.status = 'pending_verification';
    await item.save();

    // Add to user's claimed items
    await User.findByIdAndUpdate(req.user._id, {
      $push: { itemsClaimed: item._id }
    });

    res.json({
      success: true,
      message: 'Claim submitted. Please contact the reporter to verify ownership.',
      item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to claim item',
      error: error.message
    });
  }
});

// @route   GET /api/items/:id/matches
// @desc    Get potential matches for an item
// @access  Private
router.get('/:id/matches', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    const matches = await Item.find({
      _id: { $in: item.potentialMatches.map(m => m.itemId) }
    }).populate('reportedBy', 'fullName department');

    const matchesWithScores = matches.map(match => {
      const matchData = item.potentialMatches.find(
        m => m.itemId.toString() === match._id.toString()
      );
      return {
        ...match.toObject(),
        matchScore: matchData.matchScore
      };
    });

    res.json({
      success: true,
      matches: matchesWithScores
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch matches',
      error: error.message
    });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete item
// @access  Private (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check ownership
    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item'
      });
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete item',
      error: error.message
    });
  }
});

module.exports = router;
