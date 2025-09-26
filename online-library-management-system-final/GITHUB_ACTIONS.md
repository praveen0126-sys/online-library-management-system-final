# 🚀 GitHub Actions CI/CD Guide

This guide explains how to set up and use GitHub Actions for automated building, testing, and deployment of the Online Library Management System.

## 📋 Prerequisites

- GitHub repository with admin access
- Docker Hub or GitHub Container Registry access
- Deployment server(s) with SSH access (for CD)

## 🔧 Setup Instructions

### 1. Repository Settings

1. **Enable GitHub Container Registry**
   - Go to Settings → Package settings
   - Enable "Improved container support"

2. **Create Personal Access Token**
   - Go to Settings → Developer settings → Personal access tokens
   - Generate new token with `repo`, `packages:write`, and `workflow` scopes

### 2. Environment Secrets

Add the following secrets to your repository:

#### Required Secrets (Repository Settings → Secrets and variables → Actions)

```bash
# GitHub Container Registry
GITHUB_TOKEN=your_personal_access_token

# Database Configuration
DB_PASSWORD=your_database_password
DB_ROOT_PASSWORD=your_database_root_password
DB_URL=jdbc:mysql://localhost:3306/library_db
DB_USERNAME=library_user

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Deployment Server (for CD)
STAGING_HOST=your_staging_server_ip
STAGING_USER=your_ssh_username
STAGING_SSH_KEY=your_private_ssh_key

PRODUCTION_HOST=your_production_server_ip
PRODUCTION_USER=your_ssh_username
PRODUCTION_SSH_KEY=your_private_ssh_key

# Slack Notifications (optional)
SLACK_WEBHOOK=your_slack_webhook_url
```

### 3. Environment Variables

Create environment files for different deployment stages:

#### Development (.env.dev)
```bash
DB_PASSWORD=dev_password
DB_ROOT_PASSWORD=dev_root_password
SPRING_PROFILES_ACTIVE=dev
```

#### Staging (.env.staging)
```bash
DB_PASSWORD=staging_password
DB_ROOT_PASSWORD=staging_root_password
SPRING_PROFILES_ACTIVE=staging
```

#### Production (.env.prod)
```bash
DB_PASSWORD=prod_password
DB_ROOT_PASSWORD=prod_root_password
SPRING_PROFILES_ACTIVE=prod
```

## 🔄 CI/CD Pipeline Overview

### Continuous Integration (CI)

1. **Backend Testing**
   - Runs Maven tests
   - Builds JAR file
   - Uploads test results and artifacts

2. **Frontend Testing**
   - Runs npm linting
   - Builds React application
   - Uploads build artifacts

3. **Docker Image Building**
   - Builds backend Docker image
   - Builds frontend Docker image
   - Pushes to GitHub Container Registry

### Continuous Deployment (CD)

1. **Staging Deployment**
   - Triggers after successful CI
   - Deploys to staging environment
   - Runs health checks

2. **Production Deployment**
   - Manual trigger required
   - Deploys to production environment
   - Includes rollback capability

## 📁 File Structure

```
.github/
├── workflows/
│   ├── ci-cd.yml          # Main CI/CD pipeline
│   └── deploy.yml         # Deployment workflow
├── dependabot.yml        # Dependency updates
└── ISSUE_TEMPLATE/       # Issue templates

deployment/
├── docker-compose.prod.yml    # Production compose file
├── deploy.sh                  # Deployment script
└── rollback.sh                # Rollback script

nginx/
└── prod.conf              # Production nginx config

.env.example               # Environment template
```

## 🚀 Usage

### Automatic Deployment

1. **Push to main/develop branch**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin main
   ```

2. **CI/CD pipeline triggers automatically**
   - Builds and tests code
   - Creates Docker images
   - Deploys to staging (if main branch)

### Manual Deployment

1. **Deploy to Production**
   - Go to Actions tab in GitHub
   - Select "Deploy to Production" workflow
   - Click "Run workflow"
   - Choose "production" environment

2. **Deploy to Staging**
   - Push to develop branch
   - Pipeline automatically deploys to staging

## 📊 Monitoring and Notifications

### GitHub Actions Dashboard
- View workflow runs at: `https://github.com/praveen0126-sys/online-library-management-system-final/actions`
- Monitor build status and logs
- Download artifacts and test results

### Slack Notifications
- Automatic notifications on deployment success/failure
- Configure webhook in repository secrets
- Customize notification messages

### Health Checks
- Backend: `http://your-domain/api/actuator/health`
- Frontend: `http://your-domain/health`
- Database connectivity monitored

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs
   - Go to Actions → Workflow run → Build job
   - View detailed logs for each step
   ```

2. **Deployment Failures**
   ```bash
   # Check deployment logs
   - SSH into deployment server
   - Check docker-compose logs: docker-compose logs
   - Verify environment variables
   ```

3. **Permission Issues**
   ```bash
   # Ensure GITHUB_TOKEN has required scopes
   # Check repository package settings
   ```

### Manual Rollback

```bash
# On deployment server
cd /opt/library-app
./rollback.sh

# Or manually
docker-compose down
docker-compose -f docker-compose.yml.backup up -d
```

## 🔒 Security Best Practices

1. **Secrets Management**
   - Never commit secrets to code
   - Use GitHub repository secrets
   - Rotate secrets regularly

2. **Access Control**
   - Limit workflow permissions
   - Use environments for production
   - Require manual approval for production deployments

3. **Container Security**
   - Scan images for vulnerabilities
   - Use multi-stage builds
   - Run containers as non-root user

## 📈 Performance Optimization

### Build Optimization
- Docker layer caching enabled
- Maven dependency caching
- Parallel job execution

### Deployment Optimization
- Zero-downtime deployments
- Health check before switching traffic
- Automatic rollback on failure

### Resource Optimization
- Image size optimization
- Efficient base images
- Resource limits and monitoring

## 🌟 Advanced Features

### Automated Testing
- Unit tests for backend/frontend
- Integration tests
- Performance tests

### Code Quality
- Linting and formatting
- Security scanning
- Dependency vulnerability checks

### Monitoring Integration
- Application performance monitoring
- Log aggregation
- Error tracking

## 📞 Support

For issues with GitHub Actions:

1. Check the Actions tab for workflow runs
2. Review logs for error messages
3. Consult this documentation
4. Create an issue in the repository

---

## 🎯 Next Steps

1. Set up your repository secrets
2. Configure deployment servers
3. Test the CI/CD pipeline
4. Monitor deployments
5. Customize workflows as needed

Your Library Management System now has enterprise-grade CI/CD capabilities! 🚀
