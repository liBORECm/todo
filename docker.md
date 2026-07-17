First time / after any code change:

docker compose up --build
This builds both stages, starts MySQL, waits for it to be healthy, runs migrations, then starts the server. App is at http://localhost:5533.

Subsequent starts (no code change):

docker compose up
Stop:

docker compose down
Stop and wipe the database:

docker compose down -v
Run a manual migration (if needed):

docker compose exec app npx knex migrate:latest
Override env vars without editing files — create a .env file at the project root (it's in .dockerignore so it won't be baked into the image):

DB_PWD=yourpassword
DB_NAME=todo
PORT=5533
docker-compose.yml reads these automatically via ${VAR:-default} substitution.

How the build works:

Stage 1 (builder): installs all deps, builds the frontend with Vite, generates Swagger JSON, compiles the backend TypeScript → dist/
Stage 2 (production): installs prod deps only, copies dist/ and frontend/dist/, copies knexfile.ts + db/migrations/ so ts-node can run migrations at startup
