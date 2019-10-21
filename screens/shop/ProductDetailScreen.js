import React from 'react'
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import Colors from '../../constant/Colors'

const ProductDetailScreen = props => {
  const productId = props.navigation.getParam('productId')
  const selectedProduct = useSelector(state => state.products.availableProducts.find(prd => prd.id === productId))
  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }}/>
      <View style={styles.actions}>
        <Button color={Colors.primary} title="Add to Cart" onPress={() => {}}/>
      </View>
      <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  )
}

ProductDetailScreen.navigationOptions = (navigationData) => {
  return {
    headerTitle: navigationData.navigation.getParam('productTitle'),
  }
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300,
  },
  price: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'open-sans-bold'
  },
  actions: {
    marginVertical: 10,
    alignItems: 'center'
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
    fontFamily: 'open-sans'
  }
})

export default ProductDetailScreen
