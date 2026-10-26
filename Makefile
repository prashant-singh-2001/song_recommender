.PHONY: up down dev-backend dev-frontend test test-backend test-frontend lint build-index

up:
	docker compose up --build

down:
	docker compose down

# Run without Docker (needs Python 3.11 and Node 24 locally).
dev-backend:
	cd python_backend && python -m uvicorn main:app --reload --port 8000

dev-frontend:
	cd frontend && npm install && npm run dev

test: test-backend test-frontend

test-backend:
	cd python_backend && pip install -q -r requirements-dev.txt && pytest -q

test-frontend:
	cd frontend && npm ci && npm test -- --run

lint:
	cd python_backend && ruff check .
	cd frontend && npm run lint

# Rebuild songs.pkl / lyrics.pkl / index.pkl inside the backend image so the
# pickles match the runtime library versions. Set LASTFM_API_KEY to fetch covers.
build-index:
	docker compose build backend
	docker run --rm -e LASTFM_API_KEY -v "$(CURDIR)/python_backend:/app/backend" -w /app/backend \
		song_recommender-backend sh -c "pip install -q -r requirements-build.txt && python build_index.py"
