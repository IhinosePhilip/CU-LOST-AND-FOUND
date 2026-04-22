# Covenant University Lost & Found Platform

A digital lost and found system designed specifically for Covenant University campus to help students and staff recover lost items efficiently.

## Project Overview

This platform replaces manual lost and found processes with a centralized, searchable database that connects finders with owners.

## Key Features

- **Report Lost Items**: Students can report items they've lost with descriptions and photos
- **Report Found Items**: Finders can log items they've found
- **Smart Search**: Searchable database organized by location (Faculty/Department/Hostel)
- **Auto-Matching**: System suggests potential matches between lost and found reports
- **Secure Authentication**: Limited to @covenantuniversity.edu.ng email addresses
- **In-App Messaging**: Secure communication without sharing personal contact details
- **Mobile-First Design**: Optimized for students on the go

## Technology Stack

- **Frontend**: React.js with responsive design
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT with email verification
- **Hosting**: Free tier (Vercel/Firebase/Railway)
- **Image Storage**: Cloudinary (free tier)

## Project Structure

```
covenant-lost-found/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Main pages
│   │   ├── services/      # API calls
│   │   └── utils/         # Helper functions
├── server/                # Node.js backend
│   ├── models/           # Database schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth & validation
│   └── controllers/      # Business logic
└── docs/                 # Documentation
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
cd covenant-lost-found
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

## Revenue Model

1. **QR Tag Sales**: Physical stickers students can attach to belongings
2. **University Partnership**: Licensing fee for official campus use
3. **Success Fee**: Small convenience fee for successful returns
4. **Premium Features**: Device pre-registration for insurance/police reports

## Roadmap

### Phase 1: MVP (Month 1-2)
- Basic report lost/found functionality
- Search and filter system
- User authentication
- Partnership with campus security

### Phase 2: Enhancement (Month 3-4)
- Auto-matching algorithm
- In-app messaging
- QR tag system
- Mobile app (PWA)

### Phase 3: Scale (Month 5-6)
- Analytics dashboard for security office
- Integration with campus Telegram groups
- Expand to other universities

## Contributing

This is a student project. Feedback and contributions are welcome!

## License

MIT License

## Contact

For questions or partnership inquiries, contact: [Your Email]
