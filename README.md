# Info (in Pull Request) Checker with regex

A GitHub action that checks that last commit messages match a regex pattern.

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
        uses: tagenasec/negative-body-message-checker@master
        with:
          body: ${{ steps.get-pr-commits.outputs.body }}
          pattern: '^((Please describe your change).*)$'
          error: 'Please describe your change in the PR's body.'
          flags: gm

```

## Development

### Quick Start

```sh
git clone https://github.com/tagenasec/negative-body-message-checker.git
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
