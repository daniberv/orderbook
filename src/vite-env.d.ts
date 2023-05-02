/// <referencetypes="vite/client" />

interface ImportMetaEnv {
	readonly VITE_WEBSOCKET_JWT: string
	readonly VITE_WEBSOCKET_URL: string
	readonly VITE_WEBSOCKET_RETRIES_PER_URL: number
	readonly VITE_ORDERBOOK_GROUPING_SIZE: number
	readonly VITE_ORDERBOOK_DISPLAY_LIMIT: number
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
