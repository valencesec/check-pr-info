# Commit Messages (in Pull Request) Checker with regex

![Version](https://img.shields.io/github/v/release/gsactions/commit-message-checker?style=flat-square)
![Test](https://github.com/gsactions/commit-message-checker/workflows/build-test/badge.svg)

A GitHub action that checks that commit messages match a regex pattern. The
action is able to act on pull request and push events and check the pull
request title and body or the commit message of the commits of a push.

On pull requests the title and body are concatenated delimited by two line
breaks.

Designed to be very flexible in usage: you can split checks into various
workflows, using action types on pull request to listen on, define branches
for pushes etc. etc.

## Configuration

More information about `pattern` and `flags` can be found in the
[JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).

`flags` is optional and defaults to `gm`.

### Example Workflow

```yml
name: 'Commit Message Check'
on:
  pull_request:
    types:
      - opened
      - edited
      - reopened
      - synchronize

jobs:
  check-commit-message:
    name: Check Commit Message
    runs-on: ubuntu-latest
    steps:
      - name: Get PR Commits
        id: 'get-pr-info'
        uses: tagenasec/get-pr-body-and-last-commit@master
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Check body
        uses: yuvalza/commit-message-checker@master
        with:
          body: ${{ steps.get-pr-commits.outputs.body }}
          pattern: '^((Please describe your change).*)$'
          error: ${{ steps.get-pr-commits.outputs.body }}
          flags: gm

```

## Development

### Quick Start

```sh
git clone https://github.com/gsactions/commit-message-checker.git
npm install
npm run build
```

That's it, just start editing the sources...

### Commands

Below is a list of commands you will probably find useful during the development
cycle.

#### `npm run build`

Builds the package to the `lib` folder.

#### `npm run format`

Runs Prettier on .ts and .tsx files and fixes errors.

#### `npm run format-check`

Runs Prettier on .ts and .tsx files without fixing errors.

#### `npm run lint`

Runs Eslint on .ts and .tsx files.

#### `npm run pack`

Bundles the package to the `dist` folder.

#### `npm run all`

Runs all of the above commands.

## License

This project is released under the terms of the [MIT License](LICENSE)
