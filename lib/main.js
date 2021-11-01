"use strict";
/*
 * This file is part of the "Body Message Checker" Action for Github.
 *
 * Copyright (C) 2019 by Gilbertsoft LLC (gilbertsoft.org)
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * For the full license information, please read the LICENSE file that
 * was distributed with this source code.
 */
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
/**
 * Imports
 */
const core = __importStar(require("@actions/core"));
const inputHelper = __importStar(require("./input-helper"));
const commitMessageChecker = __importStar(require("./commit-message-checker"));
/**
 * Main function
 */
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const onePassAllPass = core.getInput("one_pass_all_pass");
            //  const commitsString = core.getInput('commits')
            //  const commits = JSON.parse(commitsString)
            const bodyString = core.getInput("body");
            const body = JSON.parse(bodyString);
            const checkerArguments = inputHelper.getInputs();
            const preErrorMsg = core.getInput("pre_error");
            const postErrorMsg = core.getInput("post_error");
            const failed = [];
            inputHelper.checkArgs(checkerArguments);
            let errMsg = commitMessageChecker.checkBodyMessages(checkerArguments, "");
            if (errMsg) {
                failed.push({ message: errMsg });
            }
            if (onePassAllPass === "true" && body.length > failed.length) {
                return;
            }
            if (failed.length > 0) {
                const summary = inputHelper.genOutput(failed, preErrorMsg, postErrorMsg);
                core.setFailed(summary);
            }
        }
        catch (error) {
            core.error("error");
        }
    });
}
/**
 * Main entry point
 */
run();
