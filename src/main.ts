import * as core from "@actions/core";
import { deploy } from "@samkirkland/ftp-deploy";
import { IFtpDeployArguments } from "@samkirkland/ftp-deploy/dist/types";

async function runDeployment() {
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
    "exclude": optionalStringArray("exclude", core.getInput("exclude")),
    "log-level": optionalLogLevel("log-level", core.getInput("log-level")),
    "security": optionalSecurity("security", core.getInput("security"))
  };


  try {
    await deploy(args);
  }
  catch (error) {
    core.setFailed(error);
  }
}

runDeployment();







function optionalString(rawValue: string): string | undefined {
  if (rawValue.length === 0) {
    return undefined;
  }

  return rawValue;
}

function optionalBoolean(argumentName: string, rawValue: string): boolean | undefined {
  if (rawValue.length === 0) {
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

function optionalProtocol(argumentName: string, rawValue: string): "ftp" | "ftps" | "ftps-legacy" | undefined {
  if (rawValue.length === 0) {
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

function optionalLogLevel(argumentName: string, rawValue: string): "minimal" | "standard" | "verbose" | undefined {
  if (rawValue.length === 0) {
    return undefined;
  }

  const cleanValue = rawValue.toLowerCase();
  if (cleanValue === "minimal") {
    return "minimal";
  }
  if (cleanValue === "standard") {
    return "standard";
  }
  if (cleanValue === "verbose") {
    return "verbose";
  }

  core.setFailed(`${argumentName}: invalid parameter - you provided "${rawValue}". Try "minimal", "standard", or "verbose" instead.`);
}

function optionalSecurity(argumentName: string, rawValue: string): "loose" | "strict" | undefined {
  if (rawValue.length === 0) {
    return undefined;
  }

  const cleanValue = rawValue.toLowerCase();
  if (cleanValue === "loose") {
    return "loose";
  }
  if (cleanValue === "strict") {
    return "strict";
  }

  core.setFailed(`${argumentName}: invalid parameter - you provided "${rawValue}". Try "loose" or "strict" instead.`);
}

function optionalInt(argumentName: string, rawValue: string): number | undefined {
  if (rawValue.length === 0) {
    return undefined;
  }

  const valueAsNumber = parseFloat(rawValue);

  if (Number.isInteger(valueAsNumber)) {
    return valueAsNumber;
  }

  core.setFailed(`${argumentName}: invalid parameter - you provided "${rawValue}". Try a whole number (no decimals) instead like 1234`);
}

function optionalStringArray(argumentName: string, rawValue: string): string[] | undefined {
  if (rawValue.length === 0) {
    return undefined;
  }

  // split value by space and comma
  return rawValue.split(" - ").filter(str => str !== "");
}
