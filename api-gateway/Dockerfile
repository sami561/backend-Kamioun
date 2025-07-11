FROM node:20
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port and run the application
EXPOSE 3000
CMD ["npm", "run", "dev"]