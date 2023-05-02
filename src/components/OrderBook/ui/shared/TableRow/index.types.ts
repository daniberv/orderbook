import { BoxProps } from '@mui/material'

import { OrderType, TickNumbers } from '@/stores/models/orderbook/types'

export type TableRowType = {
	order: TickNumbers
	type: OrderType
}

export interface ILabel extends BoxProps {
	type: keyof typeof OrderType
}

export interface IDepth extends BoxProps {
	value: number
	type: keyof typeof OrderType
}
