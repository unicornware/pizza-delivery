/**
 * @file Mocha Configuration - Base
 * @see https://mochajs.org/#command-line-usage
 * @see https://mochajs.org/#configuration-format
 * @see https://typestrong.org/ts-node/docs/recipes/mocha
 */

/**
 * @type {string}
 * @const {string} PWD - Current working directory
 */
const PWD = process.cwd()

/**
 * @type {string[]}
 * @const {string[]} TYPES - Test file prefixes (e.g: `*spec.ts`)
 */
const TYPES = ['', 'e2e', 'functional', 'integration']

/**
 * @type {Mocha.MochaInstanceOptions}
 * @const config - Configuration object
 */
const config = {
  allowUncaught: false,
  asyncOnly: false,
  bail: false,
  checkLeaks: true,
  color: true,
  diff: true,
  exit: true,
  extension: TYPES.map(type => `${type}.spec.ts`),
  failZero: false,
  files: [],
  forbidOnly: true,
  forbidPending: false,
  fullTrace: true,
  globals: ['chai', 'expect', 'faker', 'pf', 'sandbox'],
  growl: !(require('is-ci') && JSON.parse(process.env.CI ?? 'false')),
  ignore: ['coverage/**', 'node_modules/**'],
  inlineDiffs: true,
  isWorker: true,
  noHighlighting: false,
  nodeOption: [],
  parallel: false,
  recursive: true,
  reporterOptions: [],
  require: [
    'ts-node/register',
    `${PWD}/tools/helpers/tsconfig-paths.cjs`,
    `${PWD}/__tests__/globals/index.ts`,
    `${PWD}/__tests__/config/global-fixtures.ts`,
    `${PWD}/__tests__/config/root-hooks.ts`
  ],
  retries: 0,
  sort: true,
  spec: 'src/{,!(coverage|node_modules)/**}/__tests__/*.spec.ts',
  timeout: 10 * 1000,
  ui: 'bdd',
  watch: false
}

module.exports = config
