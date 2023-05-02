/**
 * Socket Service provides singleton for websocket connection
 */
import { Centrifuge, Subscription, SubscriptionState } from 'centrifuge'

import getError from '@/utils/errors'

import { WEBSOCKET_JWT } from '@/configs/envs'
import {
	SocketStates,
	WEBSOCKET_DEFAULT_OPTIONS,
	WEBSOCKET_RETRIES_PER_URL,
} from '@/configs/socket'
import { WS_URL } from '@/configs/url'

class SocketService {
	private static instance: SocketService | null
	private static url?: string
	private static token?: string
	private static retry: number // current try for a specific url

	public socket: Centrifuge | null
	public subscription?: Subscription // assuming the OrderBook can only have 1 concurrent subscription for demo purpose *

	constructor(token: string, url: string) {
		if (!token) throw new Error(getError(2, `[socket -> constructor]`))

		SocketService.token = token
		SocketService.retry = 0
		SocketService.url = url

		this.socket = null
		this.connect(token, url)
	}

	static getInstance() {
		if (!SocketService.instance) {
			SocketService.instance = new SocketService(WEBSOCKET_JWT, WS_URL)
		}
		return SocketService.instance
	}

	/**
	 *
	 * assuming we have several options of websocket servers
	 *
	 * @param token
	 * @param urls
	 * @returns
	 */
	private connect = (token: string, url: string) => {
		if (!token) throw new Error(getError(0))

		if (
			(this.socket?.state as string) !== SocketStates.connected &&
			(this.socket?.state as string) !== SocketStates.connecting
		) {
			SocketService.retry = 0

			try {
				this.socket = new Centrifuge(url, {
					token,
					...WEBSOCKET_DEFAULT_OPTIONS,
				})

				this.socket.connect()

				this.socket.on('connected', () => {
					SocketService.retry = 0
				})

				// depends on WEBSOCKET_RETRIES_PER_URL we can handle connection fails differently
				this.socket.on('error', (error: string) => {
					SocketService.retry++
					if (
						WEBSOCKET_RETRIES_PER_URL === 0 ||
						(WEBSOCKET_RETRIES_PER_URL !== 0 &&
							SocketService.retry >= WEBSOCKET_RETRIES_PER_URL)
					) {
						SocketService.retry = 0
						console.log(getError(3, `[socket -> connect]`, url!))
						console.log(error)
					}
				})
			} catch (error) {}
		}
	}

	/**
	 * inner method for state handling
	 */
	disconnect() {
		this.removeSubscription()
		this.socket?.disconnect()
		this.socket?.removeAllListeners()
	}

	/**
	 * outer method for destroying the service
	 */
	static flush() {
		SocketService.instance?.disconnect()
		SocketService.instance = null
		this.url = undefined
	}

	/**
	 * Subscribes for a specific market
	 * @param market
	 * @returns Subscription
	 */
	public addSubscription(channel: string): Subscription {
		if (this.hasSubscription()) {
			return this.subscription!
		}

		this.subscription = this.socket?.newSubscription(channel)

		this.subscription?.on('error', (error) => {
			console.log(getError(4, `[socket -> addSubscription]`, channel))
			console.log(error)
		})

		this.subscription?.subscribe()
		return this.subscription!
	}

	/**
	 * removes subscription from the service and Centrifuge
	 */
	private removeSubscription = () => {
		if (!this.socket || !this.hasSubscription()) return

		this.subscription!.unsubscribe()
		this.socket.removeSubscription(this.subscription!)
	}

	/**
	 * returns result where 'subscribing' and 'subscribe' considered as positive
	 * @returns boolean
	 */
	private hasSubscription = (): boolean => {
		return (
			this.subscription?.state === SubscriptionState.Subscribed ||
			this.subscription?.state === SubscriptionState.Subscribing
		)
	}
}

export default SocketService
