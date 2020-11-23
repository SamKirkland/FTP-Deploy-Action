export function optionalString(rawValue: string): string | undefined {
    if (rawValue.length === 0) {
        return undefined;
    }

    return rawValue;
}

export function optionalBoolean(argumentName: string, rawValue: string): boolean | undefined {
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

    throw new Error(`${argumentName}: invalid parameter - please use a boolean, you provided "${rawValue}". Try true or false instead.`);
}

export function optionalProtocol(argumentName: string, rawValue: string): "ftp" | "ftps" | "ftps-legacy" | undefined {
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

    throw new Error(`${argumentName}: invalid parameter - you provided "${rawValue}". Try "ftp", "ftps", or "ftps-legacy" instead.`);
}

export function optionalLogLevel(argumentName: string, rawValue: string): "minimal" | "standard" | "verbose" | undefined {
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

    throw new Error(`${argumentName}: invalid parameter - you provided "${rawValue}". Try "minimal", "standard", or "verbose" instead.`);
}

export function optionalSecurity(argumentName: string, rawValue: string): "loose" | "strict" | undefined {
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

    throw new Error(`${argumentName}: invalid parameter - you provided "${rawValue}". Try "loose" or "strict" instead.`);
}

export function optionalInt(argumentName: string, rawValue: string): number | undefined {
    if (rawValue.length === 0) {
        return undefined;
    }

    const valueAsNumber = parseFloat(rawValue);

    if (Number.isInteger(valueAsNumber)) {
        return valueAsNumber;
    }

    throw new Error(`${argumentName}: invalid parameter - you provided "${rawValue}". Try a whole number (no decimals) instead like 1234`);
}

export function optionalStringArray(argumentName: string, rawValue: string): string[] | undefined {
    if (rawValue.length === 0) {
        return undefined;
    }

    const valueTrim = rawValue.trim();

    if (valueTrim.startsWith("[")) {
        // remove [ and ] - then convert to array
        return rawValue.replace(/[\[\]]/g, "").trim().split(", ").filter(str => str !== "");
    }

    // split value by space and comma
    const valueAsArrayDouble = rawValue.split(" - ").map(str => str.trim()).filter(str => str !== "");

    if (valueAsArrayDouble.length) {
        return valueAsArrayDouble;
    }

    throw new Error(`${argumentName}: invalid parameter - you provided "${rawValue}". This option excepts an array in the format [val1, val2] or val1\/n - val2`);
}
