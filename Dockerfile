FROM node:alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/ .
RUN npm install
RUN npm run build

FROM node:alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ .
EXPOSE 5000

FROM nginx:alpine
RUN apk add --no-cache nodejs npm supervisor
COPY proxy/default.conf /etc/nginx/conf.d/default.conf
COPY proxy/fullstackwebdev.crt /etc/nginx/ssl/fullstackwebdev.crt
COPY proxy/fullstackwebdev.key /etc/nginx/ssl/fullstackwebdev.key
COPY --from=frontend-build /app/frontend/build /usr/share/nginx/html
WORKDIR /app/backend
COPY --from=backend-build /app/backend .
COPY supervisor/supervisord.conf /etc/supervisord.conf
EXPOSE 80
EXPOSE 443
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
