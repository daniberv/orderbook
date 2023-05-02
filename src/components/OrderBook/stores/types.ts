import { SnapshotOut } from 'mobx-state-tree'

import { RootStore } from '@/stores'
import type { IConnectionStore } from '@/stores/models/connection'
import type { IOrderBookStore } from '@/stores/models/orderbook'

export interface IRootStore {
	connection: IConnectionStore
	orderbook: IOrderBookStore
}

export interface IRootStoreSnapshotOut extends SnapshotOut<typeof RootStore> {}
