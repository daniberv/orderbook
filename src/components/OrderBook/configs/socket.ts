export enum SocketStates {
	connected = 'connected',
	connecting = 'connecting',
	disconnected = 'disconnected',
}

export enum SocketEvents {
	state = 'onSocketStateUpdated',
	received = 'onSocketDataReceived',
}

export enum SubscriptionStates {
	subscribed = 'subscribed',
	subscribing = 'subscribing',
}

export const WEBSOCKET_DEFAULT_OPTIONS = {
	minReconnectDelay: 500,
	maxReconnectDelay: 5000,
	maxServerPingDelay: 5000,
}

export const WEBSOCKET_RETRIES_PER_URL =
	Number(import.meta.env.VITE_WEBSOCKET_RETRIES_PER_URL) || 0 // how many times we considering fail medium. 0 for considering every fail critical
