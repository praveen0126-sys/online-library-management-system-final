#!/bin/bash

# Jenkins Deployment Script for Library Management System
set -e

echo "🚀 Starting Jenkins deployment for Library Management System..."

# Configuration
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env"
DEPLOYMENT_ENV="${DEPLOYMENT_ENV:-staging}"
BUILD_NUMBER="${BUILD_NUMBER:-latest}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_info() {
    echo -e "${BLUE}[JENKINS]${NC} $1"
}

# Function to check if required environment variables are set
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
        print_error "Please ensure these are set in Jenkins credentials or environment"
        exit 1
    fi
}

# Function to create environment file
create_env_file() {
    print_status "Creating environment file for $DEPLOYMENT_ENV..."

    cat > "$ENV_FILE" << EOF
# Database Configuration
DB_URL=jdbc:mysql://mysql:3306/library_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
DB_USERNAME=$DB_USERNAME
DB_PASSWORD=$DB_PASSWORD
DB_ROOT_PASSWORD=$DB_ROOT_PASSWORD

# JWT Configuration
JWT_SECRET=$JWT_SECRET

# Application Configuration
SPRING_PROFILES_ACTIVE=$DEPLOYMENT_ENV
BACKEND_PORT=8081
MYSQL_PORT=3306
NGINX_PORT=80
SSL_PORT=443

# Docker Images
BACKEND_IMAGE=$BACKEND_IMAGE:$BUILD_NUMBER
FRONTEND_IMAGE=$FRONTEND_IMAGE:$BUILD_NUMBER

# Deployment Environment
ENVIRONMENT=$DEPLOYMENT_ENV
BUILD_NUMBER=$BUILD_NUMBER
EOF

    print_status "Environment file created successfully"
}

# Function to backup current deployment
backup_deployment() {
    if [ -f "$COMPOSE_FILE" ]; then
        local backup_file="${COMPOSE_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
        print_status "Creating backup of current deployment: $backup_file"
        cp "$COMPOSE_FILE" "$backup_file"
    fi
}

# Function to pull latest images
pull_images() {
    print_status "Pulling latest Docker images..."
    docker-compose -f "$COMPOSE_FILE" pull
}

# Function to stop existing containers
stop_containers() {
    print_status "Stopping existing containers..."
    docker-compose -f "$COMPOSE_FILE" down --remove-orphans
}

# Function to start services
start_services() {
    print_status "Starting services for $DEPLOYMENT_ENV environment..."
    docker-compose -f "$COMPOSE_FILE" up -d

    print_status "Waiting for services to be healthy..."
    sleep 30
}

# Function to perform health check
health_check() {
    print_status "Performing health checks..."

    local max_attempts=10
    local attempt=1
    local backend_healthy=false
    local frontend_healthy=false

    while [ $attempt -le $max_attempts ]; do
        print_status "Health check attempt $attempt/$max_attempts"

        # Check backend health
        if curl -f http://localhost:8081/api/actuator/health > /dev/null 2>&1; then
            print_status "✅ Backend is healthy"
            backend_healthy=true
        else
            print_warning "Backend health check failed"
        fi

        # Check frontend
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            print_status "✅ Frontend is accessible"
            frontend_healthy=true
        else
            print_warning "Frontend health check failed"
        fi

        # If both services are healthy, break
        if [ "$backend_healthy" = true ] && [ "$frontend_healthy" = true ]; then
            print_status "🎉 All services are healthy!"
            return 0
        fi

        sleep 15
        ((attempt++))
    done

    print_error "❌ Health check failed after $max_attempts attempts"
    return 1
}

# Function to rollback deployment
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

# Function to clean up Docker resources
cleanup_docker() {
    print_status "Cleaning up Docker resources..."
    docker image prune -f
    docker container prune -f
    docker volume prune -f
}

# Main deployment process
main() {
    print_info "=== Jenkins Library Management System Deployment ==="
    print_info "Environment: $DEPLOYMENT_ENV"
    print_info "Build Number: $BUILD_NUMBER"
    print_info "Timestamp: $(date)"

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
            print_status "Frontend: http://localhost:3000"
            print_status "Backend API: http://localhost:8081/api"
            print_status "Health Check: http://localhost:8081/api/actuator/health"
            print_status "Environment: $DEPLOYMENT_ENV"

            # Clean up Docker resources
            cleanup_docker

            return 0
        else
            rollback
            return 1
        fi
    else
        rollback
        return 1
    fi
}

# Trap to handle errors
trap 'print_error "Deployment interrupted"; rollback; exit 1' INT TERM

# Run main function with all arguments
main "$@"
