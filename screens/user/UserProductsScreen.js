import React from 'react'
import { Button, FlatList, Platform, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import ProductItem from '../../components/shop/ProductItem'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../../components/UI/HeaderButton'
import Colors from '../../constant/Colors'
import productActions from '../../store/action/products'

const UserProductsScreen = props => {
  const dispatch = useDispatch()
  const onSelectItemHandler = (id) => {
    props.navigation.navigate({
      routeName: 'EditProduct',
      params: { productId: id }
    })
  }
  const deleteHandler = (id) => {
    Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
      { text: 'No', style: 'default' },
      { text: 'Yes', style: 'destructive', onPress: () => dispatch(productActions.deleteProduct(id)) }
    ])
  }
  const userProducts = useSelector(state => state.products.userProducts)
  return <FlatList data={userProducts} keyExtractor={item => item.id}
                   renderItem={itemData => <ProductItem image={itemData.item.imageUrl}
                                                        title={itemData.item.title}
                                                        price={itemData.item.price}
                                                        onSelected={() => onSelectItemHandler(itemData.item.id)}>
                     <Button color={Colors.primary} title="Edit"
                             onPress={() => onSelectItemHandler(itemData.item.id)}/>
                     <Button color={Colors.primary} title="Delete"
                             onPress={() => deleteHandler(itemData.item.id)}/>
                   </ProductItem>}/>
}
UserProductsScreen.navigationOptions = navData => {
  return {
    headerTitle: 'My Products',
    headerRight: <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item title={'Cart'} iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'} onPress={() => {
        navData.navigation.navigate('EditProduct')
      }}/>
    </HeaderButtons>,
    headerLeft: <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item title={'Menu'} iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} onPress={() => {
        navData.navigation.toggleDrawer()
      }}/>
    </HeaderButtons>
  }
}

export default UserProductsScreen
