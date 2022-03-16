/**
 * @file Models - Location
 * @module pizza-delivery/models/Location
 */

import { isNIL, ObjectPlain } from '@flex-development/tutils'
import { ILocation } from '@pizza-delivery/interfaces'
import { Coordinate } from '@pizza-delivery/types'
import is from '@sindresorhus/is'

/**
 * Single point on a two-dimensional grid.
 *
 * @implements {ILocation}
 */
class Location implements ILocation {
  /**
   * @public
   * @property {ILocation['x']} x - x-coordinate
   */
  public x: ILocation['x']

  /**
   * @public
   * @property {ILocation['y']} y - y-coordinate
   */
  public y: ILocation['y']

  /**
   * Creates a new location.
   *
   * @param {ILocation['x']} x - x-coordinate
   * @param {ILocation['y']} y - y-coordinate
   */
  constructor(x: ILocation['x'], y: ILocation['y']) {
    this.x = Location.isCoordinate(x)
    this.y = Location.isCoordinate(y)
  }

  /**
   * Checks if `value` is a valid coordinate.
   *
   * @public
   * @static
   *
   * @param {unknown} value - Value to check
   * @return {Coordinate} `value` if a `typeof` number
   * @throws {TypeError}
   */
  public static isCoordinate(value: unknown): Coordinate {
    if (Number.isNaN(value) || typeof value !== 'number') {
      const type = is(value)
      const message = `Coordinate must be a number; received ${type}`

      throw new TypeError(message)
    }

    return value
  }

  /**
   * Returns the location's coordinates.
   *
   * @public
   *
   * @return {ILocation} Object containing coordinates
   */
  public get coordinates(): ILocation {
    return { x: this.x, y: this.y }
  }

  /**
   * Returns a new `Location` instance with the same coordinates as the current
   * location.
   *
   * @public
   *
   * @return {Location} Copy of current location
   */
  public copy(): Location {
    return new Location(this.x, this.y)
  }

  /**
   * Checks if `obj` and the current location are the same location.
   *
   * @public
   *
   * @param {ObjectPlain} obj - Object to compare
   * @return {boolean} `true` if coordinates are equal, `false` otherwise
   */
  public equals(obj: ObjectPlain): boolean {
    if (!(obj instanceof Location)) return false
    return this.x === obj.x && this.y === obj.y
  }

  /**
   * Updates the location's x and y coordinates by a specified value.
   *
   * @param {ILocation['x']} [x=0] - Units to move x-coordinate
   * @param {ILocation['y']} [y=0] - Units to move y-coordinate
   * @return {this} Current location
   */
  public move(x: ILocation['x'] = 0, y: ILocation['y'] = 0): this {
    if (!isNIL(x)) this.x += Location.isCoordinate(x)
    if (!isNIL(y)) this.y += Location.isCoordinate(y)

    return this
  }

  /**
   * Returns a string representation of the current location.
   *
   * @public
   *
   * @return {string} Stringified coordinate pair
   */
  public toString(): string {
    return `[${this.x},${this.y}]`
  }
}

export default Location
