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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genOutput = exports.checkArgs = exports.getCommitInputs = exports.getBodyInputs = exports.getTitleInputs =void 0;
/**
 * Imports
 */
const core = __importStar(require("@actions/core"));
/**
 * Gets the inputs set by the user and the messages of the event.
 *
 * @returns   ICheckerArguments
 */
function getCommitInputs() {
    const result = {};
    // Get pattern
    result.pattern = core.getInput("commits_pattern", { required: true });
    // Get flags
    result.flags = core.getInput("commits_flags");
    // Get error message
    result.error = core.getInput("error", { required: true });
    return result;
}

function getBodyInputs() {
    const result = {};
    // Get pattern
    result.pattern = core.getInput("body_pattern", { required: true });
    // Get flags
    result.flags = core.getInput("body_flags");
    // Get error message
    result.error = core.getInput("error", { required: true });
    return result;
}

function getTitleInputs() {
    const result = {};
    // Get pattern
    result.pattern = core.getInput("title_pattern", { required: true });
    // Get flags
    result.flags = core.getInput("title_flags");
    // Get error message
    result.error = core.getInput("error", { required: true });
    return result;
}
exports.getCommitInputs = getCommitInputs;
exports.getBodyInputs = getBodyInputs;
exports.getTitleInputs = getTitleInputs;

function checkArgs(args) {
    // Check arguments
    if (args.pattern.length === 0) {
        throw new Error(`PATTERN not defined.`);
    }
    const regex = new RegExp("[^gimsuy]", "g");
    let invalidChars;
    let chars = "";
    while ((invalidChars = regex.exec(args.flags)) !== null) {
        chars += invalidChars[0];
    }
    if (chars !== "") {
        throw new Error(`FLAGS contains invalid characters "${chars}".`);
    }
    if (args.error.length === 0) {
        throw new Error(`ERROR not defined.`);
    }
}
exports.checkArgs = checkArgs;
function genOutput(bodyInfos, preErrorMsg, postErrorMsg) {
    const lines = bodyInfos.map(function (info) {
        return `  ${info.message}   `;
    });
    const errors = `${lines.join("\n")}`;
    return preErrorMsg + "\n\n" + errors + "\n\n" + postErrorMsg;
}
exports.genOutput = genOutput;
