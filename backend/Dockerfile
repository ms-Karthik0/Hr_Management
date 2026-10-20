# Stage 1: Build Java application
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal distroless/jre runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S nexushr && adduser -S nexushr -G nexushr
USER nexushr:nexushr
COPY --from=build /app/target/nexushr-backend-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
