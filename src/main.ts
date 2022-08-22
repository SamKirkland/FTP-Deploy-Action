import * as core from "@actions/core";
import { deploy } from "@samkirkland/ftp-deploy";
import { IFtpDeployArguments } from "@samkirkland/ftp-deploy/dist/types";
import { optionalInt, optionalProtocol, optionalString, optionalBoolean, optionalStringArray, optionalLogLevel, optionalSecurity } from "./parse";

async function runDeployment() {
  try {
    const args: IFtpDeployArguments = {
      server: core.getInput("server", { required: true }),
      username: core.getInput("username", { required: true }),
      password: core.getInput("password", { required: true }),
      port: optionalInt("port", core.getInput("port")),
      protocol: optionalProtocol("protocol", core.getInput("protocol")),
      "local-dir": optionalString(core.getInput("local-dir")),
      "server-dir": optionalString(core.getInput("server-dir")),
      "state-name": optionalString(core.getInput("state-name")),
      "dry-run": optionalBoolean("dry-run", core.getInput("dry-run")),
      "dangerous-clean-slate": optionalBoolean("dangerous-clean-slate", core.getInput("dangerous-clean-slate")),
      "exclude": optionalStringArray("exclude", core.getMultilineInput("exclude")),
      "log-level": optionalLogLevel("log-level", core.getInput("log-level")),
      "security": optionalSecurity("security", core.getInput("security")),
      "timeout": optionalInt("timeout", core.getInput("timeout"))
    };

    await deploy(args);
  }
  catch (error: any) {
    core.setFailed(error);
  }
}

runDeployment();
