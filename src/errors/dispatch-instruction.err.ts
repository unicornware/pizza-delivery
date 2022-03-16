/**
 * @file Errors - DispatchInstructionError
 * @module pizza-delivery/errors/DispatchInstructionError
 */

import Instruction from '@pizza-delivery/enums/dispatch-instruction.enum'

class DispatchInstructionError extends Error {
  /**
   * @public
   * @readonly
   * @property {unknown} instruction - Invalid instruction
   */
  public readonly instruction: unknown

  /**
   * Creates a new dispatch instruction error.
   *
   * @param {unknown} instruction - Invalid instruction
   */
  constructor(instruction: unknown) {
    super(
      ((): string => {
        const keys = Object.keys(Instruction) as (keyof typeof Instruction)[]

        return [
          `Instruction must be one of:`,
          `[${keys.map(key => Instruction[key]).toString()}];`,
          `received ${instruction}`
        ].join(' ')
      })()
    )

    this.name = 'DispatchInstructionError'
    this.instruction = instruction
  }
}

export default DispatchInstructionError
