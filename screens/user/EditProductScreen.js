import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../../components/UI/HeaderButton'
import { useDispatch, useSelector } from 'react-redux'
import * as productsActions from '../../store/action/products'
import Input from '../../components/UI/Input'
import Colors from '../../constant/Colors'

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

const EditProductScreen = props => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const dispatch = useDispatch()
  const prodId = props.navigation.getParam('productId')
  const product = useSelector(state => state.products.userProducts).find(prd => prd.id === prodId)
  const titleInput = React.createRef()
  const urlInput = React.createRef()
  const priceInput = React.createRef()
  const descriptionInput = React.createRef()

  const [formState, formDispatch] = useReducer(formReducer, {
    inputValues: {
      title: product ? product.title : '',
      url: product ? product.imageUrl : '',
      description: product ? product.description : '',
      price: ''
    },
    inputValidities: {
      title: !!product,
      url: !!product,
      description: !!product,
      price: !!product,
    },
    formIsValid: !!product
  })

  useEffect(() => {
    if (error) {
      Alert.alert('An error occur', error, [{ text: 'Okay' }])
    }
  }, [error])

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong Input!', 'Please check the errors in the form', [{ text: 'Okay' }])
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      if (product) {
        await dispatch(productsActions.updateProductsAsync({
          pid: prodId,
          title: formState.inputValues.title,
          description: formState.inputValues.description,
          imageUrl: formState.inputValues.url
        }))
      } else {
        await dispatch(productsActions.createProductAsync({
          title: formState.inputValues.title,
          description: formState.inputValues.description,
          imageUrl: formState.inputValues.url,
          price: +formState.inputValues.price
        }))
      }
      props.navigation.goBack()
    } catch (err) {
      setError(err)
    }
    setIsLoading(false)
  }, [product, dispatch, prodId, formState])

  useEffect(() => {
    props.navigation.setParams({
      'submit': submitHandler
    })
  }, [submitHandler])

  const inputChangeHandler = useCallback((input, text, isValid) => {
    formDispatch({
      type: FORM_INPUT_UPDATE,
      value: text,
      isValid: isValid,
      input: input
    })
  }, [formDispatch])

  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={Colors.primary}/>
    </View>
  }

  return (
    <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }} keyboardVerticalOffset={100}>
      <ScrollView>
        <View style={styles.form}>
          <Input
            label="Title"
            id='title'
            errorText="Please enter a valid title"
            ref={titleInput}
            initialValue={product ? product.title : ''}
            initiallyValid={!!product}
            onInputChange={inputChangeHandler}
            autoCapitalize="sentences"
            returnKeyType="next"
            onSubmitEditing={() => urlInput.current.focus()}
            keyboardType="default"
            required
          />
          <Input
            label="Image URL"
            id='url'
            errorText="Please enter a valid Image URL"
            ref={urlInput}
            initialValue={product ? product.imageUrl : ''}
            initiallyValid={!!product}
            onInputChange={inputChangeHandler}
            autoCapitalize="sentences"
            returnKeyType="next"
            onSubmitEditing={() => priceInput.current.focus()}
            required
          />

          {product ? null :
            <Input
              label="Price"
              id='price'
              errorText="Please enter a valid Price"
              ref={priceInput}
              onInputChange={inputChangeHandler}
              keyboardType="decimal-pad"
              required
              min={0.1}
            />
          }
          <Input
            label="Description"
            id='description'
            errorText="Please enter a valid description"
            multiline
            numberOflines={3}
            ref={descriptionInput}
            initialValue={product ? product.description : ''}
            initiallyValid={!!product}
            onInputChange={inputChangeHandler}
            autoCapitalize="sentences"
            required
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

EditProductScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam('submit')
  return {
    headerTitle: navData.navigation.getParam('productId') ? 'Edit Product' : 'New Product',
    headerRight: <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item title={'Menu'} iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'} onPress={submitFn}/>
    </HeaderButtons>
  }
}

const styles = StyleSheet.create({
  form: {
    margin: 20,
    justifyContent: 'flex-end',
  }
})

export default EditProductScreen
