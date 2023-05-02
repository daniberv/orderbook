import { Stack } from '@mui/material'
import { styled } from '@mui/system'

import { ORDERBOOK_DISPLAY_LIMIT } from '@/configs/envs'

import { OrderType } from '@/stores/models/orderbook/types'

import { ITable } from './index.types'

const ROW_HEIGHT = 14

export const Table = styled(Stack)<ITable>(({ type }) => ({
	fontSize: 12,
	minHeight: ROW_HEIGHT * ORDERBOOK_DISPLAY_LIMIT,
	...(type === OrderType.asks && {
		justifyContent: 'flex-end',
	}),
}))

export default {
	Table,
}
