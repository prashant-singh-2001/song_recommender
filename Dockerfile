# Backend: FastAPI served by uvicorn (no --reload; this is the production image).
FROM python:3.11-slim AS backend
WORKDIR /app/backend

# Install dependencies first so this layer is cached until requirements change.
COPY python_backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY python_backend/ .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]


# Frontend build stage: compile the Vite app to static files.
FROM node:24-alpine AS frontend-build
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
# nginx (below) proxies /api to the backend, so the browser never needs its address.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build


# Frontend runtime: nginx serves the build and proxies /api to the backend.
FROM nginx:alpine AS frontend
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
