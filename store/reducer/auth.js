import { createReducer } from 'redux-starter-kit'
import * as authActions from '../action/auth'

const initialStatus = {
  token: null,
  userId: null
}

const loginHandler = (state, action) => {
  state.token = action.payload.idToken
  state.userId = action.payload.localId
}

const signUpHandler = (state, action) => {
  state.token = action.payload.idToken
  state.userId = action.payload.localId
}

const logoutHandler = (state, action) => {
  state.token = null
  state.userId = null
}

const authReducer = createReducer(initialStatus, {
  [authActions.login]: (state, action) => loginHandler(state, action),
  [authActions.signUp]: (state, action) => signUpHandler(state, action),
  [authActions.logout]: (state, action) => logoutHandler(state, action),
})

export default authReducer
