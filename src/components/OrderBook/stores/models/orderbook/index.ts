import { Instance } from 'mobx-state-tree'

import actions from './actions'
import OrderBookModel from './model'
import views from './views'

const OrderBook = OrderBookModel.views(views).actions(actions)

export interface IOrderBookStore extends Instance<typeof OrderBook> {}

export interface IOrderBookModel extends Instance<typeof OrderBookModel> {}

export default OrderBook
