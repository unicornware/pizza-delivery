#!/usr/bin/env node

/**
 * @file CLI - Load Environment
 * @module tools/cli/loadenv
 */

const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const { LoadEnvOptions } = require('../helpers/loadenv.cjs')
const loadenv = require('../helpers/loadenv.cjs')

/** @const {yargs.Argv<LoadEnvOptions>} args - CLI arguments */
const args = yargs(hideBin(process.argv), process.env.INIT_CWD)
  .usage('$0 [options]')
  .option('defaults', {
    alias: 'd',
    default: '.env.defaults',
    describe: 'name of file containing default environment variables',
    required: false,
    requiresArg: true,
    type: 'string'
  })
  .option('envs', {
    alias: 'e',
    describe: 'comma-delimited list of environments to cascade',
    required: false,
    requiresArg: true,
    type: 'string'
  })
  .option('github', {
    alias: 'g',
    describe: 'update github actions environment',
    required: false,
    type: 'boolean'
  })
  .option('override', {
    alias: 'o',
    default: true,
    describe: 'set process.env.* (post-parsing)',
    required: false,
    type: 'boolean'
  })
  .option('paths', {
    alias: 'p',
    default: '.env',
    describe: 'comma-delimited list of environment files to load',
    required: false,
    requiresArg: true,
    type: 'string'
  })
  .option('quiet', {
    alias: 'q',
    describe: 'enable dotenv debug logs',
    required: false,
    type: 'boolean'
  })
  .option('result', {
    alias: 'r',
    describe: 'log result when loading is complete',
    required: false,
    type: 'boolean'
  })
  .alias('version', 'v')
  .alias('help', 'h')
  .pkgConf('loadenv')
  .wrap(98)

void loadenv(args.argv)
