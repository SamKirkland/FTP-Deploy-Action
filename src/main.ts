import * as core from '@actions/core';
import * as exec from '@actions/exec';
import fs from 'fs';
import { promisify } from 'util';
import { IActionArguments } from './types';

const writeFileAsync = promisify(fs.writeFile);
const appendFileAsync = promisify(fs.appendFile);

async function run() {
  const userArguments = getUserArguments();
  
  try {
    await configureHost(userArguments);
    await excludeGithub(userArguments);
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
    await writeFileAsync(`${sshFolder}/known_hosts`, args.knownHosts);
    await exec.exec(`chmod 755 ${sshFolder}/known_hosts`);

    console.log("✅ Configured known_hosts");
  }
  catch (error) {
    console.error("⚠️ Error configuring known_hosts");
    throw error;
  }
}

async function excludeGithub(args: IActionArguments) {
  if (args.ignoreGithub?.toLowerCase() != "true") {
    return;
  }

  try {
    await appendFileAsync(".git-ftp-ignore", "\n.github");
  } catch (error) {
    console.error("⚠️ Error adding .github-folder to .git-ftp-ignore", error);
    core.setFailed(error);
    throw error;
  }
}
function getUserArguments(): IActionArguments {
  return {
    ftp_server: core.getInput("ftp-server", { required: true }),
    ftp_username: core.getInput("ftp-username", { required: true }),
    ftp_password: core.getInput("ftp-password", { required: true }),
    local_dir: withDefault(core.getInput("local-dir"), "./"),
    gitFtpArgs: withDefault(core.getInput("git-ftp-args"), ""),
    knownHosts: withDefault(core.getInput("known-hosts"), ""),
    ignoreGithub: withDefault(core.getInput("ignore-github"), "true"),
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
      return await exec.exec(`git ftp push --force --auto-init --verbose --syncroot ${args.local_dir} --user ${args.ftp_username} --passwd ${args.ftp_password} ${args.gitFtpArgs} ${args.ftp_server}`);
    });
  }
  catch (error) {
    console.error("⚠️ Failed to upload files");
    core.setFailed(error.message);
    throw error;
  }
}
