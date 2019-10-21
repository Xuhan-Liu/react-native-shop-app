import React from 'react'
import { HeaderButton } from 'react-navigation-header-buttons'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../../constant/Colors'
import { Platform } from 'react-native'

const CustomHeaderButton = props => {
  return <HeaderButton
    IconComponent={Ionicons}
    iconSize={23}
    color={Platform.OS === 'android' ? 'white' : Colors.primary}
    {...props}
  />
}

export default CustomHeaderButton
