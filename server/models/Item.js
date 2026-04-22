const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['lost', 'found']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Phone',
      'Laptop',
      'Tablet',
      'Charger',
      'Headphones',
      'Wallet',
      'ID Card',
      'Keys',
      'Bag',
      'Book',
      'Jewelry',
      'Clothing',
      'Watch',
      'Glasses',
      'Water Bottle',
      'Calculator',
      'USB Drive',
      'Other Electronics',
      'Other'
    ]
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: 500
  },
  color: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    enum: [
      'Chapel',
      'Library',
      'Cafeteria',
      'Sports Complex',
      'Male Hostel',
      'Female Hostel',
      'College of Science & Technology',
      'College of Business & Social Sciences',
      'College of Engineering',
      'College of Development Studies',
      'Lecture Theatre',
      'Security Office',
      'Admin Block',
      'Parking Lot',
      'Other'
    ]
  },
  specificLocation: {
    type: String,
    trim: true,
    maxlength: 200
  },
  dateLostOrFound: {
    type: Date,
    required: [true, 'Date is required']
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'claimed', 'closed', 'pending_verification'],
    default: 'active'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  potentialMatches: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    },
    matchScore: Number,
    notifiedAt: Date
  }],
  verificationDetails: {
    type: String,
    select: false // Hidden detail only owner knows
  },
  views: {
    type: Number,
    default: 0
  },
  qrCode: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Index for search optimization
itemSchema.index({ title: 'text', description: 'text' });
itemSchema.index({ category: 1, status: 1, type: 1 });
itemSchema.index({ location: 1, dateLostOrFound: -1 });

// Calculate match score between two items
itemSchema.methods.calculateMatchScore = function(otherItem) {
  let score = 0;
  
  // Category match (most important)
  if (this.category === otherItem.category) score += 40;
  
  // Color match
  if (this.color && otherItem.color && 
      this.color.toLowerCase() === otherItem.color.toLowerCase()) {
    score += 20;
  }
  
  // Location proximity
  if (this.location === otherItem.location) score += 15;
  
  // Date proximity (within 7 days)
  const daysDiff = Math.abs(
    (this.dateLostOrFound - otherItem.dateLostOrFound) / (1000 * 60 * 60 * 24)
  );
  if (daysDiff <= 7) score += 15;
  
  // Brand match
  if (this.brand && otherItem.brand && 
      this.brand.toLowerCase() === otherItem.brand.toLowerCase()) {
    score += 10;
  }
  
  return score;
};

module.exports = mongoose.model('Item', itemSchema);
