/**
 * @file Models - Dispatcher
 * @module pizza-delivery/models/Dispatcher
 */

import {
  DocumentPartial,
  MangoSearchParams as SearchParams
} from '@flex-development/mango'
import { Employee } from '@pizza-delivery/abstracts'
import { IHouse } from '@pizza-delivery/interfaces'
import { group } from 'group-items'
import DeliveryWorker from './delivery-worker.model'
import Location from './location.model'

/**
 * Object representing a pizza delivery dispatcher.
 *
 * Dispatchers send moves to delivery workers, who then deliver a pizza at their
 * new location.
 *
 * @extends Employee
 */
class Dispatcher extends Employee {
  /**
   * @public
   * @readonly
   * @property {string} inputs - Dispatcher inputs
   */
  public readonly inputs: string

  /**
   * @public
   * @readonly
   * @property {DeliveryWorker[]} team - Workers on duty
   */
  public readonly team: DeliveryWorker[]

  /**
   * Creates a new delivery dispatcher.
   *
   * @param {string} [inputs=''] - Dispatcher inputs
   * @param {(DeliveryWorker | Location)[] | number} workers - Workers to add to
   * team, new worker starting locations, or number of workers to create
   */
  constructor(
    inputs: string = '',
    workers: (DeliveryWorker | Location)[] | number = []
  ) {
    super()

    this.inputs = inputs.trim()
    this.team = []

    this.recruit(workers)
    this.houses.setCache(this.visited)
  }

  /**
   * Creates a collection representing the houses {@link team} has visited.
   *
   * @public
   *
   * @return {IHouse[]} Array containing visited houses
   */
  public get visited(): IHouse[] {
    // Group visited houses by id, then merge duplicates
    return group(this.team.flatMap(worker => worker.visited))
      .by('id')
      .asArrays()
      .map(houses => {
        if (houses.length === 1) return houses[0]!

        // Merge duplicate houses into a single object
        return houses.reduce((accumulator: IHouse, curr: IHouse): IHouse => {
          return { ...curr, pizzas: accumulator.pizzas + curr.pizzas }
        }, houses[0]!)
      })
  }

  /**
   * Sends out **all** {@link inputs} to {@link team}.
   *
   * @public
   *
   * @return {this} Current dispatcher
   */
  public dispatch(): this {
    // Do nothing is missing inputs or there are no workers to deliver pizzas
    if (!this.inputs || this.team.length === 0) return this

    // Track current worker taking instruction
    let worker_id: number = 0

    // Send out instructions
    for (let pos = 0; pos < this.inputs.length; pos++) {
      this.instruct(this.team[worker_id]!, this.inputs.charAt(pos))

      worker_id++
      if (worker_id >= this.team.length) worker_id = 0
    }

    return this
  }

  /**
   * Sends out a **single** instruction to `worker`.
   *
   * @public
   *
   * @param {DeliveryWorker} worker - Worker to send instruction to
   * @param {string} instruction - Instruction to send
   * @param {number} [pizzas=1] - — Number of pizzas to deliver
   * @return {DeliveryWorker} Worker instruction was sent to
   */
  public instruct(
    worker: DeliveryWorker,
    instruction: string,
    pizzas: number = 1
  ): DeliveryWorker {
    return worker.deliver(instruction, pizzas)
  }

  /**
   * Adds delivery workers to {@link team}.
   *
   * @public
   *
   * @param {(DeliveryWorker | Location)[] | number} workers - Workers to add to
   * team, new worker starting locations, or number of workers to create
   * @return {this} Current dispatcher
   */
  public recruit(workers: (DeliveryWorker | Location)[] | number = []): this {
    let team: DeliveryWorker[] = []

    // If workers is an array, add new workers. Otherwise, create workers
    if (Array.isArray(workers)) {
      team = workers.map((wol: DeliveryWorker | Location) => {
        return wol instanceof DeliveryWorker ? wol : new DeliveryWorker(wol)
      })
    } else for (let w = 0; w < workers; w++) team.push(new DeliveryWorker())

    // Add new workers and return dispatcher
    this.team.push(...team)
    return this
  }

  /**
   * Executes a search against houses {@link team} has visited.
   *
   * @see https://github.com/flex-development/mango#mango-finder
   *
   * @public
   *
   * @param {SearchParams<IHouse>} [params] - Search parameters
   * @return {DocumentPartial<IHouse>[]} Search results
   */
  public report(params?: SearchParams<IHouse>): DocumentPartial<IHouse>[] {
    // Update houses cache
    this.houses.setCache(this.visited)

    // Perform search and return results
    return this.houses.find(params)
  }
}

export default Dispatcher
