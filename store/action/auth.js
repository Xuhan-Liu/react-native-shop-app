import { createAction } from 'redux-starter-kit'
import { AsyncStorage } from 'react-native'

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem('userData', JSON.stringify({
    token: token,
    userId: userId,
    expiryDate: expirationDate.toISOString()
  }))
}

export const signUp = createAction('auth/sign_up')
export const signUpAsync = payload => {
  return async dispatch => {
    try {
      const apiKey = ''
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true
        })
      })
      const resData = await response.json()
      if (!response.ok) {
        throw new Error(resData.error.message)
      }
      dispatch(signUp(resData))
    } catch (e) {
      throw e.message
    }
  }
}

export const login = createAction('auth/login')
export const loginAsync = payload => {
  return async dispatch => {
    try {
      const apiKey = ''
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
            returnSecureToken: true
          })
        })
      const resData = await response.json()
      if (!response.ok) {
        throw new Error(resData.error.message)
      }
      dispatch(login(resData))
      const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
      saveDataToStorage(resData.idToken, resData.localId, expirationDate)
    } catch (e) {
      throw e.message
    }
  }
}

export const logout = createAction('auth/logout')
export const logoutAsync = () => {
  return dispatch => {
    AsyncStorage.removeItem('userData')
    dispatch(logout())
  }
}
