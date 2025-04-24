# Stage 1: Build Angular App
FROM node:18 AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app and build it
COPY . .
RUN npm run build -- --configuration=production

# Stage 2: Serve Angular App with Nginx
FROM nginx:latest

# Optional: Replace default nginx config to support Angular routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app from previous stage
COPY --from=builder /app/dist/pts/browser /usr/share/nginx/html

# Copy Nginx HTTP and HTTPS config files
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/default-ssl.conf /etc/nginx/conf.d/default-ssl.conf

# Copy SSL certificate and key
COPY nginx/cert/neoscoder.crt /etc/ssl/certs/neoscoder.crt
COPY nginx/cert/neoscoder.key /etc/ssl/private/neoscoder.key

# Expose port
EXPOSE 5203

CMD ["nginx", "-g", "daemon off;"]