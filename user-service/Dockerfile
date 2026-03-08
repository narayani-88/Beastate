# Stage 1: Build the backend
FROM eclipse-temurin:17-jdk-jammy AS builder

WORKDIR /app

# Copy the maven wrapper and pom file
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Give execution permission to maven wrapper
RUN chmod +x ./mvnw

# Resolve dependencies (better caching)
RUN ./mvnw dependency:go-offline

# Copy the source code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the backend
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy the built jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port (Spring Boot default is 8081 for this app)
EXPOSE 8081

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
