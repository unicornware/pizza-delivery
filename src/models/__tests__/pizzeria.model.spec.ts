/**
 * @file Unit Tests - Pizzeria
 * @module pizza-delivery/models/tests/unit/Pizzeria
 */

import ORDERS from '@fixtures/orders.fixture'
import Dispatcher from '../dispatcher.model'
import TestSubject from '../pizzeria.model'

describe('unit:models/Pizzeria', () => {
  describe('constructor', () => {
    let subject: TestSubject

    before(() => {
      subject = new TestSubject(ORDERS)
    })

    it('should set #dispatcher', () => {
      expect(subject.dispatcher).to.be.instanceof(Dispatcher)
    })

    it('should set #orders', () => {
      expect(subject.orders).to.equal(ORDERS)
    })

    it('should set #workers', () => {
      expect(subject.workers).to.equal(1)
    })
  })
})
