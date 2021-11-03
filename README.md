# Info (in Pull Request) Checker with regex

A GitHub action that checks that last commit message and pr body match a regex pattern, it also checks if the author is a bot.

## Configuration

More information about `pattern` and `flags` can be found in the
[JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).

`flags` is optional and defaults to `gm`.

### Example Workflow

```yml
name: 'Pull Request Info Check'
on:
  pull_request:
    types:
      - opened
      - edited
      - reopened
      - synchronize

jobs:
  check-info:
    name: Check Info
    runs-on: ubuntu-latest
    steps:
      - name: Get PR info
        id: 'get-pr-info'
        uses: tagenasec/get-pr-info@master
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Check info
        uses: tagenasec/check-pr-info@master
        with:
          body: ${{ steps.get-pr-info.outputs.body }}
          body_pattern: '^((Please describe your change).*)$'
          body_flags: gm
          commits: ${{ steps.get-pr-info.outputs.commits }}
          commits_pattern: ^VL-\d+.*$
          commits_flags: m
          title: ${{ steps.get-pr-info.outputs.title }}
          title_pattern: ^VL-\d+.*$
          title_flags: m
          error: 'Error while checking commits, body and title pattern'
          pre_error: 'Push failed for author, because the following has the wrong pattern:'
          post_error: 'Please check that your commits and title start with `VL-XXX...` and your body request is not in the default form'

          

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

