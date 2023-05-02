import { StackProps } from '@mui/material'

import { OrderType, TickNumbers } from '@/stores/models/orderbook/types'

export type TableType = {
	rows: TickNumbers[]
	type: OrderType
}

export interface ITable extends StackProps {
	type: keyof typeof OrderType
}
