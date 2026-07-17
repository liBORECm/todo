# Thorns Todo

A todo app with tables, tasks, recurring tasks, and a tree view.

---

## Requirements

- **Node.js** 22+
- **MariaDB** or **MySQL** running locally
- **npm**

---

## First-time setup

### 1. Create a database

Open your database client (DBeaver, TablePlus, terminal, whatever) and run:

```sql
CREATE DATABASE todo;
```

### 2. Create a `.env` file

Create a file called `.env` in the project root:

```
PORT=5533
DB_HOST=localhost
DB_NAME=todo
DB_USER=root
DB_PWD=your_database_password
```

### 3. Install pm2 (one time, globally)

pm2 keeps the app running after you close the terminal.

```sh
npm install -g pm2
```

### 4. Make pm2 survive reboots (one time)

```sh
pm2 startup
```

This prints a `sudo ...` command — copy it and run it.

### 5. Install dependencies

```sh
npm install
cd frontend && npm install && cd ..
```

---

## Running the app

```sh
npm run build
npm run start
```

`npm run build` — compiles the frontend and backend.  
`npm run start` — runs any new database migrations and starts the server.

You can close the terminal. The app keeps running.

Open it at: **http://localhost:5533**

---

## Updating after a git pull

```sh
git pull
npm install
cd frontend && npm install && cd ..
npm run build
npm run start
```

---

## Useful commands

| What                        | Command                   |
| --------------------------- | ------------------------- |
| Check if the app is running | `pm2 status`              |
| Live logs                   | `npm run logs`            |
| Stop the app                | `npm run stop`            |
| Restart without rebuilding  | `pm2 restart thorns-todo` |
