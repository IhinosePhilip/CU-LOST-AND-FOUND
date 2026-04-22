const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: 1000
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date
}, {
  timestamps: true
});

// Index for efficient queries
messageSchema.index({ item: 1, createdAt: -1 });
messageSchema.index({ sender: 1, receiver: 1 });

module.exports = mongoose.model('Message', messageSchema);
