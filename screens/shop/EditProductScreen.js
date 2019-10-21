import React, { useCallback, useEffect, useRef, useState, useReducer } from 'react'
import { Platform, ScrollView, StyleSheet, Text, TextInput, View, Alert } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import CustomHeaderButton from '../../components/UI/HeaderButton'
import { useDispatch, useSelector } from 'react-redux'
import productsActions from '../../store/action/products'

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
  const dispatch = useDispatch()
  const prodId = props.navigation.getParam('productId')
  const product = useSelector(state => state.products.userProducts).find(prd => prd.id === prodId)

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

  const titleInput = useRef(null)
  const urlInput = useRef(null)
  const priceInput = useRef(null)
  const descriptionInput = useRef(null)

  const submitHandler = useCallback(() => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong Input!', 'Please check the errors in the form', [{ text: 'Okay' }])
      return
    }
    if (product) {
      dispatch(productsActions.updateProduct({
        pid: prodId,
        title: formState.inputValues.title,
        description: formState.inputValues.description,
        imageUrl: formState.inputValues.url
      }))
    } else {
      dispatch(productsActions.createProduct({
        title: formState.inputValues.title,
        description: formState.inputValues.description,
        imageUrl: formState.inputValues.url,
        price: +formState.inputValues.price
      }))
    }
    props.navigation.goBack()
  }, [product, dispatch, prodId, formState])

  useEffect(() => {
    props.navigation.setParams({
      'submit': submitHandler
    })
  }, [submitHandler])

  const textChangeHandler = (text, input) => {
    let isValid = false
    if (text.trim().length > 0) {
      isValid = true
    }
    formDispatch({
      type: FORM_INPUT_UPDATE,
      value: text,
      isValid: isValid,
      input: input
    })
  }

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput ref={titleInput}
                     style={styles.input}
                     value={formState.inputValues.title}
                     onChangeText={text => {textChangeHandler(text, 'title')}}
                     returnKeyType="next"
                     autoCorrect
                     autoCapitalize="sentences"
                     onSubmitEditing={() => urlInput.current.focus()}
                     keyboardType="default"/>
          {!formState.inputValidities.title && <Text>Title is invalid</Text>}
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput ref={urlInput} style={styles.input} value={formState.inputValues.url}
                     onChangeText={text => {textChangeHandler(text, 'url')}}
          />
        </View>
        {product ? null :
          <View style={styles.formControl}>
            <Text style={styles.label}>Price</Text>
            <TextInput style={styles.input} value={formState.inputValues.price}
                       onChangeText={text => {textChangeHandler(text, 'price')}}
                       keyboardType="decimal-pad"/>
          </View>
        }
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput style={styles.input} value={formState.inputValues.description}
                     onChangeText={text => {textChangeHandler(text, 'description')}}/>
        </View>
      </View>
    </ScrollView>
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
    margin: 20
  },
  formControl: {
    width: '100%'
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: 8
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#555',
    borderBottomWidth: 1
  }
})

export default EditProductScreen
