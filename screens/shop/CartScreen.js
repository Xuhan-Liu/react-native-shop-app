import React from 'react'
import { Button, FlatList, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Colors from '../../constant/Colors'
import CartItem from '../../components/shop/CartItem'
import cartActions from '../../store/action/cart'
import orderActions from '../../store/action/order'
import OrderScreen from './OrderScreen'
import Card from '../../components/UI/Card'

const CartScreen = props => {
  const dispatch = useDispatch()
  const cartTotalAmount = useSelector(state => state.cart.sum)
  const cartItems = useSelector(state => {
    const transformedCartItems = []
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        ...state.cart.items[key]
      })
    }
    return transformedCartItems.sort((a, b) => a.productId > b.productId ? 1 : 0)
  })

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>Total: <Text style={styles.amount}>${cartTotalAmount.toFixed(2)}</Text></Text>
        <Button disabled={cartItems.length === 0} title="Order Now"
                onPress={() => dispatch(orderActions.addOrder({
                  items: cartItems,
                  totalAmount: cartTotalAmount
                }))}/>
      </Card>
      <View>
        <FlatList data={cartItems}
                  keyExtractor={item => item.productId}
                  renderItem={itemData => <CartItem qty={itemData.item.quantity}
                                                    title={itemData.item.productTitle}
                                                    amt={itemData.item.sum}
                                                    deletable={true}
                                                    onRemove={() => dispatch(cartActions.deleteCartItem(itemData.item.productId))}
                  />}/>
      </View>
    </View>
  )
}
CartScreen.navigationOptions = {
  headerTitle: 'Your Cart'
}

const styles = StyleSheet.create({
  screen: {
    margin: 20,

  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10,
  },
  summaryText: {
    fontFamily: 'open-sans-bold',
    fontSize: 18
  },
  amount: {
    color: Colors.primary
  }
})

export default CartScreen
