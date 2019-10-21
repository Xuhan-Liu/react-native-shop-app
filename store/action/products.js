import { createAction } from 'redux-starter-kit'

export default {
  deleteProduct: createAction('product/delete'),
  createProduct: createAction('product/create'),
  updateProduct: createAction('product/update'),
}
