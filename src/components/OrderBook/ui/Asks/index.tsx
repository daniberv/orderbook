import { observer } from 'mobx-react-lite'
import type { FC } from 'react'

import { OrderType } from '@/stores/models/orderbook/types'

import useStoreContext from '@/contexts/store_context'

import Table from '@/ui/shared/Table'

const Asks: FC = observer(() => {
	const { orderbook } = useStoreContext()

	const asks = orderbook.getAsks()

	return <Table type={OrderType.asks} rows={asks} />
})

export default Asks
