import * as core from "@actions/core";
import { deploy } from "@samkirkland/ftp-deploy";
import { IFtpDeployArguments } from "@samkirkland/ftp-deploy/dist/module/types";

async function runDeployment() {
  const args: IFtpDeployArguments = {
    server: core.getInput("server", { required: true }),
    username: core.getInput("username", { required: true }),
    password: core.getInput("password", { required: true }),
    protocol: core.getInput("protocol") as any, // todo fix
    port: core.getInput("port") as any, // todo fix
    "local-dir": core.getInput("local-dir") as any, // todo fix
    "server-dir": core.getInput("server-dir") as any, // todo fix
    "state-name": core.getInput("state-name") as any, // todo fix
    "dry-run": core.getInput("dry-run") as any, // todo fix
    "dangerous-clean-slate": core.getInput("dangerous-clean-slate") as any, // todo fix
    "include": core.getInput("include") as any, // todo fix
    "exclude": core.getInput("exclude") as any, // todo fix
    "log-level": core.getInput("log-level") as any // todo fix
  };


  try {
    await deploy(args);
  }
  catch (error) {
    core.setFailed(error);
  }
}

runDeployment();