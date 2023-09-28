# Use an official Golang runtime as a parent image
FROM golang:1.21 as build

# Set the working directory to /app
WORKDIR /app

# Copy the Go module files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the current directory contents into the container at /app
COPY . .

ARG API_FOOTBALL_KEY

# Build the application
RUN GOARCH=amd64 go build -o webapp ./cmd/webapp

# Use a lightweight base image for the final runtime
FROM alpine:3.14

ENV API_FOOTBALL_KEY=$API_FOOTBALL_KEY

# Set the working directory to /app
WORKDIR /app

# Copy the binary from the build stage to the current directory in the final image
COPY --from=build /app/webapp .
RUN chmod +x ./webapp

# Expose port 8080
EXPOSE 8080

# Define environment variables if needed
# ENV VARIABLE_NAME=value

# Command to run the executable
CMD ["./webapp"]
