/**
 * @file Interfaces - IHouse
 * @module pizza-delivery/interfaces/IHouse
 */

import type ILocation from './location.interface'

/**
 * Object representing a house a `DeliveryWorker` has visited.
 */
interface IHouse {
  /**
   * Unique identifier.
   */
  id: string

  /**
   * House location coordinates.
   */
  location: ILocation

  /**
   * Total number of pizzas delivered.
   */
  pizzas: number
}

export default IHouse
