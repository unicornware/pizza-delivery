#!/usr/bin/env ts-node

/**
 * @file Challenge Runner
 * @module pizza-delivery/challenge
 */

import { Pizzeria } from '@unicornware/pizza-delivery'
import ch from 'chalk'
import yargs, { Argv } from 'yargs'
import { hideBin } from 'yargs/helpers'

/** CLI program options */
type ProgramOptions = { inputs?: string; workers?: number }

/** Object containing CLI arguments */
type ProgramArgv = Exclude<Argv<ProgramOptions>['argv'], Promise<any>>

/** @const {ProgramArgv & Required<ProgramOptions>} argv - CLI arguments */
const argv = yargs(hideBin(process.argv), process.cwd())
  .usage('$0 [options]')
  .option('inputs', {
    default: '__fixtures__/dispatcher-inputs.txt',
    describe: 'name of file containing dispatcher inputs',
    type: 'string'
  })
  .option('workers', {
    default: 1,
    describe: 'number of delivery workers on shift',
    type: 'number'
  })
  .alias('help', 'h')
  .wrap(98).argv as ProgramArgv & Required<ProgramOptions>

/**
 * Runs the program.
 *
 * @return {void} Nothing when complete
 */
function main(): void {
  const { inputs, workers } = argv

  // Create new pizzeria
  const pizzeria = new Pizzeria(inputs, workers)

  // Run the shop and query deliveries (visited houses)
  const hq = pizzeria.operate().deliveries({ pizzas: { $gte: 1 } })

  // Build answer
  const answer = [
    `Given the dispatcher inputs in ${ch.bold(inputs)},`,
    `and ${ch.bold.red(workers)} worker${workers === 1 ? '' : 's'},`,
    `${ch.bold.red(hq.length)} house${hq.length === 1 ? '' : 's'}`,
    'will receive at least one pizza.'
  ].join(' ')

  // Print answer to console
  console.log(answer)
}

main()
