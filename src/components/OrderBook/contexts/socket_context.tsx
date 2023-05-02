import { Subscription } from 'centrifuge'
import { observer } from 'mobx-react-lite'
import { ReactNode, createContext, useEffect } from 'react'

import SocketService from '@/services/socket'

import { toChannelFromMarket } from '@/utils/stringHelpers'

import { SocketPrefixes } from '@/configs/prefixes'

import useStoreContext from '@/contexts/store_context'

const initialState = {}

const SocketContext = createContext(initialState)

type SocketProviderType = {
	children?: ReactNode
}

const SocketProvider = observer(({ children }: SocketProviderType) => {
	const { connection, orderbook } = useStoreContext()

	const { market } = orderbook
	const { shouldReconnect } = connection

	useEffect(() => {
		if (market && !shouldReconnect) {
			const socketIstance = SocketService.getInstance()
			const marketTicker: string = toChannelFromMarket(
				SocketPrefixes.orderbook,
				market
			)

			const subscription: Subscription =
				socketIstance.addSubscription(marketTicker)

			subscription?.on('subscribed', (response) => {
				orderbook.init(response.data.asks, response.data.bids)
			})

			subscription?.on('publication', (response) => {
				orderbook.addBatch(response.data)
			})

			socketIstance.socket?.on('connected', () => {
				connection.setIsConnected(true)
			})

			socketIstance.socket?.on('error', (error) => {
				connection.setIsConnected(false)
				connection.setMessage(error.error?.message)
			})

			return () => {
				SocketService.flush()
			}
		}
	}, [market, shouldReconnect])

	useEffect(() => {
		if (shouldReconnect) {
			SocketService.flush()
			connection.setShouldReconnect(false)
		}
	}, [shouldReconnect])

	const value = {}

	return (
		<SocketContext.Provider value={value}>{children}</SocketContext.Provider>
	)
})

export { SocketContext, SocketProvider }
