# Stage 1: Build Stage
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Stage 2: Run Stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only required files from the builder stage
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/dist /app/dist

# Install only production dependencies
RUN npm install --only=production

# Start the application
CMD ["npm", "start"]
