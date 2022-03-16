/**
 * @file Unit Tests - Location
 * @module pizza-delivery/models/tests/unit/Location
 */

import type { ObjectPlain } from '@flex-development/tutils'
import type { ILocation } from '@pizza-delivery/interfaces'
import type { Coordinate } from '@pizza-delivery/types'
import is from '@sindresorhus/is'
import type { Testcase } from '@tests/interfaces'
import TestSubject from '../location.model'

describe('unit:models/Location', () => {
  const X: Coordinate = faker.datatype.number()
  const Y: Coordinate = faker.datatype.number()

  describe('constructor', () => {
    let subject: TestSubject

    before(() => {
      subject = new TestSubject(X, Y)
    })

    it('should set #x', () => {
      expect(subject.x).to.equal(X)
    })

    it('should set #y', () => {
      expect(subject.y).to.equal(Y)
    })
  })

  describe('.isCoordinate', () => {
    describe('@return', () => {
      it('should return value if it is a valid number', () => {
        expect(TestSubject.isCoordinate(X)).to.equal(X)
      })
    })

    describe('@throws', () => {
      type Case = {
        type:
          | 'array'
          | 'bigint'
          | 'boolean'
          | 'function'
          | 'NaN'
          | 'null'
          | 'object'
          | 'string'
          | 'symbol'
          | 'undefined'
        value: unknown
      }

      const cases: Case[] = [
        { type: 'NaN', value: Number.NaN },
        { type: 'array', value: [] },
        { type: 'bigint', value: BigInt(9_007_199_254_740_991) },
        { type: 'boolean', value: false },
        { type: 'function', value: sandbox.fake() },
        { type: 'null', value: null },
        { type: 'object', value: {} },
        { type: 'string', value: '🍕🍕🍕' },
        { type: 'symbol', value: Symbol('🍕') },
        { type: 'undefined', value: undefined }
      ]

      cases.forEach(({ value, type }) => {
        it(`should throw if value type is ${type}`, () => {
          // Arrange
          const message = `must be bigint | number; received ${is(value)}`
          let error: TypeError

          // Act
          try {
            TestSubject.isCoordinate(value)
          } catch (e: unknown) {
            error = e as typeof error
          }

          // Act + Expect
          expect(error!.message).to.match(new RegExp(message))
        })
      })
    })
  })

  describe('get coordinates', () => {
    it('should return object containing x and y coordinates', () => {
      expect(new TestSubject(X, Y).coordinates).to.deep.equal({ x: X, y: Y })
    })
  })

  describe('#equals', () => {
    type Case = Testcase<boolean> & {
      obj: ObjectPlain
      self: TestSubject
      state: string | undefined
    }

    const cases: Case[] = [
      {
        expected: false,
        obj: { x: 0, y: 0 },
        self: new TestSubject(0, 0),
        state: 'if obj is not instanceof Location'
      },
      {
        expected: false,
        obj: new TestSubject(4, 2),
        self: new TestSubject(2, 4),
        state: undefined
      },
      {
        expected: true,
        obj: new TestSubject(3, 13),
        self: new TestSubject(3, 13),
        state: undefined
      }
    ]

    cases.forEach(({ expected, obj, self, state }) => {
      state = state ?? `given [[${self.x},${self.y}],[${obj.x},${obj.y}]]`

      it(`should return ${expected} ${state}`, () => {
        expect(self.equals(obj)).to.equal(expected)
      })
    })
  })

  describe('#move', () => {
    type Case = Testcase<ILocation> & {
      do_action: string
      x: ILocation['x'] | undefined
      y: ILocation['y'] | undefined
    }

    const cases: Case[] = [
      {
        do_action: 'add 0 to #x and #y',
        expected: { x: X, y: Y },
        x: undefined,
        y: undefined
      },
      {
        do_action: 'add -1 to #x',
        expected: { x: X + -1, y: Y },
        x: -1,
        y: undefined
      },
      {
        do_action: 'add 3 to #y',
        expected: { x: X, y: Y + 3 },
        x: undefined,
        y: 3
      },
      {
        do_action: 'add 2 to #x and -2 to #y',
        expected: { x: X + 2, y: Y + -2 },
        x: 2,
        y: -2
      }
    ]

    cases.forEach(({ do_action, expected, x, y }) => {
      it(`should ${do_action} given [${x},${y}]`, () => {
        // Arrange
        const subject = new TestSubject(X, Y)

        // Act
        subject.move(x, y)

        // Expect
        expect({ x: subject.x, y: subject.y }).to.deep.equal(expected)
      })
    })
  })

  describe('#toString', () => {
    let subject: TestSubject

    before(() => {
      subject = new TestSubject(X, Y)
    })

    it('should return stringified coordinate pair', () => {
      expect(subject.toString()).to.equal(`[${subject.x},${subject.y}]`)
    })
  })
})
