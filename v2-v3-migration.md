# Migrating from v2 to v3

`uses: actions/checkout@v2.1.0` must now have the option `fetch-depth: 2`

Without the `fetch-depth` option diffs cannot be calculated and all files will be uploaded.

### Breaking changes
All arguments have been renamed to lower `kebab-case`

| Old Value        | New Value       | Notes                      |
|------------------|-----------------|----------------------------|
| `env:`           | `with:`         | ⚠ Before declaring settings in v2 you set a line to `env:` In v3+ that line must now read `with:` ⚠ |
| `FTP_SERVER`     | `ftp-server`    |                            |
| `FTP_USERNAME`   | `ftp-username`  |                            |
| `FTP_PASSWORD`   | `ftp-password`  |                            |
| `LOCAL_DIR`      | `local-dir`     |                            |
| `ARGS`           | `git-ftp-args`  |                            |
| `METHOD`         |                 | `METHOD` has been removed. Instead specify the method within `ftp-server` (ex: ftp://server.com, ftps://server.com, sftp://sever.com) |
| `PORT`           |                 | `PORT` has been removed. Instead specify the port between the domain and destination within `ftp-server` (ex: ftp://server.com:PORT/destination/) |
| `REMOTE_DIR`     |                 | `REMOTE_DIR` has been removed. Instead specify the destination path within `ftp-server` (ex: ftp://server.com/full/destination/path/) |

### ARGS changes
| Old ARG             | New ARG         | Notes                                  |
|---------------------|-----------------|----------------------------------------|
| `--include`         |                 | use `.git-ftp-ignore` instead          |
| `--include-glob`    |                 | use `.git-ftp-ignore` instead          |
| `--exclude`         |                 | use `.git-ftp-ignore` instead          |
| `--exclude-glob`    |                 | use `.git-ftp-ignore` instead          |
| `--delete-excluded` |                 |                                        |
| `--no-empty-dirs`   |                 |                                        |
| `--parallel`        |                 |                                        |
| `--L`               |                 |                                        |
| `--ignore-time`     |                 | v3 only uploads differences by default |
