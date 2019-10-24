import { createReducer } from 'redux-starter-kit'
import * as orderActions from '../action/order'
import Order from '../../models/order'

const initialStatus = {
  orders: []
}

const addOrderHandler = (state, action) => {
  const { items, totalAmount, id, date } = action.payload
  const newOrder = new Order(id, items, totalAmount, date)
  state.orders.push(newOrder)
}

const setOrdersHandler = (state, action) => {
  console.log(action.payload)
  state.orders = action.payload
}

const orderReducer = createReducer(initialStatus, {
  [orderActions.createOrder]: (state, action) => addOrderHandler(state, action),
  [orderActions.setOrders]: (state, action) => setOrdersHandler(state, action),
})

export default orderReducer
