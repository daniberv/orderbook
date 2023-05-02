import React, { ReactNode, createContext, useContext } from 'react'

import type { IRootStore } from '@/stores'

interface RootContextType {
	store: IRootStore
	children: ReactNode
}

const StoreContext = createContext<IRootStore>({} as IRootStore)

const StoreProvider = ({ store, children }: RootContextType) => {
	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

const useStoreContext = (): IRootStore => {
	const context = useContext(StoreContext)
	if (!context) throw new Error('Add a context provider')

	return context as IRootStore
}

export { StoreProvider, StoreContext }

export default useStoreContext
