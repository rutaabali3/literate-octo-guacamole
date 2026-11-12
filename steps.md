# PulseForge Setup and Run Guide

This repository contains a React/Vite client in `client/` and an Express API in
`server/`. The API uses MongoDB. For local development, run the API and client
in separate terminals.

## What you need

- Node.js 18 or newer and npm.
- MongoDB running locally on `127.0.0.1:27017`, or a MongoDB Atlas connection
  string.
- No third-party API keys are currently required.

Docker is optional and is not required for the local setup below. The checked-in
`docker-compose.yml` currently references Dockerfiles that are not in the
repository, so it is not a working alternative yet.

## 1. Start MongoDB

For a local MongoDB installation on Windows, check that the MongoDB service is
running:

```powershell
Get-Service MongoDB
```

If it is stopped, start it from an elevated PowerShell window:

```powershell
Start-Service MongoDB
```

If you use MongoDB Atlas instead, create a database, allow your development
machine's IP address in Atlas Network Access, create a database user, and copy
the Atlas connection string. Replace its password placeholder before using it.

## 2. Configure the API

From the project root, copy the example environment file into the server
directory:

```powershell
Copy-Item .env.example server\.env
```

Edit `server\.env`. Keep the local MongoDB URI for a local database, or set
`MONGO_URI` to your Atlas connection string. Replace both JWT secret values with
different random values. Generate a value with:

```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run the command twice and use one output for each secret. Do not share or commit
`server\.env`; it is ignored by Git.

The environment settings are:

| Variable | Purpose | Local default |
| --- | --- | --- |
| `NODE_ENV` | API runtime mode | `development` |
| `PORT` | API listening port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/pulseforge_fitness` |
| `JWT_ACCESS_SECRET` | Signs access tokens | Generate a private random value |
| `JWT_REFRESH_SECRET` | Signs refresh tokens | Generate a different private random value |
| `JWT_ACCESS_EXPIRES_IN` | Access-token lifetime | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh-token lifetime | `7d` |
| `CLIENT_ORIGIN` | Allowed browser origin for CORS | `http://localhost:5173` |

## 3. Install dependencies

Open PowerShell in the project root and install each app's locked dependencies:

```powershell
npm.cmd --prefix server ci
npm.cmd --prefix client ci
```

`npm.cmd` avoids PowerShell's script-execution-policy issue with `npm.ps1`.

## 4. Run the application

Open two PowerShell terminals in the project root.

**Terminal 1 — API:**

```powershell
Set-Location server
npm.cmd run dev
```

The API starts at `http://localhost:5000`.

**Terminal 2 — client:**

```powershell
Set-Location client
npm.cmd run dev
```

Open `http://localhost:5173` in your browser. The client uses
`http://localhost:5000/api/v1` by default. To use a different API URL, create
`client\.env.local` with:

```ini
VITE_API_URL=http://localhost:5000/api/v1
```

Restart the Vite server after changing client environment variables.

## 5. Optional: load demo data

The seed command creates demo accounts and sample workouts, nutrition, and
progress records:

```powershell
Set-Location server
npm.cmd run seed
```

**Warning:** seeding deletes all existing records in every PulseForge collection
in the database named by `MONGO_URI` before creating the sample data. Use it
only with a disposable development database, never with personal or production
data.

Demo account:

- Username: `ahsankhan`
- Password: `Password123!`

## 6. Verify and test

With the API running, check its health endpoint:

```powershell
Invoke-RestMethod http://localhost:5000/api/v1/health
```

The response should include `"status": "healthy"`. Confirm the client loads at
`http://localhost:5173`, then run the available checks from separate terminals:

```powershell
Set-Location server
npm.cmd test
```

The first test run may download a MongoDB binary for its in-memory test
database. If you already have MongoDB installed and want to use that binary
instead, set its path before running tests:

```powershell
$env:MONGOMS_SYSTEM_BINARY = 'C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe'
npm.cmd test
```

```powershell
Set-Location client
npm.cmd run build
```

## Things to add or decide

- **MongoDB connection:** a local MongoDB service is easiest for development;
  otherwise add your Atlas URI to the ignored `server\.env`.
- **JWT secrets:** generate and keep two distinct private values in
  `server\.env`; never put real secrets in `.env.example` or source control.
- **Deployment setup (only if needed):** add Dockerfiles for the client and
  server and update `docker-compose.yml` before using Docker. Keep deployment
  secrets outside the compose file.
- **Optional client API URL:** set `VITE_API_URL` only when the API is not at
  `http://localhost:5000/api/v1`.
