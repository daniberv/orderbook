import { IRootStore } from '.'
import { getRoot } from 'mobx-state-tree'

export function getStore<T>(node: T) {
	return getRoot<IRootStore>(node)
}
