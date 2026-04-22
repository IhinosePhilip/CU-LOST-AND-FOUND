# Covenant University Lost & Found - Wireframes & UI Design

## Design System

### Color Palette
- **Primary**: #6B46C1 (Purple) - Trust, authority
- **Secondary**: #10B981 (Green) - Success, found items
- **Danger**: #EF4444 (Red) - Lost items, alerts
- **Warning**: #F59E0B (Orange) - Pending actions
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headings**: Bold, 700-800 weight
- **Body**: Regular, 400 weight
- **Buttons**: Semi-bold, 600 weight

---

## Page Wireframes

### 1. Home Page

```
┌─────────────────────────────────────────────────────────────┐
│  [🔍 CU Lost & Found]    Browse  Login  Sign Up             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                       │    │
│  │   Lost Something?                                    │    │
│  │   We'll Help You Find It                            │    │
│  │                                                       │    │
│  │   Covenant University's digital lost and found       │    │
│  │   platform. Report lost items, browse found items.   │    │
│  │                                                       │    │
│  │   [Browse Items]  [Report Lost Item]                │    │
│  │                                                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              How It Works                             │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  [📱]          [✅]          [🔍]          [💬]       │   │
│  │  Report Lost   Report Found  Smart Match  Secure Chat│   │
│  │  Create a      Log found     Auto-match   Connect    │   │
│  │  detailed      items to      lost & found safely     │   │
│  │  report        help owners   items                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Platform Statistics                      │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │   500+         200+          1000+         65%       │   │
│  │   Items        Successful    Active        Recovery  │   │
│  │   Reported     Returns       Users         Rate      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 2. Browse Items Page

```
┌─────────────────────────────────────────────────────────────┐
│  [🔍 CU Lost & Found]    Browse  Report  Dashboard          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Browse Items                                                 │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Filters                                              │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │ Type:      [Lost ▼] [Found ▼] [All ▼]              │    │
│  │ Category:  [All Categories ▼]                       │    │
│  │ Location:  [All Locations ▼]                        │    │
│  │ Search:    [Search by keyword...]                   │    │
│  │            [Apply Filters]                           │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ [📱 Image]   │  │ [💻 Image]   │  │ [🎒 Image]   │      │
│  │              │  │              │  │              │      │
│  │ iPhone 13    │  │ MacBook Pro  │  │ Blue Backpack│      │
│  │ [LOST]       │  │ [FOUND]      │  │ [LOST]       │      │
│  │              │  │              │  │              │      │
│  │ Lost at      │  │ Found at     │  │ Lost at      │      │
│  │ Library      │  │ Chapel       │  │ Cafeteria    │      │
│  │              │  │              │  │              │      │
│  │ 2 days ago   │  │ 1 day ago    │  │ 3 hours ago  │      │
│  │              │  │              │  │              │      │
│  │ [View]       │  │ [View]       │  │ [View]       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ [🔑 Image]   │  │ [👓 Image]   │  │ [⌚ Image]   │      │
│  │ Car Keys     │  │ Ray-Ban      │  │ Apple Watch  │      │
│  │ [FOUND]      │  │ [LOST]       │  │ [FOUND]      │      │
│  │ ...          │  │ ...          │  │ ...          │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  [← Previous]  Page 1 of 10  [Next →]                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 3. Report Lost Item Page

```
┌─────────────────────────────────────────────────────────────┐
│  [🔍 CU Lost & Found]    Browse  Report  Dashboard          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Report Lost Item                                             │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Item Details                                         │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │                                                       │    │
│  │ Category *                                           │    │
│  │ [Select Category ▼]                                  │    │
│  │ (Phone, Laptop, Wallet, Keys, etc.)                 │    │
│  │                                                       │    │
│  │ Title *                                              │    │
│  │ [e.g., "Black iPhone 13 Pro"]                       │    │
│  │                                                       │    │
│  │ Description *                                        │    │
│  │ ┌─────────────────────────────────────────────┐     │    │
│  │ │ Describe your item in detail...             │     │    │
│  │ │ Include brand, color, distinguishing        │     │    │
│  │ │ features, etc.                              │     │    │
│  │ └─────────────────────────────────────────────┘     │    │
│  │                                                       │    │
│  │ Color                                                │    │
│  │ [Enter color]                                        │    │
│  │                                                       │    │
│  │ Brand                                                │    │
│  │ [Enter brand name]                                   │    │
│  │                                                       │    │
│  │ Where did you lose it? *                            │    │
│  │ [Select Location ▼]                                  │    │
│  │ (Chapel, Library, Cafeteria, etc.)                  │    │
│  │                                                       │    │
│  │ Specific Location                                    │    │
│  │ [e.g., "Near the entrance, 2nd floor"]              │    │
│  │                                                       │    │
│  │ When did you lose it? *                             │    │
│  │ [Select Date]                                        │    │
│  │                                                       │    │
│  │ Upload Photos (Optional)                             │    │
│  │ ┌──────┐ ┌──────┐ ┌──────┐                         │    │
│  │ │ [+]  │ │      │ │      │                         │    │
│  │ └──────┘ └──────┘ └──────┘                         │    │
│  │                                                       │    │
│  │ Verification Detail (Hidden from public)             │    │
│  │ [Something only you know about the item]             │    │
│  │ e.g., "Lock screen wallpaper is a beach photo"      │    │
│  │                                                       │    │
│  │ [Cancel]              [Submit Report]                │    │
│  │                                                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 4. Item Detail Page

```
┌─────────────────────────────────────────────────────────────┐
│  [🔍 CU Lost & Found]    Browse  Report  Dashboard          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                       │    │
│  │  ┌──────────────────┐    iPhone 13 Pro              │    │
│  │  │                  │    [LOST] [ACTIVE]             │    │
│  │  │   [📱 Image]     │                                │    │
│  │  │                  │    Lost 2 days ago             │    │
│  │  │                  │    👁 125 views                 │    │
│  │  └──────────────────┘                                │    │
│  │                                                       │    │
│  │  Description                                         │    │
│  │  ─────────────────────────────────────────────────   │    │
│  │  Black iPhone 13 Pro with a cracked screen          │    │
│  │  protector. Has a purple case with floral design.   │    │
│  │  Last seen in the library on the 2nd floor.         │    │
│  │                                                       │    │
│  │  Details                                             │    │
│  │  ─────────────────────────────────────────────────   │    │
│  │  Category:    Phone                                  │    │
│  │  Color:       Black                                  │    │
│  │  Brand:       Apple                                  │    │
│  │  Location:    Library - 2nd Floor                   │    │
│  │  Date Lost:   April 19, 2026                        │    │
│  │                                                       │    │
│  │  Reported By                                         │    │
│  │  ─────────────────────────────────────────────────   │    │
│  │  👤 John Doe                                         │    │
│  │  📚 Computer Science, 300 Level                     │    │
│  │  ⭐ Reputation: 95                                   │    │
│  │                                                       │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │ 🎯 Potential Matches Found!                 │    │    │
│  │  │                                              │    │    │
│  │  │ We found 2 similar items:                   │    │    │
│  │  │ • Black iPhone found at Library (85% match) │    │    │
│  │  │ • iPhone 13 found at Chapel (60% match)     │    │    │
│  │  │                                              │    │    │
│  │  │ [View Matches]                               │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  │                                                       │    │
│  │  [← Back to Browse]  [Claim This Item]              │    │
│  │                                                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 5. Dashboard Page

```
┌─────────────────────────────────────────────────────────────┐
│  [🔍 CU Lost & Found]    Browse  Report  Dashboard          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  My Dashboard                                                 │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ 📤           │  │ 📥           │  │ ⭐           │      │
│  │ Items        │  │ Items        │  │ Reputation   │      │
│  │ Reported     │  │ Claimed      │  │ Score        │      │
│  │              │  │              │  │              │      │
│  │    5         │  │    2         │  │    95        │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  My Reported Items                                            │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ [📱] iPhone 13 Pro                                   │    │
│  │      Lost • Library • 2 days ago                     │    │
│  │      Status: Active • 2 potential matches            │    │
│  │      [View] [Edit] [Mark as Found]                   │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │ [💻] MacBook Air                                     │    │
│  │      Lost • Cafeteria • 1 week ago                   │    │
│  │      Status: Active • 0 matches                      │    │
│  │      [View] [Edit] [Close Report]                    │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │ [🎒] Blue Backpack                                   │    │
│  │      Found • Chapel • 3 days ago                     │    │
│  │      Status: Claimed • Pending verification          │    │
│  │      [View] [Contact Claimer]                        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  Recent Activity                                              │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  • Someone viewed your "iPhone 13 Pro" report (2 hours ago)  │
│  • New match found for "MacBook Air" (1 day ago)             │
│  • Your "Blue Backpack" was claimed by Jane Smith (3 days)   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 6. Login/Register Pages

```
┌─────────────────────────────────────────────────────────────┐
│  [🔍 CU Lost & Found]    Browse  Login  Sign Up             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                                                               │
│              ┌─────────────────────────────┐                 │
│              │                             │                 │
│              │   Welcome Back!             │                 │
│              │   ─────────────────────     │                 │
│              │                             │                 │
│              │   Email Address *           │                 │
│              │   [your.email@covenant...] │                 │
│              │                             │                 │
│              │   Password *                │                 │
│              │   [••••••••••]             │                 │
│              │                             │                 │
│              │   [Forgot Password?]        │                 │
│              │                             │                 │
│              │   [Login]                   │                 │
│              │                             │                 │
│              │   Don't have an account?    │                 │
│              │   [Sign Up]                 │                 │
│              │                             │                 │
│              └─────────────────────────────┘                 │
│                                                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Mobile Responsive Design

### Mobile Navigation
```
┌─────────────────────┐
│ [☰] CU Lost & Found │
├─────────────────────┤
│                     │
│  (Hamburger menu    │
│   expands to show:) │
│                     │
│  • Browse Items     │
│  • Report Lost      │
│  • Report Found     │
│  • Dashboard        │
│  • Profile          │
│  • Logout           │
│                     │
└─────────────────────┘
```

### Mobile Item Card
```
┌─────────────────────┐
│  ┌───────────────┐  │
│  │   [Image]     │  │
│  └───────────────┘  │
│                     │
│  iPhone 13 Pro      │
│  [LOST]             │
│                     │
│  📍 Library         │
│  🕐 2 days ago      │
│                     │
│  [View Details]     │
│                     │
└─────────────────────┘
```

---

## Design Notes

### Accessibility
- High contrast ratios (WCAG AA compliant)
- Clear focus states for keyboard navigation
- Alt text for all images
- Semantic HTML structure
- Screen reader friendly labels

### Performance
- Lazy loading for images
- Pagination for large lists
- Optimized image sizes
- Minimal JavaScript bundle

### User Experience
- Clear call-to-action buttons
- Intuitive navigation
- Helpful error messages
- Loading states for async operations
- Success confirmations

### Trust & Safety
- Email verification badge
- Reputation scores
- Report suspicious activity button
- Secure messaging (no phone numbers exposed)
- Admin moderation indicators
