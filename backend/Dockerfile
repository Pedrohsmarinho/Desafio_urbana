# Estágio de build
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copiar apenas pom.xml primeiro para cache de dependências
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código fonte
COPY src ./src

# Build da aplicação
RUN mvn clean package -DskipTests -B

# Estágio de runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Criar usuário não-root
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copiar JAR do estágio de build
COPY --from=build /app/target/*.jar app.jar

# Mudar ownership
RUN chown -R appuser:appgroup /app

# Usar usuário não-root
USER appuser

# Expor porta
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/api/actuator/health || exit 1

# Executar aplicação com configurações otimizadas
ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "app.jar"]
