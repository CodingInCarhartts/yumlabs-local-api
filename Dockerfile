FROM node:20-alpine

WORKDIR /app

# Install nodemon for file watching
RUN npm install -g nodemon

# Copy package files
COPY package*.json ./
COPY bun.lock ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port (adjust if your app uses a different port)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start with nodemon watching src for changes, rebuild and restart on change
CMD ["nodemon", "--watch", "src", "--ext", "ts", "--exec", "rm -rf dist && npm run build && npm run start:prod", "--delay", "2500"]
