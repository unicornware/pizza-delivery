/**
 * @file Unit Tests - Dispatcher
 * @module pizza-delivery/models/tests/unit/Dispatcher
 */

import { MangoFinder } from '@flex-development/mango'
import { DispatchInstruction } from '@pizza-delivery/enums'
import DeliveryWorker from '../delivery-worker.model'
import TestSubject from '../dispatcher.model'

describe('unit:models/Dispatcher', () => {
  describe('constructor', () => {
    const inputs = DispatchInstruction.SOUTH

    let subject: TestSubject
    let worker: DeliveryWorker

    before(() => {
      worker = new DeliveryWorker()
      subject = new TestSubject(inputs, [worker])
    })

    it('should set #houses', () => {
      expect(subject.houses).to.be.instanceof(MangoFinder)
      expect(subject.houses.options.mingo.idKey).to.equal('id')
    })

    it('should set #inputs', () => {
      expect(subject.inputs).to.equal(inputs)
    })

    it('should set #team', () => {
      expect(subject.team).to.be.an('array').of.length(1)
    })
  })

  describe('get visited', () => {
    it('should return array containing IHouse objects', () => {
      // Arrange
      const worker = new DeliveryWorker()
      const inputs = `${DispatchInstruction.SOUTH}${DispatchInstruction.EAST}`
      const subject = new TestSubject(inputs, [worker])

      // Act
      const results = subject.visited

      // Act + Expect
      expect(results).to.be.an('array').of.length(1)
      expect(results[0]!.id).to.equal(worker.location.toString())
    })
  })
})
