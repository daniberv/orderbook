import OrderBookStore from '../index'

import { RootStore } from '@/stores'

describe('Orderbook', () => {
	it('return empty asks and bids from empty store', () => {
		const orderBook = OrderBookStore.create({
			displayLimit: 10,
			groupingSize: 0.5,
			sequence: 0,
		})

		expect(Array.isArray(orderBook.asks)).toBe(true)
		expect(Array.isArray(orderBook.bids)).toBe(true)
		expect(orderBook.asks.length).toBe(0)
		expect(orderBook.bids.length).toBe(0)
	})
	it('adds an empty batch', () => {
		const orderBook = OrderBookStore.create({
			displayLimit: 10,
			groupingSize: 0.5,
			sequence: 0,
		})

		orderBook.addBatch({
			timestamp: Date.now(),
			sequence: 1,
			market_id: 'market_id',
			bids: [],
			asks: [],
		})

		expect(Array.isArray(orderBook.asks)).toBe(true)
		expect(Array.isArray(orderBook.bids)).toBe(true)
		expect(orderBook.asks.length).toBe(0)
		expect(orderBook.bids.length).toBe(0)
	})
	it('adds a batch', () => {
		const orderBook = OrderBookStore.create({
			displayLimit: 10,
			groupingSize: 0.5,
			sequence: 0,
		})

		orderBook.addBatch({
			timestamp: Date.now(),
			sequence: 1,
			market_id: 'market_id',
			bids: [
				['1', '1'],
				['2', '2'],
			],
			asks: [
				['0.5', '0.5'],
				['1.5', '0.2'],
			],
		})

		expect(Array.isArray(orderBook.asks)).toBe(true)
		expect(Array.isArray(orderBook.bids)).toBe(true)

		expect(orderBook.asks).toEqual([
			[0.5, 0.5, 0.5, 71.42857142857143],
			[1.5, 0.2, 0.7, 100],
		])
		expect(orderBook.bids).toEqual([
			[2, 2, 2, 66.66666666666666],
			[1, 1, 3, 100],
		])
	})
	it('init asks & bids from the initial response', () => {
		const orderBook = OrderBookStore.create({
			displayLimit: 10,
			groupingSize: 0.5,
			sequence: 0,
		})

		orderBook.init(
			[
				['1', '1'],
				['2', '2'],
			],
			[
				['0.5', '0.5'],
				['1.5', '0.2'],
			]
		)

		expect(Array.isArray(orderBook.asks)).toBe(true)
		expect(Array.isArray(orderBook.bids)).toBe(true)

		expect(orderBook.asks).toEqual([
			[1, 1, 1, 33.33333333333333],
			[2, 2, 3, 100],
		])
		expect(orderBook.bids).toEqual([
			[1.5, 0.2, 0.2, 28.571428571428577],
			[0.5, 0.5, 0.7, 100],
		])
	})
	it('sorts views properly', () => {
		const orderBook = OrderBookStore.create({
			displayLimit: 10,
			groupingSize: 0.5,
			sequence: 0,
		})

		orderBook.addBatch({
			timestamp: Date.now(),
			sequence: 1,
			market_id: 'market_id',
			bids: [
				['1', '1'],
				['2', '2'],
			],
			asks: [
				['0.5', '0.5'],
				['1.5', '0.2'],
			],
		})

		expect(orderBook.getAsks()).toEqual([
			[1.5, 0.2, 0.7, 100],
			[0.5, 0.5, 0.5, 71.42857142857143],
		])
		expect(orderBook.getBids()).toEqual([
			[2, 2, 2, 66.66666666666666],
			[1, 1, 3, 100],
		])
	})
	it('removes zero level from asks', () => {
		const orderBook = OrderBookStore.create({
			displayLimit: 10,
			groupingSize: 0.5,
			sequence: 0,
		})

		orderBook.addBatch({
			timestamp: Date.now(),
			sequence: 1,
			market_id: 'market_id',
			bids: [],
			asks: [
				['0.5', '0.5'],
				['1.5', '0.2'],
			],
		})

		expect(orderBook.getAsks()).toEqual([
			[1.5, 0.2, 0.7, 100],
			[0.5, 0.5, 0.5, 71.42857142857143],
		])

		orderBook.addBatch({
			timestamp: Date.now(),
			sequence: 2,
			market_id: 'market_id',
			bids: [],
			asks: [['0.5', '0']],
		})

		expect(orderBook.getAsks()).toEqual([[1.5, 0.2, 0.2, 100]])
	})
	it('ignores duplicated sequence', () => {
		const orderBook = OrderBookStore.create({
			displayLimit: 10,
			groupingSize: 0.5,
			sequence: 0,
		})

		orderBook.addBatch({
			timestamp: Date.now(),
			sequence: 1,
			market_id: 'market_id',
			bids: [],
			asks: [
				['0.5', '0.5'],
				['1.5', '0.2'],
			],
		})

		expect(orderBook.getAsks()).toEqual([
			[1.5, 0.2, 0.7, 100],
			[0.5, 0.5, 0.5, 71.42857142857143],
		])

		orderBook.addBatch({
			timestamp: Date.now(),
			sequence: 1,
			market_id: 'market_id',
			bids: [],
			asks: [['0.5', '0']],
		})

		expect(orderBook.getAsks()).toEqual([
			[1.5, 0.2, 0.7, 100],
			[0.5, 0.5, 0.5, 71.42857142857143],
		])
	})
	it('fires reconnect event if missing sequence detected', () => {
		const rootStore = RootStore.create({
			connection: {},
			orderbook: {},
		})

		rootStore.orderbook.addBatch({
			timestamp: Date.now(),
			sequence: 1,
			market_id: 'market_id',
			bids: [],
			asks: [],
		})

		expect(rootStore.connection.shouldReconnect).toBeFalsy()

		rootStore.orderbook.addBatch({
			timestamp: Date.now(),
			sequence: 3,
			market_id: 'market_id',
			bids: [],
			asks: [],
		})

		expect(rootStore.connection.shouldReconnect).toBeTruthy()
	})
})
