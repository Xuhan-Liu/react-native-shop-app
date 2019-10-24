import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer'

import React from 'react'
import { Button, Platform, SafeAreaView, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../constant/Colors'

import ProductDetailScreen from '../screens/shop/ProductDetailScreen'
import CartScreen from '../screens/shop/CartScreen'
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen'
import OrderScreen from '../screens/shop/OrderScreen'
import UserProductsScreen from '../screens/user/UserProductsScreen'
import EditProductScreen from '../screens/user/EditProductScreen'
import AuthScreen from '../screens/user/AuthScreen'
import StartupScreen from '../screens/StartupScreen'
import { useDispatch } from 'react-redux'
import * as authActions from '../store/action/auth'

const defaultStackNavigationOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans'
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
}

const ProductsNavigator = createStackNavigator({
    ProductsOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen
  }, {
    defaultNavigationOptions: defaultStackNavigationOptions
  }
)

const OrdersNavigator = createStackNavigator({
  Orders: OrderScreen
}, {
  defaultNavigationOptions: defaultStackNavigationOptions
})

const AdminNavigator = createStackNavigator({
  UserProducts: UserProductsScreen,
  ProductDetail: ProductDetailScreen,
  EditProduct: EditProductScreen
}, {
  defaultNavigationOptions: defaultStackNavigationOptions
})

const ShopNavigator = createDrawerNavigator({
  Products: {
    screen: ProductsNavigator,
    navigationOptions: {
      drawerLabel: 'Shop Products',
      drawerIcon: drawerIconConfig => <Ionicons name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                                                size={23} color={drawerIconConfig.tintColor}/>
    }
  },
  Orders: {
    screen: OrdersNavigator,
    navigationOptions: {
      drawerLabel: 'Check Orders',
      drawerIcon: drawerIconConfig => <Ionicons name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                                                size={23} color={drawerIconConfig.tintColor}/>
    }
  },
  Admin: {
    screen: AdminNavigator,
    navigationOptions: {
      drawerLabel: 'Admin',
      drawerIcon: drawerIconConfig => <Ionicons name={Platform.OS === 'android' ? 'md-book' : 'ios-book'}
                                                size={23} color={drawerIconConfig.tintColor}/>
    }
  }
}, {
  contentOptions: {
    activeTintColor: Colors.primary
  },
  contentComponent: props => {
    const dispatch = useDispatch()
    return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
          <View style={{ height: '100%', justifyContent: 'space-between' }}>
            <DrawerNavigatorItems {...props}/>
            <Button title="Logout" onPress={() => {
              dispatch(authActions.logoutAsync())
              props.navigation.navigate('Auth')
            }} color={Colors.primary}/>
          </View>
        </SafeAreaView>
      </View>
    )
  }
})

const AuthNavigator = createStackNavigator({
  Auth: AuthScreen
}, {
  defaultNavigationOptions: defaultStackNavigationOptions
})

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  Shop: ShopNavigator,
})

export default createAppContainer(MainNavigator)
