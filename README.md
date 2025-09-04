# Retrospective Board - Modern Todo App

A modern, full-stack retrospective board application built with Angular and Node.js, featuring smooth animations and a clean Kanban-style interface.

![Project Screenshot](https://via.placeholder.com/800x400/f8f9fa/2c3e50?text=Retrospective+Board)

## ✨ Features

- **Three-Column Kanban Layout**: Start Doing, Do Differently, Keep Doing
- **Smooth Animations**: Beautiful transitions for card movements and interactions
- **Real-time Sorting**: Automatic sorting with incomplete items prioritized
- **Modern UI**: Clean, responsive design with hover effects and visual feedback
- **Database Persistence**: SQLite database with Prisma ORM
- **TypeScript**: Full type safety across frontend and backend
- **Angular Signals**: Modern reactive state management

## 🚀 Tech Stack

### Frontend
- **Angular 18+** with standalone components
- **Angular Signals** for reactive state management
- **TypeScript** for type safety
- **CSS3** with custom animations and transitions

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma ORM** with SQLite database
- **RESTful API** design

## 📁 Project Structure

```
todo/
├── frontend/                 # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Angular components
│   │   │   ├── models/       # TypeScript models
│   │   │   └── services/     # Angular services
│   │   └── styles.css        # Global styles
│   └── package.json
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── scripts/          # Database scripts
│   │   └── types/            # TypeScript types
│   ├── prisma/               # Database schema and migrations
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd todo
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Set up the Database
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with sample data
npx ts-node src/scripts/seed.ts
```

### 4. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## 🏃‍♂️ Running the Application

### Start the Backend Server
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:3000`

### Start the Frontend Development Server
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:4200`

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all retrospective items |
| POST | `/api/todos` | Create a new retrospective item |
| PUT | `/api/todos/:id` | Update an existing item |
| DELETE | `/api/todos/:id` | Delete an item |

## 🎨 Features in Detail

### Smooth Animations
- **Card Transitions**: Smooth sliding and scaling effects when cards appear
- **Hover Effects**: Interactive feedback with shadows and transforms
- **Button Interactions**: Pulse animations and scaling on user actions
- **Sorting Animation**: Smooth repositioning when items are sorted

### Retrospective Categories
- **Start Doing** (Blue): New practices or habits to begin
- **Do Differently** (Pink): Existing practices that need improvement
- **Keep Doing** (Green): Successful practices to continue

### State Management
- **Angular Signals**: Modern reactive state management
- **Computed Properties**: Automatic sorting and filtering
- **Real-time Updates**: Immediate UI updates with backend sync

## 🧪 Development

### Backend Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
```

### Frontend Scripts
```bash
npm start            # Start development server
npm run build        # Build for production
npm test             # Run unit tests
npm run lint         # Run linting
```

### Database Management
```bash
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate   # Create and apply migrations
npx prisma generate  # Generate Prisma client
```

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set environment variables
3. Deploy to your preferred hosting service (Heroku, Vercel, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist/` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Angular team for the excellent framework
- Prisma team for the amazing ORM
- The open-source community for inspiration and tools
