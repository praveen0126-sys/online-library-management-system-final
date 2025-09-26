# 📚 Online Library Management System

![CI/CD Pipeline](https://github.com/praveen0126-sys/online-library-management-system-final/workflows/CI%2FCD%20Pipeline/badge.svg)
![Deploy to Production](https://github.com/praveen0126-sys/online-library-management-system-final/workflows/Deploy%20to%20Production/badge.svg)
![Docker Build](https://img.shields.io/badge/docker-ready-blue.svg)
![Java](https://img.shields.io/badge/Java-21-orange.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)

A comprehensive full-stack web application for managing library operations with user authentication, book management, borrowing/returning, reservations, admin reports, and automatic book cover management.

## ✅ System Status: FULLY FUNCTIONAL
- 🔐 **Authentication**: Working with JWT tokens
- 📖 **Book Management**: 27 books with English names and cover images
- 📚 **Borrow/Reserve**: Fully functional with real-time updates
- 🖼️ **Cover Management**: Automatic fetching from Open Library API
- 👤 **User Dashboard**: Complete borrowing history and reservations
- 📊 **Admin Dashboard**: Analytics, reports, and book cover management
- 💰 **Fine System**: ₹5/day overdue fines with automatic calculation

## 🎯 Quick Start

### 1. Access the System
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api

### 2. Login Credentials
Since the system is running, you can either:

**Option A: Register New Account**
- Go to http://localhost:5173/register
- Use any email/password combination
- Example: `user@test.com` / `password123`

**Option B: Use Pre-seeded Accounts**
- **Admin**: `admin@library.com` / `password123`
- **User**: `user@library.com` / `password123`
- **User**: `jane@library.com` / `password123`

### 3. Test the Features
1. **Browse Books**: View 27 books with beautiful cover images
2. **Borrow Books**: Click "Borrow" (requires login)
3. **Reserve Books**: Click "Reserve" for popular books
4. **Admin Features**: Login as admin to manage book covers
5. **User Dashboard**: View your borrowed books and reservations

## 🚀 Tech Stack

### Backend
- **Spring Boot 3.1.5** with Maven
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **MySQL** database
- **BCrypt** password encryption

### Frontend
- **React 18** with **Vite**
- **React Router DOM** for routing
- **TailwindCSS** for styling
- **Axios** for API calls
- **Recharts** for data visualization

## 📋 Features

### User Features
- User registration and login with JWT authentication
- Browse and search books by title, author, or category
- Borrow and return books
- Reserve books when unavailable
- View borrow history and reservations
- Overdue notifications

### Admin Features
- Manage books (CRUD operations)
- View comprehensive reports with charts
- Track most borrowed books
- Monitor overdue books
- User management

## 🛠️ Setup Instructions

### Prerequisites
- Java 17 or higher
- Node.js 16+ and npm
- MySQL 8.0+
- MySQL Workbench (optional)

### Database Setup

1. **Install and start MySQL server**

2. **Create database using MySQL Workbench or command line:**
   ```sql
   CREATE DATABASE library_management_db;
   ```

3. **Update database credentials in `backend/src/main/resources/application.properties`:**
   ```properties
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies and run:**
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```
   
   Or on Windows:
   ```bash
   mvnw.cmd clean install
   mvnw.cmd spring-boot:run
   ```

3. **Backend will start on http://localhost:8080**

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Frontend will start on http://localhost:5173**

## 🎯 Usage

### Default Admin Account
After starting the application, you can create an admin account by:
1. Registering a new user
2. Manually updating the user's role to 'ADMIN' in the database
3. Or modify the registration form to allow admin registration

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

#### Books
- `GET /api/books` - Get all books
- `GET /api/books/{id}` - Get book by ID
- `GET /api/books/search?q={keyword}` - Search books
- `GET /api/books/categories` - Get all categories
- `POST /api/books` - Create book (Admin only)
- `PUT /api/books/{id}` - Update book (Admin only)
- `DELETE /api/books/{id}` - Delete book (Admin only)

#### Borrowing
- `POST /api/borrow/borrow/{bookId}` - Borrow a book
- `POST /api/borrow/return/{bookId}` - Return a book
- `GET /api/borrow/history` - Get borrow history

#### Reservations
- `POST /api/reservations/reserve/{bookId}` - Reserve a book
- `POST /api/reservations/cancel/{bookId}` - Cancel reservation
- `GET /api/reservations` - Get user reservations

#### Admin Reports
- `GET /api/admin/reports` - Get admin dashboard data

## 🗄️ Database Schema

### Tables
1. **users** - User accounts with roles
2. **books** - Book catalog with availability tracking
3. **borrow_records** - Borrowing history and status
4. **reservations** - Book reservations queue

### Relationships
- One user → many borrow_records
- One user → many reservations  
- One book → many borrow_records
- One book → many reservations

## 🎨 UI Features

### Responsive Design
- Mobile-first approach with TailwindCSS
- Clean, modern interface
- Intuitive navigation

### User Dashboard
- Borrow history table
- Active reservations
- Overdue notifications

### Admin Dashboard
- Book management interface
- Visual reports with charts
- Statistics overview

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (USER/ADMIN)
- Password encryption with BCrypt
- Protected routes on frontend
- CORS configuration for cross-origin requests

## 📊 Reports & Analytics

- Total books vs available vs borrowed
- Most borrowed books chart
- Overdue books tracking
- Pie charts and bar charts using Recharts

## 🚀 Production Deployment

### Backend
1. Build JAR file: `./mvnw clean package`
2. Run with production profile: `java -jar target/library-management-system-0.0.1-SNAPSHOT.jar`

### Frontend
1. Build for production: `npm run build`
2. Serve the `dist` folder using any web server

### Environment Variables
Set these for production:
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check credentials in application.properties
   - Verify database exists

2. **CORS Issues**
   - Frontend URL is configured in backend CORS settings
   - Default: http://localhost:5173

3. **JWT Token Issues**
   - Check if token is stored in localStorage
   - Verify JWT secret configuration

4. **Build Issues**
   - Ensure Java 17+ is installed
   - Check Node.js version (16+)
   - Clear npm cache: `npm cache clean --force`

## 📞 Support

For issues and questions, please create an issue in the repository.

---

## 🚀 GitHub Actions CI/CD

This project includes comprehensive GitHub Actions workflows for automated building, testing, and deployment.

### Features
- ✅ **Automated Testing**: Backend (Maven) and Frontend (npm) tests
- ✅ **Docker Image Building**: Multi-stage builds with caching
- ✅ **Container Registry**: GitHub Container Registry integration
- ✅ **Automated Deployment**: Staging and production environments
- ✅ **Health Checks**: Comprehensive service monitoring
- ✅ **Rollback Capability**: Automatic rollback on deployment failure

### Quick Setup
1. Fork this repository
2. Add repository secrets (see [GITHUB_ACTIONS.md](GITHUB_ACTIONS.md))
3. Push to main branch to trigger deployment
4. Monitor progress in Actions tab

### Workflow Status
- **CI/CD Pipeline**: ![CI/CD Status](https://github.com/praveen0126-sys/online-library-management-system-final/workflows/CI%2FCD%20Pipeline/badge.svg)
- **Production Deployment**: ![Deploy Status](https://github.com/praveen0126-sys/online-library-management-system-final/workflows/Deploy%20to%20Production/badge.svg)

For detailed setup instructions, see [GITHUB_ACTIONS.md](GITHUB_ACTIONS.md).
