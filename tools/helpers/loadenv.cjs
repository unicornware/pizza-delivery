#!/usr/bin/env node

/**
 * @file Helpers - loadenv
 * @module tools/helpers/loadenv
 */

const { OrPromise } = require('@flex-development/tutils')
const ch = require('chalk')
const exec = require('child_process').exec
const { config } = require('dotenv-defaults')
const { expand } = require('dotenv-expand')
const fs = require('fs')

/**
 * @typedef LoadEnvOptions
 * @property {string} [defaults='.env.defaults'] - Path to default env file.
 * @property {string} [envs] - List of environments to cascade.
 * @property {boolean} [github] - Update GitHub Actions environment.
 * @property {boolean} [override=true] - Set `process.env.*` (post-parsing).
 * @property {string} [paths='.env'] - List of environment files to load.
 * @property {boolean} [quiet=true] - Enable dotenv debug logs.
 * @property {boolean} [result] - Log result when loading is complete.
 */

/**
 * @typedef {object} LoadEnvResult
 * @property {string} cwd - Directory environment files were loaded from.
 * @property {Record<string, string>} env - Environment object.
 * @property {string[]} files - Array of (relative) file paths that were loaded.
 */

/**
 * Loads environment files.
 *
 * @param {OrPromise<LoadEnvOptions>} options - Loading options
 * @return {Promise<LoadEnvResult>} Environment variable object
 */
const loadenv = async options => {
  const {
    defaults = '.env.defaults',
    envs,
    github = false,
    override = true,
    paths = '.env',
    quiet = true,
    result: print_result = false
  } = await options

  /** @const {string} cwd - Current working directory */
  const cwd = process.cwd()

  /** @const {string[]} env_paths - List of environment files to load */
  let env_paths = paths.split(',').map(env => env.trim())

  // Handle environment cascading
  if (envs) {
    const envsarr = envs.split(',').map(env => env.trim())

    env_paths = env_paths.reduce((accumulator, path) => {
      return [
        ...accumulator,
        ...envsarr.flatMap(env => [`${path}.${env}.local`, `${path}.${env}`])
      ]
    }, [])

    env_paths = [...new Set([...env_paths, '.env.local', '.env']).values()]
  }

  /** @const {Record<string, string>[]} cwd - Parsed environment objects */
  const parsed = []

  /** @const {string[]} files - Loaded environment files */
  const files = []

  // Load environment files (and expand)
  for (const envpath of env_paths) {
    /** @const {string} files - Full path to environment file */
    const path = `${process.cwd()}/${envpath}`

    // Skip environment file if full path doesn't exist
    if (!fs.existsSync(path)) continue

    /** @const {true | undefined} debug - Enable debug logs */
    const debug = quiet ? undefined : true

    parsed.push(expand(config({ debug, defaults, path })).parsed ?? {})
    files.push(envpath)
  }

  /** @const {LoadEnvResult} debug - Result object */
  const result = {
    cwd,
    env: parsed.reduce((acc, obj) => ({ ...acc, ...obj }), {}),
    files
  }

  // Format environment variables
  for (const n of Object.keys(result.env)) result.env[n] = result.env[n].trim()

  // Update GitHub Actions environment
  if (github && process.env.GITHUB_ENV) {
    for (const n of Object.keys(result.env)) {
      exec(`echo "${n}=${result.env[n]}" >> $GITHUB_ENV`)
    }
  }

  // Apply overrides
  if (override) {
    for (const n of Object.keys(result.env)) process.env[n] = result.env[n]
  }

  // Print result
  if (print_result) console.log(ch.gray(require('util').inspect(result)))

  return result
}

exports.default = loadenv
module.exports = loadenv
