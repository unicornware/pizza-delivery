# Contributing Guide

This document aims to describe the workflows and rules used for developing this
project. This includes, but is not limited to:

- how to contribute code (coding standards, testing, documenting source code)
- how to open new issues
- how pull requests are handled

## Overview

[Getting Started](#getting-started)  
[Contributing Code](#contributing-code)  
[Labels](#labels)  
[Opening Issues](#opening-issues)  
[Pull Requests & Code Reviews](#pull-requests-&-code-reviews)  
[Merge Strategies](#merge-strategies)  
[Releasing](#releasing)

## Getting Started

### Terminology

People interacting with this project are grouped into 4 categories:

- **owner**: organization owners with full admin rights
- **maintainer**: owners and people added to the organization who actively
  contribute to projects and have direct push access
- **contributor**: someone who has helped improve any projects, but does not
  have direct push access
- **user**: developers who use this organization's projects and may or may not
  participate in discussions regarding a given project

A valuable **contribution** is more than implementing new features or fixing
bugs. It includes:

- fixing documentation
- filing bug reports with reproducible steps
- engaging in discussions for new feature requests
- answering questions

### Yarn

This project uses Yarn 2. The Yarn configuration for this project can be found
in [`.yarnrc.yml`](.yarnrc.yml).

If you're already using Yarn globally, see the [Yarn 2 Migration docs][1].

### GitHub Packages

Some workspaces depend on scoped packages (e.g: `@kadeluxe`). Some of those
packages are published to the [GitHub Package Registry][2], but **_not to
NPM_**. A [GitHub personal access token][3] is required for [installation][4].

Scopes, their registry servers, and required environment variables are defined
in [`.yarnrc.yml`](.yarnrc.yml) under the `npmScopes` field.

See [Sourcing Environment Variables](#sourcing-environment-variables) for help
setting up your environment.

### Environment Variables

#### GitHub Actions

Variables are prefixed by `secrets.` in [workflow](.github/workflows/) files.

#### [Yarn 2][5]

| name                  | description                                    |
| --------------------- | ---------------------------------------------- |
| `INIT_CWD`            | Directory from which a script has been invoked |
| `PROJECT_CWD`         | Root project directory                         |
| `npm_package_name`    | Workspace name                                 |
| `npm_package_version` | Workspace version                              |

#### Sourcing Environment Variables

Follow the steps below to autosource environment variables:

1. Open a shell startup file

   - e.g: `~/.bash_profile` `~/.bashrc`, `~/.profile`, `~/.zprofile`,
     `~/.zshenv`, `~/.zshrc`

2. Add the following to your chosen shell startup file:

   ```shell
   [ -f $PWD/.env ] && . $PWD/.env
   [ -f $PWD/.env.local ] && . $PWD/.env.local
   
   export GH_PAT=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    # github personal access token
   export NPM_TOKEN=npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx # npm access token
   ```

   where:

   - `GH_PAT` is a [GitHub personal access token][3] with at least the
     `read:packages` scope
   - `NPM_TOKEN` is a [NPM access token][6] with at least `read-only`
     permissions
   - `PWD` is the path to the repository root

3. Save shell startup file and re-launch shell

### Git Configuration

The examples in this guide contain references to custom Git aliases.

See [`.gitconfig`](.git/config) for an exhausive list of aliases.

### Clone & Install

```zsh
git clone https://github.com/unicornware/pizza-delivery
cd pizza-delivery
yarn
```

Note that if you have a global Yarn configuration (or any `YARN_*` environment
variables set), an error will be displayed in the terminal if any settings
conflict with the project's Yarn configuration, or the Yarn 2 API.

## Contributing Code

[Husky][7] is used to run Git hooks that locally enforce coding and commit
message standards, as well as run tests associated with any files changed since
the last commit.

Any code merged into the [development and production branches](#branching-model)
must confront the following criteria:

- changes should be discussed prior to implementation
- changes have been tested properly
- changes should include documentation updates if applicable
- changes have an associated ticket and pull request

### Branching Model

- Development: `next`
- Production: `main`

### Branch Prefixes

When creating a new branch, the name should match the following format:

```zsh
[prefix]/<TICKET-ID>-<branch_name>
 │           │      │
 │           │      └─⫸ a short, memorable name (possibly the future PR title)
 │           │
 │           └─⫸ check github issue
 │
 └─⫸ bugfix|feat|hotfix|release
```

For example:

```zsh
git chbf 4-authentication
```

will create a new branch titled `feat/4-authentication`.

### Commit Messages

This project follows [Conventional Commit][8] standards and uses [commitlint][9]
to enforce those standards.

This means every commit must conform to the following format:

```zsh
<type>[optional scope]: <description>
 │     │                │
 │     │                └─⫸ summary in present tense; lowercase without period at the end
 │     │
 │     └─⫸ see .commitlintrc.ts
 │
 └─⫸ build|ci|chore|docs|feat|fix|perf|refactor|revert|style|test|wip

[optional body]

[optional footer(s)]
```

`<type>` must be one of the following values:

- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Changes that don't impact external users
- `docs`: Documentation only changes
- `feat`: New features
- `fix`: Bug fixes
- `perf`: Performance improvements
- `refactor`: Code improvements
- `revert`: Revert past changes
- `style`: Changes that do not affect the meaning of the code
- `test`: Adding missing tests or correcting existing tests
- `wip`: Working on changes, but you need to go to bed :wink:

e.g:

- `git docs 'update contributing guide'` -> `docs: update contributing guide`
- `git ac 'refactor(api)!: user queries'` -> `refactor(api)!: user queries`

See [`.commitlintrc.ts`](.commitlintrc.ts) for an exhasutive list of valid
commit scopes and types.

### Code Style

[Prettier][10] is used to format code, and [ESLint][11] to lint files.

#### Prettier Configurations

- [`.prettierrc.cjs`](.prettierrc.cjs)
- [`.prettierignore`](.prettierignore)

#### ESLint Configurations

- [`.eslintrc.base.cjs`](.eslintrc.base.cjs)
- [`.eslintrc.cjs`](.eslintrc.cjs)
- [`.eslintrc.spec.cjs`](.eslintrc.spec.cjs)
- [`.eslintrc.spellcheck.cjs`](.eslintrc.spellcheck.cjs)
- [`.eslintignore`](.eslintignore)

### Making Changes

Source code is located in [`src`](src) directory.

### Documentation

- JavaScript & TypeScript: [JSDoc][12], linted with [`eslint-plugin-jsdoc`][13]

Before making a pull request, be sure your code is well documented, as it will
be part of your code review.

### Testing

This project uses a [Mocha][14] x [Chai][15] workflow.

[Husky](#contributing-code) is configured to run tests before every push. If you
need to create a new issue regarding a test, or need to make a `wip` commit, use
`it.skip` to mark your tests as [pending][16].

#### Running Tests

- run all test suites: `yarn test`
- run all test suites (with live coverage view): `yarn test:coverage`

### Getting Help

If you need help, make note of any issues in their respective files. Whenever
possible, create a test to reproduce the error. Make sure to label your issue as
`type:question` and `status:help-wanted`.

## Labels

This project uses a well-defined list of labels to organize tickets and pull
requests. Most labels are grouped into different categories (identified by the
prefix, eg: `status:`).

A list of labels can be found in [`.github/labels.yml`](.github/labels.yml).

## Opening Issues

Before opening an issue please make sure, you have:

- read the documentation
- searched open issues for an existing issue with the same topic
- search closed issues for a solution or feedback

If you haven't found a related open issue, or feel that a closed issue should be
re-visited, please open a new issue. A well-written issue has the following
traits:

- follows an [issue template](.github/ISSUE_TEMPLATE)
- is [labeled](#labels) appropriately
- contains a well-written summary of the feature, bug, or problem statement
- contains a minimal, inlined code example (if applicable)
- includes links to prior discussions and resources (if you've found any)

## Pull Requests & Code Reviews

When you're ready to have your changes reviewed, open a pull request against the
`next` branch.

Every opened PR should:

- use [**this template**](.github/PULL_REQUEST_TEMPLATE.md)
- reference it's ticket id
- be [labeled](#labels) appropriately
- be assigned to yourself
- give maintainers push access so quick fixes can be pushed to your branch

### Pull Request URL Format

```zsh
https://github.com/unicornware/pizza-delivery/compare/next...<branch>
```

where `<branch>` is the name of the branch you'd like to merge into `next`.

### Code Reviews

All pull requests are subject to code reviews before being merged into `next`
and `main`. Your code will be evaluated against the coding, documentation, and
testing guidelines that have been outlined in this guide, as well as
workspace-specific contributing guides.

If any changes are requested, those changes will need to be implemented and
approved before the pull request is merged.

## Merge Strategies

In every repository, the `create a merge commit` and `squash and merge` options
are enabled.

- if a PR has a single commit, or the changes across commits are logically
  grouped, use `squash and merge`
- if a PR has multiple commits, not logically grouped, `create a merge commit`

When merging, please make sure to use the following commit message format:

```txt
<type>[optional scope]: <pull-request-title> (#pull-request-n)
 │     │                │
 │     │                └─⫸ check your pull request
 │     │
 │     └─⫸ see .commitlintrc.ts
 │
 └─⫸ build|ci|chore|docs|feat|fix|merge|perf|refactor|release|revert|style|test
```

e.g:

- `feat(api): search pagination and caching #52`
- `merge: update contributing guides and tsconfigs #39`
- `release: @acme/sdk@1.0.0 #13`

## Releasing

This repository is configured to publish packages and releases when a
`release/*` branch is merged.

> Note: Publishing is executed via the
> [Continuous Deployment](./.github/workflows/cd.yml) workflow. This is so
> invalid or malicious versions cannot be released without merging those changes
> into `next` first.

Before releasing, the following steps must be completed:

1. Schedule a code freeze
2. Create a new `release/*` branch
   - where `*` is `<package.json#name-no-scope>@<package.json#version>`
     - e.g: `pizza-delivery@1.1.0`
   - branch naming conventions **must be followed exactly**. the branch name is
     used to create distribution tags, locate drafted releases, as well as
     generate the correct build and publish commands
3. Decide what version bump the release needs (major, minor, patch)
   - versioning
     - `yarn release` (determines [bumps based on commits][17])
     - `yarn release --first-release`
     - `yarn release --release-as major`
     - `yarn release --release-as minor`
     - `yarn release --release-as patch`
   - a new release will be drafted
4. Open a new pull request from `release/*` into `next`
   - title the PR `release: <package.json#name>@<package.json#version>`
     - e.g: `release: @unicornware/pizza-delivery@1.1.0`
   - link all issues being released
   - after review, `squash and merge` the PR:
     `release: @unicornware/pizza-delivery@1.1.0 (#pull-request-n)`
     - e.g: `release: @unicornware/pizza-delivery@1.1.0 (#3)`
   - once the PR is merged, the deployment workflow will be triggered
   - the maintainer who approved the PR should check to make sure the workflow
     completes all jobs as expected.
     - if successful, the workflow will:
       - wait for [`ci`](.github/workflows/ci.yml) job to succeed
       - publish package to the [GitHub Package Registry][2]
       - update production branch (merge branch `next` into `main`)
       - publish previously drafted release
       - delete release branch
   - the maintainer who approved the PR should go through linked issues and:
     - make sure all issues are closed and have the label `status:merged`
     - add the `status:released` label to all issues (and PRs)

[1]: https://yarnpkg.com/getting-started/migration
[2]: https://github.com/features/packages
[3]:
  https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
[4]: https://docs.github.com/packages/learn-github-packages/installing-a-package
[5]: https://yarnpkg.com/advanced/lifecycle-scripts#environment-variables
[6]: https://docs.npmjs.com/creating-and-viewing-access-tokens
[7]: https://github.com/typicode/husky
[8]: https://conventionalcommits.org
[9]: https://github.com/conventional-changelog/commitlint
[10]: https://prettier.io
[11]: https://eslint.org
[12]: https://jsdoc.app
[13]: https://github.com/gajus/eslint-plugin-jsdoc
[14]: https://mochajs.org
[15]: https://chaijs.com
[16]: https://mochajs.org/#inclusive-tests
[17]: https://conventionalcommits.org/en/v1.0.0
