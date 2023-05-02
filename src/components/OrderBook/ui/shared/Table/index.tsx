import { FC, memo } from 'react'

import TableRow from '@/ui/shared/TableRow'

import Styled from './index.styled'
import type { TableType } from './index.types'

const Table: FC<TableType> = ({ rows, type }) => {
	return (
		<Styled.Table type={type}>
			{rows.map((row) => (
				<TableRow order={row} type={type} key={row[0]} />
			))}
		</Styled.Table>
	)
}

export default memo(Table)
