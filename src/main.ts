import { getInput, getMultilineInput, setFailed } from "@actions/core";
import { deploy } from "@samkirkland/ftp-deploy";
import { IFtpDeployArguments } from "@samkirkland/ftp-deploy/dist/types";
import { optionalInt, optionalProtocol, optionalString, optionalBoolean, optionalStringArray, optionalLogLevel, optionalSecurity } from "./parse";

async function runDeployment() {
  try {
    const args: IFtpDeployArguments = {
      server: getInput("server", { required: true }),
      username: getInput("username", { required: true }),
      password: getInput("password", { required: true }),
      port: optionalInt("port", getInput("port")),
      protocol: optionalProtocol("protocol", getInput("protocol")),
      "local-dir": optionalString(getInput("local-dir")),
      "server-dir": optionalString(getInput("server-dir")),
      "state-name": optionalString(getInput("state-name")),
      "dry-run": optionalBoolean("dry-run", getInput("dry-run")),
      "dangerous-clean-slate": optionalBoolean("dangerous-clean-slate", getInput("dangerous-clean-slate")),
      "exclude": optionalStringArray("exclude", getMultilineInput("exclude")),
      "log-level": optionalLogLevel("log-level", getInput("log-level")),
      "security": optionalSecurity("security", getInput("security")),
      "timeout": optionalInt("timeout", getInput("timeout"))
    };

    await deploy(args);
  }
  // eslint-disable-next-line
  catch (error: any) {
    setFailed(error);
  }
}

runDeployment();
