/**
 * @file Abstracts - Employee
 * @module pizza-delivery/abstracts/Employee
 */

import {
  DocumentPartial,
  MangoFinder,
  MangoSearchParams as SearchParams
} from '@flex-development/mango'
import { IHouse } from '@pizza-delivery/interfaces'

/**
 * Object representing a pizza shop employee.
 *
 * @abstract
 */
abstract class Employee {
  /**
   * @public
   * @readonly
   * @property {MangoFinder<IHouse>} houses - Visited house query client
   */
  public readonly houses: MangoFinder<IHouse>

  /**
   * Creates a new pizza shop employee.
   */
  constructor() {
    this.houses = new MangoFinder<IHouse>({ mingo: { idKey: 'id' } })
  }

  /**
   * Creates a collection representing houses that have been has visited.
   *
   * @public
   * @abstract
   *
   * @return {IHouse[]} Array containing visited houses
   */
  public abstract get visited(): IHouse[]

  /**
   * Executes a search against houses that have been has visited.
   *
   * @public
   * @abstract
   *
   * @param {SearchParams<IHouse>} [params] - Search parameters
   * @return {DocumentPartial<IHouse>[]} Search results
   */
  public abstract report(
    params?: SearchParams<IHouse>
  ): DocumentPartial<IHouse>[]
}

export default Employee
