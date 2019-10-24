import React, { useState } from 'react'
import { Provider } from 'react-redux'
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'
import ProductsNavigator from './navigation/ShopNavigator'
import { AppLoading } from 'expo'
import * as Font from 'expo-font'
import cartReducer from './store/reducer/cart'
import productsReducer from './store/reducer/products'
import orderReducer from './store/reducer/order'
import thunk from 'redux-thunk'
import authReducer from './store/reducer/auth'

const combinedReducer = {
  products: productsReducer,
  cart: cartReducer,
  orders: orderReducer,
  auth: authReducer
}

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false
})

const store = configureStore({
  reducer: combinedReducer,
  middleware: [...customizedMiddleware, thunk],
})

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  })
}

export default function App () {
  const [fontLoaded, setFontLoaded] = useState(false)
  if (!fontLoaded) {
    return <AppLoading startAsync={fetchFonts} onFinish={() => setFontLoaded(true)}/>
  }
  return <Provider store={store}><ProductsNavigator/></Provider>
}
