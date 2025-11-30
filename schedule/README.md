# Schedule Microservice

Appointment scheduling service with PostgreSQL, Node.js backend, and React frontend.

## Start

```powershell
docker-compose up -d
```

## Stop

```powershell
docker-compose down
```

## Access

- Frontend: http://localhost:3003
- Backend: http://localhost:3002
- Database: localhost:5433

Authentication is disabled by default (`DISABLE_AUTH=true`), so the app works out of the box. Set it to `false` in `docker-compose.yml` when you connect the real user service.

## Structure

- `backend/` - Node.js API (port 3002)
- `frontend/` - React app (port 3003)
- `docker-compose.yml` - Runs all 3 services
