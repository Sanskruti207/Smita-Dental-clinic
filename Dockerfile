# ---- Stage 1: build the Spring Boot jar ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B -DskipTests package

# ---- Stage 2: small runtime image ----
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/smita-dental-clinic-backend-1.0.0.jar app.jar
EXPOSE 8080
# Limit memory so the app fits small free instances (512 MB)
ENTRYPOINT ["java", "-Xmx350m", "-jar", "app.jar"]
