import { FC, memo } from 'react'

import Styled from './index.styled'

const Legend: FC = () => {
	return (
		<Styled.Legend>
			<div>Price</div>
			<div>Amount</div>
			<div>Total</div>
		</Styled.Legend>
	)
}

export default memo(Legend)
