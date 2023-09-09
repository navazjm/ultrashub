<!-- PROJECT LOGO -->
<br />
<p align="center">
    <img src="" alt="Logo" width="100">
    <h3 align="center">⚽️ UltrasHub</h3>
    <p align="center">
        Home of the best content for Football Ultras!
    </p>
</p>

## About UltrasHub

## Run From Source Code

### Run the project locally

1. [Install Go 1.21](https://go.dev/dl/)

2. [Install PosgreSQL](https://www.postgresql.org/download/)

3. Create database "ultrashub"

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
_Note: Replace &lt;username&gt; and &lt;password&gt; with your unique username and password_

4. [Install golang-migrate/migrate](https://github.com/golang-migrate/migrate)

5. Clone the repo and cd into the root directory of the project

```sh
git clone https://github.com/navazjm/ultrashub && cd ultrashub
```

6. copy .env.sample to .env \
   _Note: Update with your unique keys_

```sh
cp .env.sample .env
```

7. Run db migrations

```sh
migrate -path=./migrations -database="postgres://<username>:<password>@localhost/ultrashub?sslmode=disable" up
```

8. Run the dev server \
   _Note: Will start the server at port 4000_

```sh
go run ./cmd/server
```

## Contribute

All contributions are welcome! Just open a pull request. Please read [CONTRIBUTING.md](./docs/CONTRIBUTING.md)

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

## Contact

Michael Navarro - [@navazjm](https://twitter.com/navazjm) michaelnavs@gmail.com

Project Link: [https://github.com/navazjm/ultrashub](https://github.com/navazjm/ultrashub)
