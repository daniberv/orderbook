import type {
	AsksType,
	BatchType,
	Tick,
	TickNumbers,
} from '@/stores/models/orderbook/types'
import { OrderType } from '@/stores/models/orderbook/types'
import {
	addDepths,
	addLevel,
	addTotals,
	getMaxTotal,
	groupByPrice,
	groupByTickSize,
	insertOrUpdateLevel,
	roundToNearest,
	transformBatch,
	transformTicksToNumber,
	updateLevels,
} from '@/stores/models/orderbook/utils'

describe('Orderbook helpers', () => {
	it('#transformBatch', () => {
		const sourceTick: Tick[] = [
			['1', '1'],
			['2', '2'],
		]

		const sourceBatch: BatchType = {
			timestamp: 0,
			sequence: 0,
			market_id: 'market_id',
			bids: sourceTick,
			asks: sourceTick,
		}

		const resultBatch = transformBatch(sourceBatch)
		expect(resultBatch).toEqual({
			timestamp: 0,
			sequence: 0,
			market_id: 'market_id',
			bids: [
				[1, 1],
				[2, 2],
			],
			asks: [
				[1, 1],
				[2, 2],
			],
		})
	})
	it('#transformTicksToNumber', () => {
		const sourceTick: Tick[] = [
			['1', '1'],
			['2', '2'],
		]

		const resultArray = transformTicksToNumber(sourceTick)
		expect(resultArray).toEqual([
			[1, 1],
			[2, 2],
		])
	})
	it('#roundToNearest', () => {
		const sourceLevelA = 1000.5
		const sourceLevelB = 99.6

		const sourceIntervalA = 0.5
		const sourceIntervalB = 1
		const sourceIntervalC = 5

		const resultA = roundToNearest(sourceLevelA, sourceIntervalA)
		const resultB = roundToNearest(sourceLevelA, sourceIntervalB)
		const resultC = roundToNearest(sourceLevelA, sourceIntervalC)

		expect(resultA).toBe(1000.5)
		expect(resultB).toBe(1000)
		expect(resultC).toBe(1000)

		const resultD = roundToNearest(sourceLevelB, sourceIntervalA)
		const resultE = roundToNearest(sourceLevelB, sourceIntervalB)
		const resultF = roundToNearest(sourceLevelB, sourceIntervalC)

		expect(resultD).toBe(99.5)
		expect(resultE).toBe(99)
		expect(resultF).toBe(95)
	})
	it('#groupByPrice', () => {
		const sourceTicks: AsksType | BatchType = [
			[1000, 100],
			[1000, 200],
			[999, 20],
			[55.5, 1],
			[55.5, 0.5],
		]

		const resultSourceTicks = groupByPrice(sourceTicks)

		expect(resultSourceTicks).toEqual([
			[1000, 300],
			[999, 20],
			[55.5, 1.5],
		])
	})
	it('#groupByTicketSize', () => {
		const sourceTicks: AsksType | BatchType = [
			[1000, 300],
			[999, 20],
			[55.5, 1.5],
		]

		const resultTicksA = groupByTickSize(sourceTicks, 0.5)
		const resultTicksB = groupByTickSize(sourceTicks, 1)
		const resultTicksC = groupByTickSize(sourceTicks, 10)

		expect(resultTicksA).toEqual([
			[1000, 300],
			[999, 20],
			[55.5, 1.5],
		])

		expect(resultTicksB).toEqual([
			[1000, 300],
			[999, 20],
			[55, 1.5],
		])

		expect(resultTicksC).toEqual([
			[1000, 300],
			[990, 20],
			[50, 1.5],
		])
	})
	it('#insertOrUpdateLevel', () => {
		const sourceLevels: AsksType | BatchType = [
			[1000, 300],
			[999, 20],
			[55.5, 1.5],
		]

		const sourceTickA: TickNumbers = [1000, 400]
		const sourceTickB: TickNumbers = [998, 100]
		const sourceTickC: TickNumbers = [997, 0]

		const resultLevelsA = insertOrUpdateLevel(sourceTickA, sourceLevels)
		const resultLevelsB = insertOrUpdateLevel(sourceTickB, sourceLevels)
		const resultLevelsC = insertOrUpdateLevel(sourceTickC, sourceLevels)

		expect(resultLevelsA).toEqual([
			[1000, 400],
			[999, 20],
			[55.5, 1.5],
		])

		expect(resultLevelsB).toEqual([
			[1000, 300],
			[999, 20],
			[998, 100],
			[55.5, 1.5],
		])

		expect(resultLevelsC).toEqual([
			[1000, 300],
			[999, 20],
			[997, 0],
			[55.5, 1.5],
		])
	})
	it('#addLevel', () => {
		const sourceLevels: AsksType | BatchType = [
			[1000, 300],
			[999, 20],
			[55.5, 1.5],
		]

		const sourceLevel: TickNumbers = [60, 100]

		const resultLevels = addLevel(sourceLevels, sourceLevel)

		expect(resultLevels).toEqual([
			[1000, 300],
			[999, 20],
			[60, 100],
			[55.5, 1.5],
		])
	})
	it('#updateLevels', () => {
		const sourceLevelsA: AsksType | BatchType = [
			[1000, 300],
			[999, 20],
			[55.5, 1.5],
		]

		const sourceLevelsB: AsksType | BatchType = [
			[1000, 300],
			[999, 0],
			[55.5, 5],
		]

		const resultLevels = updateLevels(sourceLevelsA, sourceLevelsB)

		expect(resultLevels).toEqual([
			[1000, 300],
			[55.5, 5],
		])
	})
	it('#getMaxTotal', () => {
		const sourceLevels: AsksType | BatchType = [
			[1000, 300],
			[999, 20],
			[55.5, 1.5],
		]

		const resultTotal = getMaxTotal(sourceLevels)

		expect(resultTotal).toBe(321.5)
	})
	it('#addDepths', () => {
		const sourceLevels: AsksType | BatchType = [
			[1000, 300],
			[999, 20],
			[55.5, 1.5],
		]

		const sourceMaxTotal = getMaxTotal(sourceLevels)
		const sourceLevelTotals = addTotals(sourceLevels, OrderType.asks)
		const resultItems = addDepths(sourceLevelTotals, sourceMaxTotal)

		expect(sourceLevelTotals).toEqual([
			[55.5, 1.5, 1.5],
			[999, 20, 21.5],
			[1000, 300, 321.5],
		])

		expect(resultItems).toEqual([
			[55.5, 1.5, 1.5, 0.46656298600311047],
			[999, 20, 21.5, 6.6874027993779155],
			[1000, 300, 321.5, 100],
		])
	})
})
