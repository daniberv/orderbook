import { FC, memo, useEffect } from 'react'

import useStoreContext from '@/contexts/store_context'

import Content from '@/ui/Content'
import Legend from '@/ui/Legend'
import Status from '@/ui/Status'

import { OrderBookType } from '../index.types'

import Styled from './index.styled'

const OrderBook: FC<OrderBookType> = ({ market }) => {
	const {
		orderbook: { setMarket },
	} = useStoreContext()

	useEffect(() => {
		setMarket(market)
	}, [market])

	return (
		<Styled.Container>
			<Legend />
			<Content />
			<Status />
		</Styled.Container>
	)
}

export default memo(OrderBook)
