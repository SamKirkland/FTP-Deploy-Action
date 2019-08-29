# FTP Deploy for GitHub Actions

Automate deploying websites and more with this GitHub action.

![Action](images/action.png)

### Usage (Your_Project/.github/workflows/push.yaml)
```
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
        FTP_PASSWORD: ${{ secrets.FTP_PASSWORD }}
        FTP_SERVER: ${{ secrets.FTP_SERVER }}
        FTP_USERNAME: ${{ secrets.FTP_USERNAME }}
```

1. Select the repository you want to add the action to
2. Select the actions tab `(currently only for beta testers)`
3. Select `Blank workflow file` or `Set up a workflow yourself`, if you don't see these options manually create a yaml file `Your_Project/.github/workflows/push.yaml`
4. Paste the above code into your file and save
7. Now you need to add a few keys to the `secrets` section in your project, the following are required at a minimum. To add a `secret` go to the `Settings` tab in your project then select `Secrets`. Add a new `Secret` for each of the following
   * FTP_USERNAME
   * FTP_PASSWORD
   * FTP_SERVER
   * (see optional settings below)

### Settings
To add a `secret` go to the `Settings` tab in your project then select `Secrets`. Add a new `Secret` for each of the following

| Secret Key Name | Required? | Example                     | Default | Description |
|-----------------|-----------|-----------------------------|---------|-------------|
| FTP_USERNAME    | Yes       | git-action@samkirkland.com  | N/A     | FTP account username |
| FTP_PASSWORD    | Yes       | CrazyUniquePassword&%123    | N/A     | FTP account password |
| FTP_SERVER      | Yes       | ftp.samkirkland.com         | N/A     | FTP server name (you may need to specify a port) |
| LOCAL_DIR       | No        |                             | /       | The local folder to copy, defaults to root project folder |
| REMOTE_DIR      | No        |                             | /       | The remote folder to copy to, deafults to root FTP folder (I recommend you configure this on your server side instead of here)  |


## Common Examples
### Building and deploying a javascript website
```
on: push
name: Build and Publish Website
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - name: Project setup
      run: npm install
    - name: Compile javascript
      run: npm run build
    - name : FTP-Deploy
      uses: SamKirkland/FTP-Deploy-Action@master
      env: 
       FTP_SERVER :  ${{ secrets.FTP_SERVER }}
       FTP_PASSWORD :  ${{ secrets.FTP_PASSWORD }}
       FTP_USERNAME :  ${{ secrets.FTP_USERNAME }}
```


### What does this action do exactly?
- This action is triggered by a `event` on your repo
- A docker image based on `mwienk/docker-lftp` is spun up on github servers
- The docker container compresses your code into a tar.gz file
- The file is then uploaded to the remote server
- The file is then un-zipped

### Deprecated main.workflow config (used for beta/legacy apps that haven't been migrated to .yaml workflows yet)
```
action "FTP-Deploy-Action" {
   uses = "SamKirkland/FTP-Deploy-Action@master"
   secrets = ["FTP_USERNAME", "FTP_PASSWORD", "FTP_SERVER"]
}
```

### Debugging locally
###### Instructions for windows
- Install docker for windows
- Open powershell
- Navigate to the repo folder
- Run `docker build --tag action .`
- (Optional) This step is only required when editing entrypoint.sh due to windows editors saving the file with windows line breaks instead of linux line breaks
  - Download http://dos2unix.sourceforge.net/
  - In another powershell window nagivate to the dos2unix folder /bin
  - Run this command every time you modify entrypoint.sh `.\dos2unix.exe "{FULL_PATH_TO_REPO\entrypoint.sh}"`
- Run `docker run action`
  
###### Instructions for linux
- Please submit a PR for linux instructions :)


### ToDo
- More config options
   - Deploy Mode: ${DEPLOY_MODE} `full`|`diffs`
- SSH support
- Switch from lftp to git

Pull Requests Welcome!

### License
----

MIT
