# Auth Frontend

Lightweight UI to exercise the user authentication microservice through the gateway.

## Run

```bash
cd microservices/auth-frontend
npm install
npm start
```

The app runs on http://localhost:3004. It talks to the gateway (`http://localhost:3000/user/...`) and supports:

- Register
- Login
- Verify session
- Logout

Cookies are stored by the browser and reused for the schedule service after authentication.

