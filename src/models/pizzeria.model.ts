/**
 * @file Models - Pizzeria
 * @module pizza-delivery/models/Pizzeria
 */

import {
  DocumentPartial,
  MangoSearchParams as SearchParams
} from '@flex-development/mango'
import { IHouse } from '@pizza-delivery/interfaces'
import fs from 'node:fs'
import Dispatcher from './dispatcher.model'

/**
 * Object representing a pizza shop.
 *
 * The pizza shop is run by a dispatcher, who manages a delivery team.
 */
class Pizzeria {
  /**
   * @public
   * @readonly
   * @property {Dispatcher} dispatcher - Current `Dispatcher` on shift
   */
  public readonly dispatcher: Dispatcher

  /**
   * @public
   * @readonly
   * @property {string} orders - {@link dispatcher} `inputs` filename (or path)
   */
  public readonly orders: string

  /**
   * @public
   * @readonly
   * @property {number} workers - Number of workers on shift
   */
  public readonly workers: number

  /**
   * Creates a new pizza shop.
   *
   * @param {string} orders - {@link dispatcher} `inputs` filename (or path)
   * @param {number} [workers=1] - Number of workers on shift
   */
  constructor(orders: string, workers: number = 1) {
    this.dispatcher = new Dispatcher(fs.readFileSync(orders, 'utf8'), workers)
    this.orders = orders
    this.workers = workers
  }

  /**
   * Executes a search against houses {@link dispatcher}'s team has visited.
   *
   * @see https://github.com/flex-development/mango#mango-finder
   *
   * @public
   *
   * @param {SearchParams<IHouse>} [params] - Search parameters
   * @return {DocumentPartial<IHouse>[]} Search results
   */
  public deliveries(params?: SearchParams<IHouse>): DocumentPartial<IHouse>[] {
    return this.dispatcher.report(params)
  }

  /**
   * Runs the pizzeria.
   *
   * Workers will deliver pizzas to houses denoted in the {@link orders} file.
   *
   * @public
   *
   * @return {this} Current pizzeria
   */
  public operate(): this {
    this.dispatcher.dispatch()
    return this
  }
}

export default Pizzeria
