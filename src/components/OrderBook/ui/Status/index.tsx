import { observer } from 'mobx-react-lite'
import { FC, memo } from 'react'

import useStoreContext from '@/contexts/store_context'

const Status: FC = observer(() => {
	const {
		connection: { isConnected },
	} = useStoreContext()

	if (isConnected) return null

	return <div>Disconnected</div>
})

export default memo(Status)
