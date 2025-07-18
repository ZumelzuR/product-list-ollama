# Product Management System

A full-stack product management application built with React, Node.js, and MongoDB. Features include user authentication, CRUD operations for products, search functionality, and AI-powered tag suggestions.

## 🏗️ Architecture

```
├── frontend/           # React + TypeScript + Vite
├── backend/           # Node.js + Express + TypeScript
├── ollama_backend/    # Python FastAPI for AI features
└── docker-compose.yml # Multi-container setup
```

## 🚀 Features

### Frontend (React + TypeScript)
- **Authentication**: Token-based login with session storage
- **Product Management**: Create, read, update, delete products
- **Search & Filter**: Search products by name or tags
- **Responsive Design**: Mobile-first with TailwindCSS
- **State Management**: React Query for server state
- **Type Safety**: Full TypeScript support
- **AI Integration**: Auto-suggest tags for products

### Backend (Node.js + Express)
- **RESTful API**: Full CRUD operations
- **Authentication**: JWT-based authentication
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Request validation with express-validator
- **Documentation**: Swagger/OpenAPI documentation
- **Testing**: Jest test suite
- **TypeScript**: Full type safety

### AI Backend (Python + FastAPI)
- **Tag Suggestions**: AI-powered product tag recommendations
- **Ollama Integration**: Local LLM for tag generation

## 📋 Prerequisites

- **Docker & Docker Compose**
- **Node.js 20.19.0+** (for local development)
- **Python 3.8+** (for AI backend)
- **MongoDB** (handled by Docker)

## 🐳 Quick Start with Docker

### 1. Clone the Repository
```bash
git clone <repository-url>
cd test2
```

### 2. Start All Services
```bash
docker-compose up --build
```

This will start:
- **MongoDB**: `localhost:27017`
- **Backend API**: `localhost:3000`
- **Frontend**: `localhost:8080`
- **AI Backend**: `localhost:3001` (commented out by default)

### 3. Access the Application
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/docs

### 4. Default Credentials
The backend automatically seeds the database with a test user:
- **Email**: `admin@example.com`
- **Password**: `password123`

## 🛠️ Local Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### AI Backend Development
```bash
cd ollama_backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

## 📁 Project Structure

### Frontend (`/frontend`)
```
src/
├── components/          # Reusable UI components
│   ├── ProductForm.tsx  # Product creation/editing form
│   ├── ProductList.tsx  # Product list with search and actions
│   ├── ProtectedRoute.tsx # Route protection component
│   └── index.ts        # Component exports
├── views/              # Page-level components
│   ├── LoginPage.tsx   # Login page
│   ├── Dashboard.tsx   # Main dashboard
│   └── index.ts        # View exports
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Authentication hook
├── types/              # TypeScript type definitions
│   └── index.ts        # Type exports
├── api.ts              # API client configuration
├── ollamaApi.ts        # Ollama API client
└── App.tsx             # Main application component
```

### Backend (`/backend`)
```
src/
├── controllers/        # Request handlers
│   ├── auth/          # Authentication controllers
│   └── products/      # Product controllers
├── models/            # Mongoose models
├── routes/            # API routes
├── middlewares/       # Express middlewares
├── utils/             # Utility functions
├── dto/               # Data transfer objects
├── interfaces/        # TypeScript interfaces
└── seed/              # Database seeding
```

### AI Backend (`/ollama_backend`)
```
├── main.py            # FastAPI application
├── service.py         # AI service logic
├── requirements.txt   # Python dependencies
└── start.sh          # Startup script
```

## 🔧 Configuration

### Environment Variables

#### Frontend (`.env`)
```bash
VITE_API_HOST=http://localhost:3000/api/v1
```

#### Backend (Docker environment)
```bash
NODE_ENV=development
MONGO_URI=mongodb://mongodbex:27017/test
SEED_ON_START=true
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test              # Run all tests
npm run test:dev      # Run tests in watch mode
```

### Frontend Tests
```bash
cd frontend
npm run lint          # Run ESLint
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:3000/api/v1/docs
- **API Spec**: http://localhost:3000/swagger.json

### Key Endpoints

#### Authentication
- `POST /api/v1/auth/token` - Login

#### Products
- `GET /api/v1/products` - List products
- `POST /api/v1/products` - Create product
- `GET /api/v1/products/:id` - Get product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

#### AI Backend Features
- `POST /suggest-tags` - Get tag suggestions

## 🐳 Docker Commands

### Start Services
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Rebuild and start
docker-compose up --build
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodbex
```

### Access Containers
```bash
# Backend container
docker-compose exec backend sh

# Frontend container
docker-compose exec frontend sh

# MongoDB container
docker-compose exec mongodbex mongosh
```

## 🔍 Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Ensure ports 3000, 8080, and 27017 are available
   - Modify `docker-compose.yml` if needed

2. **MongoDB Connection Issues**
   - Wait for MongoDB to fully start (may take 30-60 seconds)
   - Check logs: `docker-compose logs mongodbex`

3. **Frontend API Connection**
   - Verify `VITE_API_HOST` is set correctly
   - Check backend is running: `docker-compose logs backend`

4. **Build Issues**
   - Clear Docker cache: `docker-compose build --no-cache`
   - Remove node_modules: `docker-compose down && docker system prune`

### Development Tips

- **Hot Reload**: Frontend and backend support hot reloading
- **Database Reset**: `docker-compose down -v && docker-compose up`
- **Logs**: Use `docker-compose logs -f` for real-time logs
- **Shell Access**: Use `docker-compose exec` to access running containers

## 📝 License

This project is licensed under the ISC License.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🆘 Support

For issues and questions:
- Check the troubleshooting section
- Review the API documentation
- Check Docker logs for errors
- Ensure all prerequisites are met
