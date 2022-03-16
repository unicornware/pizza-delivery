/**
 * @file Functional Tests - Dispatcher
 * @module pizza-delivery/models/tests/functional/Dispatcher
 */

import type { MangoSearchParams as SearchParams } from '@flex-development/mango'
import { DispatchInstruction } from '@pizza-delivery/enums'
import type { IHouse } from '@pizza-delivery/interfaces'
import type { Testcase } from '@tests/interfaces'
import DeliveryWorker from '../delivery-worker.model'
import TestSubject from '../dispatcher.model'
import Location from '../location.model'

describe('functional:models/Dispatcher', () => {
  describe('constructor', () => {
    it('should add delivery workers to team', () => {
      // Arrange
      const workers = [new DeliveryWorker(), new Location(0, 0)]

      // Act
      const subject = new TestSubject(DispatchInstruction.NORTH, workers)

      // Expect
      expect(subject.team).to.be.an('array').of.length(workers.length)
      expect(subject.team).each(w => w.to.be.instanceof(DeliveryWorker))
    })

    it('should initialize houses cache', () => {
      // Arrange
      const worker = new DeliveryWorker()

      // Act
      const subject = new TestSubject(DispatchInstruction.SOUTH, [worker])

      // Expect
      expect(subject.houses.cache.collection).to.be.an('array').of.length(1)
    })
  })

  describe('#dispatch', () => {
    type Cases = {
      cases: (Testcase<number> & { inputs: string })[]
      workers: 1 | 2
    }

    const suites: Cases[] = [
      {
        cases: [
          { expected: 2, inputs: DispatchInstruction.EAST },
          { expected: 4, inputs: '^>v<' },
          { expected: 2, inputs: '^v^v^v^v^v' }
        ],
        workers: 1
      },
      {
        cases: [
          { expected: 3, inputs: '^v' },
          { expected: 3, inputs: '^>v<' },
          { expected: 11, inputs: '^v^v^v^v^v' }
        ],
        workers: 2
      }
    ]

    suites.forEach(({ cases, workers }) => {
      describe(`with ${workers} worker${workers === 1 ? '' : 's'}`, () => {
        cases.forEach(({ expected, inputs }) => {
          const houses = `${expected} houses`

          it(`should deliver to ${houses} given ${inputs}`, function (this) {
            // Arrange
            const subject = new TestSubject(inputs, workers)
            const spy_instruct = this.sandbox.spy(subject, 'instruct')

            // Act
            subject.dispatch()

            // Expect
            expect(spy_instruct).to.have.callCount(inputs.length)
            expect(subject.visited.length).to.equal(expected)
          })
        })
      })
    })
  })

  describe('#instruct', () => {
    it('should tell worker where to deliver an order', function (this) {
      // Arrange
      const subject = new TestSubject()
      const worker = new DeliveryWorker()
      const instruction = DispatchInstruction.WEST
      const spy_worker_deliver = this.sandbox.spy(worker, 'deliver')
      const pizzas = 13

      // Act
      subject.instruct(worker, instruction, pizzas)

      // Expect
      expect(spy_worker_deliver).to.be.calledOnceWith(instruction, pizzas)
    })
  })

  describe('#recruit', () => {
    describe('workers is DeliveryWorker[]', () => {
      it('should add workers to team', () => {
        // Arrange
        const subject = new TestSubject()
        const workers = [new DeliveryWorker(), new DeliveryWorker()]

        // Act
        subject.recruit(workers)

        // Expect
        expect(subject.team.length).to.equal(workers.length)
      })
    })

    describe('workers is Location[]', () => {
      it('should create new workers and add them to team', () => {
        // Arrange
        const subject = new TestSubject()
        const workers = [new Location(0, 0), new Location(0, 0)]

        // Act
        subject.recruit(workers)

        // Expect
        expect(subject.team.length).to.equal(workers.length)
      })
    })

    describe('workers is number', () => {
      it('should add specified number of workers to team', () => {
        // Arrange
        const subject = new TestSubject()
        const workers = 13

        // Act
        subject.recruit(workers)

        // Expect
        expect(subject.team.length).to.equal(workers)
      })
    })
  })

  describe('#report', () => {
    it('should execute search against visited houses', function (this) {
      // Arrange
      const worker = new DeliveryWorker()
      const params: SearchParams<IHouse> = { pizzas: { $gte: 1 } }
      const subject = new TestSubject(undefined, [worker])
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
