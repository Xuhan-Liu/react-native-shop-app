import React, { useEffect } from 'react'
import { ActivityIndicator, StyleSheet, View, AsyncStorage } from 'react-native'
import Colors from '../constant/Colors'
import * as authAction from '../store/action/auth'
import { useDispatch } from 'react-redux'

const StartupScreen = props => {
  const dispatch = useDispatch()
  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem('userData')
      console.log(userData)
      if (!userData) {
        props.navigation.navigate('Auth')
        return
      }
      const transformedData = JSON.parse(userData)
      const { token, userId, expiryData } = transformedData
      const expirationDate = new Date(expiryData)
      if (expirationDate <= new Date() || !token || !userId) {
        await AsyncStorage.removeItem('userData')
        props.navigation.navigate('Auth')
        return
      }
      props.navigation.navigate('Shop')
      dispatch(authAction.login({
        idToken: token,
        localId: userId
      }))
    }
    tryLogin()
  }, [dispatch])

  return <View style={styles.screen}>
    <ActivityIndicator size="large" color={Colors.primary}/>
  </View>
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default StartupScreen
