import type { IOrderBookModel } from '@/stores/models/orderbook'

export default (self: IOrderBookModel) => ({
	getAsks() {
		const asks = [...self.asks]
		return asks.sort((a, b) => b[0] - a[0]).slice(0, self.displayLimit)
	},
	getBids() {
		const bids = [...self.bids]
		return bids.sort((a, b) => b[0] - a[0]).slice(0, self.displayLimit)
	},
})
