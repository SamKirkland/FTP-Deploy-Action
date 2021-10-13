import { optionalBoolean, optionalInt, optionalLogLevel, optionalProtocol, optionalSecurity, optionalString } from "./parse";

describe("boolean", () => {
    test("false", () => {
        expect(optionalBoolean("test", "false")).toBe(false);
    });

    test("FALSE", () => {
        expect(optionalBoolean("test", "FALSE")).toBe(false);
    });

    test("true", () => {
        expect(optionalBoolean("test", "true")).toBe(true);
    });

    test("TRUE", () => {
        expect(optionalBoolean("test", "TRUE")).toBe(true);
    });

    test("optional", () => {
        expect(optionalBoolean("test", "")).toBe(undefined);
    });
});

describe("string", () => {
    test("empty", () => {
        expect(optionalString("")).toBe(undefined);
    });

    test("populated", () => {
        expect(optionalString("test")).toBe("test");
    });
});

describe("int", () => {
    test("empty", () => {
        expect(optionalInt("test", "")).toBe(undefined);
    });

    test("0", () => {
        expect(optionalInt("test", "0")).toBe(0);
    });

    test("1", () => {
        expect(optionalInt("test", "1")).toBe(1);
    });

    test("500", () => {
        expect(optionalInt("test", "500")).toBe(500);
    });

    test("non-int", () => {
        expect(() => optionalInt("test", "12.345")).toThrow();
    });
});

describe("protocol", () => {
    test("empty", () => {
        expect(optionalProtocol("test", "")).toBe(undefined);
    });

    test("ftp", () => {
        expect(optionalProtocol("test", "ftp")).toBe("ftp");
    });

    test("ftps", () => {
        expect(optionalProtocol("test", "ftps")).toBe("ftps");
    });

    test("ftps-legacy", () => {
        expect(optionalProtocol("test", "ftps-legacy")).toBe("ftps-legacy");
    });
});

describe("log level", () => {
    test("empty", () => {
        expect(optionalLogLevel("test", "")).toBe(undefined);
    });

    test("minimal", () => {
        expect(optionalLogLevel("test", "minimal")).toBe("minimal");
    });

    test("standard", () => {
        expect(optionalLogLevel("test", "standard")).toBe("standard");
    });

    test("verbose", () => {
        expect(optionalLogLevel("test", "verbose")).toBe("verbose");
    });
});

describe("security", () => {
    test("empty", () => {
        expect(optionalSecurity("test", "")).toBe(undefined);
    });

    test("loose", () => {
        expect(optionalSecurity("test", "loose")).toBe("loose");
    });

    test("strict", () => {
        expect(optionalSecurity("test", "strict")).toBe("strict");
    });
});
