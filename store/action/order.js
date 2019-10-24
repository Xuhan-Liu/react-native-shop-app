import { createAction } from 'redux-starter-kit'
import Order from '../../models/order'

export const createOrder = createAction('order/create')
export const createOrderAsync = payload => {
  return async (dispatch, getState) => {
    const date = new Date()
    const userId = getState().auth.userId
    const token = getState().auth.token
    try {
      const response = await fetch(`https://react-native-shop-22b2b.firebaseio.com/orders/${userId}.json?auth=${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            items: payload.items,
            totalAmount: payload.totalAmount,
            date: date.toISOString()
          })
        })
      if (!response.ok) {
        const errorMsg = await response.text()
        throw new Error(errorMsg)
      }
      const resData = await response.json()
      payload.id = resData.name
      payload.date = date
      dispatch(createOrder(payload))
    } catch (e) {
      throw e.toString()
    }
  }
}

export const setOrders = createAction('order/set')
export const setOrdersAsync = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId
    const token = getState().auth.token
    try {
      const response = await fetch(`https://react-native-shop-22b2b.firebaseio.com/orders/${userId}.json?auth=${token}`)
      if (!response.ok) {
        const errorMsg = await response.text()
        throw new Error(errorMsg)
      }
      const resData = await response.json()
      const loadedOrders = []
      for (const key in resData) {
        loadedOrders.push(
          new Order(key,
            resData[key].items,
            resData[key].totalAmount,
            new Date(resData[key].date)))
      }
      dispatch(setOrders(loadedOrders))
    } catch (err) {
      throw err.toString()
    }
  }
}
