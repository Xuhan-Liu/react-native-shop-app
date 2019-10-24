import { createAction } from 'redux-starter-kit'
import Product from '../../models/product'
import axios from '../../axios-shop'

export const createProductSuccess = createAction('product/create')
export const createProductAsync = payload => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId
    const token = getState().auth.token
    try {
      const response = await fetch(`https://react-native-shop-22b2b.firebaseio.com/products.json?auth${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: payload.title,
            imageUrl: payload.imageUrl,
            description: payload.description,
            price: payload.price,
            ownerId: userId
          })
        })
      const resData = await response.json()
      if (!response.ok) {
        throw new Error(resData.error.message)
      }
      payload.id = resData.name
      payload.ownerId = userId
      dispatch(createProductSuccess(payload))
    } catch (e) {
      throw e.message
    }
  }
}

export const setProducts = createAction('products/set')
export const setProductsAsync = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId
    const token = getState().auth.token
    try {
      // const response = await fetch(`https://react-native-shop-22b2b.firebaseio.com/products.json?auth=${token}`)
      const response = await axios.get('/products.jsons')
      const loadedProducts = []
      const resData = response.data
      for (const key in resData) {
        loadedProducts.push(
          new Product(key, resData[key].ownerId,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price))
      }
      const payload = {
        products: loadedProducts,
        userId: userId
      }
      dispatch(setProducts(payload))
    } catch (e) {
      throw e.message
    }
  }
}

export const deleteProduct = createAction('products/delete')
export const deleteProductsAsync = payload => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    try {
      const response = await fetch(`https://react-native-shop-22b2b.firebaseio.com/products/${payload}.json?auth=${token}`,
        {
          method: 'DELETE'
        })
      const resData = await response.json()
      if (!response.ok) {
        throw new Error(resData.error.message)
      }
      dispatch(deleteProduct(payload))
    } catch (e) {
      throw e.message
    }
  }
}

export const updateProduct = createAction('products/update')
export const updateProductsAsync = payload => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    try {
      const response = await fetch(`https://react-native-shop-22b2b.firebaseio.com/products/${payload.pid}.json?auth=${token}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: payload.title,
            imageUrl: payload.imageUrl,
            description: payload.description,
          })
        })
      const resData = await response.json()
      if (!response.ok) {
        throw new Error(resData.error.message)
      }
      dispatch(updateProduct(payload))
    } catch (e) {
      throw e.message
    }
  }
}
