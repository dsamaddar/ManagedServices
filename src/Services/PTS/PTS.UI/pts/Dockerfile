# Stage 1: Build Angular App
FROM node:22.14.0 AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

RUN npm install -g @angular/cli

COPY . .
RUN npm run build --configuration production

# Stage 2: Serve Angular App with Nginx
FROM nginx:alpine

# Copy custom nginx config (optional, for Angular routing support)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app to Nginx
COPY --from=builder /app/dist/pts /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]