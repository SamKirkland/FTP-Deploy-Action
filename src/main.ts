import * as core from "@actions/core";
import { deploy } from "@samkirkland/ftp-deploy";
import { IFtpDeployArguments } from "@samkirkland/ftp-deploy/dist/module/types";

async function runDeployment() {
  const args: IFtpDeployArguments = {
    server: core.getInput("server", { required: true }),
    username: core.getInput("username", { required: true }),
    password: core.getInput("password", { required: true }),
    protocol: optionalProtocol("protocol", core.getInput("protocol")),
    port: optionalInt("port", core.getInput("port")),
    "local-dir": core.getInput("local-dir"),
    "server-dir": core.getInput("server-dir"),
    "state-name": core.getInput("state-name"),
    "dry-run": optionalBoolean("dry-run", core.getInput("dry-run")),
    "dangerous-clean-slate": optionalBoolean("dangerous-clean-slate", core.getInput("dangerous-clean-slate")),
    "include": optionalStringArray("include", core.getInput("include")),
    "exclude": optionalStringArray("exclude", core.getInput("exclude")),
    "log-level": optionalLogLevel("log-level", core.getInput("log-level"))
  };


  try {
    await deploy(args);
  }
  catch (error) {
    core.setFailed(error);
  }
}

runDeployment();









function optionalBoolean(argumentName: string, rawValue: string | undefined): boolean | undefined {
  if (rawValue === undefined) {
    return undefined;
  }

  const cleanValue = rawValue.toLowerCase();
  if (cleanValue === "true") {
    return true;
  }
  if (cleanValue === "false") {
    return false;
  }

  core.setFailed(`${argumentName}: invalid parameter - please use a boolean, you provided "${rawValue}". Try true or false instead.`);
}

function optionalProtocol(argumentName: string, rawValue: string | undefined): "ftp" | "ftps" | "ftps-legacy" | undefined {
  if (rawValue === undefined) {
    return undefined;
  }

  const cleanValue = rawValue.toLowerCase();
  if (cleanValue === "ftp") {
    return "ftp";
  }
  if (cleanValue === "ftps") {
    return "ftps";
  }
  if (cleanValue === "ftps-legacy") {
    return "ftps-legacy";
  }

  core.setFailed(`${argumentName}: invalid parameter - you provided "${rawValue}". Try "ftp", "ftps", or "ftps-legacy" instead.`);
}

function optionalLogLevel(argumentName: string, rawValue: string | undefined): "warn" | "info" | "debug" | undefined {
  if (rawValue === undefined) {
    return undefined;
  }

  const cleanValue = rawValue.toLowerCase();
  if (cleanValue === "warn") {
    return "warn";
  }
  if (cleanValue === "info") {
    return "info";
  }
  if (cleanValue === "debug") {
    return "debug";
  }

  core.setFailed(`${argumentName}: invalid parameter - you provided "${rawValue}". Try "warn", "info", or "debug" instead.`);
}

function optionalInt(argumentName: string, rawValue: string | undefined): number | undefined {
  if (rawValue === undefined) {
    return undefined;
  }

  const cleanValue = rawValue.toLowerCase();
  const valueAsNumber = parseFloat(cleanValue);

  if (Number.isInteger(valueAsNumber)) {
    return valueAsNumber;
  }

  core.setFailed(`${argumentName}: invalid parameter - you provided "${rawValue}". Try a whole number (no decimals) instead like 1234`);
}

function optionalStringArray(argumentName: string, rawValue: string | undefined): string[] | undefined {
  if (rawValue === undefined) {
    return undefined;
  }

  // split value by space and comma
  return rawValue.split(", ");
}
