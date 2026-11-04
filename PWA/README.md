# Finance app

Full-stack personal finance application with React frontend and NestJS + Prisma backend.

## Stack

- Frontend: React + TypeScript + Vite
- Backend: NestJS + Prisma + PostgreSQL
- Auth: JWT
- PWA: manifest and service worker

## Local development

From the project root:

```bash
npm install
npm run dev
```

This starts PostgreSQL in Docker, waits until it is ready, and then launches both processes together:

- frontend: http://localhost:5173
- backend: http://localhost:4000
- API docs: http://localhost:4000/docs
- database: localhost:5432

Useful commands:

```bash
npm run dev:db
npm run dev:frontend
npm run dev:backend
npm run dev:down
npm run build
npm run build:backend
```

## Production Docker stack

To start the full production stack in one command:

```bash
docker compose up --build
```

This will bring up:

- PostgreSQL on localhost:5432
- backend API on localhost:4000
- frontend site on localhost:80

To stop it:

```bash
docker compose down
```

## Linux server deployment

### 1. Install dependencies

```bash
sudo apt update
sudo apt install -y curl git nginx postgresql-client
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 2. Clone the project

```bash
cd /var/www
sudo git clone <your-repo-url> finance-app
cd finance-app
```

### 3. Configure environment

Create the backend environment file:

```bash
cp .env.example server/.env
```

Then edit the values in `server/.env`:

```env
DATABASE_URL=postgresql://finance_user:finance_password@127.0.0.1:5432/finance_db?schema=public
JWT_SECRET=replace-with-long-random-secret
JWT_REFRESH_SECRET=replace-with-long-random-refresh-secret
API_PORT=4000
NODE_ENV=production
```

If PostgreSQL is installed on the same server, create the database:

```bash
sudo -u postgres psql -c "CREATE DATABASE finance_db;"
sudo -u postgres psql -c "CREATE USER finance_user WITH ENCRYPTED PASSWORD 'finance_password';"
sudo -u postgres psql -c "ALTER ROLE finance_user WITH SUPERUSER;"
```

### 4. Install app dependencies

```bash
npm install
cd server && npm install && npx prisma generate && npx prisma migrate deploy
```

### 5. Build the project

```bash
cd ..
npm run build
npm run build:backend
```

### 6. Run under PM2

Create a PM2 ecosystem file or run commands directly:

```bash
pm2 start "npm run dev:backend" --name finance-backend
pm2 start "npm run dev:frontend" --name finance-frontend
pm2 save
pm2 startup
```

For production, a more stable setup is:

```bash
pm2 start "npm run preview -- --host 0.0.0.0 --port 4173" --name finance-frontend
pm2 start "node server/dist/main.js" --name finance-backend
```

### 7. Nginx reverse proxy

Example config:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api/ {
        proxy_pass http://127.0.0.1:4000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:5173;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then enable the config:

```bash
sudo ln -s /etc/nginx/sites-available/finance-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Security recommendations

- use strong JWT secrets
- keep PostgreSQL behind localhost or a private network
- set up a firewall
- use HTTPS with Let's Encrypt
- run the app under a non-root user

## Common production notes

- frontend is served on port 5173 in development and can be proxied via Nginx in production
- backend listens on port 4000 by default
- API docs are available at `/docs`
- database schema is managed via Prisma migrations

## Useful migration command

```bash
cd server
npx prisma migrate deploy
```
