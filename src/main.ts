import * as core from "@actions/core";
import * as inputHelper from "./input-helper";
import * as infoChecker from "./info-checker";

async function run(): Promise<void> {
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
    const authors: string[] = [];
    const snykBot = "snyk-bot";
    const dependabot = "dependabot[bot]";

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
        const errMsg = infoChecker.checkInfoMessages(
          checkerArgumentsCommmit,
          commit.message,
        );
        if (errMsg) {
          failed.push({ message: "commit: " + commit.message });
        }
      }
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

      if (
        failed.length > 0 &&
        !authors.includes(snykBot) &&
        !authors.includes(dependabot)
      ) {
        failed.push({ message: "The authors are: " + authors.toString() });
        failed.push({
          message: "Allowed authors: " + snykBot + ", " + dependabot,
        });
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
