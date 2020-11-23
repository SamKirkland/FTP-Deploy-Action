module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__webpack_require__(2087));
const utils_1 = __webpack_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __webpack_require__(7351);
const file_command_1 = __webpack_require__(717);
const utils_1 = __webpack_require__(5278);
const os = __importStar(__webpack_require__(2087));
const path = __importStar(__webpack_require__(5622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__webpack_require__(5747));
const os = __importStar(__webpack_require__(2087));
const utils_1 = __webpack_require__(5278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5176:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createFilter = void 0;
const normalize_1 = __webpack_require__(7561);
const util_1 = __webpack_require__(9735);
function createFilter(options, ...args) {
    let criteria = args.length <= 1 ? args[0] : args;
    let filters = normalize_1.normalize(criteria, options);
    pathFilter[util_1._filters] = filters;
    return pathFilter;
    function pathFilter(...args) {
        // Does the file path match any of the exclude filters?
        let exclude = filters.exclude.some((filter) => filter(...args));
        if (exclude) {
            return false;
        }
        if (filters.include.length === 0) {
            // Include everything that's not excluded
            return true;
        }
        // Does the file path match any of the include filters?
        let include = filters.include.some((filter) => filter(...args));
        return include;
    }
}
exports.createFilter = createFilter;
//# sourceMappingURL=create-filter.js.map

/***/ }),

/***/ 2405:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.filePathFilter = void 0;
const create_filter_1 = __webpack_require__(5176);
function filePathFilter(...args) {
    return create_filter_1.createFilter({}, ...args);
}
exports.filePathFilter = filePathFilter;
//# sourceMappingURL=file-path-filter.js.map

/***/ }),

/***/ 3410:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.filePathFilter = void 0;
const file_path_filter_1 = __webpack_require__(2405);
Object.defineProperty(exports, "filePathFilter", ({ enumerable: true, get: function () { return file_path_filter_1.filePathFilter; } }));
__exportStar(__webpack_require__(3225), exports);
var create_filter_1 = __webpack_require__(5176);
Object.defineProperty(exports, "createFilter", ({ enumerable: true, get: function () { return create_filter_1.createFilter; } }));
// Export `filePathFilter` as a named export and the default export
exports.default = file_path_filter_1.filePathFilter;
// CommonJS default export hack
/* eslint-env commonjs */
if ( true && typeof module.exports === "object") {
    module.exports = Object.assign(module.exports.default, module.exports);
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7561:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalize = void 0;
const globToRegExp = __webpack_require__(7117);
const path = __webpack_require__(5622);
const util_1 = __webpack_require__(9735);
/**
 * Normalizes the user-provided filter criteria. The normalized form is a `Filters` object
 * whose `include` and `exclude` properties are both `FilterFunction` arrays.
 */
function normalize(criteria, opts) {
    let filters = {
        include: [],
        exclude: [],
    };
    let options = normalizeOptions(opts);
    // Convert each criterion to a FilterFunction
    let tuples = normalizeCriteria(criteria, options);
    // Populate the `include` and `exclude` arrays
    for (let [filter, filterFunction] of tuples) {
        filters[filter].push(filterFunction);
    }
    return filters;
}
exports.normalize = normalize;
/**
 * Fills-in defaults for any options that weren't specified by the caller.
 */
function normalizeOptions(options) {
    return {
        // TODO: Remove the "getPath" fallback in the next minor release
        map: options.map || options.getPath || String,
        sep: options.sep || path.sep,
    };
}
/**
 * Creates a `FilterFunction` for each given criterion.
 */
function normalizeCriteria(criteria, options, filter) {
    let tuples = [];
    if (Array.isArray(criteria)) {
        for (let criterion of criteria) {
            tuples.push(...normalizeCriteria(criterion, options, filter));
        }
    }
    else if (util_1.isPathFilter(criteria)) {
        for (let filterFunction of criteria[util_1._filters].include) {
            tuples.push(["include", filterFunction]);
        }
        for (let filterFunction of criteria[util_1._filters].exclude) {
            tuples.push(["exclude", filterFunction]);
        }
    }
    else if (util_1.isFilterCriterion(criteria)) {
        tuples.push(normalizeCriterion(criteria, options, filter));
    }
    else if (criteria && typeof criteria === "object" && !filter) {
        if (criteria.include !== undefined) {
            tuples.push(...normalizeCriteria(criteria.include, options, "include"));
        }
        if (criteria.exclude !== undefined) {
            tuples.push(...normalizeCriteria(criteria.exclude, options, "exclude"));
        }
    }
    else {
        throw new Error(`Invalid filter criteria: ${criteria}`);
    }
    return tuples;
}
/**
 * Creates a `FilterFunction` for the given criterion.
 *
 * @param criteria - One or more filter critiera
 * @param options - Options for how the `FilterFunction` should behave
 * @param filter - The type of filter. Defaults to `include`, except for glob patterns that start with "!"
 */
function normalizeCriterion(criterion, options, filter) {
    const globOptions = { extended: true, globstar: true };
    let type = typeof criterion;
    let filterFunction;
    if (type === "function") {
        filterFunction = criterion;
    }
    else if (type === "boolean") {
        let bool = criterion;
        filterFunction = function booleanFilter() {
            return bool;
        };
    }
    else if (type === "string") {
        let glob = criterion;
        let invert = false;
        if (glob.startsWith("!")) {
            glob = glob.substr(1);
            invert = Boolean(filter);
            filter = filter || "exclude";
        }
        let pattern = globToRegExp(glob, globOptions);
        filterFunction = createGlobFilter(pattern, options, invert);
    }
    else if (criterion instanceof RegExp) {
        let pattern = criterion;
        let { map } = options;
        filterFunction = function regExpFilter(...args) {
            let filePath = map(...args);
            return pattern.test(filePath);
        };
    }
    else {
        throw new Error(`Invalid filter criteria: ${criterion}`);
    }
    return [filter || "include", filterFunction];
}
/**
 * Creates a `FilterFunction` for filtering based on glob patterns
 */
function createGlobFilter(pattern, options, invert) {
    let { map, sep } = options;
    return function globFilter(...args) {
        let filePath = map(...args);
        if (sep !== "/") {
            // Glob patterns always expect forward slashes, even on Windows
            filePath = filePath.replace(new RegExp("\\" + sep, "g"), "/");
        }
        let match = pattern.test(filePath);
        return invert ? !match : match;
    };
}
//# sourceMappingURL=normalize.js.map

/***/ }),

/***/ 3225:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 9735:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isPathFilter = exports.isFilterCriterion = exports._filters = void 0;
/**
 * Symbol used to store the underlying filters of a `pathFilter()` function.
 */
exports._filters = Symbol("_filters");
/**
 * Determines whether the given value is a `FilterCriterion`.
 */
function isFilterCriterion(value) {
    let type = typeof value;
    return type === "string" ||
        type === "boolean" ||
        type === "function" ||
        value instanceof RegExp;
}
exports.isFilterCriterion = isFilterCriterion;
/**
 * Determines whether the given value is one of our internal `pathFilter()` functions.
 */
function isPathFilter(value) {
    let fn = value;
    return fn &&
        typeof fn === "function" &&
        typeof fn[exports._filters] === "object";
}
exports.isPathFilter = isPathFilter;
//# sourceMappingURL=util.js.map

/***/ }),

/***/ 504:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.asyncForEach = void 0;
/**
 * Simultaneously processes all items in the given array.
 *
 * @param array - The array to iterate over
 * @param iterator - The function to call for each item in the array
 * @param done - The function to call when all iterators have completed
 *
 * @internal
 */
function asyncForEach(array, iterator, done) {
    if (!Array.isArray(array)) {
        throw new TypeError(`${array} is not an array`);
    }
    if (array.length === 0) {
        // NOTE: Normally a bad idea to mix sync and async, but it's safe here because
        // of the way that this method is currently used by DirectoryReader.
        done();
        return;
    }
    // Simultaneously process all items in the array.
    let pending = array.length;
    for (let item of array) {
        iterator(item, callback);
    }
    function callback() {
        if (--pending === 0) {
            done();
        }
    }
}
exports.asyncForEach = asyncForEach;
//# sourceMappingURL=for-each.js.map

/***/ }),

/***/ 5833:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.readdirAsync = void 0;
const fs = __webpack_require__(5747);
const directory_reader_1 = __webpack_require__(4918);
const for_each_1 = __webpack_require__(504);
const asyncFacade = { fs, forEach: for_each_1.asyncForEach };
function readdirAsync(dir, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = undefined;
    }
    let promise = new Promise((resolve, reject) => {
        let results = [];
        let reader = new directory_reader_1.DirectoryReader(dir, options, asyncFacade);
        let stream = reader.stream;
        stream.on("error", (err) => {
            reject(err);
            stream.pause();
        });
        stream.on("data", (result) => {
            results.push(result);
        });
        stream.on("end", () => {
            resolve(results);
        });
    });
    if (callback) {
        promise.then((results) => callback(null, results), (err) => callback(err, undefined));
    }
    else {
        return promise;
    }
}
exports.readdirAsync = readdirAsync;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8188:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.callOnce = exports.safeCall = void 0;
/**
 * Calls a function with the given arguments, and ensures that the error-first callback is _always_
 * invoked exactly once, even if the function throws an error.
 *
 * @param fn - The function to invoke
 * @param args - The arguments to pass to the function. The final argument must be a callback function.
 *
 * @internal
 */
function safeCall(fn, input, callback) {
    // Replace the callback function with a wrapper that ensures it will only be called once
    callback = callOnce(callback);
    try {
        fn(input, callback);
    }
    catch (err) {
        callback(err, undefined);
    }
}
exports.safeCall = safeCall;
/**
 * Returns a wrapper function that ensures the given callback function is only called once.
 * Subsequent calls are ignored, unless the first argument is an Error, in which case the
 * error is thrown.
 *
 * @param callback - The function that should only be called once
 *
 * @internal
 */
function callOnce(callback) {
    let fulfilled = false;
    return function onceWrapper(err, result) {
        if (!fulfilled) {
            fulfilled = true;
            callback.call(this, err, result);
        }
        else if (err) {
            // The callback has already been called, but now an error has occurred
            // (most likely inside the callback function). So re-throw the error,
            // so it gets handled further up the call stack
            throw err;
        }
    };
}
exports.callOnce = callOnce;
//# sourceMappingURL=call.js.map

/***/ }),

/***/ 4918:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DirectoryReader = void 0;
const path = __webpack_require__(5622);
const stream_1 = __webpack_require__(2413);
const call_1 = __webpack_require__(8188);
const normalize_options_1 = __webpack_require__(2977);
const stat_1 = __webpack_require__(9445);
/**
 * Asynchronously reads the contents of a directory and streams the results
 * via a `ReadableStream`.
 *
 * @internal
 */
class DirectoryReader {
    /**
     * @param dir - The absolute or relative directory path to read
     * @param [options] - User-specified options, if any (see `normalizeOptions()`)
     * @param facade - sync or async function implementations
     * @param emit - Indicates whether the reader should emit "file", "directory", and "symlink" events.
     */
    constructor(dir, options, facade, emit = false) {
        this.options = normalize_options_1.normalizeOptions(options, facade, emit);
        // Indicates whether we should keep reading
        // This is set false if stream.Readable.push() returns false.
        this.shouldRead = true;
        // The directories to read
        // (initialized with the top-level directory)
        this.queue = [{
                path: dir,
                basePath: this.options.basePath,
                depth: 0
            }];
        // The number of directories that are currently being processed
        this.pending = 0;
        // The data that has been read, but not yet emitted
        this.buffer = [];
        this.stream = new stream_1.Readable({ objectMode: true });
        this.stream._read = () => {
            // Start (or resume) reading
            this.shouldRead = true;
            // If we have data in the buffer, then send the next chunk
            if (this.buffer.length > 0) {
                this.pushFromBuffer();
            }
            // If we have directories queued, then start processing the next one
            if (this.queue.length > 0) {
                this.readNextDirectory();
            }
            this.checkForEOF();
        };
    }
    /**
     * Reads the next directory in the queue
     */
    readNextDirectory() {
        let { facade } = this.options;
        let dir = this.queue.shift();
        this.pending++;
        // Read the directory listing
        call_1.safeCall(facade.fs.readdir, dir.path, (err, items) => {
            if (err) {
                // fs.readdir threw an error
                this.emit("error", err);
                return this.finishedReadingDirectory();
            }
            try {
                // Process each item in the directory (simultaneously, if async)
                facade.forEach(items, this.processItem.bind(this, dir), this.finishedReadingDirectory.bind(this, dir));
            }
            catch (err2) {
                // facade.forEach threw an error
                // (probably because fs.readdir returned an invalid result)
                this.emit("error", err2);
                this.finishedReadingDirectory();
            }
        });
    }
    /**
     * This method is called after all items in a directory have been processed.
     *
     * NOTE: This does not necessarily mean that the reader is finished, since there may still
     * be other directories queued or pending.
     */
    finishedReadingDirectory() {
        this.pending--;
        if (this.shouldRead) {
            // If we have directories queued, then start processing the next one
            if (this.queue.length > 0) {
                this.readNextDirectory();
            }
            this.checkForEOF();
        }
    }
    /**
     * Determines whether the reader has finished processing all items in all directories.
     * If so, then the "end" event is fired (via {@Readable#push})
     */
    checkForEOF() {
        if (this.buffer.length === 0 && // The stuff we've already read
            this.pending === 0 && // The stuff we're currently reading
            this.queue.length === 0) { // The stuff we haven't read yet
            // There's no more stuff!
            this.stream.push(null);
        }
    }
    /**
     * Processes a single item in a directory.
     *
     * If the item is a directory, and `option.deep` is enabled, then the item will be added
     * to the directory queue.
     *
     * If the item meets the filter criteria, then it will be emitted to the reader's stream.
     *
     * @param dir - A directory object from the queue
     * @param item - The name of the item (name only, no path)
     * @param done - A callback function that is called after the item has been processed
     */
    processItem(dir, item, done) {
        let stream = this.stream;
        let options = this.options;
        let itemPath = dir.basePath + item;
        let fullPath = path.join(dir.path, item);
        // If `options.deep` is a number, and we've already recursed to the max depth,
        // then there's no need to check fs.Stats to know if it's a directory.
        // If `options.deep` is a function, then we'll need fs.Stats
        let maxDepthReached = dir.depth >= options.recurseDepth;
        // Do we need to call `fs.stat`?
        let needStats = !maxDepthReached || // we need the fs.Stats to know if it's a directory
            options.stats || // the user wants fs.Stats objects returned
            options.recurseFnNeedsStats || // we need fs.Stats for the recurse function
            options.filterFnNeedsStats || // we need fs.Stats for the filter function
            stream.listenerCount("file") || // we need the fs.Stats to know if it's a file
            stream.listenerCount("directory") || // we need the fs.Stats to know if it's a directory
            stream.listenerCount("symlink"); // we need the fs.Stats to know if it's a symlink
        // If we don't need stats, then exit early
        if (!needStats) {
            if (this.filter({ path: itemPath })) {
                this.pushOrBuffer({ data: itemPath });
            }
            return done();
        }
        // Get the fs.Stats object for this path
        stat_1.stat(options.facade.fs, fullPath, (err, stats) => {
            if (err) {
                // fs.stat threw an error
                this.emit("error", err);
                return done();
            }
            try {
                // Add the item's path to the fs.Stats object
                // The base of this path, and its separators are determined by the options
                // (i.e. options.basePath and options.sep)
                stats.path = itemPath;
                // Add depth of the path to the fs.Stats object for use this in the filter function
                stats.depth = dir.depth;
                if (this.shouldRecurse(stats, maxDepthReached)) {
                    // Add this subdirectory to the queue
                    this.queue.push({
                        path: fullPath,
                        basePath: itemPath + options.sep,
                        depth: dir.depth + 1,
                    });
                }
                // Determine whether this item matches the filter criteria
                if (this.filter(stats)) {
                    this.pushOrBuffer({
                        data: options.stats ? stats : itemPath,
                        file: stats.isFile(),
                        directory: stats.isDirectory(),
                        symlink: stats.isSymbolicLink(),
                    });
                }
                done();
            }
            catch (err2) {
                // An error occurred while processing the item
                // (probably during a user-specified function, such as options.deep, options.filter, etc.)
                this.emit("error", err2);
                done();
            }
        });
    }
    /**
     * Pushes the given chunk of data to the stream, or adds it to the buffer,
     * depending on the state of the stream.
     */
    pushOrBuffer(chunk) {
        // Add the chunk to the buffer
        this.buffer.push(chunk);
        // If we're still reading, then immediately emit the next chunk in the buffer
        // (which may or may not be the chunk that we just added)
        if (this.shouldRead) {
            this.pushFromBuffer();
        }
    }
    /**
     * Immediately pushes the next chunk in the buffer to the reader's stream.
     * The "data" event will always be fired (via `Readable.push()`).
     * In addition, the "file", "directory", and/or "symlink" events may be fired,
     * depending on the type of properties of the chunk.
     */
    pushFromBuffer() {
        let stream = this.stream;
        let chunk = this.buffer.shift();
        // Stream the data
        try {
            this.shouldRead = stream.push(chunk.data);
        }
        catch (err) {
            this.emit("error", err);
        }
        if (this.options.emit) {
            // Also emit specific events, based on the type of chunk
            chunk.file && this.emit("file", chunk.data);
            chunk.symlink && this.emit("symlink", chunk.data);
            chunk.directory && this.emit("directory", chunk.data);
        }
    }
    /**
     * Determines whether the given directory meets the user-specified recursion criteria.
     * If the user didn't specify recursion criteria, then this function will default to true.
     *
     * @param stats - The directory's `Stats` object
     * @param maxDepthReached - Whether we've already crawled the user-specified depth
     */
    shouldRecurse(stats, maxDepthReached) {
        let { recurseFn } = this.options;
        if (maxDepthReached) {
            // We've already crawled to the maximum depth. So no more recursion.
            return false;
        }
        else if (!stats.isDirectory()) {
            // It's not a directory. So don't try to crawl it.
            return false;
        }
        else if (recurseFn) {
            try {
                // Run the user-specified recursion criteria
                return !!recurseFn(stats);
            }
            catch (err) {
                // An error occurred in the user's code.
                // In Sync and Async modes, this will return an error.
                // In Streaming mode, we emit an "error" event, but continue processing
                this.emit("error", err);
            }
        }
        else {
            // No recursion function was specified, and we're within the maximum depth.
            // So crawl this directory.
            return true;
        }
    }
    /**
     * Determines whether the given item meets the user-specified filter criteria.
     * If the user didn't specify a filter, then this function will always return true.
     *
     * @param stats - The item's `Stats` object, or an object with just a `path` property
     */
    filter(stats) {
        let { filterFn } = this.options;
        if (filterFn) {
            try {
                // Run the user-specified filter function
                return !!filterFn(stats);
            }
            catch (err) {
                // An error occurred in the user's code.
                // In Sync and Async modes, this will return an error.
                // In Streaming mode, we emit an "error" event, but continue processing
                this.emit("error", err);
            }
        }
        else {
            // No filter was specified, so match everything
            return true;
        }
    }
    /**
     * Emits an event.  If one of the event listeners throws an error,
     * then an "error" event is emitted.
     */
    emit(eventName, data) {
        let stream = this.stream;
        try {
            stream.emit(eventName, data);
        }
        catch (err) {
            if (eventName === "error") {
                // Don't recursively emit "error" events.
                // If the first one fails, then just throw
                throw err;
            }
            else {
                stream.emit("error", err);
            }
        }
    }
}
exports.DirectoryReader = DirectoryReader;
//# sourceMappingURL=directory-reader.js.map

/***/ }),

/***/ 8811:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.readdir = void 0;
const async_1 = __webpack_require__(5833);
const iterator_1 = __webpack_require__(5944);
const stream_1 = __webpack_require__(5521);
const sync_1 = __webpack_require__(704);
const readdir = async_1.readdirAsync;
exports.readdir = readdir;
readdir.sync = sync_1.readdirSync;
readdir.async = async_1.readdirAsync;
readdir.stream = stream_1.readdirStream;
readdir.iterator = iterator_1.readdirIterator;
var async_2 = __webpack_require__(5833);
Object.defineProperty(exports, "readdirAsync", ({ enumerable: true, get: function () { return async_2.readdirAsync; } }));
var iterator_2 = __webpack_require__(5944);
Object.defineProperty(exports, "readdirIterator", ({ enumerable: true, get: function () { return iterator_2.readdirIterator; } }));
var stream_2 = __webpack_require__(5521);
Object.defineProperty(exports, "readdirStream", ({ enumerable: true, get: function () { return stream_2.readdirStream; } }));
var sync_2 = __webpack_require__(704);
Object.defineProperty(exports, "readdirSync", ({ enumerable: true, get: function () { return sync_2.readdirSync; } }));
__exportStar(__webpack_require__(6299), exports);
exports.default = readdir;
// CommonJS default export hack
/* eslint-env commonjs */
if ( true && typeof module.exports === "object") {
    module.exports = Object.assign(module.exports.default, module.exports);
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5944:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.readdirIterator = void 0;
const fs = __webpack_require__(5747);
const for_each_1 = __webpack_require__(504);
const directory_reader_1 = __webpack_require__(4918);
const pending_1 = __webpack_require__(8553);
const iteratorFacade = { fs, forEach: for_each_1.asyncForEach };
function readdirIterator(dir, options) {
    let reader = new directory_reader_1.DirectoryReader(dir, options, iteratorFacade);
    let stream = reader.stream;
    let pendingValues = [];
    let pendingReads = [];
    let error;
    let readable = false;
    let done = false;
    stream.on("error", function streamError(err) {
        error = err;
        stream.pause();
        fulfillPendingReads();
    });
    stream.on("end", function streamEnd() {
        done = true;
        fulfillPendingReads();
    });
    stream.on("readable", function streamReadable() {
        readable = true;
        fulfillPendingReads();
    });
    return {
        [Symbol.asyncIterator]() {
            return this;
        },
        next() {
            let pendingRead = pending_1.pending();
            pendingReads.push(pendingRead);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            Promise.resolve().then(fulfillPendingReads);
            return pendingRead.promise;
        }
    };
    function fulfillPendingReads() {
        if (error) {
            while (pendingReads.length > 0) {
                let pendingRead = pendingReads.shift();
                pendingRead.reject(error);
            }
        }
        else if (pendingReads.length > 0) {
            while (pendingReads.length > 0) {
                let pendingRead = pendingReads.shift();
                let value = getNextValue();
                if (value) {
                    pendingRead.resolve({ value });
                }
                else if (done) {
                    pendingRead.resolve({ done, value });
                }
                else {
                    pendingReads.unshift(pendingRead);
                    break;
                }
            }
        }
    }
    function getNextValue() {
        let value = pendingValues.shift();
        if (value) {
            return value;
        }
        else if (readable) {
            readable = false;
            while (true) {
                value = stream.read();
                if (value) {
                    pendingValues.push(value);
                }
                else {
                    break;
                }
            }
            return pendingValues.shift();
        }
    }
}
exports.readdirIterator = readdirIterator;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8553:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pending = void 0;
/**
 * Returns a `Promise` and the functions to resolve or reject it.
 * @internal
 */
function pending() {
    let resolve, reject;
    let promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return {
        promise,
        resolve(result) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            Promise.resolve(result).then(resolve);
        },
        reject(reason) {
            Promise.reject(reason).catch(reject);
        }
    };
}
exports.pending = pending;
//# sourceMappingURL=pending.js.map

/***/ }),

/***/ 2977:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeOptions = void 0;
const file_path_filter_1 = __webpack_require__(3410);
const path = __webpack_require__(5622);
/**
 * Validates and normalizes the options argument
 *
 * @param [options] - User-specified options, if any
 * @param facade - sync or async function implementations
 * @param emit - Indicates whether the reader should emit "file", "directory", and "symlink" events.
 *
 * @internal
 */
function normalizeOptions(options, facade, emit) {
    if (options === null || options === undefined) {
        options = {};
    }
    else if (typeof options !== "object") {
        throw new TypeError("options must be an object");
    }
    let sep = options.sep;
    if (sep === null || sep === undefined) {
        sep = path.sep;
    }
    else if (typeof sep !== "string") {
        throw new TypeError("options.sep must be a string");
    }
    let stats = Boolean(options.stats || options.withFileTypes);
    let recurseDepth, recurseFn, recurseFnNeedsStats = false, deep = options.deep;
    if (deep === null || deep === undefined) {
        recurseDepth = 0;
    }
    else if (typeof deep === "boolean") {
        recurseDepth = deep ? Infinity : 0;
    }
    else if (typeof deep === "number") {
        if (deep < 0 || isNaN(deep)) {
            throw new Error("options.deep must be a positive number");
        }
        else if (Math.floor(deep) !== deep) {
            throw new Error("options.deep must be an integer");
        }
        else {
            recurseDepth = deep;
        }
    }
    else if (typeof deep === "function") {
        // Recursion functions require a Stats object
        recurseFnNeedsStats = true;
        recurseDepth = Infinity;
        recurseFn = deep;
    }
    else if (deep instanceof RegExp || (typeof deep === "string" && deep.length > 0)) {
        recurseDepth = Infinity;
        recurseFn = file_path_filter_1.createFilter({ map, sep }, deep);
    }
    else {
        throw new TypeError("options.deep must be a boolean, number, function, regular expression, or glob pattern");
    }
    let filterFn, filterFnNeedsStats = false, filter = options.filter;
    if (filter !== null && filter !== undefined) {
        if (typeof filter === "function") {
            // Filter functions requres a Stats object
            filterFnNeedsStats = true;
            filterFn = filter;
        }
        else if (filter instanceof RegExp ||
            typeof filter === "boolean" ||
            (typeof filter === "string" && filter.length > 0)) {
            filterFn = file_path_filter_1.createFilter({ map, sep }, filter);
        }
        else {
            throw new TypeError("options.filter must be a boolean, function, regular expression, or glob pattern");
        }
    }
    let basePath = options.basePath;
    if (basePath === null || basePath === undefined) {
        basePath = "";
    }
    else if (typeof basePath === "string") {
        // Append a path separator to the basePath, if necessary
        if (basePath && basePath.substr(-1) !== sep) {
            basePath += sep;
        }
    }
    else {
        throw new TypeError("options.basePath must be a string");
    }
    // Determine which facade methods to use
    if (options.fs === null || options.fs === undefined) {
        // The user didn't provide their own facades, so use our internal ones
    }
    else if (typeof options.fs === "object") {
        // Merge the internal facade methods with the user-provided `fs` facades
        facade = Object.assign({}, facade);
        facade.fs = Object.assign({}, facade.fs, options.fs);
    }
    else {
        throw new TypeError("options.fs must be an object");
    }
    return {
        recurseDepth,
        recurseFn,
        recurseFnNeedsStats,
        filterFn,
        filterFnNeedsStats,
        stats,
        sep,
        basePath,
        facade,
        emit,
    };
}
exports.normalizeOptions = normalizeOptions;
/**
 * Maps our modified fs.Stats objects to file paths
 */
function map(stats) {
    return stats.path;
}
//# sourceMappingURL=normalize-options.js.map

/***/ }),

/***/ 9445:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stat = void 0;
const call_1 = __webpack_require__(8188);
/**
 * Retrieves the `Stats` for the given path. If the path is a symbolic link,
 * then the Stats of the symlink's target are returned instead.  If the symlink is broken,
 * then the Stats of the symlink itself are returned.
 *
 * @param fs - Synchronous or Asynchronouse facade for the "fs" module
 * @param path - The path to return stats for
 *
 * @internal
 */
function stat(fs, path, callback) {
    let isSymLink = false;
    call_1.safeCall(fs.lstat, path, (err, lstats) => {
        if (err) {
            // fs.lstat threw an eror
            return callback(err, undefined);
        }
        try {
            isSymLink = lstats.isSymbolicLink();
        }
        catch (err2) {
            // lstats.isSymbolicLink() threw an error
            // (probably because fs.lstat returned an invalid result)
            return callback(err2, undefined);
        }
        if (isSymLink) {
            // Try to resolve the symlink
            symlinkStat(fs, path, lstats, callback);
        }
        else {
            // It's not a symlink, so return the stats as-is
            callback(null, lstats);
        }
    });
}
exports.stat = stat;
/**
 * Retrieves the `Stats` for the target of the given symlink.
 * If the symlink is broken, then the Stats of the symlink itself are returned.
 *
 * @param fs - Synchronous or Asynchronouse facade for the "fs" module
 * @param path - The path of the symlink to return stats for
 * @param lstats - The stats of the symlink
 */
function symlinkStat(fs, path, lstats, callback) {
    call_1.safeCall(fs.stat, path, (err, stats) => {
        if (err) {
            // The symlink is broken, so return the stats for the link itself
            return callback(null, lstats);
        }
        try {
            // Return the stats for the resolved symlink target,
            // and override the `isSymbolicLink` method to indicate that it's a symlink
            stats.isSymbolicLink = () => true;
        }
        catch (err2) {
            // Setting stats.isSymbolicLink threw an error
            // (probably because fs.stat returned an invalid result)
            return callback(err2, undefined);
        }
        callback(null, stats);
    });
}
//# sourceMappingURL=stat.js.map

/***/ }),

/***/ 5521:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.readdirStream = void 0;
const fs = __webpack_require__(5747);
const for_each_1 = __webpack_require__(504);
const directory_reader_1 = __webpack_require__(4918);
const streamFacade = { fs, forEach: for_each_1.asyncForEach };
function readdirStream(dir, options) {
    let reader = new directory_reader_1.DirectoryReader(dir, options, streamFacade, true);
    return reader.stream;
}
exports.readdirStream = readdirStream;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7448:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.syncForEach = void 0;
/**
 * A facade that allows `Array.forEach()` to be called as though it were asynchronous.
 *
 * @param array - The array to iterate over
 * @param iterator - The function to call for each item in the array
 * @param done - The function to call when all iterators have completed
 *
 * @internal
 */
function syncForEach(array, iterator, done) {
    if (!Array.isArray(array)) {
        throw new TypeError(`${array} is not an array`);
    }
    for (let item of array) {
        iterator(item, () => {
            // Note: No error-handling here because this is currently only ever called
            // by DirectoryReader, which never passes an `error` parameter to the callback.
            // Instead, DirectoryReader emits an "error" event if an error occurs.
        });
    }
    done();
}
exports.syncForEach = syncForEach;
//# sourceMappingURL=for-each.js.map

/***/ }),

/***/ 3073:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.syncFS = void 0;
const fs = __webpack_require__(5747);
const call_1 = __webpack_require__(8188);
/**
 * Synchronous versions of `fs` methods.
 *
 * @internal
 */
exports.syncFS = {
    /**
     * A facade around `fs.readdirSync()` that allows it to be called
     * the same way as `fs.readdir()`.
     */
    readdir(dir, callback) {
        // Make sure the callback is only called once
        callback = call_1.callOnce(callback);
        try {
            let items = fs.readdirSync(dir);
            callback(null, items);
        }
        catch (err) {
            callback(err, undefined);
        }
    },
    /**
     * A facade around `fs.statSync()` that allows it to be called
     * the same way as `fs.stat()`.
     */
    stat(path, callback) {
        // Make sure the callback is only called once
        callback = call_1.callOnce(callback);
        try {
            let stats = fs.statSync(path);
            callback(null, stats);
        }
        catch (err) {
            callback(err, undefined);
        }
    },
    /**
     * A facade around `fs.lstatSync()` that allows it to be called
     * the same way as `fs.lstat()`.
     */
    lstat(path, callback) {
        // Make sure the callback is only called once
        callback = call_1.callOnce(callback);
        try {
            let stats = fs.lstatSync(path);
            callback(null, stats);
        }
        catch (err) {
            callback(err, undefined);
        }
    },
};
//# sourceMappingURL=fs.js.map

/***/ }),

/***/ 704:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.readdirSync = void 0;
const directory_reader_1 = __webpack_require__(4918);
const for_each_1 = __webpack_require__(7448);
const fs_1 = __webpack_require__(3073);
const syncFacade = { fs: fs_1.syncFS, forEach: for_each_1.syncForEach };
function readdirSync(dir, options) {
    let reader = new directory_reader_1.DirectoryReader(dir, options, syncFacade);
    let stream = reader.stream;
    let results = [];
    let data = stream.read();
    while (data !== null) {
        results.push(data);
        data = stream.read();
    }
    return results;
}
exports.readdirSync = readdirSync;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6299:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=types-public.js.map

/***/ }),

/***/ 9946:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HashDiff = void 0;
function formatNumber(number) {
    return number.toLocaleString();
}
class HashDiff {
    getDiffs(localFiles, serverFiles, logger) {
        var _a, _b, _c;
        const uploadList = [];
        const deleteList = [];
        const replaceList = [];
        let sizeUpload = 0;
        let sizeDelete = 0;
        let sizeReplace = 0;
        // alphabetize each list based off path
        const localFilesSorted = localFiles.data.sort((first, second) => first.name.localeCompare(second.name));
        const serverFilesSorted = serverFiles.data.sort((first, second) => first.name.localeCompare(second.name));
        logger.standard(`----------------------------------------------------------------`);
        logger.standard(`Local Files:\t${formatNumber(localFilesSorted.length)}`);
        logger.standard(`Server Files:\t${formatNumber(localFilesSorted.length)}`);
        logger.standard(`----------------------------------------------------------------`);
        logger.standard(`Calculating differences between client & server`);
        logger.standard(`----------------------------------------------------------------`);
        let localPosition = 0;
        let serverPosition = 0;
        while (localPosition + serverPosition < localFilesSorted.length + serverFilesSorted.length) {
            let localFile = localFilesSorted[localPosition];
            let serverFile = serverFilesSorted[serverPosition];
            let fileNameCompare = 0;
            if (localFile === undefined) {
                fileNameCompare = 1;
            }
            if (serverFile === undefined) {
                fileNameCompare = -1;
            }
            if (localFile !== undefined && serverFile !== undefined) {
                fileNameCompare = localFile.name.localeCompare(serverFile.name);
            }
            if (fileNameCompare < 0) {
                let icon = localFile.type === "folder" ? `📁 Create` : `➕ Upload`;
                logger.standard(`${icon}: ${localFile.name}`);
                uploadList.push(localFile);
                sizeUpload += (_a = localFile.size) !== null && _a !== void 0 ? _a : 0;
                localPosition += 1;
            }
            else if (fileNameCompare > 0) {
                let icon = serverFile.type === "folder" ? `📁` : `🗑️`;
                logger.standard(`${icon}  Delete: ${serverFile.name}    `);
                deleteList.push(serverFile);
                sizeDelete += (_b = serverFile.size) !== null && _b !== void 0 ? _b : 0;
                serverPosition += 1;
            }
            else if (fileNameCompare === 0) {
                // paths are a match
                if (localFile.type === "file" && serverFile.type === "file") {
                    if (localFile.hash === serverFile.hash) {
                        logger.standard(`⚖️  File content is the same, doing nothing: ${localFile.name}`);
                    }
                    else {
                        logger.standard(`🔁 File replace: ${localFile.name}`);
                        sizeReplace += (_c = localFile.size) !== null && _c !== void 0 ? _c : 0;
                        replaceList.push(localFile);
                    }
                }
                localPosition += 1;
                serverPosition += 1;
            }
        }
        return {
            upload: uploadList,
            delete: deleteList,
            replace: replaceList,
            sizeDelete,
            sizeReplace,
            sizeUpload
        };
    }
}
exports.HashDiff = HashDiff;


/***/ }),

/***/ 3678:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prettyError = void 0;
const types_1 = __webpack_require__(6703);
function logOriginalError(logger, error) {
    logger.all();
    logger.all(`----------------------------------------------------------------`);
    logger.all(`----------------------  Full Error below  ----------------------`);
    logger.all(error);
}
/**
 * Converts a exception to helpful debug info
 * @param error exception
 */
function prettyError(logger, args, error) {
    logger.all();
    logger.all(`----------------------------------------------------------------`);
    logger.all(`---------------  🔥🔥🔥 A error occurred  🔥🔥🔥  --------------`);
    logger.all(`----------------------------------------------------------------`);
    const ftpError = error;
    if (typeof error.code === "string") {
        const errorCode = error.code;
        if (errorCode === "ENOTFOUND") {
            logger.all(`The server "${args.server}" doesn't seem to exist. Do you have a typo?`);
        }
    }
    else if (typeof error.name === "string") {
        const errorName = error.name;
        if (errorName.includes("ERR_TLS_CERT_ALTNAME_INVALID")) {
            logger.all(`The certificate for "${args.server}" is likely shared. The host did not place your server on the list of valid domains for this cert.`);
            logger.all(`This is a common issue with shared hosts. You have a few options:`);
            logger.all(` - Ignore this error by setting security back to loose`);
            logger.all(` - Contact your hosting provider and ask them for your servers hostname`);
        }
    }
    else if (typeof ftpError.code === "number") {
        if (ftpError.code === types_1.ErrorCode.NotLoggedIn) {
            const serverRequiresFTPS = ftpError.message.toLowerCase().includes("must use encryption");
            if (serverRequiresFTPS) {
                logger.all(`The server you are connecting to requires encryption (ftps)`);
                logger.all(`Enable FTPS by using the protocol option.`);
            }
            else {
                logger.all(`Could not login with the username "${args.username}" and password "${args.password}".`);
                logger.all(`Make sure you can login with those credentials. If you have a space or a quote in your username or password be sure to escape them!`);
            }
        }
    }
    logOriginalError(logger, error);
}
exports.prettyError = prettyError;


/***/ }),

/***/ 8347:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deploy = exports.getLocalFiles = exports.excludeDefaults = void 0;
const ftp = __importStar(__webpack_require__(7957));
const readdir_enhanced_1 = __importDefault(__webpack_require__(8811));
const crypto_1 = __importDefault(__webpack_require__(6417));
const fs_1 = __importDefault(__webpack_require__(5747));
const multiMatch_1 = __importDefault(__webpack_require__(4865));
const types_1 = __webpack_require__(6703);
const HashDiff_1 = __webpack_require__(9946);
const utilities_1 = __webpack_require__(4389);
const pretty_bytes_1 = __importDefault(__webpack_require__(5168));
const errorHandling_1 = __webpack_require__(3678);
/**
 * Default excludes, ignores all git files and the node_modules folder
 */
exports.excludeDefaults = [".git*", ".git*/**", "node_modules/**", "node_modules/**/*"];
function fileHash(filename, algorithm) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // Algorithm depends on availability of OpenSSL on platform
            // Another algorithms: "sha1", "md5", "sha256", "sha512" ...
            let shasum = crypto_1.default.createHash(algorithm);
            try {
                let s = fs_1.default.createReadStream(filename);
                s.on("data", function (data) {
                    shasum.update(data);
                });
                s.on("error", function (error) {
                    reject(error);
                });
                // making digest
                s.on("end", function () {
                    const hash = shasum.digest("hex");
                    return resolve(hash);
                });
            }
            catch (error) {
                return reject("calc fail");
            }
        });
    });
}
function applyExcludeFilter(stat, args) {
    // match exclude, return immediatley
    if (args.exclude.length > 0) {
        const excludeMatch = multiMatch_1.default(stat.path, args.exclude, { matchBase: true, dot: true });
        if (excludeMatch.length > 0) {
            return false;
        }
    }
    return true;
}
function getLocalFiles(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield readdir_enhanced_1.default.async(args["local-dir"], { deep: true, stats: true, sep: "/", filter: (stat) => applyExcludeFilter(stat, args) });
        const records = [];
        for (let stat of files) {
            if (stat.isDirectory()) {
                records.push({
                    type: "folder",
                    name: stat.path,
                    size: undefined
                });
                continue;
            }
            if (stat.isFile()) {
                records.push({
                    type: "file",
                    name: stat.path,
                    size: stat.size,
                    hash: yield fileHash(args["local-dir"] + stat.path, "sha256")
                });
                continue;
            }
            if (stat.isSymbolicLink()) {
                console.warn("This script is currently unable to handle symbolic links - please add a feature request if you need this");
            }
        }
        return {
            description: types_1.syncFileDescription,
            version: types_1.currentSyncFileVersion,
            generatedTime: new Date().getTime(),
            data: records
        };
    });
}
exports.getLocalFiles = getLocalFiles;
function downloadFileList(client, logger, path) {
    return __awaiter(this, void 0, void 0, function* () {
        // note: originally this was using a writable stream instead of a buffer file
        // basic-ftp doesn't seam to close the connection when using steams over some ftps connections. This appears to be dependent on the ftp server
        const tempFileNameHack = ".ftp-deploy-sync-server-state-buffer-file---delete.json";
        yield utilities_1.retryRequest(logger, () => __awaiter(this, void 0, void 0, function* () { return yield client.downloadTo(tempFileNameHack, path); }));
        const fileAsString = fs_1.default.readFileSync(tempFileNameHack, { encoding: "utf-8" });
        const fileAsObject = JSON.parse(fileAsString);
        fs_1.default.unlinkSync(tempFileNameHack);
        return fileAsObject;
    });
}
/**
 * Converts a file path (ex: "folder/otherfolder/file.txt") to an array of folder and a file path
 * @param fullPath
 */
function getFileBreadcrumbs(fullPath) {
    var _a;
    // todo see if this regex will work for nonstandard folder names
    // todo what happens if the path is relative to the root dir? (starts with /)
    const pathSplit = fullPath.split("/");
    const file = (_a = pathSplit === null || pathSplit === void 0 ? void 0 : pathSplit.pop()) !== null && _a !== void 0 ? _a : ""; // get last item
    const folders = pathSplit.filter(folderName => folderName != "");
    return {
        folders: folders.length === 0 ? null : folders,
        file: file === "" ? null : file
    };
}
/**
 * Navigates up {dirCount} number of directories from the current working dir
 */
function upDir(client, logger, dirCount) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof dirCount !== "number") {
            return;
        }
        // navigate back to the starting folder
        for (let i = 0; i < dirCount; i++) {
            yield utilities_1.retryRequest(logger, () => __awaiter(this, void 0, void 0, function* () { return yield client.cdup(); }));
        }
    });
}
function ensureDir(client, logger, timings, folder) {
    return __awaiter(this, void 0, void 0, function* () {
        timings.start("changingDir");
        logger.verbose(`  changing dir to ${folder}`);
        yield utilities_1.retryRequest(logger, () => __awaiter(this, void 0, void 0, function* () { return yield client.ensureDir(folder); }));
        logger.verbose(`  dir changed`);
        timings.stop("changingDir");
    });
}
/**
 *
 * @param client ftp client
 * @param file file can include folder(s)
 * Note working dir is modified and NOT reset after upload
 * For now we are going to reset it - but this will be removed for performance
 */
function uploadFile(client, basePath, filePath, logger, type = "upload", dryRun) {
    return __awaiter(this, void 0, void 0, function* () {
        const typePresent = type === "upload" ? "uploading" : "replacing";
        const typePast = type === "upload" ? "uploaded" : "replaced";
        logger.all(`${typePresent} "${filePath}"`);
        if (dryRun === false) {
            yield utilities_1.retryRequest(logger, () => __awaiter(this, void 0, void 0, function* () { return yield client.uploadFrom(basePath + filePath, filePath); }));
        }
        logger.verbose(`  file ${typePast}`);
    });
}
function createFolder(client, folderPath, logger, timings, dryRun) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        logger.all(`creating folder "${folderPath + "/"}"`);
        if (dryRun === true) {
            return;
        }
        const path = getFileBreadcrumbs(folderPath + "/");
        if (path.folders === null) {
            logger.verbose(`  no need to change dir`);
        }
        else {
            yield ensureDir(client, logger, timings, path.folders.join("/"));
        }
        // navigate back to the root folder
        yield upDir(client, logger, (_a = path.folders) === null || _a === void 0 ? void 0 : _a.length);
        logger.verbose(`  completed`);
    });
}
function removeFolder(client, folderPath, logger, dryRun) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        logger.all(`removing folder "${folderPath + "/"}"`);
        const path = getFileBreadcrumbs(folderPath + "/");
        if (path.folders === null) {
            logger.verbose(`  no need to change dir`);
        }
        else {
            try {
                logger.verbose(`  removing folder "${path.folders.join("/") + "/"}"`);
                if (dryRun === false) {
                    yield utilities_1.retryRequest(logger, () => __awaiter(this, void 0, void 0, function* () { return yield client.removeDir(path.folders.join("/") + "/"); }));
                }
            }
            catch (e) {
                let error = e;
                if (error.code === types_1.ErrorCode.FileNotFoundOrNoAccess) {
                    logger.verbose(`  could not remove folder. It doesn't exist!`);
                }
                else {
                    // unknown error
                    throw error;
                }
            }
        }
        // navigate back to the root folder
        yield upDir(client, logger, (_a = path.folders) === null || _a === void 0 ? void 0 : _a.length);
        logger.verbose(`  completed`);
    });
}
function removeFile(client, basePath, filePath, logger, dryRun) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.all(`removing ${filePath}...`);
        try {
            if (dryRun === false) {
                yield utilities_1.retryRequest(logger, () => __awaiter(this, void 0, void 0, function* () { return yield client.remove(basePath + filePath); }));
            }
            logger.verbose(`  file removed`);
        }
        catch (e) {
            let error = e;
            if (error.code === types_1.ErrorCode.FileNotFoundOrNoAccess) {
                logger.verbose(`  could not remove file. It doesn't exist!`);
            }
            else {
                // unknown error
                throw error;
            }
        }
        logger.verbose(`  completed`);
    });
}
function createLocalState(localFiles, logger, args) {
    logger.verbose(`Creating local state at ${args["local-dir"]}${args["state-name"]}`);
    fs_1.default.writeFileSync(`${args["local-dir"]}${args["state-name"]}`, JSON.stringify(localFiles, undefined, 4), { encoding: "utf8" });
    logger.verbose("Local state created");
}
function connect(client, args, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        let secure = false;
        if (args.protocol === "ftps") {
            secure = true;
        }
        else if (args.protocol === "ftps-legacy") {
            secure = "implicit";
        }
        client.ftp.verbose = args["log-level"] === "verbose";
        const rejectUnauthorized = args.security === "loose";
        yield client.access({
            host: args.server,
            user: args.username,
            password: args.password,
            port: args.port,
            secure: secure,
            secureOptions: {
                rejectUnauthorized: rejectUnauthorized
            }
        });
        if (args["log-level"] === "verbose") {
            client.trackProgress(info => {
                logger.verbose(`${info.type} progress for "${info.name}". Progress: ${info.bytes} bytes of ${info.bytesOverall} bytes`);
            });
        }
    });
}
function getServerFiles(client, logger, timings, args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield ensureDir(client, logger, timings, args["server-dir"]);
            if (args["dangerous-clean-slate"]) {
                logger.all(`----------------------------------------------------------------`);
                logger.all("🗑️ Removing all files on the server because 'dangerous-clean-slate' was set, this will make the deployment very slow...");
                yield client.clearWorkingDir();
                logger.all("Clear complete");
                throw new Error("nope");
            }
            const serverFiles = yield downloadFileList(client, logger, args["state-name"]);
            logger.all(`----------------------------------------------------------------`);
            logger.all(`Last published on 📅 ${new Date(serverFiles.generatedTime).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })}`);
            return serverFiles;
        }
        catch (e) {
            logger.all(`----------------------------------------------------------------`);
            logger.all(`No file exists on the server "${args["server-dir"] + args["state-name"]}" - this much be your first publish! 🎉`);
            logger.all(`The first publish will take a while... but once the initial sync is done only differences are published!`);
            logger.all(`If you get this message and its NOT your first publish, something is wrong.`);
            // set the server state to nothing, because we don't know what the server state is
            return {
                description: types_1.syncFileDescription,
                version: types_1.currentSyncFileVersion,
                generatedTime: new Date().getTime(),
                data: [],
            };
        }
    });
}
function getDefaultSettings(withoutDefaults) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    if (withoutDefaults["local-dir"] !== undefined) {
        if (!withoutDefaults["local-dir"].endsWith("/")) {
            throw new Error("local-dir should be a folder (must end with /)");
        }
    }
    if (withoutDefaults["server-dir"] !== undefined) {
        if (!withoutDefaults["server-dir"].endsWith("/")) {
            throw new Error("server-dir should be a folder (must end with /)");
        }
    }
    return {
        "server": withoutDefaults.server,
        "username": withoutDefaults.username,
        "password": withoutDefaults.password,
        "port": (_a = withoutDefaults.port) !== null && _a !== void 0 ? _a : 21,
        "protocol": (_b = withoutDefaults.protocol) !== null && _b !== void 0 ? _b : "ftp",
        "local-dir": (_c = withoutDefaults["local-dir"]) !== null && _c !== void 0 ? _c : "./",
        "server-dir": (_d = withoutDefaults["server-dir"]) !== null && _d !== void 0 ? _d : "./",
        "state-name": (_e = withoutDefaults["state-name"]) !== null && _e !== void 0 ? _e : ".ftp-deploy-sync-state.json",
        "dry-run": (_f = withoutDefaults["dry-run"]) !== null && _f !== void 0 ? _f : false,
        "dangerous-clean-slate": (_g = withoutDefaults["dangerous-clean-slate"]) !== null && _g !== void 0 ? _g : false,
        "exclude": (_h = withoutDefaults.exclude) !== null && _h !== void 0 ? _h : exports.excludeDefaults,
        "log-level": (_j = withoutDefaults["log-level"]) !== null && _j !== void 0 ? _j : "standard",
        "security": (_k = withoutDefaults.security) !== null && _k !== void 0 ? _k : "loose",
    };
}
function syncLocalToServer(client, diffs, logger, timings, args) {
    return __awaiter(this, void 0, void 0, function* () {
        const totalCount = diffs.delete.length + diffs.upload.length + diffs.replace.length;
        logger.all(`----------------------------------------------------------------`);
        logger.all(`Making changes to ${totalCount} ${utilities_1.pluralize(totalCount, "file", "files")} to sync server state`);
        logger.all(`Uploading: ${pretty_bytes_1.default(diffs.sizeUpload)} -- Deleting: ${pretty_bytes_1.default(diffs.sizeDelete)} -- Replacing: ${pretty_bytes_1.default(diffs.sizeReplace)}`);
        logger.all(`----------------------------------------------------------------`);
        const basePath = args["local-dir"];
        // create new folders
        for (const file of diffs.upload.filter(item => item.type === "folder")) {
            yield createFolder(client, file.name, logger, timings, args["dry-run"]);
        }
        // upload new files
        for (const file of diffs.upload.filter(item => item.type === "file").filter(item => item.name !== args["state-name"])) {
            yield uploadFile(client, basePath, file.name, logger, "upload", args["dry-run"]);
        }
        // replace new files
        for (const file of diffs.replace.filter(item => item.type === "file").filter(item => item.name !== args["state-name"])) {
            // note: FTP will replace old files with new files. We run replacements after uploads to limit downtime
            yield uploadFile(client, basePath, file.name, logger, "replace", args["dry-run"]);
        }
        // delete old files
        for (const file of diffs.delete.filter(item => item.type === "file")) {
            yield removeFile(client, basePath, file.name, logger, args["dry-run"]);
        }
        // delete old folders
        for (const file of diffs.delete.filter(item => item.type === "folder")) {
            yield removeFolder(client, file.name, logger, args["dry-run"]);
        }
        logger.all(`----------------------------------------------------------------`);
        logger.all(`🎉 Sync complete. Saving current server state to "${args["server-dir"] + args["state-name"]}"`);
        if (args["dry-run"] === false) {
            yield utilities_1.retryRequest(logger, () => __awaiter(this, void 0, void 0, function* () { return yield client.uploadFrom(args["local-dir"] + args["state-name"], args["state-name"]); }));
        }
    });
}
function deploy(deployArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        const args = getDefaultSettings(deployArgs);
        const logger = new utilities_1.Logger(args["log-level"]);
        const timings = new utilities_1.Timings();
        timings.start("total");
        // header
        logger.all(`----------------------------------------------------------------`);
        logger.all(`🚀 Thanks for using ftp-deploy. Let's deploy some stuff!   `);
        logger.all(`----------------------------------------------------------------`);
        logger.all(`If you found this project helpful, please support it`);
        logger.all(`by giving it a ⭐ on Github --> https://github.com/SamKirkland/FTP-Deploy-Action`);
        logger.all(`or add a badge 🏷️ to your projects readme --> https://github.com/SamKirkland/FTP-Deploy-Action#badge`);
        timings.start("hash");
        const localFiles = yield getLocalFiles(args);
        timings.stop("hash");
        createLocalState(localFiles, logger, args);
        const client = new ftp.Client();
        global.reconnect = function () {
            return __awaiter(this, void 0, void 0, function* () {
                timings.start("connecting");
                yield connect(client, args, logger);
                timings.stop("connecting");
            });
        };
        let totalBytesUploaded = 0;
        try {
            yield global.reconnect();
            try {
                const serverFiles = yield getServerFiles(client, logger, timings, args);
                timings.start("logging");
                const diffTool = new HashDiff_1.HashDiff();
                const diffs = diffTool.getDiffs(localFiles, serverFiles, logger);
                timings.stop("logging");
                totalBytesUploaded = diffs.sizeUpload + diffs.sizeReplace;
                timings.start("upload");
                try {
                    yield syncLocalToServer(client, diffs, logger, timings, args);
                }
                catch (e) {
                    if (e.code === types_1.ErrorCode.FileNameNotAllowed) {
                        logger.all("Error 553 FileNameNotAllowed, you don't have access to upload that file");
                    }
                    logger.all(e);
                    throw e;
                }
                finally {
                    timings.stop("upload");
                }
            }
            catch (error) {
                const ftpError = error;
                if (ftpError.code === types_1.ErrorCode.FileNotFoundOrNoAccess) {
                    logger.all("Couldn't find file");
                }
                logger.all(ftpError);
            }
        }
        catch (error) {
            errorHandling_1.prettyError(logger, args, error);
            throw error;
        }
        finally {
            client.close();
            timings.stop("total");
        }
        const uploadSpeed = pretty_bytes_1.default(totalBytesUploaded / (timings.getTime("upload") / 1000));
        // footer
        logger.all(`----------------------------------------------------------------`);
        logger.all(`Time spent hashing:               ${timings.getTimeFormatted("hash")}`);
        logger.all(`Time spent connecting to server:  ${timings.getTimeFormatted("connecting")}`);
        logger.all(`Time spent deploying:             ${timings.getTimeFormatted("upload")} (${uploadSpeed}/second)`);
        logger.all(`  - changing dirs:                ${timings.getTimeFormatted("changingDir")}`);
        logger.all(`  - logging:                      ${timings.getTimeFormatted("logging")}`);
        logger.all(`----------------------------------------------------------------`);
        logger.all(`Total time:                       ${timings.getTimeFormatted("total")}`);
        logger.all(`----------------------------------------------------------------`);
    });
}
exports.deploy = deploy;


/***/ }),

/***/ 6703:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ErrorCode = exports.syncFileDescription = exports.currentSyncFileVersion = void 0;
exports.currentSyncFileVersion = "1.0.0";
exports.syncFileDescription = "DO NOT DELETE THIS FILE. This file is used to keep track of which files have been synced in the most recent deployment. If you delete this file a resync will need to be done (which can take a while) - read more: https://github.com/SamKirkland/FTP-Deploy-Action";
var ErrorCode;
(function (ErrorCode) {
    // The requested action is being initiated, expect another reply before proceeding with a new command.
    ErrorCode[ErrorCode["RestartMarkerReplay"] = 110] = "RestartMarkerReplay";
    ErrorCode[ErrorCode["ServiceReadyInNNNMinutes"] = 120] = "ServiceReadyInNNNMinutes";
    ErrorCode[ErrorCode["DataConnectionAlreadyOpenStartingTransfer"] = 125] = "DataConnectionAlreadyOpenStartingTransfer";
    ErrorCode[ErrorCode["FileStatusOkayOpeningDataConnection"] = 150] = "FileStatusOkayOpeningDataConnection";
    // The requested action has been successfully completed.
    ErrorCode[ErrorCode["CommandNotImplemented"] = 202] = "CommandNotImplemented";
    ErrorCode[ErrorCode["SystemStatus"] = 211] = "SystemStatus";
    ErrorCode[ErrorCode["DirectoryStatus"] = 212] = "DirectoryStatus";
    ErrorCode[ErrorCode["FileStatus"] = 213] = "FileStatus";
    ErrorCode[ErrorCode["HelpMessage"] = 214] = "HelpMessage";
    ErrorCode[ErrorCode["IANAOfficialName"] = 215] = "IANAOfficialName";
    ErrorCode[ErrorCode["ReadyForNewUser"] = 220] = "ReadyForNewUser";
    ErrorCode[ErrorCode["ClosingControlConnection"] = 221] = "ClosingControlConnection";
    ErrorCode[ErrorCode["DataConnectionOpen"] = 225] = "DataConnectionOpen";
    ErrorCode[ErrorCode["SuccessNowClosingDataConnection"] = 226] = "SuccessNowClosingDataConnection";
    ErrorCode[ErrorCode["EnteringPassiveMode"] = 227] = "EnteringPassiveMode";
    ErrorCode[ErrorCode["EnteringLongPassiveMode"] = 228] = "EnteringLongPassiveMode";
    ErrorCode[ErrorCode["EnteringExtendedPassiveMode"] = 229] = "EnteringExtendedPassiveMode";
    ErrorCode[ErrorCode["UserLoggedIn"] = 230] = "UserLoggedIn";
    ErrorCode[ErrorCode["UserLoggedOut"] = 231] = "UserLoggedOut";
    ErrorCode[ErrorCode["LogoutWillCompleteWhenTransferDone"] = 232] = "LogoutWillCompleteWhenTransferDone";
    ErrorCode[ErrorCode["ServerAcceptsAuthenticationMethod"] = 234] = "ServerAcceptsAuthenticationMethod";
    ErrorCode[ErrorCode["ActionComplete"] = 250] = "ActionComplete";
    ErrorCode[ErrorCode["PathNameCreated"] = 257] = "PathNameCreated";
    // The command has been accepted, but the requested action is on hold, pending receipt of further information.
    ErrorCode[ErrorCode["UsernameOkayPasswordNeeded"] = 331] = "UsernameOkayPasswordNeeded";
    ErrorCode[ErrorCode["NeedAccountForLogin"] = 332] = "NeedAccountForLogin";
    ErrorCode[ErrorCode["RequestedFileActionPendingFurtherInformation"] = 350] = "RequestedFileActionPendingFurtherInformation";
    // The command was not accepted and the requested action did not take place, but the error condition is temporary and the action may be requested again.
    ErrorCode[ErrorCode["ServiceNotAvailable"] = 421] = "ServiceNotAvailable";
    ErrorCode[ErrorCode["CantOpenDataConnection"] = 425] = "CantOpenDataConnection";
    ErrorCode[ErrorCode["ConnectionClosed"] = 426] = "ConnectionClosed";
    ErrorCode[ErrorCode["InvalidUsernameOrPassword"] = 430] = "InvalidUsernameOrPassword";
    ErrorCode[ErrorCode["HostUnavailable"] = 434] = "HostUnavailable";
    ErrorCode[ErrorCode["FileActionNotTaken"] = 450] = "FileActionNotTaken";
    ErrorCode[ErrorCode["LocalErrorProcessing"] = 451] = "LocalErrorProcessing";
    ErrorCode[ErrorCode["InsufficientStorageSpaceOrFileInUse"] = 452] = "InsufficientStorageSpaceOrFileInUse";
    // Syntax error, command unrecognized and the requested action did not take place. This may include errors such as command line too long.
    ErrorCode[ErrorCode["SyntaxErrorInParameters"] = 501] = "SyntaxErrorInParameters";
    ErrorCode[ErrorCode["CommandNotImpemented"] = 502] = "CommandNotImpemented";
    ErrorCode[ErrorCode["BadSequenceOfCommands"] = 503] = "BadSequenceOfCommands";
    ErrorCode[ErrorCode["CommandNotImplementedForThatParameter"] = 504] = "CommandNotImplementedForThatParameter";
    ErrorCode[ErrorCode["NotLoggedIn"] = 530] = "NotLoggedIn";
    ErrorCode[ErrorCode["NeedAccountForStoringFiles"] = 532] = "NeedAccountForStoringFiles";
    ErrorCode[ErrorCode["CouldNotConnectToServerRequiresSSL"] = 534] = "CouldNotConnectToServerRequiresSSL";
    ErrorCode[ErrorCode["FileNotFoundOrNoAccess"] = 550] = "FileNotFoundOrNoAccess";
    ErrorCode[ErrorCode["UnknownPageType"] = 551] = "UnknownPageType";
    ErrorCode[ErrorCode["ExceededStorageAllocation"] = 552] = "ExceededStorageAllocation";
    ErrorCode[ErrorCode["FileNameNotAllowed"] = 553] = "FileNameNotAllowed";
    // Replies regarding confidentiality and integrity
    ErrorCode[ErrorCode["IntegrityProtectedReply"] = 631] = "IntegrityProtectedReply";
    ErrorCode[ErrorCode["ConfidentialityAndIntegrityProtectedReply"] = 632] = "ConfidentialityAndIntegrityProtectedReply";
    ErrorCode[ErrorCode["ConfidentialityProtectedReply"] = 633] = "ConfidentialityProtectedReply";
    // Common Winsock Error Codes[2] (These are not FTP return codes)
    ErrorCode[ErrorCode["ConnectionClosedByServer"] = 10054] = "ConnectionClosedByServer";
    ErrorCode[ErrorCode["CannotConnect"] = 10060] = "CannotConnect";
    ErrorCode[ErrorCode["CannotConnectRefusedByServer"] = 10061] = "CannotConnectRefusedByServer";
    ErrorCode[ErrorCode["DirectoryNotEmpty"] = 10066] = "DirectoryNotEmpty";
    ErrorCode[ErrorCode["TooManyUsers"] = 10068] = "TooManyUsers";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
;


/***/ }),

/***/ 4389:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Timer = exports.Timings = exports.retryRequest = exports.pluralize = exports.Logger = void 0;
const pretty_ms_1 = __importDefault(__webpack_require__(1127));
const types_1 = __webpack_require__(6703);
class Logger {
    constructor(level) {
        this.level = level;
    }
    all(...data) {
        console.log(...data);
    }
    standard(...data) {
        if (this.level === "minimal") {
            return;
        }
        console.log(...data);
    }
    verbose(...data) {
        if (this.level !== "verbose") {
            return;
        }
        console.log(...data);
    }
}
exports.Logger = Logger;
function pluralize(count, singular, plural) {
    if (count === 1) {
        return singular;
    }
    return plural;
}
exports.pluralize = pluralize;
/**
 * retry a request
 *
 * @example retryRequest(logger, async () => await item());
 */
function retryRequest(logger, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield callback();
        }
        catch (e) {
            if (e.code >= 400 && e.code <= 499) {
                logger.standard("400 level error from server when performing action - retrying...");
                logger.standard(e);
                if (e.code === types_1.ErrorCode.ConnectionClosed) {
                    logger.all("Connection closed. This library does not currently handle reconnects");
                    // await global.reconnect();
                    // todo reset current working dir
                    throw e;
                }
                return yield callback();
            }
            else {
                throw e;
            }
        }
    });
}
exports.retryRequest = retryRequest;
class Timings {
    constructor() {
        this.timers = {};
    }
    start(type) {
        if (this.timers[type] === undefined) {
            this.timers[type] = new Timer();
        }
        this.timers[type].start();
    }
    stop(type) {
        this.timers[type].stop();
    }
    getTime(type) {
        const timer = this.timers[type];
        if (timer === undefined || timer.time === null) {
            return 0;
        }
        return timer.time;
    }
    getTimeFormatted(type) {
        const timer = this.timers[type];
        if (timer === undefined || timer.time === null) {
            return "💣 Failed";
        }
        return pretty_ms_1.default(timer.time, { verbose: true });
    }
}
exports.Timings = Timings;
class Timer {
    constructor() {
        this.totalTime = null;
        this.startTime = null;
        this.endTime = null;
    }
    start() {
        this.startTime = process.hrtime();
    }
    stop() {
        if (this.startTime === null) {
            throw new Error("Called .stop() before calling .start()");
        }
        this.endTime = process.hrtime(this.startTime);
        const currentSeconds = this.totalTime === null ? 0 : this.totalTime[0];
        const currentNS = this.totalTime === null ? 0 : this.totalTime[1];
        this.totalTime = [
            currentSeconds + this.endTime[0],
            currentNS + this.endTime[1]
        ];
    }
    get time() {
        if (this.totalTime === null) {
            return null;
        }
        return (this.totalTime[0] * 1000) + (this.totalTime[1] / 1000000);
    }
}
exports.Timer = Timer;


/***/ }),

/***/ 6554:
/***/ ((module) => {

"use strict";


const arrayDiffer = (array, ...values) => {
	const rest = new Set([].concat(...values));
	return array.filter(element => !rest.has(element));
};

module.exports = arrayDiffer;


/***/ }),

/***/ 9600:
/***/ ((module) => {

"use strict";


module.exports = (...arguments_) => {
	return [...new Set([].concat(...arguments_))];
};


/***/ }),

/***/ 1546:
/***/ ((module) => {

"use strict";


const arrify = value => {
	if (value === null || value === undefined) {
		return [];
	}

	if (Array.isArray(value)) {
		return value;
	}

	if (typeof value === 'string') {
		return [value];
	}

	if (typeof value[Symbol.iterator] === 'function') {
		return [...value];
	}

	return [value];
};

module.exports = arrify;


/***/ }),

/***/ 9417:
/***/ ((module) => {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),

/***/ 8337:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Client = void 0;
const fs_1 = __webpack_require__(5747);
const path_1 = __webpack_require__(5622);
const tls_1 = __webpack_require__(4016);
const util_1 = __webpack_require__(1669);
const FtpContext_1 = __webpack_require__(9052);
const parseList_1 = __webpack_require__(2993);
const ProgressTracker_1 = __webpack_require__(7170);
const StringWriter_1 = __webpack_require__(8184);
const parseListMLSD_1 = __webpack_require__(8157);
const netUtils_1 = __webpack_require__(6288);
const transfer_1 = __webpack_require__(5803);
const parseControlResponse_1 = __webpack_require__(9948);
// Use promisify to keep the library compatible with Node 8.
const fsReadDir = util_1.promisify(fs_1.readdir);
const fsMkDir = util_1.promisify(fs_1.mkdir);
const fsStat = util_1.promisify(fs_1.stat);
const fsOpen = util_1.promisify(fs_1.open);
const fsClose = util_1.promisify(fs_1.close);
const fsUnlink = util_1.promisify(fs_1.unlink);
/**
 * High-level API to interact with an FTP server.
 */
class Client {
    /**
     * Instantiate an FTP client.
     *
     * @param timeout  Timeout in milliseconds, use 0 for no timeout. Optional, default is 30 seconds.
     */
    constructor(timeout = 30000) {
        /**
         * Multiple commands to retrieve a directory listing are possible. This instance
         * will try all of them in the order presented the first time a directory listing
         * is requested. After that, `availableListCommands` will  hold only the first
         * entry that worked.
         */
        this.availableListCommands = ["MLSD", "LIST -a", "LIST"];
        this.ftp = new FtpContext_1.FTPContext(timeout);
        this.prepareTransfer = this._enterFirstCompatibleMode([transfer_1.enterPassiveModeIPv6, transfer_1.enterPassiveModeIPv4]);
        this.parseList = parseList_1.parseList;
        this._progressTracker = new ProgressTracker_1.ProgressTracker();
    }
    /**
     * Close the client and all open socket connections.
     *
     * Close the client and all open socket connections. The client can’t be used anymore after calling this method,
     * you have to either reconnect with `access` or `connect` or instantiate a new instance to continue any work.
     * A client is also closed automatically if any timeout or connection error occurs.
     */
    close() {
        this.ftp.close();
        this._progressTracker.stop();
    }
    /**
     * Returns true if the client is closed and can't be used anymore.
     */
    get closed() {
        return this.ftp.closed;
    }
    /**
     * Connect (or reconnect) to an FTP server.
     *
     * This is an instance method and thus can be called multiple times during the lifecycle of a `Client`
     * instance. Whenever you do, the client is reset with a new control connection. This also implies that
     * you can reopen a `Client` instance that has been closed due to an error when reconnecting with this
     * method. In fact, reconnecting is the only way to continue using a closed `Client`.
     *
     * @param host  Host the client should connect to. Optional, default is "localhost".
     * @param port  Port the client should connect to. Optional, default is 21.
     */
    connect(host = "localhost", port = 21) {
        this.ftp.reset();
        this.ftp.socket.connect({
            host,
            port,
            family: this.ftp.ipFamily
        }, () => this.ftp.log(`Connected to ${netUtils_1.describeAddress(this.ftp.socket)} (${netUtils_1.describeTLS(this.ftp.socket)})`));
        return this._handleConnectResponse();
    }
    /**
     * As `connect` but using implicit TLS. Implicit TLS is not an FTP standard and has been replaced by
     * explicit TLS. There are still FTP servers that support only implicit TLS, though.
     */
    connectImplicitTLS(host = "localhost", port = 21, tlsOptions = {}) {
        this.ftp.reset();
        this.ftp.socket = tls_1.connect(port, host, tlsOptions, () => this.ftp.log(`Connected to ${netUtils_1.describeAddress(this.ftp.socket)} (${netUtils_1.describeTLS(this.ftp.socket)})`));
        this.ftp.tlsOptions = tlsOptions;
        return this._handleConnectResponse();
    }
    /**
     * Handles the first reponse by an FTP server after the socket connection has been established.
     */
    _handleConnectResponse() {
        return this.ftp.handle(undefined, (res, task) => {
            if (res instanceof Error) {
                // The connection has been destroyed by the FTPContext at this point.
                task.reject(res);
            }
            else if (parseControlResponse_1.positiveCompletion(res.code)) {
                task.resolve(res);
            }
            // Reject all other codes, including 120 "Service ready in nnn minutes".
            else {
                // Don't stay connected but don't replace the socket yet by using reset()
                // so the user can inspect properties of this instance.
                this.ftp.socket.destroy();
                task.reject(new FtpContext_1.FTPError(res));
            }
        });
    }
    /**
     * Send an FTP command and handle the first response.
     */
    send(command, ignoreErrorCodesDEPRECATED = false) {
        if (ignoreErrorCodesDEPRECATED) { // Deprecated starting from 3.9.0
            this.ftp.log("Deprecated call using send(command, flag) with boolean flag to ignore errors. Use sendIgnoringError(command).");
            return this.sendIgnoringError(command);
        }
        return this.ftp.request(command);
    }
    /**
     * Send an FTP command and ignore an FTP error response. Any other kind of error or timeout will still reject the Promise.
     *
     * @param command
     */
    sendIgnoringError(command) {
        return this.ftp.handle(command, (res, task) => {
            if (res instanceof FtpContext_1.FTPError) {
                task.resolve({ code: res.code, message: res.message });
            }
            else if (res instanceof Error) {
                task.reject(res);
            }
            else {
                task.resolve(res);
            }
        });
    }
    /**
     * Upgrade the current socket connection to TLS.
     *
     * @param options  TLS options as in `tls.connect(options)`, optional.
     * @param command  Set the authentication command. Optional, default is "AUTH TLS".
     */
    async useTLS(options = {}, command = "AUTH TLS") {
        const ret = await this.send(command);
        this.ftp.socket = await netUtils_1.upgradeSocket(this.ftp.socket, options);
        this.ftp.tlsOptions = options; // Keep the TLS options for later data connections that should use the same options.
        this.ftp.log(`Control socket is using: ${netUtils_1.describeTLS(this.ftp.socket)}`);
        return ret;
    }
    /**
     * Login a user with a password.
     *
     * @param user  Username to use for login. Optional, default is "anonymous".
     * @param password  Password to use for login. Optional, default is "guest".
     */
    login(user = "anonymous", password = "guest") {
        this.ftp.log(`Login security: ${netUtils_1.describeTLS(this.ftp.socket)}`);
        return this.ftp.handle("USER " + user, (res, task) => {
            if (res instanceof Error) {
                task.reject(res);
            }
            else if (parseControlResponse_1.positiveCompletion(res.code)) { // User logged in proceed OR Command superfluous
                task.resolve(res);
            }
            else if (res.code === 331) { // User name okay, need password
                this.ftp.send("PASS " + password);
            }
            else { // Also report error on 332 (Need account)
                task.reject(new FtpContext_1.FTPError(res));
            }
        });
    }
    /**
     * Set the usual default settings.
     *
     * Settings used:
     * * Binary mode (TYPE I)
     * * File structure (STRU F)
     * * Additional settings for FTPS (PBSZ 0, PROT P)
     */
    async useDefaultSettings() {
        await this.send("TYPE I"); // Binary mode
        await this.sendIgnoringError("STRU F"); // Use file structure
        await this.sendIgnoringError("OPTS UTF8 ON"); // Some servers expect UTF-8 to be enabled explicitly
        await this.sendIgnoringError("OPTS MLST type;size;modify;unique;unix.mode;unix.owner;unix.group;unix.ownername;unix.groupname;"); // Make sure MLSD listings include all we can parse
        if (this.ftp.hasTLS) {
            await this.sendIgnoringError("PBSZ 0"); // Set to 0 for TLS
            await this.sendIgnoringError("PROT P"); // Protect channel (also for data connections)
        }
    }
    /**
     * Convenience method that calls `connect`, `useTLS`, `login` and `useDefaultSettings`.
     *
     * This is an instance method and thus can be called multiple times during the lifecycle of a `Client`
     * instance. Whenever you do, the client is reset with a new control connection. This also implies that
     * you can reopen a `Client` instance that has been closed due to an error when reconnecting with this
     * method. In fact, reconnecting is the only way to continue using a closed `Client`.
     */
    async access(options = {}) {
        const useExplicitTLS = options.secure === true;
        const useImplicitTLS = options.secure === "implicit";
        let welcome;
        if (useImplicitTLS) {
            welcome = await this.connectImplicitTLS(options.host, options.port, options.secureOptions);
        }
        else {
            welcome = await this.connect(options.host, options.port);
        }
        if (useExplicitTLS) {
            await this.useTLS(options.secureOptions);
        }
        await this.login(options.user, options.password);
        await this.useDefaultSettings();
        return welcome;
    }
    /**
     * Get the current working directory.
     */
    async pwd() {
        const res = await this.send("PWD");
        // The directory is part of the return message, for example:
        // 257 "/this/that" is current directory.
        const parsed = res.message.match(/"(.+)"/);
        if (parsed === null || parsed[1] === undefined) {
            throw new Error(`Can't parse response to command 'PWD': ${res.message}`);
        }
        return parsed[1];
    }
    /**
     * Get a description of supported features.
     *
     * This sends the FEAT command and parses the result into a Map where keys correspond to available commands
     * and values hold further information. Be aware that your FTP servers might not support this
     * command in which case this method will not throw an exception but just return an empty Map.
     */
    async features() {
        const res = await this.sendIgnoringError("FEAT");
        const features = new Map();
        // Not supporting any special features will be reported with a single line.
        if (res.code < 400 && parseControlResponse_1.isMultiline(res.message)) {
            // The first and last line wrap the multiline response, ignore them.
            res.message.split("\n").slice(1, -1).forEach(line => {
                // A typical lines looks like: " REST STREAM" or " MDTM".
                // Servers might not use an indentation though.
                const entry = line.trim().split(" ");
                features.set(entry[0], entry[1] || "");
            });
        }
        return features;
    }
    /**
     * Set the working directory.
     */
    async cd(path) {
        const validPath = await this.protectWhitespace(path);
        return this.send("CWD " + validPath);
    }
    /**
     * Switch to the parent directory of the working directory.
     */
    async cdup() {
        return this.send("CDUP");
    }
    /**
     * Get the last modified time of a file. This is not supported by every FTP server, in which case
     * calling this method will throw an exception.
     */
    async lastMod(path) {
        const validPath = await this.protectWhitespace(path);
        const res = await this.send(`MDTM ${validPath}`);
        const date = res.message.slice(4);
        return parseListMLSD_1.parseMLSxDate(date);
    }
    /**
     * Get the size of a file.
     */
    async size(path) {
        const validPath = await this.protectWhitespace(path);
        const command = `SIZE ${validPath}`;
        const res = await this.send(command);
        // The size is part of the response message, for example: "213 555555". It's
        // possible that there is a commmentary appended like "213 5555, some commentary".
        const size = parseInt(res.message.slice(4), 10);
        if (Number.isNaN(size)) {
            throw new Error(`Can't parse response to command '${command}' as a numerical value: ${res.message}`);
        }
        return size;
    }
    /**
     * Rename a file.
     *
     * Depending on the FTP server this might also be used to move a file from one
     * directory to another by providing full paths.
     */
    async rename(srcPath, destPath) {
        const validSrc = await this.protectWhitespace(srcPath);
        const validDest = await this.protectWhitespace(destPath);
        await this.send("RNFR " + validSrc);
        return this.send("RNTO " + validDest);
    }
    /**
     * Remove a file from the current working directory.
     *
     * You can ignore FTP error return codes which won't throw an exception if e.g.
     * the file doesn't exist.
     */
    async remove(path, ignoreErrorCodes = false) {
        const validPath = await this.protectWhitespace(path);
        return this.send(`DELE ${validPath}`, ignoreErrorCodes);
    }
    /**
     * Report transfer progress for any upload or download to a given handler.
     *
     * This will also reset the overall transfer counter that can be used for multiple transfers. You can
     * also call the function without a handler to stop reporting to an earlier one.
     *
     * @param handler  Handler function to call on transfer progress.
     */
    trackProgress(handler) {
        this._progressTracker.bytesOverall = 0;
        this._progressTracker.reportTo(handler);
    }
    /**
     * Upload data from a readable stream or a local file to a remote file.
     *
     * @param source  Readable stream or path to a local file.
     * @param toRemotePath  Path to a remote file to write to.
     */
    async uploadFrom(source, toRemotePath, options = {}) {
        return this._uploadWithCommand(source, toRemotePath, "STOR", options);
    }
    /**
     * Upload data from a readable stream or a local file by appending it to an existing file. If the file doesn't
     * exist the FTP server should create it.
     *
     * @param source  Readable stream or path to a local file.
     * @param toRemotePath  Path to a remote file to write to.
     */
    async appendFrom(source, toRemotePath, options = {}) {
        return this._uploadWithCommand(source, toRemotePath, "APPE", options);
    }
    /**
     * @protected
     */
    async _uploadWithCommand(source, remotePath, command, options) {
        if (typeof source === "string") {
            return this._uploadLocalFile(source, remotePath, command, options);
        }
        return this._uploadFromStream(source, remotePath, command);
    }
    /**
     * @protected
     */
    async _uploadLocalFile(localPath, remotePath, command, options) {
        const fd = await fsOpen(localPath, "r");
        const source = fs_1.createReadStream("", {
            fd,
            start: options.localStart,
            end: options.localEndInclusive,
            autoClose: false
        });
        try {
            return await this._uploadFromStream(source, remotePath, command);
        }
        finally {
            await ignoreError(() => fsClose(fd));
        }
    }
    /**
     * @protected
     */
    async _uploadFromStream(source, remotePath, command) {
        const onError = (err) => this.ftp.closeWithError(err);
        source.once("error", onError);
        try {
            const validPath = await this.protectWhitespace(remotePath);
            await this.prepareTransfer(this.ftp);
            // Keep the keyword `await` or the `finally` clause below runs too early
            // and removes the event listener for the source stream too early.
            return await transfer_1.uploadFrom(source, {
                ftp: this.ftp,
                tracker: this._progressTracker,
                command,
                remotePath: validPath,
                type: "upload"
            });
        }
        finally {
            source.removeListener("error", onError);
        }
    }
    /**
     * Download a remote file and pipe its data to a writable stream or to a local file.
     *
     * You can optionally define at which position of the remote file you'd like to start
     * downloading. If the destination you provide is a file, the offset will be applied
     * to it as well. For example: To resume a failed download, you'd request the size of
     * the local, partially downloaded file and use that as the offset. Assuming the size
     * is 23, you'd download the rest using `downloadTo("local.txt", "remote.txt", 23)`.
     *
     * @param destination  Stream or path for a local file to write to.
     * @param fromRemotePath  Path of the remote file to read from.
     * @param startAt  Position within the remote file to start downloading at. If the destination is a file, this offset is also applied to it.
     */
    async downloadTo(destination, fromRemotePath, startAt = 0) {
        if (typeof destination === "string") {
            return this._downloadToFile(destination, fromRemotePath, startAt);
        }
        return this._downloadToStream(destination, fromRemotePath, startAt);
    }
    /**
     * @protected
     */
    async _downloadToFile(localPath, remotePath, startAt) {
        const appendingToLocalFile = startAt > 0;
        const fileSystemFlags = appendingToLocalFile ? "r+" : "w";
        const fd = await fsOpen(localPath, fileSystemFlags);
        const destination = fs_1.createWriteStream("", {
            fd,
            start: startAt,
            autoClose: false
        });
        try {
            return await this._downloadToStream(destination, remotePath, startAt);
        }
        catch (err) {
            const localFileStats = await ignoreError(() => fsStat(localPath));
            const hasDownloadedData = localFileStats && localFileStats.size > 0;
            const shouldRemoveLocalFile = !appendingToLocalFile && !hasDownloadedData;
            if (shouldRemoveLocalFile) {
                await ignoreError(() => fsUnlink(localPath));
            }
            throw err;
        }
        finally {
            await ignoreError(() => fsClose(fd));
        }
    }
    /**
     * @protected
     */
    async _downloadToStream(destination, remotePath, startAt) {
        const onError = (err) => this.ftp.closeWithError(err);
        destination.once("error", onError);
        try {
            const validPath = await this.protectWhitespace(remotePath);
            await this.prepareTransfer(this.ftp);
            // Keep the keyword `await` or the `finally` clause below runs too early
            // and removes the event listener for the source stream too early.
            return await transfer_1.downloadTo(destination, {
                ftp: this.ftp,
                tracker: this._progressTracker,
                command: startAt > 0 ? `REST ${startAt}` : `RETR ${validPath}`,
                remotePath: validPath,
                type: "download"
            });
        }
        finally {
            destination.removeListener("error", onError);
            destination.end();
        }
    }
    /**
     * List files and directories in the current working directory, or from `path` if specified.
     *
     * @param [path]  Path to remote file or directory.
     */
    async list(path = "") {
        const validPath = await this.protectWhitespace(path);
        let lastError;
        for (const candidate of this.availableListCommands) {
            const command = validPath === "" ? candidate : `${candidate} ${validPath}`;
            await this.prepareTransfer(this.ftp);
            try {
                const parsedList = await this._requestListWithCommand(command);
                // Use successful candidate for all subsequent requests.
                this.availableListCommands = [candidate];
                return parsedList;
            }
            catch (err) {
                const shouldTryNext = err instanceof FtpContext_1.FTPError;
                if (!shouldTryNext) {
                    throw err;
                }
                lastError = err;
            }
        }
        throw lastError;
    }
    /**
     * @protected
     */
    async _requestListWithCommand(command) {
        const buffer = new StringWriter_1.StringWriter();
        await transfer_1.downloadTo(buffer, {
            ftp: this.ftp,
            tracker: this._progressTracker,
            command,
            remotePath: "",
            type: "list"
        });
        const text = buffer.getText(this.ftp.encoding);
        this.ftp.log(text);
        return this.parseList(text);
    }
    /**
     * Remove a directory and all of its content.
     *
     * @param remoteDirPath  The path of the remote directory to delete.
     * @example client.removeDir("foo") // Remove directory 'foo' using a relative path.
     * @example client.removeDir("foo/bar") // Remove directory 'bar' using a relative path.
     * @example client.removeDir("/foo/bar") // Remove directory 'bar' using an absolute path.
     * @example client.removeDir("/") // Remove everything.
     */
    async removeDir(remoteDirPath) {
        return this._exitAtCurrentDirectory(async () => {
            await this.cd(remoteDirPath);
            await this.clearWorkingDir();
            if (remoteDirPath !== "/") {
                await this.cdup();
                await this.removeEmptyDir(remoteDirPath);
            }
        });
    }
    /**
     * Remove all files and directories in the working directory without removing
     * the working directory itself.
     */
    async clearWorkingDir() {
        for (const file of await this.list()) {
            if (file.isDirectory) {
                await this.cd(file.name);
                await this.clearWorkingDir();
                await this.cdup();
                await this.removeEmptyDir(file.name);
            }
            else {
                await this.remove(file.name);
            }
        }
    }
    /**
     * Upload the contents of a local directory to the remote working directory.
     *
     * This will overwrite existing files with the same names and reuse existing directories.
     * Unrelated files and directories will remain untouched. You can optionally provide a `remoteDirPath`
     * to put the contents inside a directory which will be created if necessary including all
     * intermediate directories. If you did provide a remoteDirPath the working directory will stay
     * the same as before calling this method.
     *
     * @param localDirPath  Local path, e.g. "foo/bar" or "../test"
     * @param [remoteDirPath]  Remote path of a directory to upload to. Working directory if undefined.
     */
    async uploadFromDir(localDirPath, remoteDirPath) {
        return this._exitAtCurrentDirectory(async () => {
            if (remoteDirPath) {
                await this.ensureDir(remoteDirPath);
            }
            return await this._uploadToWorkingDir(localDirPath);
        });
    }
    /**
     * @protected
     */
    async _uploadToWorkingDir(localDirPath) {
        const files = await fsReadDir(localDirPath);
        for (const file of files) {
            const fullPath = path_1.join(localDirPath, file);
            const stats = await fsStat(fullPath);
            if (stats.isFile()) {
                await this.uploadFrom(fullPath, file);
            }
            else if (stats.isDirectory()) {
                await this._openDir(file);
                await this._uploadToWorkingDir(fullPath);
                await this.cdup();
            }
        }
    }
    /**
     * Download all files and directories of the working directory to a local directory.
     *
     * @param localDirPath  The local directory to download to.
     * @param remoteDirPath  Remote directory to download. Current working directory if not specified.
     */
    async downloadToDir(localDirPath, remoteDirPath) {
        return this._exitAtCurrentDirectory(async () => {
            if (remoteDirPath) {
                await this.cd(remoteDirPath);
            }
            return await this._downloadFromWorkingDir(localDirPath);
        });
    }
    /**
     * @protected
     */
    async _downloadFromWorkingDir(localDirPath) {
        await ensureLocalDirectory(localDirPath);
        for (const file of await this.list()) {
            const localPath = path_1.join(localDirPath, file.name);
            if (file.isDirectory) {
                await this.cd(file.name);
                await this._downloadFromWorkingDir(localPath);
                await this.cdup();
            }
            else if (file.isFile) {
                await this.downloadTo(localPath, file.name);
            }
        }
    }
    /**
     * Make sure a given remote path exists, creating all directories as necessary.
     * This function also changes the current working directory to the given path.
     */
    async ensureDir(remoteDirPath) {
        // If the remoteDirPath was absolute go to root directory.
        if (remoteDirPath.startsWith("/")) {
            await this.cd("/");
        }
        const names = remoteDirPath.split("/").filter(name => name !== "");
        for (const name of names) {
            await this._openDir(name);
        }
    }
    /**
     * Try to create a directory and enter it. This will not raise an exception if the directory
     * couldn't be created if for example it already exists.
     * @protected
     */
    async _openDir(dirName) {
        await this.sendIgnoringError("MKD " + dirName);
        await this.cd(dirName);
    }
    /**
     * Remove an empty directory, will fail if not empty.
     */
    async removeEmptyDir(path) {
        const validPath = await this.protectWhitespace(path);
        return this.send(`RMD ${validPath}`);
    }
    /**
     * FTP servers can't handle filenames that have leading whitespace. This method transforms
     * a given path to fix that issue for most cases.
     */
    async protectWhitespace(path) {
        if (!path.startsWith(" ")) {
            return path;
        }
        // Handle leading whitespace by prepending the absolute path:
        // " test.txt" while being in the root directory becomes "/ test.txt".
        const pwd = await this.pwd();
        const absolutePathPrefix = pwd.endsWith("/") ? pwd : pwd + "/";
        return absolutePathPrefix + path;
    }
    async _exitAtCurrentDirectory(func) {
        const userDir = await this.pwd();
        try {
            return await func();
        }
        finally {
            if (!this.closed) {
                await ignoreError(() => this.cd(userDir));
            }
        }
    }
    /**
     * Try all available transfer strategies and pick the first one that works. Update `client` to
     * use the working strategy for all successive transfer requests.
     *
     * @param strategies
     * @returns a function that will try the provided strategies.
     */
    _enterFirstCompatibleMode(strategies) {
        return async (ftp) => {
            ftp.log("Trying to find optimal transfer strategy...");
            for (const strategy of strategies) {
                try {
                    const res = await strategy(ftp);
                    ftp.log("Optimal transfer strategy found.");
                    this.prepareTransfer = strategy; // eslint-disable-line require-atomic-updates
                    return res;
                }
                catch (err) {
                    // Try the next candidate no matter the exact error. It's possible that a server
                    // answered incorrectly to a strategy, for example a PASV answer to an EPSV.
                }
            }
            throw new Error("None of the available transfer strategies work.");
        };
    }
    /**
     * DEPRECATED, use `uploadFrom`.
     * @deprecated
     */
    async upload(source, toRemotePath, options = {}) {
        this.ftp.log("Warning: upload() has been deprecated, use uploadFrom().");
        return this.uploadFrom(source, toRemotePath, options);
    }
    /**
     * DEPRECATED, use `appendFrom`.
     * @deprecated
     */
    async append(source, toRemotePath, options = {}) {
        this.ftp.log("Warning: append() has been deprecated, use appendFrom().");
        return this.appendFrom(source, toRemotePath, options);
    }
    /**
     * DEPRECATED, use `downloadTo`.
     * @deprecated
     */
    async download(destination, fromRemotePath, startAt = 0) {
        this.ftp.log("Warning: download() has been deprecated, use downloadTo().");
        return this.downloadTo(destination, fromRemotePath, startAt);
    }
    /**
     * DEPRECATED, use `uploadFromDir`.
     * @deprecated
     */
    async uploadDir(localDirPath, remoteDirPath) {
        this.ftp.log("Warning: uploadDir() has been deprecated, use uploadFromDir().");
        return this.uploadFromDir(localDirPath, remoteDirPath);
    }
    /**
     * DEPRECATED, use `downloadToDir`.
     * @deprecated
     */
    async downloadDir(localDirPath) {
        this.ftp.log("Warning: downloadDir() has been deprecated, use downloadToDir().");
        return this.downloadToDir(localDirPath);
    }
}
exports.Client = Client;
async function ensureLocalDirectory(path) {
    try {
        await fsStat(path);
    }
    catch (err) {
        await fsMkDir(path, { recursive: true });
    }
}
async function ignoreError(func) {
    try {
        return await func();
    }
    catch (err) {
        // Ignore
        return undefined;
    }
}


/***/ }),

/***/ 202:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileInfo = exports.FileType = void 0;
var FileType;
(function (FileType) {
    FileType[FileType["Unknown"] = 0] = "Unknown";
    FileType[FileType["File"] = 1] = "File";
    FileType[FileType["Directory"] = 2] = "Directory";
    FileType[FileType["SymbolicLink"] = 3] = "SymbolicLink";
})(FileType = exports.FileType || (exports.FileType = {}));
/**
 * Describes a file, directory or symbolic link.
 */
class FileInfo {
    constructor(name) {
        this.name = name;
        this.type = FileType.Unknown;
        this.size = 0;
        /**
         * Unparsed, raw modification date as a string.
         *
         * If `modifiedAt` is undefined, the FTP server you're connected to doesn't support the more modern
         * MLSD command for machine-readable directory listings. The older command LIST is then used returning
         * results that vary a lot between servers as the format hasn't been standardized. Here, directory listings
         * and especially modification dates were meant to be human-readable first.
         *
         * Be careful when still trying to parse this by yourself. Parsing dates from listings using LIST is
         * unreliable. This library decides to offer parsed dates only when they're absolutely reliable and safe to
         * use e.g. for comparisons.
         */
        this.rawModifiedAt = "";
        /**
         * Parsed modification date.
         *
         * Available if the FTP server supports the MLSD command. Only MLSD guarantees dates than can be reliably
         * parsed with the correct timezone and a resolution down to seconds. See `rawModifiedAt` property for the unparsed
         * date that is always available.
         */
        this.modifiedAt = undefined;
        /**
         * Unix permissions if present. If the underlying FTP server is not running on Unix this will be undefined.
         * If set, you might be able to edit permissions with the FTP command `SITE CHMOD`.
         */
        this.permissions = undefined;
        /**
         * Hard link count if available.
         */
        this.hardLinkCount = undefined;
        /**
         * Link name for symbolic links if available.
         */
        this.link = undefined;
        /**
         * Unix group if available.
         */
        this.group = undefined;
        /**
         * Unix user if available.
         */
        this.user = undefined;
        /**
         * Unique ID if available.
         */
        this.uniqueID = undefined;
        this.name = name;
    }
    get isDirectory() {
        return this.type === FileType.Directory;
    }
    get isSymbolicLink() {
        return this.type === FileType.SymbolicLink;
    }
    get isFile() {
        return this.type === FileType.File;
    }
    /**
     * Deprecated, legacy API. Use `rawModifiedAt` instead.
     * @deprecated
     */
    get date() {
        return this.rawModifiedAt;
    }
    set date(rawModifiedAt) {
        this.rawModifiedAt = rawModifiedAt;
    }
}
exports.FileInfo = FileInfo;
FileInfo.UnixPermission = {
    Read: 4,
    Write: 2,
    Execute: 1
};


/***/ }),

/***/ 9052:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FTPContext = exports.FTPError = void 0;
const net_1 = __webpack_require__(1631);
const parseControlResponse_1 = __webpack_require__(9948);
/**
 * Describes an FTP server error response including the FTP response code.
 */
class FTPError extends Error {
    constructor(res) {
        super(res.message);
        this.name = this.constructor.name;
        this.code = res.code;
    }
}
exports.FTPError = FTPError;
/**
 * FTPContext holds the control and data sockets of an FTP connection and provides a
 * simplified way to interact with an FTP server, handle responses, errors and timeouts.
 *
 * It doesn't implement or use any FTP commands. It's only a foundation to make writing an FTP
 * client as easy as possible. You won't usually instantiate this, but use `Client`.
 */
class FTPContext {
    /**
     * Instantiate an FTP context.
     *
     * @param timeout - Timeout in milliseconds to apply to control and data connections. Use 0 for no timeout.
     * @param encoding - Encoding to use for control connection. UTF-8 by default. Use "latin1" for older servers.
     */
    constructor(timeout = 0, encoding = "utf8") {
        this.timeout = timeout;
        /** Debug-level logging of all socket communication. */
        this.verbose = false;
        /** IP version to prefer (4: IPv4, 6: IPv6, undefined: automatic). */
        this.ipFamily = undefined;
        /** Options for TLS connections. */
        this.tlsOptions = {};
        /** A multiline response might be received as multiple chunks. */
        this._partialResponse = "";
        this._encoding = encoding;
        // Help Typescript understand that we do indeed set _socket in the constructor but use the setter method to do so.
        this._socket = this.socket = this._newSocket();
        this._dataSocket = undefined;
    }
    /**
     * Close the context.
     */
    close() {
        // Internally, closing a context is always described with an error. If there is still a task running, it will
        // abort with an exception that the user closed the client during a task. If no task is running, no exception is
        // thrown but all newly submitted tasks after that will abort the exception that the client has been closed.
        // In addition the user will get a stack trace pointing to where exactly the client has been closed. So in any
        // case use _closingError to determine whether a context is closed. This also allows us to have a single code-path
        // for closing a context making the implementation easier.
        const message = this._task ? "User closed client during task" : "User closed client";
        const err = new Error(message);
        this.closeWithError(err);
    }
    /**
     * Close the context with an error.
     */
    closeWithError(err) {
        // If this context already has been closed, don't overwrite the reason.
        if (this._closingError) {
            return;
        }
        this._closingError = err;
        // Before giving the user's task a chance to react, make sure we won't be bothered with any inputs.
        this._closeSocket(this._socket);
        this._closeSocket(this._dataSocket);
        // Give the user's task a chance to react, maybe cleanup resources.
        this._passToHandler(err);
        // The task might not have been rejected by the user after receiving the error.
        this._stopTrackingTask();
    }
    /**
     * Returns true if this context has been closed or hasn't been connected yet. You can reopen it with `access`.
     */
    get closed() {
        return this.socket.remoteAddress === undefined || this._closingError !== undefined;
    }
    /**
     * Reset this contex and all of its state.
     */
    reset() {
        this.socket = this._newSocket();
    }
    /**
     * Get the FTP control socket.
     */
    get socket() {
        return this._socket;
    }
    /**
     * Set the socket for the control connection. This will only close the current control socket
     * if the new one is not an upgrade to the current one.
     */
    set socket(socket) {
        // No data socket should be open in any case where the control socket is set or upgraded.
        this.dataSocket = undefined;
        this.tlsOptions = {};
        // This being a soft reset, remove any remaining partial response.
        this._partialResponse = "";
        if (this._socket) {
            // Only close the current connection if the new is not an upgrade.
            const isUpgrade = socket.localPort === this._socket.localPort;
            if (!isUpgrade) {
                this._socket.destroy();
            }
            this._removeSocketListeners(this._socket);
        }
        if (socket) {
            // Setting a completely new control socket is in essence something like a reset. That's
            // why we also close any open data connection above. We can go one step further and reset
            // a possible closing error. That means that a closed FTPContext can be "reopened" by
            // setting a new control socket.
            this._closingError = undefined;
            // Don't set a timeout yet. Timeout for control sockets is only active during a task, see handle() below.
            socket.setTimeout(0);
            socket.setEncoding(this._encoding);
            socket.setKeepAlive(true);
            socket.on("data", data => this._onControlSocketData(data));
            // Server sending a FIN packet is treated as an error.
            socket.on("end", () => this.closeWithError(new Error("Server sent FIN packet unexpectedly, closing connection.")));
            // Control being closed without error by server is treated as an error.
            socket.on("close", hadError => { if (!hadError)
                this.closeWithError(new Error("Server closed connection unexpectedly.")); });
            this._setupDefaultErrorHandlers(socket, "control socket");
        }
        this._socket = socket;
    }
    /**
     * Get the current FTP data connection if present.
     */
    get dataSocket() {
        return this._dataSocket;
    }
    /**
     * Set the socket for the data connection. This will automatically close the former data socket.
     */
    set dataSocket(socket) {
        this._closeSocket(this._dataSocket);
        if (socket) {
            // Don't set a timeout yet. Timeout data socket should be activated when data transmission starts
            // and timeout on control socket is deactivated.
            socket.setTimeout(0);
            this._setupDefaultErrorHandlers(socket, "data socket");
        }
        this._dataSocket = socket;
    }
    /**
     * Get the currently used encoding.
     */
    get encoding() {
        return this._encoding;
    }
    /**
     * Set the encoding used for the control socket.
     *
     * See https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings for what encodings
     * are supported by Node.
     */
    set encoding(encoding) {
        this._encoding = encoding;
        if (this.socket) {
            this.socket.setEncoding(encoding);
        }
    }
    /**
     * Send an FTP command without waiting for or handling the result.
     */
    send(command) {
        const containsPassword = command.startsWith("PASS");
        const message = containsPassword ? "> PASS ###" : `> ${command}`;
        this.log(message);
        this._socket.write(command + "\r\n", this.encoding);
    }
    /**
     * Send an FTP command and handle the first response. Use this if you have a simple
     * request-response situation.
     */
    request(command) {
        return this.handle(command, (res, task) => {
            if (res instanceof Error) {
                task.reject(res);
            }
            else {
                task.resolve(res);
            }
        });
    }
    /**
     * Send an FTP command and handle any response until you resolve/reject. Use this if you expect multiple responses
     * to a request. This returns a Promise that will hold whatever the response handler passed on when resolving/rejecting its task.
     */
    handle(command, responseHandler) {
        if (this._task) {
            // The user or client instance called `handle()` while a task is still running.
            const err = new Error("User launched a task while another one is still running. Forgot to use 'await' or '.then()'?");
            err.stack += `\nRunning task launched at: ${this._task.stack}`;
            this.closeWithError(err);
            // Don't return here, continue with returning the Promise that will then be rejected
            // because the context closed already. That way, users will receive an exception where
            // they called this method by mistake.
        }
        return new Promise((resolvePromise, rejectPromise) => {
            const stack = new Error().stack || "Unknown call stack";
            const resolver = {
                resolve: (...args) => {
                    this._stopTrackingTask();
                    resolvePromise(...args);
                },
                reject: err => {
                    this._stopTrackingTask();
                    rejectPromise(err);
                }
            };
            this._task = {
                stack,
                resolver,
                responseHandler
            };
            if (this._closingError) {
                // This client has been closed. Provide an error that describes this one as being caused
                // by `_closingError`, include stack traces for both.
                const err = new Error("Client is closed"); // Type 'Error' is not correctly defined, doesn't have 'code'.
                err.stack += `\nClosing reason: ${this._closingError.stack}`;
                err.code = this._closingError.code !== undefined ? this._closingError.code : "0";
                this._passToHandler(err);
                return;
            }
            // Only track control socket timeout during the lifecycle of a task. This avoids timeouts on idle sockets,
            // the default socket behaviour which is not expected by most users.
            this.socket.setTimeout(this.timeout);
            if (command) {
                this.send(command);
            }
        });
    }
    /**
     * Log message if set to be verbose.
     */
    log(message) {
        if (this.verbose) {
            // tslint:disable-next-line no-console
            console.log(message);
        }
    }
    /**
     * Return true if the control socket is using TLS. This does not mean that a session
     * has already been negotiated.
     */
    get hasTLS() {
        return "encrypted" in this._socket;
    }
    /**
     * Removes reference to current task and handler. This won't resolve or reject the task.
     * @protected
     */
    _stopTrackingTask() {
        // Disable timeout on control socket if there is no task active.
        this.socket.setTimeout(0);
        this._task = undefined;
    }
    /**
     * Handle incoming data on the control socket. The chunk is going to be of type `string`
     * because we let `socket` handle encoding with `setEncoding`.
     * @protected
     */
    _onControlSocketData(chunk) {
        this.log(`< ${chunk}`);
        // This chunk might complete an earlier partial response.
        const completeResponse = this._partialResponse + chunk;
        const parsed = parseControlResponse_1.parseControlResponse(completeResponse);
        // Remember any incomplete remainder.
        this._partialResponse = parsed.rest;
        // Each response group is passed along individually.
        for (const message of parsed.messages) {
            const code = parseInt(message.substr(0, 3), 10);
            const response = { code, message };
            const err = code >= 400 ? new FTPError(response) : undefined;
            this._passToHandler(err ? err : response);
        }
    }
    /**
     * Send the current handler a response. This is usually a control socket response
     * or a socket event, like an error or timeout.
     * @protected
     */
    _passToHandler(response) {
        if (this._task) {
            this._task.responseHandler(response, this._task.resolver);
        }
        // Errors other than FTPError always close the client. If there isn't an active task to handle the error,
        // the next one submitted will receive it using `_closingError`.
        // There is only one edge-case: If there is an FTPError while no task is active, the error will be dropped.
        // But that means that the user sent an FTP command with no intention of handling the result. So why should the
        // error be handled? Maybe log it at least? Debug logging will already do that and the client stays useable after
        // FTPError. So maybe no need to do anything here.
    }
    /**
     * Setup all error handlers for a socket.
     * @protected
     */
    _setupDefaultErrorHandlers(socket, identifier) {
        socket.once("error", error => {
            error.message += ` (${identifier})`;
            this.closeWithError(error);
        });
        socket.once("close", hadError => {
            if (hadError) {
                this.closeWithError(new Error(`Socket closed due to transmission error (${identifier})`));
            }
        });
        socket.once("timeout", () => this.closeWithError(new Error(`Timeout (${identifier})`)));
    }
    /**
     * Close a socket.
     * @protected
     */
    _closeSocket(socket) {
        if (socket) {
            socket.destroy();
            this._removeSocketListeners(socket);
        }
    }
    /**
     * Remove all default listeners for socket.
     * @protected
     */
    _removeSocketListeners(socket) {
        socket.removeAllListeners();
        // Before Node.js 10.3.0, using `socket.removeAllListeners()` without any name did not work: https://github.com/nodejs/node/issues/20923.
        socket.removeAllListeners("timeout");
        socket.removeAllListeners("data");
        socket.removeAllListeners("end");
        socket.removeAllListeners("error");
        socket.removeAllListeners("close");
        socket.removeAllListeners("connect");
    }
    /**
     * Provide a new socket instance.
     *
     * Internal use only, replaced for unit tests.
     */
    _newSocket() {
        return new net_1.Socket();
    }
}
exports.FTPContext = FTPContext;


/***/ }),

/***/ 7170:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProgressTracker = void 0;
/**
 * Tracks progress of one socket data transfer at a time.
 */
class ProgressTracker {
    constructor() {
        this.bytesOverall = 0;
        this.intervalMs = 500;
        this.onStop = noop;
        this.onHandle = noop;
    }
    /**
     * Register a new handler for progress info. Use `undefined` to disable reporting.
     */
    reportTo(onHandle = noop) {
        this.onHandle = onHandle;
    }
    /**
     * Start tracking transfer progress of a socket.
     *
     * @param socket  The socket to observe.
     * @param name  A name associated with this progress tracking, e.g. a filename.
     * @param type  The type of the transfer, typically "upload" or "download".
     */
    start(socket, name, type) {
        let lastBytes = 0;
        this.onStop = poll(this.intervalMs, () => {
            const bytes = socket.bytesRead + socket.bytesWritten;
            this.bytesOverall += bytes - lastBytes;
            lastBytes = bytes;
            this.onHandle({
                name,
                type,
                bytes,
                bytesOverall: this.bytesOverall
            });
        });
    }
    /**
     * Stop tracking transfer progress.
     */
    stop() {
        this.onStop(false);
    }
    /**
     * Call the progress handler one more time, then stop tracking.
     */
    updateAndStop() {
        this.onStop(true);
    }
}
exports.ProgressTracker = ProgressTracker;
/**
 * Starts calling a callback function at a regular interval. The first call will go out
 * immediately. The function returns a function to stop the polling.
 */
function poll(intervalMs, updateFunc) {
    const id = setInterval(updateFunc, intervalMs);
    const stopFunc = (stopWithUpdate) => {
        clearInterval(id);
        if (stopWithUpdate) {
            updateFunc();
        }
        // Prevent repeated calls to stop calling handler.
        updateFunc = noop;
    };
    updateFunc();
    return stopFunc;
}
function noop() { }


/***/ }),

/***/ 4677:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 8184:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StringWriter = void 0;
const stream_1 = __webpack_require__(2413);
class StringWriter extends stream_1.Writable {
    constructor() {
        super(...arguments);
        this.buf = Buffer.alloc(0);
    }
    _write(chunk, _, callback) {
        if (chunk instanceof Buffer) {
            this.buf = Buffer.concat([this.buf, chunk]);
            callback(null);
        }
        else {
            callback(new Error("StringWriter expects chunks of type 'Buffer'."));
        }
    }
    getText(encoding) {
        return this.buf.toString(encoding);
    }
}
exports.StringWriter = StringWriter;


/***/ }),

/***/ 7957:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.enterPassiveModeIPv6 = exports.enterPassiveModeIPv4 = void 0;
/**
 * Public API
 */
__exportStar(__webpack_require__(8337), exports);
__exportStar(__webpack_require__(9052), exports);
__exportStar(__webpack_require__(202), exports);
__exportStar(__webpack_require__(2993), exports);
__exportStar(__webpack_require__(4677), exports);
var transfer_1 = __webpack_require__(5803);
Object.defineProperty(exports, "enterPassiveModeIPv4", ({ enumerable: true, get: function () { return transfer_1.enterPassiveModeIPv4; } }));
Object.defineProperty(exports, "enterPassiveModeIPv6", ({ enumerable: true, get: function () { return transfer_1.enterPassiveModeIPv6; } }));


/***/ }),

/***/ 6288:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ipIsPrivateV4Address = exports.upgradeSocket = exports.describeAddress = exports.describeTLS = void 0;
const tls_1 = __webpack_require__(4016);
/**
 * Returns a string describing the encryption on a given socket instance.
 */
function describeTLS(socket) {
    if (socket instanceof tls_1.TLSSocket) {
        const protocol = socket.getProtocol();
        return protocol ? protocol : "Server socket or disconnected client socket";
    }
    return "No encryption";
}
exports.describeTLS = describeTLS;
/**
 * Returns a string describing the remote address of a socket.
 */
function describeAddress(socket) {
    if (socket.remoteFamily === "IPv6") {
        return `[${socket.remoteAddress}]:${socket.remotePort}`;
    }
    return `${socket.remoteAddress}:${socket.remotePort}`;
}
exports.describeAddress = describeAddress;
/**
 * Upgrade a socket connection with TLS.
 */
function upgradeSocket(socket, options) {
    return new Promise((resolve, reject) => {
        const tlsOptions = Object.assign({}, options, {
            socket
        });
        const tlsSocket = tls_1.connect(tlsOptions, () => {
            const expectCertificate = tlsOptions.rejectUnauthorized !== false;
            if (expectCertificate && !tlsSocket.authorized) {
                reject(tlsSocket.authorizationError);
            }
            else {
                // Remove error listener added below.
                tlsSocket.removeAllListeners("error");
                resolve(tlsSocket);
            }
        }).once("error", error => {
            reject(error);
        });
    });
}
exports.upgradeSocket = upgradeSocket;
/**
 * Returns true if an IP is a private address according to https://tools.ietf.org/html/rfc1918#section-3.
 * This will handle IPv4-mapped IPv6 addresses correctly but return false for all other IPv6 addresses.
 *
 * @param ip  The IP as a string, e.g. "192.168.0.1"
 */
function ipIsPrivateV4Address(ip = "") {
    // Handle IPv4-mapped IPv6 addresses like ::ffff:192.168.0.1
    if (ip.startsWith("::ffff:")) {
        ip = ip.substr(7); // Strip ::ffff: prefix
    }
    const octets = ip.split(".").map(o => parseInt(o, 10));
    return octets[0] === 10 // 10.0.0.0 - 10.255.255.255
        || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) // 172.16.0.0 - 172.31.255.255
        || (octets[0] === 192 && octets[1] === 168); // 192.168.0.0 - 192.168.255.255
}
exports.ipIsPrivateV4Address = ipIsPrivateV4Address;


/***/ }),

/***/ 9948:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.positiveIntermediate = exports.positiveCompletion = exports.isMultiline = exports.isSingleLine = exports.parseControlResponse = void 0;
const LF = "\n";
/**
 * Parse an FTP control response as a collection of messages. A message is a complete
 * single- or multiline response. A response can also contain multiple multiline responses
 * that will each be represented by a message. A response can also be incomplete
 * and be completed on the next incoming data chunk for which case this function also
 * describes a `rest`. This function converts all CRLF to LF.
 */
function parseControlResponse(text) {
    const lines = text.split(/\r?\n/).filter(isNotBlank);
    const messages = [];
    let startAt = 0;
    let tokenRegex;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // No group has been opened.
        if (!tokenRegex) {
            if (isMultiline(line)) {
                // Open a group by setting an expected token.
                const token = line.substr(0, 3);
                tokenRegex = new RegExp(`^${token}(?:$| )`);
                startAt = i;
            }
            else if (isSingleLine(line)) {
                // Single lines can be grouped immediately.
                messages.push(line);
            }
        }
        // Group has been opened, expect closing token.
        else if (tokenRegex.test(line)) {
            tokenRegex = undefined;
            messages.push(lines.slice(startAt, i + 1).join(LF));
        }
    }
    // The last group might not have been closed, report it as a rest.
    const rest = tokenRegex ? lines.slice(startAt).join(LF) + LF : "";
    return { messages, rest };
}
exports.parseControlResponse = parseControlResponse;
function isSingleLine(line) {
    return /^\d\d\d(?:$| )/.test(line);
}
exports.isSingleLine = isSingleLine;
function isMultiline(line) {
    return /^\d\d\d-/.test(line);
}
exports.isMultiline = isMultiline;
/**
 * Return true if an FTP return code describes a positive completion.
 */
function positiveCompletion(code) {
    return code >= 200 && code < 300;
}
exports.positiveCompletion = positiveCompletion;
/**
 * Return true if an FTP return code describes a positive intermediate response.
 */
function positiveIntermediate(code) {
    return code >= 300 && code < 400;
}
exports.positiveIntermediate = positiveIntermediate;
function isNotBlank(str) {
    return str.trim() !== "";
}


/***/ }),

/***/ 2993:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseList = void 0;
const dosParser = __importStar(__webpack_require__(6199));
const unixParser = __importStar(__webpack_require__(2622));
const mlsdParser = __importStar(__webpack_require__(8157));
/**
 * Available directory listing parsers. These are candidates that will be tested
 * in the order presented. The first candidate will be used to parse the whole list.
 */
const availableParsers = [
    dosParser,
    unixParser,
    mlsdParser // Keep MLSD last, may accept filename only
];
function firstCompatibleParser(line, parsers) {
    return parsers.find(parser => parser.testLine(line) === true);
}
function stringIsNotBlank(str) {
    return str.trim() !== "";
}
const REGEX_NEWLINE = /\r?\n/;
/**
 * Parse raw directory listing.
 */
function parseList(rawList) {
    const lines = rawList
        .split(REGEX_NEWLINE)
        .filter(stringIsNotBlank);
    if (lines.length === 0) {
        return [];
    }
    const testLine = lines[lines.length - 1];
    const parser = firstCompatibleParser(testLine, availableParsers);
    if (!parser) {
        throw new Error("This library only supports MLSD, Unix- or DOS-style directory listing. Your FTP server seems to be using another format. You can see the transmitted listing when setting `client.ftp.verbose = true`. You can then provide a custom parser to `client.parseList`, see the documentation for details.");
    }
    const files = lines
        .map(parser.parseLine)
        .filter((info) => info !== undefined);
    return parser.transformList(files);
}
exports.parseList = parseList;


/***/ }),

/***/ 6199:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.transformList = exports.parseLine = exports.testLine = void 0;
const FileInfo_1 = __webpack_require__(202);
/**
 * This parser is based on the FTP client library source code in Apache Commons Net provided
 * under the Apache 2.0 license. It has been simplified and rewritten to better fit the Javascript language.
 *
 * https://github.com/apache/commons-net/blob/master/src/main/java/org/apache/commons/net/ftp/parser/NTFTPEntryParser.java
 */
const RE_LINE = new RegExp("(\\S+)\\s+(\\S+)\\s+" // MM-dd-yy whitespace hh:mma|kk:mm swallow trailing spaces
    + "(?:(<DIR>)|([0-9]+))\\s+" // <DIR> or ddddd swallow trailing spaces
    + "(\\S.*)" // First non-space followed by rest of line (name)
);
/**
 * Returns true if a given line might be a DOS-style listing.
 *
 * - Example: `12-05-96  05:03PM       <DIR>          myDir`
 */
function testLine(line) {
    return /^\d{2}/.test(line) && RE_LINE.test(line);
}
exports.testLine = testLine;
/**
 * Parse a single line of a DOS-style directory listing.
 */
function parseLine(line) {
    const groups = line.match(RE_LINE);
    if (groups === null) {
        return undefined;
    }
    const name = groups[5];
    if (name === "." || name === "..") { // Ignore parent directory links
        return undefined;
    }
    const file = new FileInfo_1.FileInfo(name);
    const fileType = groups[3];
    if (fileType === "<DIR>") {
        file.type = FileInfo_1.FileType.Directory;
        file.size = 0;
    }
    else {
        file.type = FileInfo_1.FileType.File;
        file.size = parseInt(groups[4], 10);
    }
    file.rawModifiedAt = groups[1] + " " + groups[2];
    return file;
}
exports.parseLine = parseLine;
function transformList(files) {
    return files;
}
exports.transformList = transformList;


/***/ }),

/***/ 8157:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseMLSxDate = exports.transformList = exports.parseLine = exports.testLine = void 0;
const FileInfo_1 = __webpack_require__(202);
function parseSize(value, info) {
    info.size = parseInt(value, 10);
}
/**
 * Parsers for MLSD facts.
 */
const factHandlersByName = {
    "size": parseSize,
    "sizd": parseSize,
    "unique": (value, info) => {
        info.uniqueID = value;
    },
    "modify": (value, info) => {
        info.modifiedAt = parseMLSxDate(value);
        info.rawModifiedAt = info.modifiedAt.toISOString();
    },
    "type": (value, info) => {
        // There seems to be confusion on how to handle symbolic links for Unix. RFC 3659 doesn't describe
        // this but mentions some examples using the syntax `type=OS.unix=slink:<target>`. But according to
        // an entry in the Errata (https://www.rfc-editor.org/errata/eid1500) this syntax can't be valid.
        // Instead it proposes to use `type=OS.unix=symlink` and to then list the actual target of the
        // symbolic link as another entry in the directory listing. The unique identifiers can then be used
        // to derive the connection between link(s) and target. We'll have to handle both cases as there
        // are differing opinions on how to deal with this. Here are some links on this topic:
        // - ProFTPD source: https://github.com/proftpd/proftpd/blob/56e6dfa598cbd4ef5c6cba439bcbcd53a63e3b21/modules/mod_facts.c#L531
        // - ProFTPD bug: http://bugs.proftpd.org/show_bug.cgi?id=3318
        // - ProFTPD statement: http://www.proftpd.org/docs/modules/mod_facts.html
        // – FileZilla bug: https://trac.filezilla-project.org/ticket/9310
        if (value.startsWith("OS.unix=slink")) {
            info.type = FileInfo_1.FileType.SymbolicLink;
            info.link = value.substr(value.indexOf(":") + 1);
            return 1 /* Continue */;
        }
        switch (value) {
            case "file":
                info.type = FileInfo_1.FileType.File;
                break;
            case "dir":
                info.type = FileInfo_1.FileType.Directory;
                break;
            case "OS.unix=symlink":
                info.type = FileInfo_1.FileType.SymbolicLink;
                // The target of the symbolic link might be defined in another line in the directory listing.
                // We'll handle this in `transformList()` below.
                break;
            case "cdir": // Current directory being listed
            case "pdir": // Parent directory
                return 2 /* IgnoreFile */; // Don't include these entries in the listing
            default:
                info.type = FileInfo_1.FileType.Unknown;
        }
        return 1 /* Continue */;
    },
    "unix.mode": (value, info) => {
        const digits = value.substr(-3);
        info.permissions = {
            user: parseInt(digits[0], 10),
            group: parseInt(digits[1], 10),
            world: parseInt(digits[2], 10)
        };
    },
    "unix.ownername": (value, info) => {
        info.user = value;
    },
    "unix.owner": (value, info) => {
        if (info.user === undefined)
            info.user = value;
    },
    get "unix.uid"() {
        return this["unix.owner"];
    },
    "unix.groupname": (value, info) => {
        info.group = value;
    },
    "unix.group": (value, info) => {
        if (info.group === undefined)
            info.group = value;
    },
    get "unix.gid"() {
        return this["unix.group"];
    }
    // Regarding the fact "perm":
    // We don't handle permission information stored in "perm" because its information is conceptually
    // different from what users of FTP clients usually associate with "permissions". Those that have
    // some expectations (and probably want to edit them with a SITE command) often unknowingly expect
    // the Unix permission system. The information passed by "perm" describes what FTP commands can be
    // executed with a file/directory. But even this can be either incomplete or just meant as a "guide"
    // as the spec mentions. From https://tools.ietf.org/html/rfc3659#section-7.5.5: "The permissions are
    // described here as they apply to FTP commands. They may not map easily into particular permissions
    // available on the server's operating system." The parser by Apache Commons tries to translate these
    // to Unix permissions – this is misleading users and might not even be correct.
};
/**
 * Split a string once at the first position of a delimiter. For example
 * `splitStringOnce("a b c d", " ")` returns `["a", "b c d"]`.
 */
function splitStringOnce(str, delimiter) {
    const pos = str.indexOf(delimiter);
    const a = str.substr(0, pos);
    const b = str.substr(pos + delimiter.length);
    return [a, b];
}
/**
 * Returns true if a given line might be part of an MLSD listing.
 *
 * - Example 1: `size=15227;type=dir;perm=el;modify=20190419065730; test one`
 * - Example 2: ` file name` (leading space)
 */
function testLine(line) {
    return /^\S+=\S+;/.test(line) || line.startsWith(" ");
}
exports.testLine = testLine;
/**
 * Parse single line as MLSD listing, see specification at https://tools.ietf.org/html/rfc3659#section-7.
 */
function parseLine(line) {
    const [packedFacts, name] = splitStringOnce(line, " ");
    if (name === "" || name === "." || name === "..") {
        return undefined;
    }
    const info = new FileInfo_1.FileInfo(name);
    const facts = packedFacts.split(";");
    for (const fact of facts) {
        const [factName, factValue] = splitStringOnce(fact, "=");
        if (!factValue) {
            continue;
        }
        const factHandler = factHandlersByName[factName.toLowerCase()];
        if (!factHandler) {
            continue;
        }
        const result = factHandler(factValue, info);
        if (result === 2 /* IgnoreFile */) {
            return undefined;
        }
    }
    return info;
}
exports.parseLine = parseLine;
function transformList(files) {
    // Create a map of all files that are not symbolic links by their unique ID
    const nonLinksByID = new Map();
    for (const file of files) {
        if (!file.isSymbolicLink && file.uniqueID !== undefined) {
            nonLinksByID.set(file.uniqueID, file);
        }
    }
    const resolvedFiles = [];
    for (const file of files) {
        // Try to associate unresolved symbolic links with a target file/directory.
        if (file.isSymbolicLink && file.uniqueID !== undefined && file.link === undefined) {
            const target = nonLinksByID.get(file.uniqueID);
            if (target !== undefined) {
                file.link = target.name;
            }
        }
        // The target of a symbolic link is listed as an entry in the directory listing but might
        // have a path pointing outside of this directory. In that case we don't want this entry
        // to be part of the listing. We generally don't want these kind of entries at all.
        const isPartOfDirectory = !file.name.includes("/");
        if (isPartOfDirectory) {
            resolvedFiles.push(file);
        }
    }
    return resolvedFiles;
}
exports.transformList = transformList;
/**
 * Parse date as specified in https://tools.ietf.org/html/rfc3659#section-2.3.
 *
 * Message contains response code and modified time in the format: YYYYMMDDHHMMSS[.sss]
 * For example `19991005213102` or `19980615100045.014`.
 */
function parseMLSxDate(fact) {
    return new Date(Date.UTC(+fact.slice(0, 4), // Year
    +fact.slice(4, 6) - 1, // Month
    +fact.slice(6, 8), // Date
    +fact.slice(8, 10), // Hours
    +fact.slice(10, 12), // Minutes
    +fact.slice(12, 14), // Seconds
    +fact.slice(15, 18) // Milliseconds
    ));
}
exports.parseMLSxDate = parseMLSxDate;


/***/ }),

/***/ 2622:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.transformList = exports.parseLine = exports.testLine = void 0;
const FileInfo_1 = __webpack_require__(202);
const JA_MONTH = "\u6708";
const JA_DAY = "\u65e5";
const JA_YEAR = "\u5e74";
/**
 * This parser is based on the FTP client library source code in Apache Commons Net provided
 * under the Apache 2.0 license. It has been simplified and rewritten to better fit the Javascript language.
 *
 * https://github.com/apache/commons-net/blob/master/src/main/java/org/apache/commons/net/ftp/parser/UnixFTPEntryParser.java
 *
 * Below is the regular expression used by this parser.
 *
 * Permissions:
 *    r   the file is readable
 *    w   the file is writable
 *    x   the file is executable
 *    -   the indicated permission is not granted
 *    L   mandatory locking occurs during access (the set-group-ID bit is
 *        on and the group execution bit is off)
 *    s   the set-user-ID or set-group-ID bit is on, and the corresponding
 *        user or group execution bit is also on
 *    S   undefined bit-state (the set-user-ID bit is on and the user
 *        execution bit is off)
 *    t   the 1000 (octal) bit, or sticky bit, is on [see chmod(1)], and
 *        execution is on
 *    T   the 1000 bit is turned on, and execution is off (undefined bit-
 *        state)
 *    e   z/OS external link bit
 *    Final letter may be appended:
 *    +   file has extended security attributes (e.g. ACL)
 *    Note: local listings on MacOSX also use '@'
 *    this is not allowed for here as does not appear to be shown by FTP servers
 *    {@code @}   file has extended attributes
 */
const RE_LINE = new RegExp("([bcdelfmpSs-])" // file type
    + "(((r|-)(w|-)([xsStTL-]))((r|-)(w|-)([xsStTL-]))((r|-)(w|-)([xsStTL-])))\\+?" // permissions
    + "\\s*" // separator TODO why allow it to be omitted??
    + "(\\d+)" // link count
    + "\\s+" // separator
    + "(?:(\\S+(?:\\s\\S+)*?)\\s+)?" // owner name (optional spaces)
    + "(?:(\\S+(?:\\s\\S+)*)\\s+)?" // group name (optional spaces)
    + "(\\d+(?:,\\s*\\d+)?)" // size or n,m
    + "\\s+" // separator
    /**
     * numeric or standard format date:
     *   yyyy-mm-dd (expecting hh:mm to follow)
     *   MMM [d]d
     *   [d]d MMM
     *   N.B. use non-space for MMM to allow for languages such as German which use
     *   diacritics (e.g. umlaut) in some abbreviations.
     *   Japanese uses numeric day and month with suffixes to distinguish them
     *   [d]dXX [d]dZZ
     */
    + "(" +
    "(?:\\d+[-/]\\d+[-/]\\d+)" + // yyyy-mm-dd
    "|(?:\\S{3}\\s+\\d{1,2})" + // MMM [d]d
    "|(?:\\d{1,2}\\s+\\S{3})" + // [d]d MMM
    "|(?:\\d{1,2}" + JA_MONTH + "\\s+\\d{1,2}" + JA_DAY + ")" +
    ")"
    + "\\s+" // separator
    /**
     * year (for non-recent standard format) - yyyy
     * or time (for numeric or recent standard format) [h]h:mm
     * or Japanese year - yyyyXX
     */
    + "((?:\\d+(?::\\d+)?)|(?:\\d{4}" + JA_YEAR + "))" // (20)
    + "\\s" // separator
    + "(.*)"); // the rest (21)
/**
 * Returns true if a given line might be a Unix-style listing.
 *
 * - Example: `-rw-r--r--+   1 patrick  staff   1057 Dec 11 14:35 test.txt`
 */
function testLine(line) {
    return RE_LINE.test(line);
}
exports.testLine = testLine;
/**
 * Parse a single line of a Unix-style directory listing.
 */
function parseLine(line) {
    const groups = line.match(RE_LINE);
    if (groups === null) {
        return undefined;
    }
    const name = groups[21];
    if (name === "." || name === "..") { // Ignore parent directory links
        return undefined;
    }
    const file = new FileInfo_1.FileInfo(name);
    file.size = parseInt(groups[18], 10);
    file.user = groups[16];
    file.group = groups[17];
    file.hardLinkCount = parseInt(groups[15], 10);
    file.rawModifiedAt = groups[19] + " " + groups[20];
    file.permissions = {
        user: parseMode(groups[4], groups[5], groups[6]),
        group: parseMode(groups[8], groups[9], groups[10]),
        world: parseMode(groups[12], groups[13], groups[14]),
    };
    // Set file type
    switch (groups[1].charAt(0)) {
        case "d":
            file.type = FileInfo_1.FileType.Directory;
            break;
        case "e": // NET-39 => z/OS external link
            file.type = FileInfo_1.FileType.SymbolicLink;
            break;
        case "l":
            file.type = FileInfo_1.FileType.SymbolicLink;
            break;
        case "b":
        case "c":
            file.type = FileInfo_1.FileType.File; // TODO change this if DEVICE_TYPE implemented
            break;
        case "f":
        case "-":
            file.type = FileInfo_1.FileType.File;
            break;
        default:
            // A 'whiteout' file is an ARTIFICIAL entry in any of several types of
            // 'translucent' filesystems, of which a 'union' filesystem is one.
            file.type = FileInfo_1.FileType.Unknown;
    }
    // Separate out the link name for symbolic links
    if (file.isSymbolicLink) {
        const end = name.indexOf(" -> ");
        if (end !== -1) {
            file.name = name.substring(0, end);
            file.link = name.substring(end + 4);
        }
    }
    return file;
}
exports.parseLine = parseLine;
function transformList(files) {
    return files;
}
exports.transformList = transformList;
function parseMode(r, w, x) {
    let value = 0;
    if (r !== "-") {
        value += FileInfo_1.FileInfo.UnixPermission.Read;
    }
    if (w !== "-") {
        value += FileInfo_1.FileInfo.UnixPermission.Write;
    }
    const execToken = x.charAt(0);
    if (execToken !== "-" && execToken.toUpperCase() !== execToken) {
        value += FileInfo_1.FileInfo.UnixPermission.Execute;
    }
    return value;
}


/***/ }),

/***/ 5803:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.downloadTo = exports.uploadFrom = exports.connectForPassiveTransfer = exports.parsePasvResponse = exports.enterPassiveModeIPv4 = exports.parseEpsvResponse = exports.enterPassiveModeIPv6 = void 0;
const netUtils_1 = __webpack_require__(6288);
const tls_1 = __webpack_require__(4016);
const parseControlResponse_1 = __webpack_require__(9948);
/**
 * Prepare a data socket using passive mode over IPv6.
 */
async function enterPassiveModeIPv6(ftp) {
    const res = await ftp.request("EPSV");
    const port = parseEpsvResponse(res.message);
    if (!port) {
        throw new Error("Can't parse EPSV response: " + res.message);
    }
    const controlHost = ftp.socket.remoteAddress;
    if (controlHost === undefined) {
        throw new Error("Control socket is disconnected, can't get remote address.");
    }
    await connectForPassiveTransfer(controlHost, port, ftp);
    return res;
}
exports.enterPassiveModeIPv6 = enterPassiveModeIPv6;
/**
 * Parse an EPSV response. Returns only the port as in EPSV the host of the control connection is used.
 */
function parseEpsvResponse(message) {
    // Get port from EPSV response, e.g. "229 Entering Extended Passive Mode (|||6446|)"
    // Some FTP Servers such as the one on IBM i (OS/400) use ! instead of | in their EPSV response.
    const groups = message.match(/[|!]{3}(.+)[|!]/);
    if (groups === null || groups[1] === undefined) {
        throw new Error(`Can't parse response to 'EPSV': ${message}`);
    }
    const port = parseInt(groups[1], 10);
    if (Number.isNaN(port)) {
        throw new Error(`Can't parse response to 'EPSV', port is not a number: ${message}`);
    }
    return port;
}
exports.parseEpsvResponse = parseEpsvResponse;
/**
 * Prepare a data socket using passive mode over IPv4.
 */
async function enterPassiveModeIPv4(ftp) {
    const res = await ftp.request("PASV");
    const target = parsePasvResponse(res.message);
    if (!target) {
        throw new Error("Can't parse PASV response: " + res.message);
    }
    // If the host in the PASV response has a local address while the control connection hasn't,
    // we assume a NAT issue and use the IP of the control connection as the target for the data connection.
    // We can't always perform this replacement because it's possible (although unlikely) that the FTP server
    // indeed uses a different host for data connections.
    const controlHost = ftp.socket.remoteAddress;
    if (netUtils_1.ipIsPrivateV4Address(target.host) && controlHost && !netUtils_1.ipIsPrivateV4Address(controlHost)) {
        target.host = controlHost;
    }
    await connectForPassiveTransfer(target.host, target.port, ftp);
    return res;
}
exports.enterPassiveModeIPv4 = enterPassiveModeIPv4;
/**
 * Parse a PASV response.
 */
function parsePasvResponse(message) {
    // Get host and port from PASV response, e.g. "227 Entering Passive Mode (192,168,1,100,10,229)"
    const groups = message.match(/([-\d]+,[-\d]+,[-\d]+,[-\d]+),([-\d]+),([-\d]+)/);
    if (groups === null || groups.length !== 4) {
        throw new Error(`Can't parse response to 'PASV': ${message}`);
    }
    return {
        host: groups[1].replace(/,/g, "."),
        port: (parseInt(groups[2], 10) & 255) * 256 + (parseInt(groups[3], 10) & 255)
    };
}
exports.parsePasvResponse = parsePasvResponse;
function connectForPassiveTransfer(host, port, ftp) {
    return new Promise((resolve, reject) => {
        const handleConnErr = function (err) {
            err.message = "Can't open data connection in passive mode: " + err.message;
            reject(err);
        };
        let socket = ftp._newSocket();
        socket.on("error", handleConnErr);
        socket.connect({ port, host, family: ftp.ipFamily }, () => {
            if (ftp.socket instanceof tls_1.TLSSocket) {
                socket = tls_1.connect(Object.assign({}, ftp.tlsOptions, {
                    socket,
                    // Reuse the TLS session negotiated earlier when the control connection
                    // was upgraded. Servers expect this because it provides additional
                    // security: If a completely new session would be negotiated, a hacker
                    // could guess the port and connect to the new data connection before we do
                    // by just starting his/her own TLS session.
                    session: ftp.socket.getSession()
                }));
                // It's the responsibility of the transfer task to wait until the
                // TLS socket issued the event 'secureConnect'. We can't do this
                // here because some servers will start upgrading after the
                // specific transfer request has been made. List and download don't
                // have to wait for this event because the server sends whenever it
                // is ready. But for upload this has to be taken into account,
                // see the details in the upload() function below.
            }
            // Let the FTPContext listen to errors from now on, remove local handler.
            socket.removeListener("error", handleConnErr);
            ftp.dataSocket = socket;
            resolve();
        });
    });
}
exports.connectForPassiveTransfer = connectForPassiveTransfer;
/**
 * Helps resolving/rejecting transfers.
 *
 * This is used internally for all FTP transfers. For example when downloading, the server might confirm
 * with "226 Transfer complete" when in fact the download on the data connection has not finished
 * yet. With all transfers we make sure that a) the result arrived and b) has been confirmed by
 * e.g. the control connection. We just don't know in which order this will happen.
 */
class TransferResolver {
    /**
     * Instantiate a TransferResolver
     */
    constructor(ftp, progress) {
        this.ftp = ftp;
        this.progress = progress;
        this.response = undefined;
        this.dataTransferDone = false;
    }
    /**
     * Mark the beginning of a transfer.
     *
     * @param name - Name of the transfer, usually the filename.
     * @param type - Type of transfer, usually "upload" or "download".
     */
    onDataStart(name, type) {
        // Let the data socket be in charge of tracking timeouts during transfer.
        // The control socket sits idle during this time anyway and might provoke
        // a timeout unnecessarily. The control connection will take care
        // of timeouts again once data transfer is complete or failed.
        if (this.ftp.dataSocket === undefined) {
            throw new Error("Data transfer should start but there is no data connection.");
        }
        this.ftp.socket.setTimeout(0);
        this.ftp.dataSocket.setTimeout(this.ftp.timeout);
        this.progress.start(this.ftp.dataSocket, name, type);
    }
    /**
     * The data connection has finished the transfer.
     */
    onDataDone(task) {
        this.progress.updateAndStop();
        // Hand-over timeout tracking back to the control connection. It's possible that
        // we don't receive the response over the control connection that the transfer is
        // done. In this case, we want to correctly associate the resulting timeout with
        // the control connection.
        this.ftp.socket.setTimeout(this.ftp.timeout);
        if (this.ftp.dataSocket) {
            this.ftp.dataSocket.setTimeout(0);
        }
        this.dataTransferDone = true;
        this.tryResolve(task);
    }
    /**
     * The control connection reports the transfer as finished.
     */
    onControlDone(task, response) {
        this.response = response;
        this.tryResolve(task);
    }
    /**
     * An error has been reported and the task should be rejected.
     */
    onError(task, err) {
        this.progress.updateAndStop();
        this.ftp.socket.setTimeout(this.ftp.timeout);
        this.ftp.dataSocket = undefined;
        task.reject(err);
    }
    /**
     * Control connection sent an unexpected request requiring a response from our part. We
     * can't provide that (because unknown) and have to close the contrext with an error because
     * the FTP server is now caught up in a state we can't resolve.
     */
    onUnexpectedRequest(response) {
        const err = new Error(`Unexpected FTP response is requesting an answer: ${response.message}`);
        this.ftp.closeWithError(err);
    }
    tryResolve(task) {
        // To resolve, we need both control and data connection to report that the transfer is done.
        const canResolve = this.dataTransferDone && this.response !== undefined;
        if (canResolve) {
            this.ftp.dataSocket = undefined;
            task.resolve(this.response);
        }
    }
}
function uploadFrom(source, config) {
    const resolver = new TransferResolver(config.ftp, config.tracker);
    const fullCommand = `${config.command} ${config.remotePath}`;
    return config.ftp.handle(fullCommand, (res, task) => {
        if (res instanceof Error) {
            resolver.onError(task, res);
        }
        else if (res.code === 150 || res.code === 125) { // Ready to upload
            const dataSocket = config.ftp.dataSocket;
            if (!dataSocket) {
                resolver.onError(task, new Error("Upload should begin but no data connection is available."));
                return;
            }
            // If we are using TLS, we have to wait until the dataSocket issued
            // 'secureConnect'. If this hasn't happened yet, getCipher() returns undefined.
            const canUpload = "getCipher" in dataSocket ? dataSocket.getCipher() !== undefined : true;
            onConditionOrEvent(canUpload, dataSocket, "secureConnect", () => {
                config.ftp.log(`Uploading to ${netUtils_1.describeAddress(dataSocket)} (${netUtils_1.describeTLS(dataSocket)})`);
                resolver.onDataStart(config.remotePath, config.type);
                source.pipe(dataSocket).once("finish", () => {
                    dataSocket.destroy(); // Explicitly close/destroy the socket to signal the end.
                    resolver.onDataDone(task);
                });
            });
        }
        else if (parseControlResponse_1.positiveCompletion(res.code)) { // Transfer complete
            resolver.onControlDone(task, res);
        }
        else if (parseControlResponse_1.positiveIntermediate(res.code)) {
            resolver.onUnexpectedRequest(res);
        }
        // Ignore all other positive preliminary response codes (< 200)
    });
}
exports.uploadFrom = uploadFrom;
function downloadTo(destination, config) {
    if (!config.ftp.dataSocket) {
        throw new Error("Download will be initiated but no data connection is available.");
    }
    // It's possible that data transmission begins before the control socket
    // receives the announcement. Start listening for data immediately.
    config.ftp.dataSocket.pipe(destination);
    const resolver = new TransferResolver(config.ftp, config.tracker);
    return config.ftp.handle(config.command, (res, task) => {
        if (res instanceof Error) {
            resolver.onError(task, res);
        }
        else if (res.code === 150 || res.code === 125) { // Ready to download
            const dataSocket = config.ftp.dataSocket;
            if (!dataSocket) {
                resolver.onError(task, new Error("Download should begin but no data connection is available."));
                return;
            }
            config.ftp.log(`Downloading from ${netUtils_1.describeAddress(dataSocket)} (${netUtils_1.describeTLS(dataSocket)})`);
            resolver.onDataStart(config.remotePath, config.type);
            onConditionOrEvent(isWritableFinished(destination), destination, "finish", () => resolver.onDataDone(task));
        }
        else if (res.code === 350) { // Restarting at startAt.
            config.ftp.send("RETR " + config.remotePath);
        }
        else if (parseControlResponse_1.positiveCompletion(res.code)) { // Transfer complete
            resolver.onControlDone(task, res);
        }
        else if (parseControlResponse_1.positiveIntermediate(res.code)) {
            resolver.onUnexpectedRequest(res);
        }
        // Ignore all other positive preliminary response codes (< 200)
    });
}
exports.downloadTo = downloadTo;
/**
 * Calls a function immediately if a condition is met or subscribes to an event and calls
 * it once the event is emitted.
 *
 * @param condition  The condition to test.
 * @param emitter  The emitter to use if the condition is not met.
 * @param eventName  The event to subscribe to if the condition is not met.
 * @param action  The function to call.
 */
function onConditionOrEvent(condition, emitter, eventName, action) {
    if (condition === true) {
        action();
    }
    else {
        emitter.once(eventName, () => action());
    }
}
/**
 * Detect whether a writable stream is finished, supporting Node 8.
 * From https://github.com/nodejs/node/blob/3e2a3007107b7a100794f4e4adbde19263fc7464/lib/internal/streams/end-of-stream.js#L28-L33
 */
function isWritableFinished(stream) {
    if (stream.writableFinished)
        return true;
    const wState = stream._writableState;
    if (!wState || wState.errored)
        return false;
    return wState.finished || (wState.ended && wState.length === 0);
}


/***/ }),

/***/ 3717:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var concatMap = __webpack_require__(6891);
var balanced = __webpack_require__(9417);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function identity(e) {
  return e;
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length)
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}



/***/ }),

/***/ 6891:
/***/ ((module) => {

module.exports = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ 7117:
/***/ ((module) => {

module.exports = function (glob, opts) {
  if (typeof glob !== 'string') {
    throw new TypeError('Expected a string');
  }

  var str = String(glob);

  // The regexp we are building, as a string.
  var reStr = "";

  // Whether we are matching so called "extended" globs (like bash) and should
  // support single character matching, matching ranges of characters, group
  // matching, etc.
  var extended = opts ? !!opts.extended : false;

  // When globstar is _false_ (default), '/foo/*' is translated a regexp like
  // '^\/foo\/.*$' which will match any string beginning with '/foo/'
  // When globstar is _true_, '/foo/*' is translated to regexp like
  // '^\/foo\/[^/]*$' which will match any string beginning with '/foo/' BUT
  // which does not have a '/' to the right of it.
  // E.g. with '/foo/*' these will match: '/foo/bar', '/foo/bar.txt' but
  // these will not '/foo/bar/baz', '/foo/bar/baz.txt'
  // Lastely, when globstar is _true_, '/foo/**' is equivelant to '/foo/*' when
  // globstar is _false_
  var globstar = opts ? !!opts.globstar : false;

  // If we are doing extended matching, this boolean is true when we are inside
  // a group (eg {*.html,*.js}), and false otherwise.
  var inGroup = false;

  // RegExp flags (eg "i" ) to pass in to RegExp constructor.
  var flags = opts && typeof( opts.flags ) === "string" ? opts.flags : "";

  var c;
  for (var i = 0, len = str.length; i < len; i++) {
    c = str[i];

    switch (c) {
    case "/":
    case "$":
    case "^":
    case "+":
    case ".":
    case "(":
    case ")":
    case "=":
    case "!":
    case "|":
      reStr += "\\" + c;
      break;

    case "?":
      if (extended) {
        reStr += ".";
	    break;
      }

    case "[":
    case "]":
      if (extended) {
        reStr += c;
	    break;
      }

    case "{":
      if (extended) {
        inGroup = true;
	    reStr += "(";
	    break;
      }

    case "}":
      if (extended) {
        inGroup = false;
	    reStr += ")";
	    break;
      }

    case ",":
      if (inGroup) {
        reStr += "|";
	    break;
      }
      reStr += "\\" + c;
      break;

    case "*":
      // Move over all consecutive "*"'s.
      // Also store the previous and next characters
      var prevChar = str[i - 1];
      var starCount = 1;
      while(str[i + 1] === "*") {
        starCount++;
        i++;
      }
      var nextChar = str[i + 1];

      if (!globstar) {
        // globstar is disabled, so treat any number of "*" as one
        reStr += ".*";
      } else {
        // globstar is enabled, so determine if this is a globstar segment
        var isGlobstar = starCount > 1                      // multiple "*"'s
          && (prevChar === "/" || prevChar === undefined)   // from the start of the segment
          && (nextChar === "/" || nextChar === undefined)   // to the end of the segment

        if (isGlobstar) {
          // it's a globstar, so match zero or more path segments
          reStr += "((?:[^/]*(?:\/|$))*)";
          i++; // move over the "/"
        } else {
          // it's not a globstar, so only match one path segment
          reStr += "([^/]*)";
        }
      }
      break;

    default:
      reStr += c;
    }
  }

  // When regexp 'g' flag is specified don't
  // constrain the regular expression with ^ & $
  if (!flags || !~flags.indexOf('g')) {
    reStr = "^" + reStr + "$";
  }

  return new RegExp(reStr, flags);
};


/***/ }),

/***/ 3973:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = { sep: '/' }
try {
  path = __webpack_require__(5622)
} catch (er) {}

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __webpack_require__(3717)

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]'

// * => any number of characters
var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {}
  b = b || {}
  var t = {}
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
}

function minimatch (p, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === '') return p === ''

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}
  pattern = pattern.trim()

  // windows support: need to use /, not \
  if (path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/')
  }

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = console.error

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
  var negate = false
  var options = this.options
  var negateOffset = 0

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options
    } else {
      options = {}
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern

  if (typeof pattern === 'undefined') {
    throw new TypeError('undefined pattern')
  }

  if (options.nobrace ||
    !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  if (pattern.length > 1024 * 64) {
    throw new TypeError('pattern is too long')
  }

  var options = this.options

  // shortcuts
  if (!options.noglobstar && pattern === '**') return GLOBSTAR
  if (pattern === '') return ''

  var re = ''
  var hasMagic = !!options.nocase
  var escaping = false
  // ? => one single character
  var patternListStack = []
  var negativeLists = []
  var stateChar
  var inClass = false
  var reClassStart = -1
  var classStart = -1
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)'
  var self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
        break
        case '?':
          re += qmark
          hasMagic = true
        break
        default:
          re += '\\' + stateChar
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      case '/':
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case '\\':
        clearStateChar()
        escaping = true
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
      continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }

        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close
        if (pl.type === '!') {
          negativeLists.push(pl)
        }
        pl.reEnd = re.length
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        if (inClass) {
          // split where the last [ was, make sure we don't have
          // an invalid re. if so, re-walk the contents of the
          // would-be class to re-translate any characters that
          // were passed through as-is
          // TODO: It would probably be faster to determine this
          // without a try/catch and a new RegExp, but it's tricky
          // to do safely.  For now, this is safe and works.
          var cs = pattern.substring(classStart + 1, i)
          try {
            RegExp('[' + cs + ']')
          } catch (er) {
            // not a valid class!
            var sp = this.parse(cs, SUBPARSE)
            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
            hasMagic = hasMagic || sp[1]
            inClass = false
            continue
          }
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\'
        }

        re += c

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\'
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += '\\\\'
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case '.':
    case '[':
    case '(': addPatternStart = true
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n]

    var nlBefore = re.slice(0, nl.reStart)
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
    var nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1
    var cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
    }
    nlAfter = cleanAfter

    var dollar = ''
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$'
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
    re = newRe
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re
  }

  if (addPatternStart) {
    re = patternStart + re
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (er) {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot
  var flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|')

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$'

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (ex) {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {}
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = match
function match (f, partial) {
  this.debug('match', f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/')
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, 'set', set)

  // Find the basename of the path by looking for the last non-empty segment
  var filename
  var i
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i]
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i]
    var file = f
    if (options.matchBase && pattern.length === 1) {
      file = [filename]
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop')
    var p = pattern[pi]
    var f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
      var pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr)
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr++
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === 'string') {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase()
      } else {
        hit = f === p
      }
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '')
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error('wtf?')
}

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}


/***/ }),

/***/ 4865:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const minimatch = __webpack_require__(3973);
const arrayUnion = __webpack_require__(9600);
const arrayDiffer = __webpack_require__(6554);
const arrify = __webpack_require__(1546);

module.exports = (list, patterns, options = {}) => {
	list = arrify(list);
	patterns = arrify(patterns);

	if (list.length === 0 || patterns.length === 0) {
		return [];
	}

	return patterns.reduce((result, pattern) => {
		let process = arrayUnion;

		if (pattern[0] === '!') {
			pattern = pattern.slice(1);
			process = arrayDiffer;
		}

		return process(result, minimatch.match(list, pattern, options));
	}, []);
};


/***/ }),

/***/ 7816:
/***/ ((module) => {

"use strict";

module.exports = milliseconds => {
	if (typeof milliseconds !== 'number') {
		throw new TypeError('Expected a number');
	}

	const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;

	return {
		days: roundTowardsZero(milliseconds / 86400000),
		hours: roundTowardsZero(milliseconds / 3600000) % 24,
		minutes: roundTowardsZero(milliseconds / 60000) % 60,
		seconds: roundTowardsZero(milliseconds / 1000) % 60,
		milliseconds: roundTowardsZero(milliseconds) % 1000,
		microseconds: roundTowardsZero(milliseconds * 1000) % 1000,
		nanoseconds: roundTowardsZero(milliseconds * 1e6) % 1000
	};
};


/***/ }),

/***/ 5168:
/***/ ((module) => {

"use strict";


const BYTE_UNITS = [
	'B',
	'kB',
	'MB',
	'GB',
	'TB',
	'PB',
	'EB',
	'ZB',
	'YB'
];

const BIBYTE_UNITS = [
	'B',
	'kiB',
	'MiB',
	'GiB',
	'TiB',
	'PiB',
	'EiB',
	'ZiB',
	'YiB'
];

const BIT_UNITS = [
	'b',
	'kbit',
	'Mbit',
	'Gbit',
	'Tbit',
	'Pbit',
	'Ebit',
	'Zbit',
	'Ybit'
];

const BIBIT_UNITS = [
	'b',
	'kibit',
	'Mibit',
	'Gibit',
	'Tibit',
	'Pibit',
	'Eibit',
	'Zibit',
	'Yibit'
];

/*
Formats the given number using `Number#toLocaleString`.
- If locale is a string, the value is expected to be a locale-key (for example: `de`).
- If locale is true, the system default locale is used for translation.
- If no value for locale is specified, the number is returned unmodified.
*/
const toLocaleString = (number, locale) => {
	let result = number;
	if (typeof locale === 'string') {
		result = number.toLocaleString(locale);
	} else if (locale === true) {
		result = number.toLocaleString();
	}

	return result;
};

module.exports = (number, options) => {
	if (!Number.isFinite(number)) {
		throw new TypeError(`Expected a finite number, got ${typeof number}: ${number}`);
	}

	options = Object.assign({bits: false, binary: false}, options);
	const UNITS = options.bits ?
		(options.binary ? BIBIT_UNITS : BIT_UNITS) :
		(options.binary ? BIBYTE_UNITS : BYTE_UNITS);

	if (options.signed && number === 0) {
		return ' 0 ' + UNITS[0];
	}

	const isNegative = number < 0;
	const prefix = isNegative ? '-' : (options.signed ? '+' : '');

	if (isNegative) {
		number = -number;
	}

	if (number < 1) {
		const numberString = toLocaleString(number, options.locale);
		return prefix + numberString + ' ' + UNITS[0];
	}

	const exponent = Math.min(Math.floor(options.binary ? Math.log(number) / Math.log(1024) : Math.log10(number) / 3), UNITS.length - 1);
	// eslint-disable-next-line unicorn/prefer-exponentiation-operator
	number = Number((number / Math.pow(options.binary ? 1024 : 1000, exponent)).toPrecision(3));
	const numberString = toLocaleString(number, options.locale);

	const unit = UNITS[exponent];

	return prefix + numberString + ' ' + unit;
};


/***/ }),

/***/ 1127:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const parseMilliseconds = __webpack_require__(7816);

const pluralize = (word, count) => count === 1 ? word : `${word}s`;

const SECOND_ROUNDING_EPSILON = 0.0000001;

module.exports = (milliseconds, options = {}) => {
	if (!Number.isFinite(milliseconds)) {
		throw new TypeError('Expected a finite number');
	}

	if (options.colonNotation) {
		options.compact = false;
		options.formatSubMilliseconds = false;
		options.separateMilliseconds = false;
		options.verbose = false;
	}

	if (options.compact) {
		options.secondsDecimalDigits = 0;
		options.millisecondsDecimalDigits = 0;
	}

	const result = [];

	const floorDecimals = (value, decimalDigits) => {
		const flooredInterimValue = Math.floor((value * (10 ** decimalDigits)) + SECOND_ROUNDING_EPSILON);
		const flooredValue = Math.round(flooredInterimValue) / (10 ** decimalDigits);
		return flooredValue.toFixed(decimalDigits);
	};

	const add = (value, long, short, valueString) => {
		if ((result.length === 0 || !options.colonNotation) && value === 0 && !(options.colonNotation && short === 'm')) {
			return;
		}

		valueString = (valueString || value || '0').toString();
		let prefix;
		let suffix;
		if (options.colonNotation) {
			prefix = result.length > 0 ? ':' : '';
			suffix = '';
			const wholeDigits = valueString.includes('.') ? valueString.split('.')[0].length : valueString.length;
			const minLength = result.length > 0 ? 2 : 1;
			valueString = '0'.repeat(Math.max(0, minLength - wholeDigits)) + valueString;
		} else {
			prefix = '';
			suffix = options.verbose ? ' ' + pluralize(long, value) : short;
		}

		result.push(prefix + valueString + suffix);
	};

	const parsed = parseMilliseconds(milliseconds);

	add(Math.trunc(parsed.days / 365), 'year', 'y');
	add(parsed.days % 365, 'day', 'd');
	add(parsed.hours, 'hour', 'h');
	add(parsed.minutes, 'minute', 'm');

	if (
		options.separateMilliseconds ||
		options.formatSubMilliseconds ||
		(!options.colonNotation && milliseconds < 1000)
	) {
		add(parsed.seconds, 'second', 's');
		if (options.formatSubMilliseconds) {
			add(parsed.milliseconds, 'millisecond', 'ms');
			add(parsed.microseconds, 'microsecond', 'µs');
			add(parsed.nanoseconds, 'nanosecond', 'ns');
		} else {
			const millisecondsAndBelow =
				parsed.milliseconds +
				(parsed.microseconds / 1000) +
				(parsed.nanoseconds / 1e6);

			const millisecondsDecimalDigits =
				typeof options.millisecondsDecimalDigits === 'number' ?
					options.millisecondsDecimalDigits :
					0;

			const roundedMiliseconds = millisecondsAndBelow >= 1 ?
				Math.round(millisecondsAndBelow) :
				Math.ceil(millisecondsAndBelow);

			const millisecondsString = millisecondsDecimalDigits ?
				millisecondsAndBelow.toFixed(millisecondsDecimalDigits) :
				roundedMiliseconds;

			add(
				Number.parseFloat(millisecondsString, 10),
				'millisecond',
				'ms',
				millisecondsString
			);
		}
	} else {
		const seconds = (milliseconds / 1000) % 60;
		const secondsDecimalDigits =
			typeof options.secondsDecimalDigits === 'number' ?
				options.secondsDecimalDigits :
				1;
		const secondsFixed = floorDecimals(seconds, secondsDecimalDigits);
		const secondsString = options.keepDecimalsOnWholeSeconds ?
			secondsFixed :
			secondsFixed.replace(/\.0+$/, '');
		add(Number.parseFloat(secondsString, 10), 'second', 's', secondsString);
	}

	if (result.length === 0) {
		return '0' + (options.verbose ? ' milliseconds' : 'ms');
	}

	if (options.compact) {
		return result[0];
	}

	if (typeof options.unitCount === 'number') {
		const separator = options.colonNotation ? '' : ' ';
		return result.slice(0, Math.max(options.unitCount, 1)).join(separator);
	}

	return options.colonNotation ? result.join('') : result.join(' ');
};


/***/ }),

/***/ 399:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__webpack_require__(2186));
const ftp_deploy_1 = __webpack_require__(8347);
const parse_1 = __webpack_require__(6089);
async function runDeployment() {
    try {
        const args = {
            server: core.getInput("server", { required: true }),
            username: core.getInput("username", { required: true }),
            password: core.getInput("password", { required: true }),
            port: parse_1.optionalInt("port", core.getInput("port")),
            protocol: parse_1.optionalProtocol("protocol", core.getInput("protocol")),
            "local-dir": parse_1.optionalString(core.getInput("local-dir")),
            "server-dir": parse_1.optionalString(core.getInput("server-dir")),
            "state-name": parse_1.optionalString(core.getInput("state-name")),
            "dry-run": parse_1.optionalBoolean("dry-run", core.getInput("dry-run")),
            "dangerous-clean-slate": parse_1.optionalBoolean("dangerous-clean-slate", core.getInput("dangerous-clean-slate")),
            "exclude": parse_1.optionalStringArray("exclude", core.getInput("exclude")),
            "log-level": parse_1.optionalLogLevel("log-level", core.getInput("log-level")),
            "security": parse_1.optionalSecurity("security", core.getInput("security"))
        };
        await ftp_deploy_1.deploy(args);
    }
    catch (error) {
        core.setFailed(error);
    }
}
runDeployment();


/***/ }),

/***/ 6089:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.optionalStringArray = exports.optionalInt = exports.optionalSecurity = exports.optionalLogLevel = exports.optionalProtocol = exports.optionalBoolean = exports.optionalString = void 0;
function optionalString(rawValue) {
    if (rawValue.length === 0) {
        return undefined;
    }
    return rawValue;
}
exports.optionalString = optionalString;
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
    throw new Error(`${argumentName}: invalid parameter - please use a boolean, you provided "${rawValue}". Try true or false instead.`);
}
exports.optionalBoolean = optionalBoolean;
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
    throw new Error(`${argumentName}: invalid parameter - you provided "${rawValue}". Try "ftp", "ftps", or "ftps-legacy" instead.`);
}
exports.optionalProtocol = optionalProtocol;
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
    throw new Error(`${argumentName}: invalid parameter - you provided "${rawValue}". Try "minimal", "standard", or "verbose" instead.`);
}
exports.optionalLogLevel = optionalLogLevel;
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
    throw new Error(`${argumentName}: invalid parameter - you provided "${rawValue}". Try "loose" or "strict" instead.`);
}
exports.optionalSecurity = optionalSecurity;
function optionalInt(argumentName, rawValue) {
    if (rawValue.length === 0) {
        return undefined;
    }
    const valueAsNumber = parseFloat(rawValue);
    if (Number.isInteger(valueAsNumber)) {
        return valueAsNumber;
    }
    throw new Error(`${argumentName}: invalid parameter - you provided "${rawValue}". Try a whole number (no decimals) instead like 1234`);
}
exports.optionalInt = optionalInt;
function optionalStringArray(argumentName, rawValue) {
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
exports.optionalStringArray = optionalStringArray;


/***/ }),

/***/ 6417:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 1631:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 2413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 4016:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__webpack_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(399);
/******/ })()
;