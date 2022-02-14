import React, {useEffect, useState} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import AuthButton from '../../components/AuthButton'
import Colors from '../../constants/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Reconnect = ({route, navigation}) => {
  const [itemId, setItemId] = useState(route.params?.id ? route.params?.id : '')

  useEffect(() => {
    // const getItem = async () => {
    //   const itemId = await AsyncStorage.getItem('itemId')
    //   if (itemId) {
    //     const parsedId = JSON.parse(itemId)
    //     setItemId(parsedId)
    //   }
    // }
    // getItem()
  }, [])

  return (
    <View style={styles.screen}>
      <AuthButton
        onPress={() => navigation.navigate('call', {...route.params})}>
        Reconnect
      </AuthButton>
      <Text
        style={{
          marginVertical: 20,
          fontSize: 20,
          fontFamily: 'Roboto-Regular',
        }}>
        Or
      </Text>
      <AuthButton
        onPress={() => navigation.navigate('diagnostic', {id: itemId})}>
        Create diagnostic checklist
      </AuthButton>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
})

export default Reconnect
