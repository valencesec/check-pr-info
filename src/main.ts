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

/**
 * Imports
 */
import * as core from "@actions/core";
import * as inputHelper from "./input-helper";
import * as bodyMessageChecker from "./body-message-checker";

/**
 * Main function
 */
async function run(): Promise<void> {
  try {
    const onePassAllPass = core.getInput("one_pass_all_pass");
    const bodyString = core.getInput("body");
    const bodyJason = JSON.parse(bodyString);
    const checkerArguments = inputHelper.getInputs();

    const preErrorMsg = core.getInput("pre_error");
    const postErrorMsg = core.getInput("post_error");

    const failed = [];

    for (const {body} of bodyJason) {
      inputHelper.checkArgs(checkerArguments)
      let errMsg = bodyMessageChecker.checkBodyMessages(checkerArguments, body)
      // github regex has a problem with "not", so here we do the opposite check from commits.
      if (!errMsg) {
        failed.push({message: errMsg})
      }
    }

    if (onePassAllPass === "true" && bodyJason.length > failed.length) {
      return;
    }

    if (failed.length > 0) {
      const summary = inputHelper.genOutput(failed, preErrorMsg, postErrorMsg);
      core.setFailed(summary);
    }
  } catch (error) {
      core.error(error.message);
  }
}

/**
 * Main entry point
 */
run();
