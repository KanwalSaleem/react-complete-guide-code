import React, {useCallback, useEffect} from 'react'

import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  BackHandler,
} from 'react-native'
import {useFocusEffect} from '@react-navigation/native'

const NotActivated = ({navigation}) => {
  useFocusEffect(
    useCallback(
      () => {
        const onBackPress = () => {
          navigation.navigate('signin')
          return true
        }

        BackHandler.addEventListener('hardwareBackPress', onBackPress)

        return () =>
          BackHandler.removeEventListener('hardwareBackPress', onBackPress)
      },
      [navigation],
    ),
  )

  return (
    <SafeAreaView style={styles.screen}>
      <Image
        source={require('../../assets/logo.png')}
        resizeMode="contain"
        style={{
          alignSelf: 'center',
          width: '80%',
          height: 150,
          marginBottom: 70,
        }}
      />
      <View>
        <Text style={styles.text}>
          Your account is not Activated Yet. You will recieve a confimation
          E-mail
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 10,
    paddingTop: '40%',
  },
  text: {
    marginTop: 10,
    fontSize: 22,
    textAlign: 'center',
  },
})

export default NotActivated
