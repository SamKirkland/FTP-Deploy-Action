import * as core from '@actions/core';
import * as exec from '@actions/exec';
import fs from 'fs';
import { IActionArguments } from './types';

async function run() {
  const userArguments = getUserArguments();
  if ( '' !== userArguments.knownHosts ) {
    try {
      await exec.exec(`mkdir -v -p ${process.env['HOME']}/.ssh`);
      await exec.exec(`chmod 700 ${process.env['HOME']}/.ssh`);
      fs.writeFile(
        process.env['HOME'] + '/.ssh/known_hosts',
        userArguments.knownHosts,
        (err) => { 
          if (err) throw err;
          console.log('Wrote ' + process.env['HOME'] + '/.ssh/known_hosts');
        }
      );
      await exec.exec(`chmod 755 ${process.env['HOME']}/.ssh/known_hosts`);
      console.log("✅ Configured known_hosts");
    } catch( error ) {
      console.error("⚠️ Error configuring known_hosts")
      core.setFailed(error.message);;
    }
  }
  try {
    await syncFiles(userArguments);

    console.log("✅ Deploy Complete");
  }
  catch (error) {
    console.error("⚠️ Error deploying");
    core.setFailed(error.message);
  }
}

run();


function getUserArguments(): IActionArguments {
  return {
    ftp_server: core.getInput("ftp-server", { required: true }),
    ftp_username: core.getInput("ftp-username", { required: true }),
    ftp_password: core.getInput("ftp-password", { required: true }),
    local_dir: withDefault(core.getInput("local-dir"), "./"),
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
      return await exec.exec(`git ftp push --force --auto-init --verbose --syncroot ${args.local_dir} --user ${args.ftp_username} --passwd ${args.ftp_password} ${args.gitFtpArgs} ${args.ftp_server}`);
    });
  }
  catch (error) {
    console.error("⚠️ Failed to upload files");
    core.setFailed(error.message);
    throw error;
  }
}
