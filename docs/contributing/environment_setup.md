# UltrasHub - Environment Setup

## Prerequisites

- [API-Football API Key](https://www.api-football.com/documentation-v3)
  - Free tier which allows 100 requests/day
- Docker/PostgreSQL for DB
- NodeJS 21.1.0
- Go 1.21.0
- Go-lang Migrate

## Run From Source Code

1. Fork the repo, clone, and cd into the root directory of the project

```sh
git clone https://github.com/<your_username>/ultrashub && cd ultrashub
```

2. copy .env.sample to .env \
   _Note: Update with your unique information_

```sh
cp .env.sample .env
```

### Setup Database

- You can either chose to use docker compose or to run a postgress db instance locally.

#### Docker Compose

1. Make sure docker/docker compose is installed and running

2. Run docker compose up

```sh
docker compose up
```

#### Run postgress locally

1. [Install PosgreSQL](https://www.postgresql.org/download/)

1. Create database "ultrashub"

```sh
psql
```

```sql
CREATE DATABASE ultrashub;
\c ultrashub
CREATE ROLE <username> WITH LOGIN PASSWORD '<password>';
CREATE EXTENSION IF NOT EXISTS citext;
\q
```

_Note: Username and password need to match that of .env file_

### Run database migrations

1. [Install golang-migrate/migrate](https://github.com/golang-migrate/migrate)

```sh
migrate -path=./migrations -database="postgres://<username>:<password>@localhost:5433/ultrashub?sslmode=disable" up
```

If running multiple migration commands you can add `export ULTRASHUB_DB_DSN postgres://<username>:<password>@localhost:5433/ultrashub?sslmode=disable` into ~/.profile and use the following command instead

```sh
migrate -path=./migrations -database=$ULTRASHUB_DB_DSN
```

### Start frontend web server

1. [Install NodeJS](https://nodejs.org/en)

1. CD into web directory

```sh
cd /path/to/ultrashub/web
```

2. Install dependencies

```sh
npm install
```

3. Build for prod \
   _Note: Needed since we embed react app into go binary for production_

```sh
npm run build:prod
```

4. Start react dev \
   _Note: Will start the react dev server on port 3000_

```sh
npm run dev
```

### Start the backend dev server

_Note: Will need a new terminal window/tab_

1. [Install Go 1.21](https://go.dev/dl/)

2. CD into the root of ultrashub directory

```sh
cd path/to/ultrashub
```

3. Run the backend dev server \
   _Note: Will start the backend dev server on port 8080_

```sh
go run ./cmd/server/ -env=dev
```

To view all available command-line flags, read [./docs/go-commandline-flags](./docs/go-commandline-flags.md)
