FROM maven:3.9-eclipse-temurin-21 AS backend-build

WORKDIR /app/backend

COPY backend/pom.xml ./pom.xml
COPY backend/src ./src

RUN mvn package -Dmaven.test.skip=true


FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=backend-build /app/backend/target/quarkus-app/lib/ ./lib/
COPY --from=backend-build /app/backend/target/quarkus-app/*.jar ./
COPY --from=backend-build /app/backend/target/quarkus-app/app/ ./app/
COPY --from=backend-build /app/backend/target/quarkus-app/quarkus/ ./quarkus/

EXPOSE 8080

CMD ["java", "-jar", "quarkus-run.jar"]