# List of all available command line flags

This list should match all flags set in [/taskls/internal/server/config.go](../internal/server/config.go)

| Flag              | Default value      | Description                         |
| ----------------- | ------------------ | ----------------------------------- |
| port              | 8080               | Server port                         |
| env               | prod               | Environment (dev-test-prod)         |
| db-dsn            | .env TASKLS_DB_DSN | PostgreSQL DSN                      |
| db-max-open-conns | 25                 | PostgreSQL max open connections     |
| db-max-idle-conns | 25                 | PostgreSQL max idle connections     |
| db-max-idle-time  | 15                 | PostgreSQL max connection idle time |

## Example Command

```sh
go run ./cmd/server/ -port=4000 -env=dev -db-max-open-conns=30
```
