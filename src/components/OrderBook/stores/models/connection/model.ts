import { Instance, types as t } from 'mobx-state-tree'

const ConnectionModel = t.model({
	shouldReconnect: t.optional(t.boolean, false),
	isConnected: t.optional(t.boolean, false),
	isConnecting: t.optional(t.boolean, false),
	message: t.maybeNull(t.string),
})

export interface IConnectionModel extends Instance<typeof ConnectionModel> {}

export default ConnectionModel
