import React, { useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import Colors from '../../constant/Colors'
import CartItem from './CartItem'
import Card from '../UI/Card'

const OrderItem = props => {
  const [showDetails, setShowDetails] = useState(false)
  return (
    <Card style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.amt}>${props.amount.toFixed(2)}</Text>
        <Text style={styles.date}>{props.date}</Text>
      </View>
      <Button color={Colors.primary} title={showDetails ? 'Hide Details' : 'Show Details'}
              onPress={() => {setShowDetails(pre => !pre)}}/>
      {showDetails && <View style={styles.detailItems}>
        {props.items.map(item => <CartItem key={item.productId}
                                           qty={item.quantity}
                                           deletable={false}
                                           title={item.productTitle}
                                           amt={item.sum}/>)}
      </View>}
    </Card>
  )
}
const styles = StyleSheet.create({
  orderItem: {
    margin: 20,
    padding: 10,
    alignItems: 'center'
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15
  },
  amt: {
    fontFamily: 'open-sans-bold',
    fontSize: 16
  },
  date: {
    fontSize: 16,
    fontFamily: 'open-sans',
    color: '#888'
  },
  detailItems: {
    width: '100%'
  }

})

export default OrderItem
