# Stage 1: Build Vite React Frontend
FROM node:21.1-alpine as frontend

WORKDIR /app

# Copy only the necessary files for installing dependencies
COPY web/package.json web/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY web .

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
RUN apk update && apk add tzdata \
     && cp -r -f /usr/share/zoneinfo/$TZ /etc/localtime

# Command to run the executable
CMD ["webapp"]