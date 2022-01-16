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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const inputHelper = __importStar(require("./input-helper"));
const infoChecker = __importStar(require("./info-checker"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bodyString = core.getInput("body");
            const commitsString = core.getInput("commits");
            const titleString = core.getInput("title");
            const checkerArgumentsBody = inputHelper.getBodyInputs();
            const checkerArgumentsCommmit = inputHelper.getCommitInputs();
            const checkerArgumentsTitle = inputHelper.getTitleInputs();
            const preErrorMsg = core.getInput("pre_error");
            const postErrorMsg = core.getInput("post_error");
            const failed = [];
            const authors = [];
            const snykBot = 'snyk-bot';
            const dependabot = 'dependabot[bot]';
            if (bodyString !== "" && commitsString !== "" && titleString !== "") {
                const bodyJason = JSON.parse(bodyString);
                const commitsJason = JSON.parse(commitsString);
                const titleJason = JSON.parse(titleString);
                for (const { commit } of commitsJason) {
                    if (!authors.includes(commit.author.name))
                        authors.push(commit.author.name);
                    if (snykBot === commit.author.name || dependabot === commit.author.name)
                        break;
                    inputHelper.checkArgs(checkerArgumentsCommmit);
                    let errMsg = infoChecker.checkInfoMessages(checkerArgumentsCommmit, commit.message);
                    if (errMsg) {
                        failed.push({ message: "commit: " + commit.message });
                    }
                }
                for (const { body } of bodyJason) {
                    inputHelper.checkArgs(checkerArgumentsBody);
                    let errMsg = infoChecker.checkInfoMessages(checkerArgumentsBody, body);
                    // github regex has a problem with "not", so here we do the opposite check from commits.
                    if (!errMsg) {
                        failed.push({ message: "body: " + body });
                    }
                }
                for (const { title } of titleJason) {
                    inputHelper.checkArgs(checkerArgumentsTitle);
                    let errMsg = infoChecker.checkInfoMessages(checkerArgumentsTitle, title);
                    if (errMsg) {
                        failed.push({ message: "title: " + title });
                    }
                }
                if (failed.length > 0 && !authors.includes(snykBot) && !authors.includes(dependabot)) {
                    failed.push({ message: "The authors are: " + authors.toString() });
                    failed.push({ message: "Allowed authors: " + snykBot + ", " + dependabot });
                    const summary = inputHelper.genOutput(failed, preErrorMsg, postErrorMsg);
                    core.setFailed(summary);
                }
            }
        }
        catch (error) {
            if (error instanceof Error) {
                core.error(error.message);
            }
        }
    });
}
/**
 * Main entry point
 */
run();
