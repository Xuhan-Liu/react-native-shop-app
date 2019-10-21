import { createReducer } from 'redux-starter-kit'
import orderActions from '../action/order'
import Order from '../../models/order'

const initialStatus = {
  orders: []
}

const addOrderHandler = (state, action) => {
  const cartItems = action.payload.items
  const totalAmount = action.payload.totalAmount
  const newOrder = new Order(new Date().toString(), cartItems, totalAmount, new Date())
  state.orders.push(newOrder)
}

const orderReducer = createReducer(initialStatus, {
  [orderActions.addOrder]: (state, action) => addOrderHandler(state, action),
})

export default orderReducer
