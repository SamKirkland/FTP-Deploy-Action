# Migrating from v3 to v4

Migrating from v3 to v4 should be fairly straightforward. Version 4 was designed with speed and ease of initial setup in mind. Going forward version 4 will be the only supported version.

#### Those who can't upgrade
Most features have been carried forward and improved upon. However, some features did not make the cut.
- **`sftp` is no longer supported**. If you have `sftp` access you are using `ssh`, that means you have access to a much more modern and capable protocol. I plan on releasing a separate github action that will deploy over `sftp`/`ssh` using `rsync`. Until then you can continue using version 3.
- The `include` argument has been removed. I didn't see much need for it in the initial release. If you need this feature please create a support ticket.

---

### How to upgrade

1) Remove `with: fetch-depth: 2`. It is no longer needed and removing it will _slightly_ speed up deployments.
2) Change the version to `4.X.X`, for example `SamKirkland/FTP-Deploy-Action@4.0.0` (please check readme for latest version)
3) If you have a `.git-ftp-include` file you should delete it. Version 4 tracks files differently and no longer needs this config file.
4) If you have a `.git-ftp-ignore` file, you should transfer the options to the new `exclude` argument. _Note: Version 4 excludes any `.git*` and `node_modules/` files/folders by default_
5) Update your arguments to reflect the following changes
    * `ftp-server` was split into 4 arguments. `server`, `port`, `protocol`, and `server-dir`. Transfer your config to these options as needed.
    * `ftp-username` was renamed to `username`
    * `ftp-password` was renamed to `password`
    * `local-dir` and `server-dir` now **must** end with `/`
    * `git-ftp-args` and `known-hosts` arguments were removed