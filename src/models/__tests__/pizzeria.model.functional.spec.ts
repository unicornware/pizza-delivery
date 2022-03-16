/**
 * @file Functional Tests - Pizzeria
 * @module pizza-delivery/models/tests/functional/Pizzeria
 */

import ORDERS from '@fixtures/orders.fixture'
import TestSubject from '../pizzeria.model'

describe('functional:models/Pizzeria', () => {
  describe('#deliveries', () => {
    it('should execute search against visited houses', function (this) {
      // Arrange
      const subject = new TestSubject(ORDERS)
      const spy_dispatcher_report = this.sandbox.spy(
        subject.dispatcher,
        'report'
      )

      // Act
      subject.deliveries()

      // Expect
      expect(spy_dispatcher_report).to.have.been.calledOnce
    })
  })

  describe('#operate', () => {
    it('should send out all deliveries', function (this) {
      // Arrange
      const subject = new TestSubject(ORDERS)
      const spy_dispatcher_dispatch = this.sandbox.spy(
        subject.dispatcher,
        'dispatch'
      )

      // Act
      subject.operate()

      // Expect
      expect(spy_dispatcher_dispatch).to.have.been.calledOnce
    })
  })
})
