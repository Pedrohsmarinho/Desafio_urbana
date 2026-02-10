# Estágio de build
FROM node:20-alpine AS build
WORKDIR /app

# Copiar arquivos de dependências primeiro para cache
COPY package*.json ./

# Instalar dependências com cache limpo
RUN npm ci --only=production=false

# Copiar código fonte
COPY . .

# Build da aplicação para produção
RUN npm run build -- --configuration production

# Estágio de produção
FROM nginx:alpine

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Criar usuário não-root
RUN addgroup -g 1001 -S nginx && \
    adduser -u 1001 -S nginx -G nginx || true

# Copiar build do estágio anterior
COPY --from=build /app/dist/desafio-urbana-frontend/browser /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ajustar permissões
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Usar usuário não-root
USER nginx

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
