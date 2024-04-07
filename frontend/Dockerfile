# Base image for the container (slim Alpine Linux with Node.js)
FROM node:alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json file to the working directory
COPY package.json .

# Install dependencies listed in package.json
RUN npm install

# Copy all files from the current directory to the working directory
COPY . .

# Expose port 3000 for container communication
EXPOSE 3000

# Command to execute when the container starts (assumes a 'start' script in package.json)
CMD ["npm", "start"]
