import { ThemeProvider } from '@emotion/react'
import type { FC } from 'react'

import { SocketProvider } from '@/contexts/socket_context'
import { StoreProvider } from '@/contexts/store_context'

import type { TypeMainProvider } from './main.types'
import { createStore } from '@/stores'
import theme from '@/theme'

const store = createStore()

const MainProvider: FC<TypeMainProvider> = ({ children }) => {
	return (
		<StoreProvider store={store}>
			<SocketProvider>
				<ThemeProvider theme={theme}>{children}</ThemeProvider>
			</SocketProvider>
		</StoreProvider>
	)
}

export default MainProvider
