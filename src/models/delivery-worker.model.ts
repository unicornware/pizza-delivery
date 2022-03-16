/**
 * @file Models - DeliveryWorker
 * @module pizza-delivery/models/DeliveryWorker
 */

import {
  DocumentPartial,
  MangoFinder,
  MangoSearchParams as SearchParams
} from '@flex-development/mango'
import { OneOrMany } from '@flex-development/tutils'
import { DispatchInstruction } from '@pizza-delivery/enums'
import { DispatchInstructionError } from '@pizza-delivery/errors'
import { IHouse } from '@pizza-delivery/interfaces'
import { Coordinate, DeliveryMap } from '@pizza-delivery/types'
import Location from './location.model'

/**
 * Object representing a pizza delivery worker.
 *
 * After each move, workers deliver a pizza to the house at their new location.
 */
class DeliveryWorker {
  /**
   * @public
   * @readonly
   * @property {DeliveryMap} deliveries - Delivery map
   */
  public readonly deliveries: DeliveryMap

  /**
   * @public
   * @readonly
   * @property {MangoFinder<IHouse>} houses - House query client
   */
  public readonly houses: MangoFinder<IHouse>

  /**
   * @public
   * @readonly
   * @property {Location} location - Current point on grid
   */
  public readonly location: Location

  /**
   * Creates a new delivery worker.
   *
   * Once instantiated, the worker will start by delivering a pizza to their
   * starting `location`.
   *
   * @param {Location} [location=new Location(0, 0)] - Starting location
   * @param {DeliveryMap} [deliveries=new Map<string, number>()] - Delivery map
   */
  constructor(
    location: Location = new Location(0, 0),
    deliveries: DeliveryMap = new Map<string, number>()
  ) {
    this.deliveries = deliveries
    this.houses = new MangoFinder<IHouse>({ mingo: { idKey: 'id' } })
    this.location = location

    this.handoff(this.location)
    this.houses.setCache(this.visited)
  }

  /**
   * Creates a collection representing the houses the worker has visited.
   *
   * @public
   *
   * @return {IHouse[]} Array containing visited houses
   */
  public get visited(): IHouse[] {
    return [...this.deliveries.entries()].map(([location, pizzas]): IHouse => {
      const coordinates: Coordinate[] = JSON.parse(location)

      return {
        id: location,
        location: { x: coordinates[0]!, y: coordinates[1]! },
        pizzas
      }
    })
  }

  /**
   * Instructs the worker to move and/or handoff a pizza.
   *
   * @public
   *
   * @param {Location | OneOrMany<string>} dispatch - Location or instructions
   * @param {number} [pizzas] - Number of pizzas to deliver
   * @return {this} Current worker
   */
  public deliver(
    dispatch: Location | OneOrMany<string>,
    pizzas?: number
  ): this {
    if (dispatch instanceof Location) return this.handoff(dispatch, pizzas)

    for (const input of [dispatch].flat()) {
      this.move(input).handoff(this.location.copy(), pizzas)
    }

    return this
  }

  /**
   * Marks `location` as having received a pizza delivery.
   *
   * @public
   *
   * @param {Location} location - Location to deliver pizza to
   * @param {number} [delivered=1] - Number of pizzas delivered
   * @return {this} Current worker
   */
  public handoff(location: Location, delivered: number = 1): this {
    const coords = location.toString()
    let pizzas: number = 0

    // If location has already been visited, get # of pizzas already delivered
    if (this.deliveries.has(coords)) pizzas = this.deliveries.get(coords)!

    // Update number of pizzas delivered to location and return current worker
    this.deliveries.set(coords, pizzas + delivered)
    return this
  }

  /**
   * Moves the worker.
   *
   * @see {@link DispatchInstruction}
   *
   * @public
   *
   * @param {string} instruction - Dispatch instruction
   * @param {number} [steps=1] - Number of steps to take to next house
   * @return {this} Current worker
   * @throws {DispatchInstructionError}
   */
  public move(instruction: string, steps: number = 1): this {
    // Determine which house to visit based on dispatcher instruction
    switch (instruction) {
      case DispatchInstruction.EAST:
        this.location.move(steps)
        break
      case DispatchInstruction.NORTH:
        this.location.move(undefined, steps)
        break
      case DispatchInstruction.SOUTH:
        this.location.move(undefined, steps * -1)
        break
      case DispatchInstruction.WEST:
        this.location.move(steps * -1)
        break
      default:
        throw new DispatchInstructionError(instruction)
    }

    return this
  }

  /**
   * Executes a search against the houses the worker has visited.
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

export default DeliveryWorker
