import * as core from '@actions/core';
import * as exec from '@actions/exec';
import fs from 'fs';
import { promisify } from 'util';
import { IActionArguments } from './types';

const writeFileAsync = promisify(fs.writeFile);

async function run() {
  const userArguments = getUserArguments();
  
  try {
    await configureHost(userArguments);
    await syncFiles(userArguments);

    console.log("✅ Deploy Complete");
  }
  catch (error) {
    console.error("⚠️ Error deploying");
    core.setFailed(error.message);
  }
}

run();

async function configureHost(args: IActionArguments): Promise<void> {
  if (args.knownHosts === "") {
    return;
  }

  try {
    const sshFolder = `${process.env['HOME']}/.ssh`;

    await exec.exec(`mkdir -v -p ${sshFolder}`);
    await exec.exec(`chmod 700 ${sshFolder}`);
    writeFileAsync(`${sshFolder}/known_hosts`, args.knownHosts);
    await exec.exec(`chmod 755 ${sshFolder}/known_hosts`);

    console.log("✅ Configured known_hosts");
  }
  catch (error) {
    console.error("⚠️ Error configuring known_hosts");
    throw error;
  }
}

function getUserArguments(): IActionArguments {
  return {
    ftp_server: core.getInput("ftp-server", { required: true }),
    ftp_username: core.getInput("ftp-username", { required: true }),
    ftp_password: core.getInput("ftp-password", { required: true }),
    local_dir: withDefault(core.getInput("local-dir"), "./"),
    gitFtpCommand: withDefault(core.getInput("git-ftp-command"), "push"),
    gitFtpArgs: withDefault(core.getInput("git-ftp-args"), ""),
    knownHosts: withDefault(core.getInput("known-hosts"), "")
  };
}

function withDefault(value: string, defaultValue: string) {
  if (value === "" || value === null || value === undefined) {
    return defaultValue;
  }

  return value;
}

/**
 * Sync changed files
 */
async function syncFiles(args: IActionArguments) {
  try {
    await core.group("Uploading files", async () => {
      return await exec.exec(`git ftp ${args.gitFtpCommand} --force --auto-init --verbose --syncroot ${args.local_dir} --user ${args.ftp_username} --passwd ${args.ftp_password} ${args.gitFtpArgs} ${args.ftp_server}`);
    });
  }
  catch (error) {
    console.error("⚠️ Failed to upload files");
    core.setFailed(error.message);
    throw error;
  }
}
