# Database Schema Documentation

## Overview

The Covenant University Lost & Found platform uses MongoDB as its database. This document outlines the database structure, relationships, and key features.

## Collections

### 1. Users Collection

Stores information about registered users (students and staff).

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  fullName: String (required),
  phoneNumber: String (required),
  department: String (required, enum),
  level: String (required, enum),
  verified: Boolean (default: false),
  verificationToken: String,
  verificationTokenExpiry: Date,
  resetPasswordToken: String,
  resetPasswordExpiry: Date,
  itemsReported: [ObjectId] (ref: Item),
  itemsClaimed: [ObjectId] (ref: Item),
  reputation: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email` (unique)
- `verificationToken`
- `resetPasswordToken`

**Validation:**
- Email must end with `@covenantuniversity.edu.ng`
- Password minimum 6 characters
- Department must be from predefined list
- Level must be from predefined list

---

### 2. Items Collection

Stores information about lost and found items.

```javascript
{
  _id: ObjectId,
  type: String (required, enum: ['lost', 'found']),
  category: String (required, enum),
  title: String (required, max: 100),
  description: String (required, max: 500),
  color: String,
  brand: String,
  location: String (required, enum),
  specificLocation: String (max: 200),
  dateLostOrFound: Date (required),
  images: [String],
  status: String (enum: ['active', 'claimed', 'closed', 'pending_verification'], default: 'active'),
  reportedBy: ObjectId (ref: User, required),
  claimedBy: ObjectId (ref: User),
  potentialMatches: [{
    itemId: ObjectId (ref: Item),
    matchScore: Number,
    notifiedAt: Date
  }],
  verificationDetails: String (select: false),
  views: Number (default: 0),
  qrCode: String (unique, sparse),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Text index on `title` and `description` (for search)
- Compound index on `category`, `status`, `type`
- Index on `location` and `dateLostOrFound`
- Unique sparse index on `qrCode`

**Categories:**
- Phone, Laptop, Tablet, Charger, Headphones, Wallet, ID Card, Keys, Bag, Book, Jewelry, Clothing, Watch, Glasses, Water Bottle, Calculator, USB Drive, Other Electronics, Other

**Locations:**
- Chapel, Library, Cafeteria, Sports Complex, Male Hostel, Female Hostel, College of Science & Technology, College of Business & Social Sciences, College of Engineering, College of Development Studies, Lecture Theatre, Security Office, Admin Block, Parking Lot, Other

---

### 3. Messages Collection

Stores messages between users regarding items.

```javascript
{
  _id: ObjectId,
  item: ObjectId (ref: Item, required),
  sender: ObjectId (ref: User, required),
  receiver: ObjectId (ref: User, required),
  content: String (required, max: 1000),
  read: Boolean (default: false),
  readAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Compound index on `item` and `createdAt`
- Compound index on `sender` and `receiver`

---

## Relationships

### User → Items (One-to-Many)
- A user can report multiple items (lost or found)
- A user can claim multiple items
- Stored as arrays of ObjectIds in User model

### Item → User (Many-to-One)
- Each item is reported by one user
- Each item can be claimed by one user
- Stored as ObjectId references

### Item → Item (Many-to-Many)
- Items can have potential matches with other items
- Stored as embedded array in Item model

### Message → User & Item (Many-to-One)
- Each message belongs to one item
- Each message has one sender and one receiver
- Stored as ObjectId references

---

## Key Features

### 1. Auto-Matching Algorithm

When a new item is reported, the system automatically searches for potential matches:

```javascript
calculateMatchScore(otherItem) {
  let score = 0;
  
  // Category match (40 points)
  if (this.category === otherItem.category) score += 40;
  
  // Color match (20 points)
  if (this.color && otherItem.color && 
      this.color.toLowerCase() === otherItem.color.toLowerCase()) {
    score += 20;
  }
  
  // Location match (15 points)
  if (this.location === otherItem.location) score += 15;
  
  // Date proximity within 7 days (15 points)
  const daysDiff = Math.abs(
    (this.dateLostOrFound - otherItem.dateLostOrFound) / (1000 * 60 * 60 * 24)
  );
  if (daysDiff <= 7) score += 15;
  
  // Brand match (10 points)
  if (this.brand && otherItem.brand && 
      this.brand.toLowerCase() === otherItem.brand.toLowerCase()) {
    score += 10;
  }
  
  return score; // Max: 100 points
}
```

**Match Threshold:** Items with a score ≥ 50 are considered potential matches.

### 2. Full-Text Search

The Items collection has a text index on `title` and `description` fields, enabling:
- Keyword search
- Phrase search
- Relevance scoring

```javascript
// Example search query
db.items.find({ $text: { $search: "black iphone" } })
```

### 3. Security Features

**Password Hashing:**
- Uses bcrypt with salt rounds of 10
- Passwords are never stored in plain text
- Password field is excluded from queries by default

**Email Verification:**
- Verification token generated using crypto.randomBytes
- Token expires after 24 hours
- Users must verify email to report items

**Verification Details:**
- Hidden field only accessible to item owner
- Used to verify ownership when someone claims an item
- Never exposed in API responses

### 4. Reputation System

Users earn reputation points for:
- Successfully returning items (+10 points)
- Having items successfully claimed (+5 points)
- Reporting items that get matched (+2 points)

Reputation decreases for:
- False reports (-5 points)
- Suspicious activity (-10 points)

---

## Sample Data

### Sample User
```json
{
  "email": "john.doe@covenantuniversity.edu.ng",
  "fullName": "John Doe",
  "phoneNumber": "+234 XXX XXX XXXX",
  "department": "Computer Science",
  "level": "300",
  "verified": true,
  "reputation": 95,
  "itemsReported": ["item_id_1", "item_id_2"],
  "itemsClaimed": ["item_id_3"]
}
```

### Sample Item (Lost)
```json
{
  "type": "lost",
  "category": "Phone",
  "title": "Black iPhone 13 Pro",
  "description": "Black iPhone 13 Pro with a cracked screen protector. Has a purple case with floral design.",
  "color": "Black",
  "brand": "Apple",
  "location": "Library",
  "specificLocation": "2nd floor, near the water fountain",
  "dateLostOrFound": "2026-04-19T10:00:00Z",
  "status": "active",
  "reportedBy": "user_id_1",
  "potentialMatches": [
    {
      "itemId": "item_id_5",
      "matchScore": 85,
      "notifiedAt": "2026-04-19T12:00:00Z"
    }
  ],
  "verificationDetails": "Lock screen wallpaper is a beach photo",
  "views": 125
}
```

### Sample Message
```json
{
  "item": "item_id_1",
  "sender": "user_id_2",
  "receiver": "user_id_1",
  "content": "Hi, I think I found your phone. Can you describe the lock screen?",
  "read": false,
  "createdAt": "2026-04-20T09:00:00Z"
}
```

---

## Database Queries

### Common Queries

**Find all active lost items:**
```javascript
db.items.find({ type: 'lost', status: 'active' })
  .sort({ createdAt: -1 })
  .limit(20)
```

**Search for items by keyword:**
```javascript
db.items.find({ 
  $text: { $search: "iphone" },
  status: 'active'
})
```

**Find items by location and category:**
```javascript
db.items.find({
  location: 'Library',
  category: 'Phone',
  status: 'active'
})
```

**Get user's reported items:**
```javascript
db.users.findOne({ _id: userId })
  .populate('itemsReported')
```

**Find potential matches for an item:**
```javascript
const item = await Item.findById(itemId);
const oppositeType = item.type === 'lost' ? 'found' : 'lost';

const matches = await Item.find({
  type: oppositeType,
  status: 'active',
  category: item.category
});

// Calculate match scores
matches.forEach(match => {
  const score = item.calculateMatchScore(match);
  if (score >= 50) {
    // Add to potential matches
  }
});
```

---

## Performance Optimization

### Indexes
- Text indexes for search functionality
- Compound indexes for common query patterns
- Sparse indexes for optional unique fields

### Pagination
- All list queries use pagination (default: 20 items per page)
- Reduces memory usage and improves response time

### Selective Field Loading
- Password field excluded by default
- Verification details excluded from public queries
- Only necessary fields populated in relationships

### Caching Strategy (Future Enhancement)
- Cache frequently accessed items
- Cache user profiles
- Invalidate cache on updates

---

## Backup & Recovery

### Recommended Backup Strategy

1. **Daily Automated Backups**
   - Use MongoDB Atlas automated backups (if using cloud)
   - Or use `mongodump` for local installations

2. **Backup Command:**
```bash
mongodump --uri="mongodb://localhost:27017/cu-lostandfound" --out=/backup/$(date +%Y%m%d)
```

3. **Restore Command:**
```bash
mongorestore --uri="mongodb://localhost:27017/cu-lostandfound" /backup/20260421
```

---

## Migration Scripts

### Adding New Fields

When adding new fields to existing collections, use migration scripts:

```javascript
// Example: Add 'featured' field to all items
db.items.updateMany(
  { featured: { $exists: false } },
  { $set: { featured: false } }
);
```

### Data Cleanup

```javascript
// Remove expired verification tokens
db.users.updateMany(
  { verificationTokenExpiry: { $lt: new Date() } },
  { $unset: { verificationToken: "", verificationTokenExpiry: "" } }
);
```

---

## Security Considerations

1. **Never expose sensitive fields** in API responses
2. **Validate all inputs** before database operations
3. **Use parameterized queries** to prevent injection
4. **Implement rate limiting** on write operations
5. **Regular security audits** of database access patterns
6. **Encrypt sensitive data** at rest (MongoDB encryption)
7. **Use connection string secrets** (never commit to Git)

---

## Monitoring

### Key Metrics to Monitor

- Query performance (slow queries)
- Database size growth
- Index usage statistics
- Connection pool utilization
- Error rates

### MongoDB Monitoring Tools

- MongoDB Atlas built-in monitoring
- MongoDB Compass for local development
- Custom logging for application-level metrics

---

This schema is designed to be scalable, secure, and optimized for the specific use case of a university lost and found platform.
