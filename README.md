# HealthQuest - MERN Application

A comprehensive health and fitness tracking application built with Node.js Express backend and React frontend.

## 🚀 Features
<h3 align="center">App Preview</h3>

<table align="center">
  <tr>
    <td><img src="https://github.com/user-attachments/assets/13038a2e-b5a3-47be-aa64-40b29a704ff2" width="300"/></td>
    <td><img src="https://github.com/user-attachments/assets/4f4f9a87-0385-4fe4-9980-7d7876dbd98d" width="300"/></td>
    <td><img src="https://github.com/user-attachments/assets/e76b96ba-9f1e-4576-87f3-3fd20e124f4e" width="300"/></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/5244188d-80bb-4633-899c-3a386cf6a290" width="300"/></td>
    <td><img src="https://github.com/user-attachments/assets/18f2b135-aee5-46cc-a9e8-a2639933f0a4" width="300"/></td>
    <td><img src="https://github.com/user-attachments/assets/96a6a2d1-aa03-4f7b-bb2c-f57ef69eda46" width="300"/></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/9e3c25fe-ec33-409d-a61e-4b09595c388a" width="300"/></td>
    <td><img src="https://github.com/user-attachments/assets/36461a27-dba9-4242-9757-f167c0f3799b" width="300"/></td>
    <td><img src="https://github.com/user-attachments/assets/01ce2e94-2e41-456e-8cff-bf5557900e63" width="300"/></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/135e207d-3ab6-4f73-b179-0b3b4855ee2d" width="300"/></td>
    <td><img src="https://github.com/user-attachments/assets/1b31bfca-0f6f-41a6-8b94-40e6ec58e6c4" width="300"/></td>
    <td><img src="https://github.com/user-attachments/assets/73372896-f15e-47b9-8649-86d82c2d2e0e" width="300"/></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/e0e54a03-7149-4814-96c4-6d858ab4944b" width="300"/></td>
    <td><img src="https://github.com/user-attachments/assets/c936c4a4-b4c6-47b1-9c8a-603524cd4a49" width="300"/></td>
    <td><img src="https://github.com/user-attachments/assets/e435796d-2e20-486c-9853-1a66ca3448df" width="300"/></td>
  </tr>
</table>


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
