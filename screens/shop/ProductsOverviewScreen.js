import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Button, FlatList, Platform, StatusBar, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import ProductItem from '../../components/shop/ProductItem'
import cartActions from '../../store/action/cart'
import * as productsActions from '../../store/action/products'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../../components/UI/HeaderButton'
import Colors from '../../constant/Colors'

const ProductsOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const products = useSelector(state => state.products.availableProducts)
  const dispatch = useDispatch()
  const { navigation } = props

  const onSelectItemHandler = (id, title) => {
    props.navigation.navigate({
      routeName: 'ProductDetail',
      params: {
        productId: id,
        productTitle: title
      }
    })
  }
  const loadingProducts = useCallback(async () => {
    console.log('loading data')
    setIsRefreshing(true)
    setError(null)
    try {
      await dispatch(productsActions.setProductsAsync())
    } catch (e) {
      setError(e)
    }
    setIsRefreshing(false)
  }, [setIsLoading, setError, dispatch])

  useEffect(() => {
    setIsLoading(true)
    loadingProducts().then(() => setIsLoading(false)
    )
  }, [loadingProducts, setIsLoading])

  useEffect(() => {
    const navigationSub = props.navigation.addListener('willFocus', loadingProducts)
    return () => {
      navigationSub.remove()
    }
  }, [navigation])

  if (error) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontFamily: 'open-sans' }}>{error}</Text>
      <Button color={Colors.primary} title="Load Again" onPress={loadingProducts}/>
    </View>
  }

  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={Colors.primary}/>
    </View>
  }

  if (!isLoading && products.length === 0) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontFamily: 'open-sans' }}>No Products Found</Text>
    </View>
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList onRefresh={loadingProducts}
                refreshing={isRefreshing}
                keyExtractor={item => item.id}
                data={products}
                renderItem={itemData => (
                  <ProductItem image={itemData.item.imageUrl}
                               title={itemData.item.title}
                               price={itemData.item.price}
                               onSelected={() => {
                                 onSelectItemHandler(itemData.item.id, itemData.item.title)
                               }}>
                    <Button color={Colors.primary} title="View Details"
                            onPress={() => onSelectItemHandler(itemData.item.id, itemData.item.title)}/>
                    <Button color={Colors.primary} title="To Cart"
                            onPress={() => dispatch(cartActions.addItemToCart(itemData.item))}/>
                  </ProductItem>)}/>
    </View>
  )
}

ProductsOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: 'All Products',
    headerRight: <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item title={'Cart'} iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'} onPress={() => {
        navData.navigation.navigate('Cart')
      }}/>
    </HeaderButtons>,
    headerLeft: <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item title={'Menu'} iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} onPress={() => {
        navData.navigation.toggleDrawer()
      }}/>
    </HeaderButtons>
  }
}

export default ProductsOverviewScreen
