"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const ftp_deploy_1 = require("@samkirkland/ftp-deploy");
async function runDeployment() {
    const args = {
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
        await ftp_deploy_1.deploy(args);
    }
    catch (error) {
        core.setFailed(error);
    }
}
runDeployment();
function optionalString(rawValue) {
    if (rawValue.length === 0) {
        return undefined;
    }
    return rawValue;
}
function optionalBoolean(argumentName, rawValue) {
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
function optionalProtocol(argumentName, rawValue) {
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
function optionalLogLevel(argumentName, rawValue) {
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
function optionalSecurity(argumentName, rawValue) {
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
function optionalInt(argumentName, rawValue) {
    if (rawValue.length === 0) {
        return undefined;
    }
    const valueAsNumber = parseFloat(rawValue);
    if (Number.isInteger(valueAsNumber)) {
        return valueAsNumber;
    }
    core.setFailed(`${argumentName}: invalid parameter - you provided "${rawValue}". Try a whole number (no decimals) instead like 1234`);
}
function optionalStringArray(argumentName, rawValue) {
    if (rawValue.length === 0) {
        return undefined;
    }
    // split value by space and comma
    return rawValue.split(", ");
}
