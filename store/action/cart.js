import { createAction } from 'redux-starter-kit'

export default {
  addItemToCart: createAction('cart/add_item'),
  deleteCartItem: createAction('cart/delete_item'),
  clearCart: createAction('cart/clear_cart'),
}
