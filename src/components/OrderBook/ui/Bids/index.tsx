import { observer } from 'mobx-react-lite'
import type { FC } from 'react'

import { OrderType } from '@/stores/models/orderbook/types'

import useStoreContext from '@/contexts/store_context'

import Table from '@/ui/shared/Table'

const Bids: FC = observer(() => {
	const { orderbook } = useStoreContext()

	const bids = orderbook.getBids()

	return <Table type={OrderType.bids} rows={bids} />
})

export default Bids
