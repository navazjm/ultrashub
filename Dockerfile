# Stage 1: Build Vite React Frontend
FROM node:20.15-alpine as frontend

WORKDIR /app

# Copy only the necessary files for installing dependencies
# COPY web/package.json web/package-lock.json ./
COPY web/package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY web .

ARG VITE_ULTRASHUB_BASE_URL
ENV VITE_ULTRASHUB_BASE_URL=$VITE_ULTRASHUB_BASE_URL
ARG VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

# Build the frontend
RUN npm run build:prod

# Use an official Golang runtime as a parent image
FROM golang:1.21-alpine as build

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Copy the built frontend from the previous stage
COPY --from=frontend /app/dist /app/web/dist

# Build the application
RUN go build -o bin/webapp ./cmd/server

# Use a lightweight base image for the final runtime
FROM alpine

# Set the working directory to /app
WORKDIR /root/

# Copy the binary from the build stage to the current directory in the final image
COPY --from=build /app/bin/webapp /usr/local/bin/
RUN chmod +x /usr/local/bin/webapp

# Expose port 8080
EXPOSE 8080

# Define environment variables if needed
ENV API_FOOTBALL_KEY=$API_FOOTBALL_KEY
ENV ULTRASHUB_DB_DSN=$ULTRASHUB_DB_DSN
ENV FIREBASE_TYPE=$FIREBASE_TYPE
ENV FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
ENV FIREBASE_PRIVATE_KEY_ID=$FIREBASE_PRIVATE_KEY_ID
ENV FIREBASE_PRIVATE_KEY=$FIREBASE_PRIVATE_KEY
ENV FIREBASE_CLIENT_EMAIL=$FIREBASE_CLIENT_EMAIL
ENV FIREBASE_CLIENT_ID=$FIREBASE_CLIENT_ID
ENV FIREBASE_AUTH_URI=$FIREBASE_AUTH_URI
ENV FIREBASE_TOKEN_URI=$FIREBASE_TOKEN_URI
ENV FIREBASE_AUTH_PROVIDER_X509_CERT_URL=$FIREBASE_AUTH_PROVIDER_X509_CERT_URL
ENV FIREBASE_CLIENT_X509_CERT_URL=$FIREBASE_CLIENT_X509_CERT_URL
ENV FIREBASE_UNIVERSE_DOMAIN=$FIREBASE_UNIVERSE_DOMAIN

# Command to run the executable
CMD ["webapp"]
