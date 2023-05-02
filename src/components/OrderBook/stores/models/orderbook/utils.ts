/**
 * Math and other helpers to prepare, calculate and sort the OrderBook
 *
 * Author: Slava Verba
 * License: unlicensed
 */
import { OrderType } from '@/stores/models/orderbook/types'
import type {
	AsksType,
	BatchTransformedType,
	BatchType,
	BidsType,
	Tick,
	TickNumbers,
} from '@/stores/models/orderbook/types'

/**
 * Converts strings to numbers
 * Example:
 *
 * 		transformTicksToNumber(['1', '1'], ['2', '2']) // [1, 1], [2, 2]
 *
 * @param ticks
 * @returns
 */
export const transformTicksToNumber = (ticks: Tick[]): AsksType | BidsType => {
	let result: AsksType | BidsType = []
	const ticksLen = ticks.length
	for (let i = 0; i < ticksLen; i++)
		result.push([parseFloat(ticks[i][0]), parseFloat(ticks[i][1])])

	return result
}

/**
 * transform batch from a backend response to typed version (string -> number for asks & bids)
 */
export const transformBatch = (batch: BatchType): BatchTransformedType => {
	return {
		...batch,
		asks: transformTicksToNumber(batch.asks),
		bids: transformTicksToNumber(batch.bids),
	}
}

/**
 * Returns the number rounded to the nearest interval.
 * Example:
 *
 *   	roundToNearest(1000.5, 1); // 1000
 *   	roundToNearest(1000.5, 0.5);  // 1000.5
 *
 * @param {number} value    The number to round
 * @param {number} interval The numeric interval to round to
 * @return {number}
 */
export const roundToNearest = (value: number, interval: number) => {
	return Math.floor(value / interval) * interval
}

/**
 * Groups price levels by their price
 * Example:
 *
 *  	groupByPrice([[1000, 100], [1000, 200], [999, 20] ]) // [ [ 1000, 300 ], [ 999, 20 ]]
 *
 * @param levels
 */

export const groupByPrice = (
	levels: AsksType | BidsType
): AsksType | BidsType => {
	let result: AsksType | BidsType = []
	const levelsLen = levels.length
	for (let i = 0; i < levelsLen; i++) {
		const nextLevel = levels[i + 1]
		const prevLevel = levels[i - 1]

		if (nextLevel && levels[i][0] === nextLevel[0]) {
			result.push([levels[i][0], levels[i][1] + nextLevel[1]])
		} else if (!prevLevel || levels[i][0] !== prevLevel[0]) {
			result.push(levels[i])
		}
	}

	return result
}

/**
 * Group price levels by given ticket size. Uses groupByPrice() and roundToNearest()
 * Example:
 *
 * 		groupByTickSize([[1000.5, 100], [1000, 200], [993, 20]], 1) // [[1000, 300], [993, 20]]
 *
 * @param levels
 * @param ticketSize
 */
export const groupByTickSize = (
	levels: AsksType | BidsType,
	tickSize: number
): AsksType | BidsType => {
	let result: AsksType | BidsType = []
	const levelsLen = levels.length
	for (let i = 0; i < levelsLen; i++) {
		result.push([roundToNearest(levels[i][0], tickSize), levels[i][1]])
	}

	return result
}

/**
 * Augments levels with totals
 *
 * @param levels
 * @param type
 * @returns
 */
export const addTotals = (
	levels: AsksType | BidsType,
	type: keyof typeof OrderType
): AsksType | BidsType => {
	let totalSum: number = 0

	const levelsCopy =
		type === OrderType.bids
			? [...levels]
			: [...levels].sort((a, b) => a[0] - b[0])

	const resultLevels = []
	const levelsLen = levelsCopy.length
	for (let i = 0; i < levelsLen; i++) {
		const level = [...levelsCopy[i]]
		const size: number = level[1]!
		totalSum += size
		level[2] = totalSum
		resultLevels.push(level)
	}

	return resultLevels as AsksType | BidsType
}

/**
 * Removes the certain level if is equal to zero
 *
 * @param price
 * @param levels
 * @returns
 */
export const removeLevel = (
	price: number,
	levels: AsksType | BidsType
): AsksType | BidsType => levels.filter((level) => level[0] !== price)

/**
 * If certain level exists - it should be updated. Otherwise insert a new level
 *
 * @param order
 * @param levels
 * @returns
 */
export const insertOrUpdateLevel = (
	level: TickNumbers,
	levels: AsksType | BidsType
): AsksType | BidsType => {
	let resultLevels: AsksType | BidsType = [...levels]

	const hasLevelIndex = levels.findIndex((_level) => _level[0] === level[0])

	if (hasLevelIndex !== -1) resultLevels[hasLevelIndex] = level
	else resultLevels = addLevel(resultLevels, level)

	return resultLevels
}

/**
 * Helper method to keep levels properly sorted by price
 *
 * @param levels
 * @param level
 * @returns
 */
export const addLevel = (
	levels: AsksType | BidsType,
	level: TickNumbers
): AsksType | BidsType => {
	const _levels = [...levels]
	_levels.push(level)
	return _levels.sort((a, b) => b[0] - a[0])
}

/**
 * It updates the levels with the incoming data batch. If newLevel size is 0 that means we should remove this price from the list
 *
 * @param currentLevels
 * @param newLevels
 * @returns
 */
export const updateLevels = (
	currentLevels: AsksType | BidsType,
	newLevels: AsksType | BidsType
): AsksType | BidsType => {
	let resultLevels: AsksType | BidsType = currentLevels

	const newLevelsLen = newLevels.length
	if (newLevelsLen) {
		for (let i = 0; i < newLevelsLen; i++) {
			const price = newLevels[i][0]
			const size = newLevels[i][1]

			if (size === 0) resultLevels = removeLevel(price, resultLevels)
			else resultLevels = insertOrUpdateLevel(newLevels[i], resultLevels)
		}
	}

	return resultLevels
}

/**
 * Gets incremental total sum of orders list
 *
 * @param levels
 * @returns
 */
export const getMaxTotal = (levels: AsksType | BidsType): number => {
	return levels.reduce(
		(acc: number, current: TickNumbers) => acc + current[1],
		0
	)
}

/**
 * Augments levels with depth percentage
 *
 * @param levels
 * @param maxTotal
 * @returns
 */
export const addDepths = (
	levels: AsksType | BidsType,
	maxTotal: number
): AsksType | BidsType => {
	const result: AsksType | BidsType = []

	const newLevelsLen = levels.length
	for (let i = 0; i < newLevelsLen; i++) {
		if (typeof levels[i][3] !== 'undefined') {
			result.push(levels[i])
		} else {
			const calculatedTotal: number = levels[i][2]!
			const depth = (calculatedTotal / maxTotal) * 100
			const updatedLevel: TickNumbers = [...levels[i]]
			updatedLevel[3] = depth
			result.push(updatedLevel)
		}
	}

	return result
}
