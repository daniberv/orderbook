import { styled } from '@mui/system'

import { OrderType } from '@/stores/models/orderbook/types'

import { IDepth, ILabel } from './index.types'

export const Row = styled(`div`)(() => ({
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
}))

export const Col = styled(`div`)(() => ({
	width: '33.3333%',
	position: 'relative',
}))

export const Label = styled(`div`)<ILabel>(({ theme, type }) => ({
	...(type === OrderType.bids
		? {
				color: theme.palette.labels.bidColor,
		  }
		: {
				color: theme.palette.labels.askColor,
		  }),
}))

export const Depth = styled(`div`)<IDepth>(({ theme, value, type }) => ({
	position: 'absolute',
	top: 0,
	bottom: 0,
	left: 0,
	width: value,
	opacity: 0.3,
	...(type === OrderType.bids
		? {
				background: theme.palette.labels.bidColor,
		  }
		: {
				background: theme.palette.labels.askColor,
		  }),
}))

export default {
	Row,
	Col,
	Label,
	Depth,
}
