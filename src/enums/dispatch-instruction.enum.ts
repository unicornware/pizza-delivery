/**
 * @file Enums - DispatchInstruction
 * @module pizza-delivery/enums/DispatchInstruction
 */

/**
 * Maps directions to dispatcher instructions.
 *
 * Instructions are sent to delivery workers, who move in a certain direction
 * based on the instruction. Moves are always **exactly one house** to the north
 * (`^`), south (`v`), east (`>`), or west (`<`).
 *
 * @enum {string}
 */
enum DispatchInstruction {
  EAST = '>',
  NORTH = '^',
  SOUTH = 'v',
  WEST = '<'
}

export default DispatchInstruction
