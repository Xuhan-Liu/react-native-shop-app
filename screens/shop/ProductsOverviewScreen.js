import React from 'react'
import { Button, FlatList, Platform, StatusBar, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import ProductItem from '../../components/shop/ProductItem'
import cartActions from '../../store/action/cart'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../../components/UI/HeaderButton'
import Colors from '../../constant/Colors'

const ProductsOverviewScreen = props => {
  const onSelectItemHandler = (id, title) => {
    props.navigation.navigate({
      routeName: 'ProductDetail',
      params: {
        productId: id,
        productTitle: title
      }
    })
  }
  const dispatch = useDispatch()
  const products = useSelector(state => state.products.availableProducts)
  return (
    <View>
      <StatusBar barStyle={'dark-content'}/>
      <FlatList keyExtractor={item => item.id} data={products}
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
