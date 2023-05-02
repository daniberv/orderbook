import { Container, Stack } from '@mui/material'
import { FC } from 'react'

import OrderBook from './components/OrderBook'
import { Markets } from './components/OrderBook/configs/markets'

const App: FC = () => {
	return (
		<Container maxWidth="sm">
			<Stack alignItems="center" py={5}>
				<OrderBook market={Markets.btcusd} />
			</Stack>
		</Container>
	)
}

export default App
