import { types as t } from 'mobx-state-tree'

import ConnectionStore from '@/stores/models/connection'
import OrderBookStore from '@/stores/models/orderbook'
import { IRootStore } from '@/stores/types'

export const RootStore = t.model({
	connection: t.optional(ConnectionStore, {}),
	orderbook: t.optional(OrderBookStore, {}),
})

export const createStore = (): IRootStore => {
	return RootStore.create()
}
