import { createReducer } from 'redux-starter-kit'
import PRODUCTS from '../../constant/dummy-data'
import productActions from '../action/products'
import Product from '../../models/product'

const initialStatus = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter(prd => prd.ownerId === 'u1')
}

const deleteProductHandler = (state, action) => {
  state.userProducts = state.userProducts.filter(prd => prd.id !== action.payload)
  state.availableProducts = state.availableProducts.filter(prd => prd.id !== action.payload)
}

const createProductHandler = (state, action) => {
  const newProduct = new Product(new Date().toString(), 'u1', action.payload.title,
    action.payload.imageUrl, action.payload.description, action.payload.price)
  state.availableProducts.push(newProduct)
  state.userProducts.push(newProduct)
}

const updateProductHandler = (state, action) => {
  const productIndex = state.userProducts.findIndex(prod => prod.id === action.payload.pid)
  const updatedProduct = new Product(action.payload.pid, state.userProducts[productIndex].ownerId,
    action.payload.title, action.payload.imageUrl, action.payload.description, state.userProducts[productIndex].price)
  state.userProducts[productIndex] = updatedProduct
  const availableProductIndex = state.availableProducts.findIndex(prod => prod.id === action.payload.pid)
  state.availableProducts[availableProductIndex] = updatedProduct
}

const productsReducer = createReducer(initialStatus, {
  [productActions.deleteProduct]: (state, action) => deleteProductHandler(state, action),
  [productActions.createProduct]: (state, action) => createProductHandler(state, action),
  [productActions.updateProduct]: (state, action) => updateProductHandler(state, action),
})

export default productsReducer
