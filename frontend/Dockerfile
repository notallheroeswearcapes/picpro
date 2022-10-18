# Stage 1: Build
FROM node:16-alpine as build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Run
FROM nginx:stable-alpine
# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
# Copy dist folder from build stage to nginx public folder
COPY --from=build /usr/src/app/dist/frontend /usr/share/nginx/html
# Copy nginx config file
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80