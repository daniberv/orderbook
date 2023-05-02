import { Instance } from 'mobx-state-tree'

import actions from './actions'
import model from './model'
import views from './views'

const Connection = model.views(views).actions(actions)

export interface IConnectionStore extends Instance<typeof Connection> {}

export default Connection
