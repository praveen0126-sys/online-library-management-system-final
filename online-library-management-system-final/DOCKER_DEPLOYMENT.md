# 🐳 Docker Deployment Guide

This guide explains how to deploy the Online Library Management System using Docker Compose.

## 📋 Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- At least 4GB of available RAM
- Ports 3000, 8080, and 3306 should be available

## 🚀 Quick Start

1. **Clone and navigate to the project directory:**
   ```bash
   cd online-library-management-system-final
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8081/api
   - MySQL Database: localhost:3307

## 🏗️ Architecture

```
┌─────────────────┐    HTTP (Port 3000)    ┌─────────────────┐
│   React Frontend │ ◄─────────────────────► │      Nginx      │
│   (Container)    │                         │   (Container)   │
└─────────────────┘                         └─────────────────┘
                                                       │
                                                       ▼
                                            ┌─────────────────┐
                                            │ Spring Boot API │
                                            │   (Port 8080)   │
                                            └─────────────────┘
                                                       │
                                                       ▼
                                            ┌─────────────────┐
                                            │  MySQL Database │
                                            │   (Port 3306)   │
                                            └─────────────────┘
```

## 🔧 Services Configuration

### Frontend Service
- **Container**: `library-frontend`
- **Port**: 3000:80
- **Technology**: React + Vite + Nginx
- **Build Context**: `./frontend`

### Backend Service
- **Container**: `library-backend`
- **Port**: 8081:8080
- **Technology**: Spring Boot + Java 21
- **Build Context**: `./backend`
- **Profile**: `docker`

### Database Service
- **Container**: `library-mysql`
- **Port**: 3307:3306
- **Technology**: MySQL 8.0
- **Database**: `library_db`
- **User**: `library_user`
- **Password**: `library_password`

## 📝 Detailed Commands

### Start Services
```bash
# Start all services in detached mode
docker-compose up -d

# Start with build (if you made changes)
docker-compose up -d --build

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete database data)
docker-compose down -v
```

### Rebuild Services
```bash
# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Rebuild all services
docker-compose build --no-cache
```

## 🔍 Health Checks & Monitoring

### Service Status
```bash
# Check running containers
docker-compose ps

# Check service health
docker-compose exec backend curl -f http://localhost:8080/api/actuator/health
```

### Database Connection
```bash
# Connect to MySQL
docker-compose exec mysql mysql -u library_user -p library_db
# Password: library_password
```

### View Application Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   lsof -i :8080
   lsof -i :3307
   
   # Kill the process or change ports in docker-compose.yml
   ```

2. **Database Connection Failed**
   ```bash
   # Check MySQL container logs
   docker-compose logs mysql
   
   # Restart MySQL service
   docker-compose restart mysql
   ```

3. **Backend Health Check Failing**
   ```bash
   # Check backend logs
   docker-compose logs backend
   
   # Verify database is ready
   docker-compose exec mysql mysqladmin ping -h localhost
   ```

4. **Frontend Not Loading**
   ```bash
   # Check nginx logs
   docker-compose logs frontend
   
   # Rebuild frontend
   docker-compose build frontend --no-cache
   ```

### Reset Everything
```bash
# Stop all services and remove everything
docker-compose down -v --rmi all

# Remove unused Docker resources
docker system prune -a

# Start fresh
docker-compose up -d --build
```

## 🔐 Default Credentials

### Database
- **Host**: localhost:3307
- **Database**: library_db
- **Username**: library_user
- **Password**: library_password
- **Root Password**: root_password

### Application
- **Admin User**: Create through the registration page and manually update role in database
- **Regular User**: Register through the application

## 📊 Performance Optimization

### Production Recommendations

1. **Use External Database**
   - Replace MySQL container with external MySQL/PostgreSQL
   - Update connection string in `application-docker.properties`

2. **Enable SSL**
   - Add SSL certificates to nginx configuration
   - Update CORS settings for HTTPS

3. **Resource Limits**
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             memory: 1G
             cpus: '0.5'
   ```

4. **Environment Variables**
   ```bash
   # Create .env file
   MYSQL_PASSWORD=your_secure_password
   JWT_SECRET=your_jwt_secret_key
   ```

## 🔄 Updates & Maintenance

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up -d --build
```

### Database Backup
```bash
# Backup database
docker-compose exec mysql mysqldump -u library_user -p library_db > backup.sql

# Restore database
docker-compose exec -i mysql mysql -u library_user -p library_db < backup.sql
```

### View Resource Usage
```bash
# Container resource usage
docker stats

# Disk usage
docker system df
```

## 🌐 Production Deployment

For production deployment, consider:

1. **Use Docker Swarm or Kubernetes**
2. **Implement proper logging and monitoring**
3. **Set up automated backups**
4. **Use secrets management**
5. **Implement CI/CD pipeline**
6. **Add load balancing**
7. **Enable HTTPS**

## 📞 Support

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify all services are healthy: `docker-compose ps`
3. Restart services: `docker-compose restart`
4. Check this troubleshooting guide

---

## 🎉 Success!

Once all services are running:
- Visit http://localhost:3000 to access the application
- Register a new user account
- Start managing your library!

The application includes:
- ✅ User registration and authentication
- ✅ Book browsing and searching
- ✅ Borrowing and returning books
- ✅ Reservation system
- ✅ Admin dashboard with analytics
- ✅ Responsive design for all devices
