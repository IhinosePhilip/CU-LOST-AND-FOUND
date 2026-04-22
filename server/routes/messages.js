const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const Item = require('../models/Item');
const { protect } = require('../middleware/auth');

// @route   GET /api/messages/item/:itemId
// @desc    Get all messages for an item
// @access  Private
router.get('/item/:itemId', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Only item owner or claimer can view messages
    const isAuthorized = 
      item.reportedBy.toString() === req.user._id.toString() ||
      (item.claimedBy && item.claimedBy.toString() === req.user._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these messages'
      });
    }

    const messages = await Message.find({ item: req.params.itemId })
      .populate('sender', 'fullName')
      .populate('receiver', 'fullName')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
});

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', [
  protect,
  body('itemId').notEmpty().withMessage('Item ID is required'),
  body('receiverId').notEmpty().withMessage('Receiver ID is required'),
  body('content').notEmpty().withMessage('Message content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { itemId, receiverId, content } = req.body;

    const message = await Message.create({
      item: itemId,
      sender: req.user._id,
      receiver: receiverId,
      content
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'fullName')
      .populate('receiver', 'fullName');

    res.status(201).json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (message.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    message.read = true;
    message.readAt = new Date();
    await message.save();

    res.json({
      success: true,
      message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update message',
      error: error.message
    });
  }
});

module.exports = router;
