# 🚀 Jenkins CI/CD Setup Guide

This guide explains how to set up and use Jenkins for automated building, testing, and deployment of the Online Library Management System.

## 📋 Prerequisites

- Jenkins server installed and running
- Docker and Docker Compose installed on Jenkins server
- Git repository access
- Docker registry access (Docker Hub, GitHub Container Registry, etc.)

## 🏗️ Architecture Overview

```
┌─────────────────┐    Git Push     ┌─────────────────┐    Docker Build    ┌─────────────────┐
│   Git Repository │ ──────────────► │     Jenkins     │ ────────────────► │   Docker Images │
│                 │                 │   CI/CD Pipeline│                   │                 │
└─────────────────┘                 └─────────────────┘                   └─────────────────┘
                                            │                                       │
                                            ▼                                       ▼
┌─────────────────┐                 ┌─────────────────┐                 ┌─────────────────┐
│   Staging       │◄────────────────│   Health Check  │────────────────►│   Production    │
│   Environment   │                 │   & Testing     │                 │   Environment   │
└─────────────────┘                 └─────────────────┘                 └─────────────────┘
```

## 🔧 Jenkins Setup Instructions

### 1. Install Required Plugins

In Jenkins, go to **Manage Jenkins → Manage Plugins** and install:

- **Pipeline**: For pipeline jobs
- **Git**: For Git repository integration
- **Credentials Binding**: For secure credential management
- **Docker Pipeline**: For Docker integration
- **AnsiColor**: For colored console output
- **Timestamper**: For build timestamps

### 2. Configure Docker

#### Option A: Docker-in-Docker (Recommended)

```bash
# Install Docker on Jenkins server
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add jenkins user to docker group
sudo usermod -aG docker jenkins

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### Option B: External Docker Host

Configure Jenkins to use an external Docker host:

1. Go to **Manage Jenkins → Manage Nodes and Clouds**
2. Configure Docker host settings
3. Add Docker credentials

### 3. Configure Credentials

In Jenkins, go to **Manage Jenkins → Manage Credentials** and add:

#### GitHub Credentials
- **Kind**: Username with password
- **Username**: Your GitHub username
- **Password**: Your GitHub Personal Access Token
- **ID**: `github-credentials`

#### Docker Registry Credentials
- **Kind**: Username with password
- **Username**: Your Docker registry username
- **Password**: Your Docker registry password/token
- **ID**: `docker-hub-credentials`

#### Database Credentials
- **Kind**: Secret text
- **Secret**: Your database password
- **ID**: `DB_PASSWORD`

- **Kind**: Secret text
- **Secret**: Your database root password
- **ID**: `DB_ROOT_PASSWORD`

- **Kind**: Secret text
- **Secret**: Your database URL
- **ID**: `DB_URL`

- **Kind**: Secret text
- **Secret**: Your database username
- **ID**: `DB_USERNAME`

#### JWT Secret
- **Kind**: Secret text
- **Secret**: Your JWT signing secret
- **ID**: `JWT_SECRET`

### 4. Create Jenkins Pipeline Job

#### Option A: Using Jenkinsfile (Recommended)

1. Create a new **Pipeline** job
2. Set **Definition** to "Pipeline script from SCM"
3. Set **SCM** to Git
4. Set **Repository URL** to your Git repository
5. Set **Branch Specifier** to `*/main` or `*/develop`
6. Set **Script Path** to `Jenkinsfile`

#### Option B: Using Job Configuration

1. Create a new **Freestyle** job
2. Import the `jenkins-job-config.xml` file
3. Configure build steps and post-build actions

## 📁 Project Structure

```
online-library-management-system-final/
├── Jenkinsfile                    # Main pipeline definition
├── Dockerfile.jenkins            # Jenkins agent with required tools
├── docker-compose.jenkins.yml    # Jenkins Docker setup
├── jenkins-job-config.xml        # Jenkins job configuration
├── jenkins-deploy.sh             # Jenkins deployment script
├── docker-compose.prod.yml       # Production Docker Compose
├── backend/                      # Spring Boot backend
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
└── frontend/                     # React frontend
    ├── Dockerfile
    ├── package.json
    └── src/
```

## 🔄 Pipeline Stages

### 1. Checkout
- Clones the Git repository
- Sets up workspace

### 2. Backend Build & Test
- Compiles Java code with Maven
- Runs unit tests
- Packages JAR file

### 3. Frontend Build & Test
- Installs npm dependencies
- Builds React application
- Archives build artifacts

### 4. Build Docker Images
- Builds backend Docker image
- Builds frontend Docker image
- Tags images with build number

### 5. Push Docker Images
- Pushes images to Docker registry
- Tags with `latest` and build number

### 6. Deploy to Staging
- Deploys to staging environment
- Runs health checks
- Verifies deployment success

### 7. Integration Tests
- Runs integration tests
- Validates system functionality

### 8. Deploy to Production (main branch only)
- Deploys to production environment
- Creates backup before deployment
- Runs comprehensive health checks

## 🚀 Usage Instructions

### Automatic Deployment

1. **Push to main/develop branch:**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin main
   ```

2. **Jenkins will automatically:**
   - Detect the push
   - Start the pipeline
   - Build and test the code
   - Deploy to staging (develop) or production (main)

### Manual Deployment

1. **Go to Jenkins dashboard**
2. **Click on the pipeline job**
3. **Click "Build with Parameters"**
4. **Choose deployment environment:**
   - `staging` - Deploy to staging environment
   - `production` - Deploy to production environment
5. **Click "Build"**

### Monitoring Builds

1. **View build status:** Jenkins dashboard
2. **Console output:** Click on build number → Console Output
3. **Artifacts:** Download build artifacts from build page
4. **Logs:** View detailed logs for each stage

## 🛠️ Configuration

### Environment Variables

Configure these in Jenkins job parameters or environment:

```bash
# Docker Registry
REGISTRY=your-docker-registry.com
BACKEND_IMAGE=${REGISTRY}/library-backend
FRONTEND_IMAGE=${REGISTRY}/library-frontend

# Database Configuration
DB_PASSWORD=your_database_password
DB_ROOT_PASSWORD=your_root_password
DB_URL=jdbc:mysql://localhost:3306/library_db
DB_USERNAME=library_user

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
```

### Docker Registry Setup

#### Docker Hub
```bash
# Login to Docker Hub
docker login

# Build and push images
docker build -t your-username/library-backend:latest ./backend
docker push your-username/library-backend:latest
```

#### GitHub Container Registry
```bash
# Login to GitHub Container Registry
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Build and push images
docker build -t ghcr.io/your-username/library-backend:latest ./backend
docker push ghcr.io/your-username/library-backend:latest
```

## 📊 Monitoring and Notifications

### Build Status
- **Jenkins Dashboard**: Real-time build status
- **Console Output**: Detailed build logs
- **Artifacts**: Download build outputs
- **Test Results**: View test reports

### Notifications
Configure Jenkins to send notifications:

#### Email Notifications
1. Go to **Manage Jenkins → Configure System**
2. Configure SMTP settings
3. Add email addresses to job configuration

#### Slack Notifications
1. Install Slack Notification plugin
2. Configure Slack webhook URL
3. Add Slack notifications to pipeline

#### Webhook Notifications
1. Configure webhooks in Jenkins
2. Send notifications to external systems

## 🐛 Troubleshooting

### Common Issues

#### 1. Docker Permission Issues
```bash
# Add jenkins user to docker group
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins

# Or run Docker with sudo
sudo docker build -t my-image ./backend
```

#### 2. Git Authentication Issues
```bash
# Check Git credentials
git ls-remote https://github.com/username/repo.git

# Test GitHub token
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
```

#### 3. Docker Registry Authentication
```bash
# Test Docker registry login
docker login your-registry.com

# Check registry credentials
docker login -u username -p password your-registry.com
```

#### 4. Build Failures
```bash
# Check Java version
java -version

# Check Node.js version
node -v && npm -v

# Check Maven version
mvn -v

# Check Docker version
docker -v && docker-compose -v
```

### Debug Mode

Enable debug mode in Jenkins:

```bash
# In Jenkinsfile, add at the beginning of pipeline
options {
    timestamps()
    ansiColor('xterm')
}
```

### Log Analysis

1. **Check build logs** in Jenkins console
2. **Review Docker build logs** for image issues
3. **Check container logs** for runtime issues
4. **Verify environment variables** are set correctly

## 🔒 Security Best Practices

### Credential Management
- Use Jenkins credentials for sensitive data
- Never store passwords in plain text
- Rotate credentials regularly
- Use different credentials for different environments

### Access Control
- Limit Jenkins access to authorized users
- Use role-based access control (RBAC)
- Configure matrix-based security
- Enable CSRF protection

### Container Security
- Scan Docker images for vulnerabilities
- Use minimal base images
- Run containers with non-root users
- Implement security policies

## 📈 Performance Optimization

### Build Optimization
- Use Docker layer caching
- Parallelize build stages
- Cache Maven dependencies
- Optimize Docker image size

### Deployment Optimization
- Implement blue-green deployments
- Use health checks for zero-downtime
- Configure resource limits
- Monitor performance metrics

### Resource Optimization
- Configure Jenkins agents properly
- Use appropriate instance types
- Set up build timeouts
- Clean up old builds and artifacts

## 🌟 Advanced Features

### Parallel Testing
```groovy
stage('Parallel Tests') {
    parallel {
        stage('Unit Tests') { /* ... */ }
        stage('Integration Tests') { /* ... */ }
        stage('Performance Tests') { /* ... */ }
    }
}
```

### Conditional Builds
```groovy
stage('Deploy to Production') {
    when { branch 'main' }
    steps { /* production deployment */ }
}
```

### Parameterized Builds
```groovy
parameters {
    choice(name: 'ENVIRONMENT', choices: ['staging', 'production'])
    booleanParam(name: 'RUN_TESTS', defaultValue: true)
}
```

## 📞 Support

For Jenkins-related issues:

1. Check Jenkins logs: `/var/log/jenkins/jenkins.log`
2. Review build console output
3. Verify system requirements
4. Check plugin compatibility
5. Consult Jenkins documentation

### Useful Commands

```bash
# Check Jenkins status
sudo systemctl status jenkins

# View Jenkins logs
sudo tail -f /var/log/jenkins/jenkins.log

# Restart Jenkins
sudo systemctl restart jenkins

# Check Docker status
sudo systemctl status docker

# View Docker logs
sudo journalctl -u docker.service
```

## 🎯 Next Steps

1. Set up your Jenkins server
2. Configure credentials and tools
3. Import the pipeline configuration
4. Test the pipeline with a small change
5. Monitor deployments
6. Customize the pipeline as needed

Your Library Management System now has enterprise-grade CI/CD capabilities with Jenkins! 🚀

---

## 📋 Quick Reference

- **Jenkinsfile**: Main pipeline configuration
- **Dockerfile.jenkins**: Jenkins agent with required tools
- **jenkins-job-config.xml**: Job configuration template
- **jenkins-deploy.sh**: Deployment script
- **docker-compose.jenkins.yml**: Jenkins Docker setup

For detailed setup instructions, see the individual configuration files.
