import * as core from "@actions/core";
import * as inputHelper from "./input-helper";
import * as infoChecker from "./info-checker";

async function run(): Promise<void> {
  try {
    const infoString = core.getInput("info");
    const checkerArgumentsCommmit = inputHelper.getCommitInputs();
    const checkerArgumentsBody = inputHelper.getBodyInputs();
    const preErrorMsg = core.getInput("pre_error");
    const postErrorMsg = core.getInput("post_error");
    const failed = [];


    if(infoString !== "") {
        const infoJason = JSON.parse(infoString);
        const bot = 'snyk-bot';
        for (const {commit, body, author} of infoJason) {
            if( bot === author)
                break;
            inputHelper.checkArgs(checkerArgumentsCommmit)
            let errMsg = infoChecker.checkInfoMessages(checkerArgumentsCommmit, commit)
            if (errMsg) {
            failed.push({message: errMsg})
            }

            inputHelper.checkArgs(checkerArgumentsBody)
            errMsg = infoChecker.checkInfoMessages(checkerArgumentsBody, body)
            // github regex has a problem with "not", so here we do the opposite check from commits.
            if (!errMsg) {
            failed.push({message: errMsg})
            }
        }
    
        if (infoJason.length > failed.length) {
          return;
        }
    
        if (failed.length > 0) {
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
}

/**
 * Main entry point
 */
run();
