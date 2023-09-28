# Use an official Golang runtime as a parent image
FROM golang:1.21 as build

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Build the application
RUN GOARCH=amd64 go build -o bin/webapp ./cmd/webapp

# Use a lightweight base image for the final runtime
FROM alpine:3.14
RUN apk --no-cache add ca-certificates

# Set the working directory to /app
WORKDIR /root/

# Copy the binary from the build stage to the current directory in the final image
COPY --from=build /app/bin/webapp /usr/local/bin/

# Expose port 8080
EXPOSE 8080

# Define environment variables if needed
ENV API_FOOTBALL_KEY=$API_FOOTBALL_KEY

# Command to run the executable
CMD ["webapp"]
