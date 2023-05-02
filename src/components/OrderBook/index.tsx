import { FC } from 'react'

import MainProvider from '@/providers/main'

import { OrderBookType } from './index.types'
import OrderBook from '@/containers'

const OrderBookContainer: FC<OrderBookType> = ({ market }) => {
	return (
		<MainProvider>
			<OrderBook market={market} />
		</MainProvider>
	)
}

export default OrderBookContainer
