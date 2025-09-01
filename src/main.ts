import * as core from "@actions/core";
import * as inputHelper from "./input-helper";
import * as infoChecker from "./info-checker";

async function run(): Promise<void> {
  try {
    const bodyString = core.getInput("body");
    const titleString = core.getInput("title");
    const checkerArgumentsBody = inputHelper.getBodyInputs();
    const checkerArgumentsTitle = inputHelper.getTitleInputs();
    const preErrorMsg = core.getInput("pre_error");
    const postErrorMsg = core.getInput("post_error");
    const failed = [];

    if (bodyString !== "" && titleString !== "") {
      const bodyJason = JSON.parse(bodyString);
      const titleJason = JSON.parse(titleString);
      for (const { body } of bodyJason) {
        inputHelper.checkArgs(checkerArgumentsBody);
        const errMsg = infoChecker.checkInfoMessages(
          checkerArgumentsBody,
          body,
        );
        // github regex has a problem with "not", so here we do the opposite check from commits.
        if (!errMsg) {
          failed.push({ message: "body: " + body });
        }
      }

      for (const { title } of titleJason) {
        inputHelper.checkArgs(checkerArgumentsTitle);
        const errMsg = infoChecker.checkInfoMessages(
          checkerArgumentsTitle,
          title,
        );
        if (errMsg) {
          failed.push({ message: "title: " + title });
        }
      }

      if (failed.length > 0) {
        const summary = inputHelper.genOutput(
          failed,
          preErrorMsg,
          postErrorMsg,
        );
        core.setFailed(summary);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      core.error(error.message);
    }
  }
}

/**
 * Main entry point
 */
run();
