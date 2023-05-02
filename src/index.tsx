import React from 'react'
import ReactDOM from 'react-dom/client'

import MainProvider from '@/components/OrderBook/providers/main'

import App from './App'
import Logger from './logger'

// dev only logging for debugging purpose
Logger()

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)
