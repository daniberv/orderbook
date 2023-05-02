import { FC, memo } from 'react'

import { NUMBER_DECIMALS } from '@/configs/envs'

import Styled from './index.styled'
import { TableRowType } from './index.types'

const TableRow: FC<TableRowType> = ({ order, type }) => {
	const price = !isNaN(order[0]) ? order[0].toFixed(NUMBER_DECIMALS) : 0
	const amount = !isNaN(order[1]) ? order[1].toFixed(NUMBER_DECIMALS) : 0
	const total =
		order[2] && !isNaN(order[2]) ? order[2].toFixed(NUMBER_DECIMALS) : 0
	const depth = order[3] && !isNaN(order[3]) ? order[3] : 0

	return (
		<Styled.Row>
			<Styled.Col>
				<Styled.Label type={type}>{price}</Styled.Label>
			</Styled.Col>
			<Styled.Col>{amount}</Styled.Col>
			<Styled.Col>
				{total}
				<Styled.Depth value={depth} type={type} />
			</Styled.Col>
		</Styled.Row>
	)
}

export default memo(TableRow)
