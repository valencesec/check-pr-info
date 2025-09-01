"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBodyInputs = getBodyInputs;
exports.getTitleInputs = getTitleInputs;
exports.checkArgs = checkArgs;
exports.genOutput = genOutput;
/* eslint-disable @typescript-eslint/no-explicit-any */
const core = __importStar(require("@actions/core"));
/**
 * Gets the inputs set by the user and the messages of the event.
 *
 * @returns   ICheckerArguments
 */
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
function genOutput(bodyInfos, preErrorMsg, postErrorMsg) {
    const lines = bodyInfos.map(function (info) {
        return `  ${info.message}   `;
    });
    const errors = `${lines.join("\n")}`;
    return preErrorMsg + "\n\n" + errors + "\n\n" + postErrorMsg;
}
