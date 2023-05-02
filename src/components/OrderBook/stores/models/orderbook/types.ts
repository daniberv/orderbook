export type Tick = [string, string]
export type TickNumbers = [number, number, number?, number?]

export type AsksType = TickNumbers[]
export type BidsType = TickNumbers[]

export type BatchType = {
	timestamp: number
	sequence: number
	market_id: string
	bids: Tick[]
	asks: Tick[]
}

export type BatchTransformedType = {
	timestamp: number
	sequence: number
	market_id: string
	bids: TickNumbers[]
	asks: TickNumbers[]
}

export enum OrderType {
	asks = 'asks',
	bids = 'bids',
}
