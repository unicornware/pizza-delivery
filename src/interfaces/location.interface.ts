/**
 * @file Interfaces - ILocation
 * @module pizza-delivery/interfaces/ILocation
 */

import type { Coordinate } from '@pizza-delivery/types'

/**
 * Pair of numbers representing a single point on a two-dimensional grid.
 */
interface ILocation {
  /** x-coordinate. */
  x: Coordinate

  /** y-coordinate. */
  y: Coordinate
}

export default ILocation
