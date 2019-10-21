import React from 'react'
import { FlatList, Platform, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../../components/UI/HeaderButton'
import OrderItem from '../../components/shop/OrderItem'

const OrderScreen = props => {
  const orders = useSelector(state => state.orders.orders)
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
