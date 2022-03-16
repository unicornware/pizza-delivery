/**
 * @file Functional Tests - DeliveryWorker
 * @module pizza-delivery/models/tests/functional/DeliveryWorker
 */

import type { MangoSearchParams as SearchParams } from '@flex-development/mango'
import { isNIL } from '@flex-development/tutils'
import { DispatchInstruction } from '@pizza-delivery/enums'
import type { IHouse } from '@pizza-delivery/interfaces'
import type { Testcase } from '@tests/interfaces'
import TestSubject from '../delivery-worker.model'
import Location from '../location.model'

describe('functional:models/DeliveryWorker', () => {
  describe('constructor', () => {
    it('should add starting location to delivery map', () => {
      // Act
      const subject = new TestSubject()
      const location_id = subject.location.toString()

      // Expect
      expect(subject.deliveries.size).to.equal(1)
      expect(subject.deliveries.has(location_id)).to.be.true
      expect(subject.deliveries.get(location_id)).to.equal(1)
    })

    it('should initialize houses cache', () => {
      // Act
      const subject = new TestSubject()

      // Expect
      expect(subject.houses.cache.collection).to.be.an('array').of.length(1)
    })
  })

  describe('#deliver', () => {
    describe('dispatch instanceof Location', () => {
      it('should deliver pizza(s) without moving', function (this) {
        // Arrange
        const subject = new TestSubject()
        const spy_handoff = this.sandbox.spy(subject, 'handoff')
        const spy_move = this.sandbox.spy(subject, 'move')
        const dispatch = new Location(4, 4)
        const pizzas = 2

        // Act
        subject.deliver(dispatch, pizzas)

        // Expect
        expect(spy_move).to.not.be.called
        expect(spy_handoff).to.have.been.calledOnceWith(dispatch, pizzas)
      })
    })

    describe('dispatch is DispatchInstruction', () => {
      type Case = {
        direction: keyof typeof DispatchInstruction
        pizzas: number | undefined
      }

      const cases: Case[] = [
        { direction: 'EAST', pizzas: undefined },
        { direction: 'NORTH', pizzas: 2 },
        { direction: 'SOUTH', pizzas: 3 },
        { direction: 'WEST', pizzas: 4 }
      ]

      cases.forEach(({ direction, pizzas }) => {
        const total = isNIL(pizzas) ? 1 : pizzas
        const deliver = `${total} ${total === 1 ? 'pizza' : 'pizzas'}`

        it(`should move ${direction} and deliver ${deliver}`, function (this) {
          // Arrange
          const subject = new TestSubject()
          const spy_handoff = this.sandbox.spy(subject, 'handoff')
          const spy_move = this.sandbox.spy(subject, 'move')
          const dispatch = DispatchInstruction[direction]
          const location = subject.location

          // Act
          subject.deliver(dispatch, pizzas)

          // Expect
          expect(spy_move).to.have.been.calledOnceWith(dispatch)
          expect(spy_handoff).to.have.been.calledOnceWith(location, pizzas)
        })
      })
    })

    describe('dispatch is DispatchInstruction[]', () => {
      type Case = Testcase<number> & { dispatch: DispatchInstruction[] }

      const cases: Case[] = [
        { dispatch: [DispatchInstruction.EAST], expected: 2 },
        {
          dispatch: [
            DispatchInstruction.NORTH,
            DispatchInstruction.EAST,
            DispatchInstruction.SOUTH,
            DispatchInstruction.WEST
          ],
          expected: 4
        },
        {
          dispatch: [
            DispatchInstruction.NORTH,
            DispatchInstruction.SOUTH,
            DispatchInstruction.NORTH,
            DispatchInstruction.SOUTH,
            DispatchInstruction.NORTH,
            DispatchInstruction.SOUTH,
            DispatchInstruction.NORTH,
            DispatchInstruction.SOUTH,
            DispatchInstruction.NORTH,
            DispatchInstruction.SOUTH
          ],
          expected: 2
        }
      ]

      cases.forEach(({ dispatch, expected }) => {
        const houses = `${expected} houses`
        const instructions = `[${dispatch.toString()}]`

        it(`should deliver pizza to ${houses} given ${instructions}`, () => {
          // Arrange
          const subject = new TestSubject()

          // Act
          subject.deliver(dispatch)

          // Expect
          expect(subject.deliveries.size).to.equal(expected)
        })
      })
    })
  })

  describe('#handoff', () => {
    it('should add new location to delivery map', function (this) {
      // Arrange
      const location = new Location(98, 13)
      const location_id = location.toString()
      const subject = new TestSubject()
      const spy_deliveries_set = this.sandbox.spy(subject.deliveries, 'set')

      // Act
      subject.handoff(location)

      // Expect
      expect(subject.deliveries.size).to.equal(2)
      expect(spy_deliveries_set).to.have.been.calledOnceWith(location_id, 1)
    })

    it('should update existing location in delivery map', function (this) {
      // Arrange
      const subject = new TestSubject()
      const location_id = subject.location.toString()
      const spy_deliveries_set = this.sandbox.spy(subject.deliveries, 'set')

      // Act
      subject.handoff(subject.location)

      // Expect
      expect(subject.deliveries.size).to.equal(1)
      expect(spy_deliveries_set).to.have.been.calledOnceWith(location_id, 2)
    })
  })

  describe('#move', () => {
    type Case = Testcase<Parameters<TestSubject['location']['move']>> & {
      direction: keyof typeof DispatchInstruction
      steps: number | undefined
    }

    const cases: Case[] = [
      { direction: 'EAST', expected: [1], steps: undefined },
      { direction: 'NORTH', expected: [undefined, 2], steps: 2 },
      { direction: 'SOUTH', expected: [undefined, -3], steps: 3 },
      { direction: 'WEST', expected: [-4], steps: 4 }
    ]

    cases.forEach(({ direction, expected, steps }) => {
      const total = isNIL(steps) ? 1 : steps
      const units = `${total} ${total === 1 ? 'step' : 'steps'}`

      it(`should move ${direction} ${units}`, function (this) {
        // Arrange
        const subject = new TestSubject()
        const spy_move = this.sandbox.spy(subject.location, 'move')

        // Act
        subject.move(DispatchInstruction[direction], steps)

        // Expect
        expect(spy_move).to.have.been.calledOnceWith(...expected)
      })
    })
  })

  describe('#report', () => {
    it('should execute search against visited houses', function (this) {
      // Arrange
      const params: SearchParams<IHouse> = { pizzas: { $gte: 2 } }
      const subject = new TestSubject()
      const spy_houses_find = this.sandbox.spy(subject.houses, 'find')
      const spy_houses_setCache = this.sandbox.spy(subject.houses, 'setCache')

      // Act
      subject.report(params)

      // Expect
      expect(spy_houses_setCache).to.have.been.calledOnceWith(subject.visited)
      expect(spy_houses_find).to.have.been.calledOnceWith(params)
    })
  })
})
