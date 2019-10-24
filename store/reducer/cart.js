import { createReducer } from 'redux-starter-kit'
import cartActions from '../action/cart'
import * as orderActions from '../action/order'
import CartItem from '../../models/cart-item'
import * as productActions from '../action/products'

const initialStatus = {
  items: {},
  sum: 0
}

const addItemToCartHandler = (state, action) => {
  const product = action.payload
  if (state.items[product.id]) {
    state.items[product.id] = new CartItem(state.items[product.id].quantity + 1, product.price, product.title,
      state.items[product.id].productPrice * (state.items[product.id].quantity + 1))
  } else {
    state.items[product.id] = new CartItem(1, product.price, product.title, product.price)
  }
  state.sum = state.sum + product.price
}

const deleteCartItemHandler = (state, action) => {
  const productId = action.payload
  const currentQty = state.items[productId].quantity
  const newSum = state.sum - state.items[productId].productPrice
  state.sum = newSum >= 0 ? newSum : 0
  if (currentQty > 1) {
    state.items[productId] = new CartItem(state.items[productId].quantity - 1,
      state.items[productId].productPrice, state.items[productId].productTitle,
      state.items[productId].sum - state.items[productId].productPrice)
  } else {
    delete state.items[productId]
  }
}

const clearCartHandler = (state, action) => {
  state.items = {}
  state.sum = 0
}

function onProductItemDeletedHandler (state, action) {
  if (state.items.hasOwnProperty(action.payload)) {
    state.sum -= state.items[action.payload].sum
    delete state.items[action.payload]
  }
}

const cartReducer = createReducer(initialStatus, {
  [cartActions.addItemToCart]: (state, action) => addItemToCartHandler(state, action),
  [cartActions.deleteCartItem]: (state, action) => deleteCartItemHandler(state, action),
  [orderActions.createOrder]: (state, action) => clearCartHandler(state, action),
  [productActions.deleteProduct]: (state, action) => onProductItemDeletedHandler(state, action),
})

export default cartReducer
