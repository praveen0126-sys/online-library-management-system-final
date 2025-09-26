# Use Eclipse Temurin (more secure and maintained)
FROM eclipse-temurin:21-jdk-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml first for better caching
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn
COPY pom.xml .

# Make Maven wrapper executable
RUN chmod +x ./mvnw

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose the port the app runs on
EXPOSE 8080

# Set the active profile to docker
ENV SPRING_PROFILES_ACTIVE=docker

# Run the application
CMD ["java", "-jar", "target/library-management-system-0.0.1-SNAPSHOT.jar"]
