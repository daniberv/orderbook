import { SocketPrefixes } from '@/configs/prefixes'

export const toChannelFromMarket = (
	type: keyof typeof SocketPrefixes,
	symbol?: string
): string => {
	return `${type}:${symbol}`
}
