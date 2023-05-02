import { IConnectionModel } from './model'

export default (self: IConnectionModel) => ({
	setIsConnected(isConnected: boolean) {
		self.isConnected = isConnected
		self.message = null
	},
	setIsConnecting(isConnecting: boolean) {
		self.isConnecting = isConnecting
	},
	setMessage(message: string) {
		self.message = message
	},
	setShouldReconnect(shouldReconnect: boolean) {
		self.shouldReconnect = shouldReconnect
	},
})
