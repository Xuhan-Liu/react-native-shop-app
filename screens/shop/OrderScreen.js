import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../../components/UI/HeaderButton'
import OrderItem from '../../components/shop/OrderItem'
import * as ordersActions from '../../store/action/order'
import Colors from '../../constant/Colors'

const OrderScreen = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const orders = useSelector(state => state.orders.orders)
  const dispatch = useDispatch()
  useEffect(() => {
    setIsLoading(true)
    setError(null)
    dispatch(ordersActions.setOrdersAsync()).then(() => {
      setIsLoading(false)
    }).catch(err => {
      setError(err)
      setIsLoading(false)
    })
  }, [dispatch])

  if (error) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontFamily: 'open-sans' }}>{error}</Text>
    </View>
  }

  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={Colors.primary}/>
    </View>
  }

  return <FlatList data={orders} keyExtractor={item => item.id}
                   renderItem={itemData => <OrderItem amount={itemData.item.totalAmount}
                                                      items={itemData.item.items}
                                                      date={itemData.item.readableDate}/>}/>

}

OrderScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Your Orders',
    headerLeft: <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item title={'Menu'} iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} onPress={() => {
        navData.navigation.toggleDrawer()
      }}/>
    </HeaderButtons>
  }
}

const styles = StyleSheet.create({})

export default OrderScreen
