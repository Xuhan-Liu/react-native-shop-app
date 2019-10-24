import React, { useCallback, useReducer, useState } from 'react'
import {
  Alert,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View
} from 'react-native'
import Card from '../../components/UI/Card'
import Input from '../../components/UI/Input'
import Colors from '../../constant/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import { useDispatch } from 'react-redux'
import * as authActions from '../../store/action/auth'

const FORM_INPUT_UPDATE = 'UPDATE'

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    }
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    }
    let updatedFormIsValid = true
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
    }
    return {
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      formIsValid: updatedFormIsValid
    }
  }
  return state
}

const AuthScreen = props => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setSignUp] = useState(false)
  const dispatch = useDispatch()
  const [formState, formDispatch] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false
  })

  const inputChangeHandler = useCallback((input, text, isValid) => {
    formDispatch({
      type: FORM_INPUT_UPDATE,
      value: text,
      isValid: isValid,
      input: input
    })
  }, [formDispatch])

  const authHandler = async () => {
    const action = isSignUp ? authActions.signUpAsync : authActions.loginAsync
    setIsLoading(true)
    try {
      await dispatch(action({
        email: formState.inputValues.email,
        password: formState.inputValues.password
      }))
      if (isSignUp) {
        setSignUp(false)
      } else {
        props.navigation.navigate('Shop')
      }
    } catch (err) {
      Alert.alert('Auth Failed', err, [{ text: 'Okay' }])
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={styles.screen}>
      <StatusBar barStyle={'dark-content'}/>
      <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input id="email"
                   label="Email"
                   keyboardType="email-address"
                   required
                   email
                   autoCapitalize='none'
                   errorText='Please enter a valida email address'
                   onInputChange={inputChangeHandler}
                   initialValue={formState.inputValues.email}
            />
            <Input id="password"
                   label="Password"
                   keyboardType="default"
                   secureTextEntry
                   required
                   minLength={5}
                   autoCapitalize='none'
                   errorText='Please enter a valida password'
                   onInputChange={inputChangeHandler}
                   initialValue={formState.inputValues.password}
            />
            <View style={styles.btnContainer}>
              {isLoading ? <ActivityIndicator size="small" color={Colors.primary}/> : <Button
                title={isSignUp ? 'Sign Up' : 'Login'} color={Colors.primary} onPress={authHandler}/>
              }
            </View>
            <View style={styles.btnContainer}>
              <Button title={`Switch to ${isSignUp ? 'Login' : 'Sign Up'}`} color={Colors.accent} onPress={() => {
                setSignUp(pre => !pre)
              }}/>
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnContainer: {
    marginVertical: 10
  }
})

AuthScreen.navigationOptions = {
  headerTitle: 'Login'
}

export default AuthScreen
