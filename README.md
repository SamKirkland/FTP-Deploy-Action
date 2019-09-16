# FTP Deploy GitHub Action

Automate deploying websites and more with this GitHub action.

![Action](images/action-preview.gif)

### Usage Example (Your_Project/.github/workflows/main.yml)
```shell
on: push
name: Publish Website
jobs:
  fTP-Deploy-Action:
    name: FTP-Deploy-Action
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - name: FTP-Deploy-Action
      uses: SamKirkland/FTP-Deploy-Action@master
      env:
        FTP_SERVER: ftp.samkirkland.com
        FTP_USERNAME: ${{ secrets.FTP_USERNAME }}
        FTP_PASSWORD: ${{ secrets.FTP_PASSWORD }}
        ARGS: --delete
        # --delete arg will delete files on the server if you've deleted them in git
```

1. Select the repository you want to add the action to
2. Select the actions tab `(currently only for beta testers)`
3. Select `Blank workflow file` or `Set up a workflow yourself`, if you don't see these options manually create a yaml file `Your_Project/.github/workflows/main.yml`
4. Paste the above code into your file and save
7. Now you need to add a few keys to the `secrets` section in your project, the following are required at a minimum. To add a `secret` go to the `Settings` tab in your project then select `Secrets`. Add a new `Secret` for each of the following
   * FTP_SERVER
   * FTP_USERNAME
   * FTP_PASSWORD
   * (see optional settings below)

### Settings
To add a `secret` go to the `Settings` tab in your project then select `Secrets`. Add a new `Secret` for each of the following.
I recommend you use a secrets to store your FTP_USERNAME and FTP_PASSWORD.

| Key Name       | Required? | Example                     | Default | Description |
|----------------|-----------|-----------------------------|---------|-------------|
| `FTP_SERVER`   | Yes       | ftp.samkirkland.com         | N/A     | FTP server name (you may need to specify a port) |
| `FTP_USERNAME` | Yes       | git-action@samkirkland.com  | N/A     | FTP account username |
| `FTP_PASSWORD` | Yes       | CrazyUniquePassword&%123    | N/A     | FTP account password |
| `LOCAL_DIR`    | No        | build                       | . (root project folder) | The local folder to copy, defaults to root project folder. Do NOT include slashes for folders. |
| `REMOTE_DIR`   | No        | serverFolder                | . (root FTP folder) | The remote folder to copy to, deafults to root FTP folder (I recommend you configure this on your server side instead of here). Do NOT include slashes for folders.  |
| `ARGS`         | No        | See `Commonly used ARGS` section below  | N/A     | Custom lftp arguments, this field is passed through directly into the lftp script. |

#### Commonly used ARGS
Custom lftp arguments, this field is passed through directly into the lftp script. See [lftp's website](https://lftp.yar.ru/lftp-man.html) for all options.
You can use as many arguments as you want, seperate them with a space

| Argument            | Description                                                      |
|---------------------|------------------------------------------------------------------|
| `--delete`          | Delete files not present at the source                           |
| `--transfer-all`    | Transfer  all  files, even seemingly the same at the target site |
| `--dry-run`         | Ouputs a list of files that will be created/modified to sync your source without making any actual changes |
| `--include-glob=GP` | Include matching files (GP is a glob pattern, e.g. `*.zip')      |
| `--exclude-glob=GP` | Exclude matching files (GP is a glob pattern, e.g. `*.zip')      |
| `--no-empty-dirs`   | Don't create empty directories                                   |



## Common Examples
### Build and Publish React/Angular/Vue/Node Website
Make sure you have an npm script named 'build'. This config should work for most node built websites
```shell
on: push
name: Build and Publish Front End Framework Website
jobs:
  fTP-Deploy-Action:
    name: FTP-Deploy-Action
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    
    - name: Use Node.js 12.x
      uses: actions/setup-node@v1
      with:
        node-version: '12.x'
        
    - name: Build Project
      run: |
        npm install
        npm run build --if-present
        
    - name: List output files
      run: ls
      
    - name: FTP-Deploy-Action
      uses: SamKirkland/FTP-Deploy-Action@master
      env:
        FTP_SERVER: ftp.samkirkland.com
        FTP_USERNAME: ${{ secrets.FTP_USERNAME }}
        FTP_PASSWORD: ${{ secrets.FTP_PASSWORD }}
        LOCAL_DIR: build
        ARGS: --delete
```

### Log only dry run: Use this mode for testing
Ouputs a list of files that will be created/modified to sync your source without making any actual changes
```shell
on: push
name: Publish Website Dry Run
jobs:
  fTP-Deploy-Action:
    name: FTP-Deploy-Action
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - name: FTP-Deploy-Action
      uses: SamKirkland/FTP-Deploy-Action@master
      env:
        FTP_SERVER: ftp.samkirkland.com
        FTP_USERNAME: ${{ secrets.FTP_USERNAME }}
        FTP_PASSWORD: ${{ secrets.FTP_PASSWORD }}
        ARGS: --delete --dry-run
```

##### Want another example? Let me know by creating a github issue



#### Deprecated main.workflow config (used for beta/legacy apps that haven't been migrated to .yaml workflows yet)
```json
action "FTP-Deploy-Action" {
   uses = "SamKirkland/FTP-Deploy-Action@master"
   secrets = ["FTP_USERNAME", "FTP_PASSWORD", "FTP_SERVER"]
}
```

### Debugging locally
##### Instructions for debugging on windows
- Install docker for windows
- Open powershell
- Navigate to the repo folder
- Run `docker build --tag action .`
- (Optional) This step is only required when editing entrypoint.sh due to windows editors saving the file with windows line breaks instead of linux line breaks
  - Download http://dos2unix.sourceforge.net/
  - In another powershell window nagivate to the dos2unix folder /bin
  - Run this command every time you modify entrypoint.sh `.\dos2unix.exe "{FULL_PATH_TO_REPO\entrypoint.sh}"`
- Run `docker run action`
  
##### Instructions for debugging on linux
- Please submit a PR for linux instructions :)


#### ToDo
- SFTP example
- More examples

#### Pull Requests Welcome!
