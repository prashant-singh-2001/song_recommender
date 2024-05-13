# Use the official Python image as base for backend
FROM python:3.11-slim AS backend

# Set the working directory for backend
WORKDIR /app/backend

# Copy the backend source code to the container
COPY python_backend/ .

# Copy the requirements file to the container
COPY python_backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port the backend will run on
EXPOSE 8000

# Command to run the backend server
CMD ["uvicorn", "main:app", "--reload", "--host=0.0.0.0", "--port=8000"]

# Use the official Node.js image as base for frontend
FROM node:14 AS frontend

# Set the working directory for frontend
WORKDIR /app/frontend

# Copy package.json and package-lock.json to the container
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the frontend source code to the container
COPY frontend/ .

# Expose the port the frontend will run on
EXPOSE 3000

# Command to run the frontend server
CMD ["npm", "start"]
