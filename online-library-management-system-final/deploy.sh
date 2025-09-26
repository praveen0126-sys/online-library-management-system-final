#!/bin/bash

# Library Management System Deployment Script
set -e

echo "🚀 Starting Library Management System deployment..."

# Configuration
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_env_vars() {
    local required_vars=("DB_PASSWORD" "DB_ROOT_PASSWORD" "DB_USERNAME" "JWT_SECRET")
    local missing_vars=()

    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done

    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables: ${missing_vars[*]}"
        print_error "Please set these variables or create a .env file"
        exit 1
    fi
}

# Create environment file
create_env_file() {
    print_status "Creating environment file..."

    cat > "$ENV_FILE" << EOF
# Database Configuration
DB_URL=jdbc:mysql://mysql:3306/library_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
DB_USERNAME=$DB_USERNAME
DB_PASSWORD=$DB_PASSWORD
DB_ROOT_PASSWORD=$DB_ROOT_PASSWORD

# JWT Configuration
JWT_SECRET=$JWT_SECRET

# Application Configuration
BACKEND_PORT=8081
MYSQL_PORT=3307
NGINX_PORT=80
SSL_PORT=443

    # Docker Images
    BACKEND_IMAGE=${BACKEND_IMAGE:-ghcr.io/praveen0126-sys/online-library-management-system-final/backend:latest}
    FRONTEND_IMAGE=${FRONTEND_IMAGE:-ghcr.io/praveen0126-sys/online-library-management-system-final/frontend:latest}
EOF

    print_status "Environment file created successfully"
}
backup_deployment() {
        local backup_file="${COMPOSE_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
        print_status "Creating backup of current deployment: $backup_file"
        cp "$COMPOSE_FILE" "$backup_file"
    fi
}

# Pull latest images
pull_images() {
    print_status "Pulling latest Docker images..."
    docker-compose -f "$COMPOSE_FILE" pull
}

# Stop existing containers
stop_containers() {
    print_status "Stopping existing containers..."
    docker-compose -f "$COMPOSE_FILE" down --remove-orphans
}

# Start services
start_services() {
    print_status "Starting services..."
    docker-compose -f "$COMPOSE_FILE" up -d

    print_status "Waiting for services to be healthy..."
    sleep 30

    # Check backend health
    if curl -f http://localhost:${BACKEND_PORT:-8081}/api/actuator/health > /dev/null 2>&1; then
        print_status "✅ Backend is healthy"
    else
        print_error "❌ Backend health check failed"
        return 1
    fi

    # Check frontend
    if curl -f http://localhost:${FRONTEND_PORT:-3000} > /dev/null 2>&1; then
        print_status "✅ Frontend is accessible"
    else
        print_error "❌ Frontend is not accessible"
        return 1
    fi
}

# Health check
health_check() {
    print_status "Performing health checks..."

    local max_attempts=10
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        print_status "Health check attempt $attempt/$max_attempts"

        if curl -f http://localhost:${BACKEND_PORT:-8081}/api/actuator/health > /dev/null 2>&1; then
            print_status "✅ All services are healthy!"
            return 0
        fi

        sleep 10
        ((attempt++))
    done

    print_error "❌ Health check failed after $max_attempts attempts"
    return 1
}

# Rollback function
rollback() {
    print_error "Deployment failed! Attempting rollback..."

    if [ -f "${COMPOSE_FILE}.backup" ]; then
        print_status "Restoring from backup..."
        cp "${COMPOSE_FILE}.backup" "$COMPOSE_FILE"
        docker-compose -f "$COMPOSE_FILE" up -d
        print_status "Rollback completed"
    else
        print_error "No backup found, manual intervention required"
    fi
}

# Main deployment process
main() {
    print_status "=== Library Management System Deployment ==="
    print_status "Environment: ${ENVIRONMENT:-production}"
    print_status "Timestamp: $(date)"

    # Check environment variables
    check_env_vars

    # Create environment file
    create_env_file

    # Backup current deployment
    backup_deployment

    # Pull latest images
    pull_images

    # Stop existing containers
    stop_containers

    # Start services
    if start_services; then
        # Perform health check
        if health_check; then
            print_status "🎉 Deployment completed successfully!"
            print_status "Frontend: http://localhost:${FRONTEND_PORT:-3000}"
            print_status "Backend API: http://localhost:${BACKEND_PORT:-8081}/api"
            print_status "Health Check: http://localhost:${BACKEND_PORT:-8081}/api/actuator/health"
        else
            rollback
            exit 1
        fi
    else
        rollback
        exit 1
    fi
}

# Trap to handle errors
trap 'print_error "Deployment interrupted"; rollback; exit 1' INT TERM

# Run main function
main "$@"
