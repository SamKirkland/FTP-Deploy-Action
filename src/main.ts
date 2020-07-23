import * as core from '@actions/core';
import * as exec from '@actions/exec';
import fs from 'fs';
import { promisify } from 'util';
import { IActionArguments } from './types';

const writeFileAsync = promisify(fs.writeFile);
const errorDeploying = "⚠️ Error deploying";
const errorNoAuth = "⚠️ Error: No methods of authentication present! Provide action with either password (ftp_password argument) or ssh key (sftp_key argument).";

const sshFolder = `${process.env['HOME']}/.ssh`;
const sshKeyFile = `${sshFolder}/id`
const sshKnownHostsFile = `${sshFolder}/known_hosts`

async function run() {
  try {
    const userArguments = getUserArguments();
    
    await configureSSH(userArguments);
    await syncFiles(userArguments);

    console.log("✅ Deploy Complete");
  }
  catch (error) {
    console.error(errorDeploying);
    core.setFailed(error.message);
  }
}

run();

async function configureSSH(args: IActionArguments): Promise<void> {
  if (args.knownHosts === "" && args.sftp_key === "") {
    return;
  }

  try {
    await exec.exec(`mkdir -v -p ${sshFolder}`);
    await exec.exec(`chmod 700 ${sshFolder}`);
    writeFileAsync(sshKnownHostsFile, args.knownHosts);
    writeFileAsync(sshKeyFile, args.sftp_key);
    await exec.exec(`bash -c "echo >> ${sshKeyFile}"`);
    await exec.exec(`chmod 600 ${sshKeyFile}`);
    await exec.exec(`chmod 755 ${sshKnownHostsFile}`);
    
    console.log("✅ Configured .ssh directory");
  }
  catch (error) {
    console.error("⚠️ Error configuring .ssh directory");
    core.setFailed(error.message);
  }
}

function getUserArguments(): IActionArguments {
  return {
    ftp_server: core.getInput("ftp-server", { required: true }),
    ftp_username: core.getInput("ftp-username", { required: true }),
    ftp_password: withDefault(core.getInput("ftp-password"), ""),
    sftp_key: withDefault(core.getInput("sftp-key"), ""),
    local_dir: withDefault(core.getInput("local-dir"), "./"),
    gitFtpArgs: withDefault(core.getInput("git-ftp-args"), ""),
    knownHosts: withDefault(core.getInput("known-hosts"), "")
  };
}

function withDefault(value: string, defaultValue: string) {
  if (value === "" || value === null || value === undefined || value === "undefined") {
    return defaultValue;
  }

  return value;
}

/**
 * Determine auth method from password and key strings
 * and return string to be used by git ftp
 * (either --paswd=<pass> or --key <path_to_keyfile>)
 * favors key over password
 * if none present returns empty array
 */
function getAuthenticationString(password: string, key: string): string[] {
  if (key !== "") {
    return new Array('--key', `${sshKeyFile}`);
  } else if (password !== "") {
    return new Array(`--passwd=${password}`);
  } else {
    return new Array();
  }
}

/**
 * Sync changed files
 */
async function syncFiles(args: IActionArguments) {
  const authStr = getAuthenticationString(args.ftp_password!, args.sftp_key!);
  if (authStr.length === 0) {
    console.log(errorNoAuth);
    core.setFailed(errorNoAuth);
    return
  }
  
  try {
    await core.group("Uploading files", async () => {
      return await exec.exec(
        "git-ftp",
        [
          "push",
          "--force",
          "--auto-init",
          "--verbose",
          `--syncroot=${args.local_dir}`,
          `--user=${args.ftp_username}`,
          ...authStr,
          args.gitFtpArgs!,
          args.ftp_server!
        ]
      );
    });
  }
  catch (error) {
    core.setFailed(error.message);
  }
}
