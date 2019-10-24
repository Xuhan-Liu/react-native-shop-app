import axios from 'react-native-axios'
import { AsyncStorage } from 'react-native'

const instance = axios.create({
  baseURL: 'https://react-native-shop-22b2b.firebaseio.com/'
})

const requestHandler = (request) => {
  return AsyncStorage.getItem('userData').then(data => {
    const token = JSON.parse(data).token
    request.url = request.url + '?auth=' + token
    return request
  })
}

instance.interceptors.request.use(request => requestHandler(request))
export default instance
