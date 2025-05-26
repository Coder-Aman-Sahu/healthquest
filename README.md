# HealthQuest - MERN Application

A comprehensive health and fitness tracking application built with Node.js Express backend and React frontend.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure registration/login
- **Health Tracking**: Monitor weight, BMI, and health metrics
- **Reminders**: Set and manage health-related reminders
- **Meal Planning**: Browse meal recommendations and track nutrition
- **Workout Planning**: Access workout routines and track progress
- **Community**: Social features with posts, challenges, and friends
- **Streak Tracking**: Gamified daily activity tracking
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **CORS** for cross-origin requests

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **React Query** for data fetching
- **React Hook Form** for form handling
- **Tailwind CSS** for styling
- **Axios** for API calls

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon


**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Project Structure

\`\`\`
healthquest/
├── server.js                 # Express server entry point
├── config/
│   └── database.js          # MongoDB connection
├── controllers/             # Route controllers
├── middleware/              # Custom middleware
├── models/                  # Mongoose models
├── routes/                  # API routes
├── uploads/                 # File uploads directory
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── hooks/          # Custom hooks
│   └── public/             # Static assets
└── package.json
\`\`\`

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Reminders
- `GET /api/reminders` - Get user reminders
- `POST /api/reminders` - Create reminder
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Delete reminder

### Meals
- `GET /api/meals` - Get meals with filters
- `GET /api/meals/:id` - Get single meal
- `POST /api/meals` - Create meal (auth required)
- `GET /api/meals/recommendations` - Get meal recommendations

### Workouts
- `GET /api/workouts` - Get workouts
- `POST /api/workouts` - Create workout (auth required)
- `GET /api/workouts/recommendations` - Get workout recommendations

## 🚀 Deployment



## 🗄️ Database Schema

### User Model
\`\`\`javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  age: Number,
  weight: Number,
  height: Number,
  gender: String,
  preferences: Object,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Reminder Model
\`\`\`javascript
{
  user: ObjectId (ref: User),
  type: String,
  title: String,
  time: String,
  enabled: Boolean,
  status: String,
  createdAt: Date
}
\`\`\`

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcryptjs
- **Input Validation** with express-validator
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for secure cross-origin requests
- **Helmet.js** for security headers
- **Environment Variables** for sensitive data

## 🧪 Testing

\`\`\`bash
# Run backend tests
npm test

# Run frontend tests
cd client && npm test
\`\`\`

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices
- Progressive Web App (PWA) ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

---

**HealthQuest** - Your personalized health and fitness companion 🏃‍♂️💪🥗
#
