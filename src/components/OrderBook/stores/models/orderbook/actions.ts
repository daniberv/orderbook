import getError from '@/utils/errors'

import { Markets } from '@/configs/markets'

import { IOrderBookModel } from '@/stores/models/orderbook'
import type {
	AsksType,
	BatchTransformedType,
	BatchType,
	BidsType,
	Tick,
} from '@/stores/models/orderbook/types'
import { OrderType } from '@/stores/models/orderbook/types'
import { getStore } from '@/stores/utils'

import {
	addDepths,
	addTotals,
	getMaxTotal,
	groupByTickSize,
	transformBatch,
	transformTicksToNumber,
	updateLevels,
} from './utils'

export default (self: IOrderBookModel) => ({
	setMarket(market: Markets) {
		self.market = market
	},
	init(asks: Tick[], bids: Tick[]) {
		self.sequence = null

		const hasAsks = asks.length
		const hasBids = bids.length

		if (hasAsks)
			this.updateAsksLevels(
				transformTicksToNumber(asks)
					.sort((a, b) => a[0] - b[0])
					.slice(0, self.displayLimit)
			)
		if (hasBids)
			this.updateBidsLevels(
				transformTicksToNumber(bids)
					.sort((a, b) => a[0] - b[0])
					.slice(0, self.displayLimit)
			)
	},
	/**
	 * Every single "pong" from the websocket subscription is a batch
	 * @param batch
	 * @returns
	 */
	addBatch(batch: BatchType) {
		if (self.sequence && batch.sequence === self.sequence) return // duplicating the sequence we've already handled
		if (self.sequence && batch.sequence - self.sequence > 1) {
			console.log(getError(5))
			// Considering this problem caused by websocket transport - simple reconnect should work
			getStore(self).connection.setShouldReconnect(true)
		}

		// transform the data from response to correct types
		const newBatch = transformBatch(batch)

		self.sequence = newBatch.sequence
		this.updateLevelsWithBatch(newBatch)
	},
	/**
	 * Handle batch's data depending on type: asks or bids
	 * @param batch
	 */
	updateLevelsWithBatch(batch: BatchTransformedType) {
		const hasAsks = batch.asks.length
		const hasBids = batch.bids.length

		if (hasAsks) this.updateAsksLevels(batch.asks)
		if (hasBids) this.updateBidsLevels(batch.bids)
	},
	updateAsksLevels(asks: AsksType) {
		// 1. Group incoming asks by levels according to groupingSize
		const groupedByLevels = groupByTickSize(asks, self.groupingSize)

		// 2. Merge it with existing asks (already grouped)
		self.asksLevels = addTotals(
			updateLevels(self.asksLevels, groupedByLevels),
			OrderType.asks
		)
		self.maxTotalAsks = getMaxTotal(self.asksLevels)
		self.asks = addDepths(self.asksLevels, self.maxTotalAsks)
	},
	updateBidsLevels(bids: BidsType) {
		// 1. Group incoming bids by levels according to groupingSize
		const groupedByLevels = groupByTickSize(bids, self.groupingSize)

		// 2. Merge it with existing bids (already grouped)
		self.bidsLevels = addTotals(
			updateLevels(self.bidsLevels, groupedByLevels),
			OrderType.bids
		)
		self.maxTotalBids = getMaxTotal(self.bidsLevels)
		self.bids = addDepths(self.bidsLevels, self.maxTotalBids)
	},
})
