# Microservices Application

A microservices-based application with user authentication and appointment scheduling features.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (:3000)                     │
├─────────────┬─────────────┬──────────────┬─────────────────┤
│   /user     │  /schedule  │  /auth-ui    │  /schedule-ui   │
└──────┬──────┴──────┬──────┴───────┬──────┴────────┬────────┘
       │             │              │               │
       ▼             ▼              ▼               ▼
┌────────────┐ ┌───────────┐ ┌────────────┐ ┌─────────────┐
│   User     │ │ Schedule  │ │   Auth     │ │  Schedule   │
│  Service   │ │  Backend  │ │  Frontend  │ │  Frontend   │
│  (:3101)   │ │  (:3002)  │ │  (:3004)   │ │  (:3003)    │
└─────┬──────┘ └─────┬─────┘ └────────────┘ └─────────────┘
      │              │
      ▼              ▼
┌────────────┐ ┌───────────┐
│  MongoDB   │ │ PostgreSQL│
└────────────┘ └───────────┘
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| Gateway | 3000 | API Gateway - routes requests to services |
| User Service | 3101 | User authentication & management (MongoDB) |
| Schedule Backend | 3002 | Appointment scheduling API (PostgreSQL) |
| Schedule Frontend | 3003 | React app for scheduling |
| Auth Frontend | 3004 | Authentication UI |

## Tech Stack

- **Gateway**: Express.js, http-proxy-middleware
- **User Service**: Express.js, MongoDB, Mongoose, JWT, bcrypt
- **Schedule Service**: Express.js, PostgreSQL, React
- **Auth Frontend**: HTML, CSS, lite-server

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (for user service)
- Docker & Docker Compose (for schedule service)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd microservices
   ```

2. **Install dependencies for each service**
   ```bash
   # Gateway
   cd gateway && npm install

   # User Service
   cd ../user && npm install

   # Auth Frontend
   cd ../auth-frontend && npm install

   # Schedule Service
   cd ../schedule/backend && npm install
   cd ../frontend && npm install
   ```

### Running the Services

#### Option 1: Run individually

```bash
# Terminal 1 - User Service
cd user
npm start

# Terminal 2 - Schedule Service (with Docker)
cd schedule
docker-compose up

# Terminal 3 - Auth Frontend
cd auth-frontend
npm start

# Terminal 4 - Gateway
cd gateway
node app.js
```

#### Option 2: Schedule Service with Docker

```bash
cd schedule
docker-compose up --build
```

This starts:
- PostgreSQL database (:5433)
- Schedule backend (:3002)
- Schedule frontend (:3003)

### Environment Variables

#### User Service
```env
PORT=3101
MONGODB_URI=mongodb://localhost:27017/users
JWT_SECRET=your_secret
```

#### Schedule Backend
```env
PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_NAME=schedules
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=user_secret
USER_SERVICE_URL=http://localhost:3101
```

## API Endpoints

### Gateway Routes

| Route | Target |
|-------|--------|
| `/user/*` | User Service API |
| `/schedule/*` | Schedule Service API |
| `/auth-ui` | Auth Frontend |
| `/schedule-ui` | Schedule Frontend |

### User Service (`/user`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | User login |
| GET | `/api/users/profile` | Get user profile |

### Schedule Service (`/schedule`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/appointments` | List appointments |
| POST | `/appointments` | Create appointment |
| PUT | `/appointments/:id` | Update appointment |
| DELETE | `/appointments/:id` | Delete appointment |

## Project Structure

```
microservices/
├── gateway/              # API Gateway
│   └── app.js
├── user/                 # User Service
│   ├── controller/
│   ├── db/
│   ├── models/
│   ├── routes/
│   └── server.js
├── schedule/             # Schedule Service
│   ├── backend/
│   │   ├── controller/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   ├── frontend/         # React App
│   │   └── src/
│   └── docker-compose.yml
├── auth-frontend/        # Auth UI
│   ├── index.html
│   └── styles.css
└── README.md
```

## License

ISC

