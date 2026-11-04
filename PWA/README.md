# Финансовое приложение

Полноценное приложение для учёта личных финансов с фронтендом на React и бэкендом на NestJS + Prisma.

## Технологический стек

- Фронтенд: React + TypeScript + Vite
- Бэкенд: NestJS + Prisma + PostgreSQL
- Авторизация: JWT
- PWA: манифест и service worker

## Локальная разработка

Из корня проекта:

```bash
npm install
npm run dev
```

Эта команда запускает PostgreSQL через Docker, ждёт готовности базы и затем запускает оба процесса вместе:

- фронтенд: http://localhost:5173
- бэкенд: http://localhost:4000
- документация API: http://localhost:4000/docs
- база данных: localhost:5432

Полезные команды:

```bash
npm run dev:db
npm run dev:frontend
npm run dev:backend
npm run dev:down
npm run build
npm run build:backend
```

## Продакшн стек через Docker

Чтобы запустить полный продакшн стек одной командой:

```bash
docker compose up --build
```

После этого будут запущены:

- PostgreSQL на localhost:5432
- API бэкенда на localhost:4000
- фронтенд сайт на localhost:80

Чтобы остановить:

```bash
docker compose down
```

## Развёртывание на Linux сервере

### 1. Установите зависимости

```bash
sudo apt update
sudo apt install -y curl git nginx postgresql-client
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 2. Склонируйте проект

```bash
cd /var/www
sudo git clone <your-repo-url> finance-app
cd finance-app
```

### 3. Настройте окружение

Создайте файл окружения для бэкенда:

```bash
cp .env.example server/.env
```

Затем отредактируйте значения в `server/.env`:

```env
DATABASE_URL=postgresql://finance_user:finance_password@127.0.0.1:5432/finance_db?schema=public
JWT_SECRET=replace-with-long-random-secret
JWT_REFRESH_SECRET=replace-with-long-random-refresh-secret
API_PORT=4000
NODE_ENV=production
```

Если PostgreSQL установлен на этом же сервере, создайте базу данных:

```bash
sudo -u postgres psql -c "CREATE DATABASE finance_db;"
sudo -u postgres psql -c "CREATE USER finance_user WITH ENCRYPTED PASSWORD 'finance_password';"
sudo -u postgres psql -c "ALTER ROLE finance_user WITH SUPERUSER;"
```

### 4. Установите зависимости приложения

```bash
npm install
cd server && npm install && npx prisma generate && npx prisma migrate deploy
```

### 5. Соберите проект

```bash
cd ..
npm run build
npm run build:backend
```

### 6. Запуск через PM2

Создайте файл ecosystem или запускайте команды напрямую:

```bash
pm2 start "npm run dev:backend" --name finance-backend
pm2 start "npm run dev:frontend" --name finance-frontend
pm2 save
pm2 startup
```

Для продакшна более стабильный вариант:

```bash
pm2 start "npm run preview -- --host 0.0.0.0 --port 4173" --name finance-frontend
pm2 start "node server/dist/main.js" --name finance-backend
```

### 7. Nginx reverse proxy

Пример конфигурации:

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

После этого включите конфиг:

```bash
sudo ln -s /etc/nginx/sites-available/finance-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Рекомендации по безопасности

- используйте надёжные JWT-секреты
- храните PostgreSQL на localhost или в частной сети
- настройте firewall
- используйте HTTPS через Let's Encrypt
- запускайте приложение под не-root пользователем

## Частые замечания для продакшна

- фронтенд работает на порту 5173 в разработке и может быть проксирован через Nginx в продакшне
- бэкенд по умолчанию слушает порт 4000
- документация API доступна по `/docs`
- схема базы данных управляется через Prisma миграции

## Полезная команда миграции

```bash
cd server
npx prisma migrate deploy
```
