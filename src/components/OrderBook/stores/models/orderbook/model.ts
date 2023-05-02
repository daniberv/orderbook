import { types as t } from 'mobx-state-tree'

import {
	ORDERBOOK_DISPLAY_LIMIT,
	ORDERBOOK_GROUPING_SIZE,
} from '@/configs/envs'

import type { AsksType, BidsType } from '@/stores/models/orderbook/types'

const OrderBookModel = t.model({
	market: t.maybe(t.string), // assuming we have single market ticket at the time
	displayLimit: t.optional(t.number, ORDERBOOK_DISPLAY_LIMIT), // limit the list size. Can be a param from the outside
	groupingSize: t.optional(t.number, ORDERBOOK_GROUPING_SIZE), // group price level by this value. Can be a param from the outside

	sequence: t.maybeNull(t.number), // last response to validate the freshness of incoming data

	bidsLevels: t.frozen<BidsType>([]),
	bids: t.frozen<AsksType>([]),
	maxTotalBids: t.optional(t.number, 0), // doesn't really need it. Used only for display in UI component

	asksLevels: t.frozen<AsksType>([]),
	asks: t.frozen<AsksType>([]),
	maxTotalAsks: t.optional(t.number, 0), // doesn't really need it. Used only for display in UI component
})

export default OrderBookModel
