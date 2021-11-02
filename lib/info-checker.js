"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMessage = exports.checkInfoMessages = void 0;
/**
 * Checks commit messages given by args.
 *
 * @param     args messages, pattern and error message to process.
 * @returns   void
 */
function checkInfoMessages(args, message) {
    if (checkMessage(message, args.pattern, args.flags)) {
        return "";
    }
    else {
        return args.error;
    }
}
exports.checkInfoMessages = checkInfoMessages;
/**
 * Checks the message against the regex pattern.
 *
 * @param     message message to check against the pattern.
 * @param     pattern regex pattern for the check.
 * @returns   boolean
 */
function checkMessage(message, pattern, flags) {
    const regex = new RegExp(pattern, flags);
    return regex.test(message);
}
exports.checkMessage = checkMessage;
