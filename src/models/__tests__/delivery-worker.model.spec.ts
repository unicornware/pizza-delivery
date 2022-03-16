/**
 * @file Unit Tests - DeliveryWorker
 * @module pizza-delivery/models/tests/unit/DeliveryWorker
 */

import { MangoFinder } from '@flex-development/mango'
import { DispatchInstructionError } from '@pizza-delivery/errors'
import is from '@sindresorhus/is'
import TestSubject from '../delivery-worker.model'
import Location from '../location.model'

describe('unit:models/DeliveryWorker', () => {
  describe('constructor', () => {
    let subject: TestSubject

    before(() => {
      subject = new TestSubject()
    })

    it('should set #deliveries', () => {
      expect(subject.deliveries).to.not.be.undefined
      expect(is(subject.deliveries)).to.equal('Map')
    })

    it('should set #houses', () => {
      expect(subject.houses).to.be.instanceof(MangoFinder)
      expect(subject.houses.options.mingo.idKey).to.equal('id')
    })

    it('should set #location', () => {
      expect(subject.location).to.be.instanceof(Location)
      expect(subject.location.coordinates).to.deep.equal({ x: 0, y: 0 })
    })
  })

  describe('get visited', () => {
    it('should return array containing IHouse objects', () => {
      // Arrange
      const subject = new TestSubject()

      // Act
      const results = subject.visited

      // Expect
      expect(results).to.be.an('array').of.length(1)
      expect(results[0]).to.deep.equal({
        id: subject.location.toString(),
        location: subject.location.coordinates,
        pizzas: 1
      })
    })
  })

  describe('#move', () => {
    it('should throw DispatchInstructionError', () => {
      // Arrange
      const instruction = '🍕'
      let error: DispatchInstructionError

      // Act
      try {
        new TestSubject().move(instruction)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.be.instanceof(DispatchInstructionError)
      expect(error!.instruction).to.equal(instruction)
    })
  })
})
