import React from 'react'
import {ProgressDialog} from 'react-native-simple-dialogs'
import Colors from '../constants/Colors'

const CustomProgressDialog = ({loading}) => {
  return (
    <ProgressDialog
      message="Please, wait..."
      activityIndicatorColor={Colors.primary}
      activityIndicatorSize={'large'}
      dialogStyle={{backgroundColor: 'white', borderRadius: 5}}
      visible={loading}
      messageStyle={{
        fontSize: 18,
      }}
    />
  )
}

export default CustomProgressDialog
