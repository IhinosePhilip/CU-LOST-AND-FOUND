const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// @route   GET /api/admin/stats
// @desc    Get dashboard summary stats
// @access  Admin
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalItems,
      lostItems,
      foundItems,
      activeItems,
      claimedItems,
      closedItems,
      recentUsers,
      recentItems
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Item.countDocuments(),
      Item.countDocuments({ type: 'lost' }),
      Item.countDocuments({ type: 'found' }),
      Item.countDocuments({ status: 'active' }),
      Item.countDocuments({ status: 'claimed' }),
      Item.countDocuments({ status: 'closed' }),
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      Item.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    ]);

    const recoveryRate = totalItems > 0
      ? Math.round((claimedItems / totalItems) * 100)
      : 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalItems,
        lostItems,
        foundItems,
        activeItems,
        claimedItems,
        closedItems,
        recentUsers,
        recentItems,
        recoveryRate
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users (spreadsheet view)
// @access  Admin
router.get('/users', async (req, res) => {
  try {
    const { search, department, level, page = 1, limit = 50 } = req.query;

    const query = { role: 'user' };
    if (department) query.department = new RegExp(department, 'i');
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { fullName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { department: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(query)
      .select('-password -verificationToken -resetPasswordToken')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/items
// @desc    Get all items (spreadsheet view)
// @access  Admin
router.get('/items', async (req, res) => {
  try {
    const {
      search, type, category, location,
      status, page = 1, limit = 50
    } = req.query;

    const query = {};
    if (type) query.type = type;
    if (category) query.category = category;
    if (location) query.location = location;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const items = await Item.find(query)
      .populate('reportedBy', 'fullName email department level')
      .populate('claimedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Item.countDocuments(query);

    res.json({
      success: true,
      items,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Promote/demote user role
// @access  Admin
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/items/:id/status
// @desc    Update item status
// @access  Admin
router.put('/items/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('reportedBy', 'fullName email');

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/items/:id
// @desc    Delete an item
// @access  Admin
router.delete('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Admin
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
