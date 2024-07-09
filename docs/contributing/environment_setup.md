# UltrasHub - Environment Setup

## **Table of Contents**

- [UltrasHub - Environment Setup](#ultrashub---environment-setup)
  - [**Table of Contents**](#table-of-contents)
  - [Prerequisites](#prerequisites)
    - [API Football API Key](#api-football-api-key)
    - [ENV Variables](#env-variables)
    - [Go](#go)
    - [NodeJS and NPM](#nodejs-and-npm)
    - [Firebase](#firebase)
    - [PostgreSQL](#postgresql)
  - [Building and Running UltrasHub](#building-and-running-ultrashub)

## Prerequisites 

### API Football API Key

UltrasHub is a UI wrapper around a third party api called API-Football. In order to work on UltrasHub, you will need an api key from API-Football.
To get an api key from API-Football:

1. Create an account at [API-Football dashboard](https://dashboard.api-football.com/login)
    - Free tier allows 100 requests/day
1. Click Account > My Access.
1. Copy the API Key and store it in a .env following the steps below.

### ENV Variables

1. Fork the repo, clone, and cd into the root directory of the project

```sh
git clone https://github.com/<your_username>/ultrashub && cd ultrashub
```

2. copy .env.sample to .env

```sh
cp .env.sample .env
```

3. CD into web directory

```sh
cd web/
```

4. copy .env.sample to .env

```sh
cp .env.sample .env
```

### Go

UltrasHub backend server is written using Go 1.21.0. You can download Go by visiting [Go's download and install page](https://go.dev/doc/install).
This will likely installed the latest version of Go. To install the version 1.21 of Go, you can follow the instructions on
[Managing Go installations](https://go.dev/doc/manage-install).


### NodeJS and NPM

Currently, the web project is using version `20.15.0 LTS`.

If you use `nvm` (if you use Windows, use [nvm-windows](https://github.com/coreybutler/nvm-windows)) then you can run `nvm install` and `nvm use` 
(you might need to specify the exact version eg: `nvm install 20.15.0` then `nvm use 20.15.0`) to use the version of Node.js in the `.nvmrc` file.

Alternatively, you can navigate to the NodeJS [website](https://nodejs.org/en/) to download it from there.

### Firebase

The account system will not let you create an account without a Firebase project.

1. Create a Firebase account if you already haven't done so.
1. [Create a new Firebase project.](https://console.firebase.google.com/u/0/)

   - The project name doesn't matter, but the name `ultrashub` would be preferred.
   - Google Analytics is not necessary.

1. Enable Firebase Authentication

   - In the Firebase console, go to `Build > Authentication > Sign-in method`
   - Click on `Google`, add a support email, and save

1. Generate a Firebase Admin private key

   - In your Firebase console, go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save anywhere locally on your machine.
   - Open the newly download file, and copy each element to their respective .env variable in the project's root .env file

#### Firebase Config file

1. Navigate to `Project Settings > General > Your apps`
2. If there are no apps in your project, create a new web app
3. In the `SDK setup and configuration` section, select `config`
4. The Firebase config will be visible below
5. Copy the `firebaseConfig` object properties to their respective .env variables in both the project's root and web .env files. These
.env variables will be prefixed with VITE_

### PostgreSQL

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

#### Run database migrations

1. [Install golang-migrate/migrate](https://github.com/golang-migrate/migrate)

```sh
migrate -path=./migrations -database="postgres://<username>:<password>@localhost:5433/ultrashub?sslmode=disable" up
```

If running multiple migration commands you can add `export ULTRASHUB_DB_DSN postgres://<username>:<password>@localhost:5433/ultrashub?sslmode=disable` into ~/.profile and use the following command instead

```sh
migrate -path=./migrations -database=$ULTRASHUB_DB_DSN
```

## Building and Running UltrasHub

### Start frontend web server

1. [Install NodeJS](#nodejs-and-npm)

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

1. [Install Go 1.21](#go)

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
