import React, {useContext, useLayoutEffect, useState} from 'react'
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native'
import fonts from '../../constants/fonts'

import Colors from '../../constants/Colors'
import BottomBar from '../../components/BottomBar'
import {ScrollView} from 'react-native-gesture-handler'
import {AuthContext} from '../../context/Auth'
import {RadioButtonInput as RadioButton} from 'react-native-simple-radio-button'

const VerifyNIN = ({navigation, route}) => {
  const [option, setOption] = useState('')
  const {user} = useContext(AuthContext)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: ({canGoBack}) => {
        return (
          <TouchableOpacity
            style={{
              display:
                !route.params?.replacedFromLicense && !canGoBack
                  ? 'none'
                  : 'flex',
            }}
            onPress={() => {
              route.params?.replacedFromLicense === true
                ? user
                  ? navigation.navigate('dashboard')
                  : navigation.navigate('profile')
                : canGoBack && navigation.goBack()
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 16,
                fontFamily: 'Inter-SemiBold',
                color: Colors.primary,
              }}>
              Back
            </Text>
          </TouchableOpacity>
        )
      },
    })
  }, [navigation, route.params?.replacedFromLicense, user])
  return (
    <>
      <ScrollView
        contentContainerStyle={styles.screen}
        style={{backgroundColor: Colors.backgroundColor}}>
        <Text
          style={[fonts.paragraph, {marginBottom: 50}]}
          allowFontScaling={false}>
          Ensure your NIN data is accurate!! View, Print or Email your record!
          Fast, Easy, Reliable, Available and Instantanous (24/7). We are
          Licensed NIMC Verification Agents.
        </Text>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            setOption('nin')
            navigation.navigate('nin')
          }}
          style={styles.optionSelectionItem}>
          <RadioButton
            // value="nin"
            obj={{
              value: option,
            }}
            onPress={() => {
              setOption('nin')
              navigation.navigate('nin')
            }}
            buttonOuterColor={Colors.primary}
            buttonInnerColor={Colors.primary}
            buttonSize={14}
            // buttonOuterSize={25}

            // color={Colors.primary}

            isSelected={option === 'nin' ? true : false}
            // theme={{colors: {accent: Colors.primary}}}
          />
          <Text style={styles.selectionText} allowFontScaling={false}>
            Search By NIN
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            setOption('telephone')
            navigation.navigate('telephoneNo')
          }}
          style={styles.optionSelectionItem}>
          <RadioButton
            obj={{
              value: option,
            }}
            buttonOuterColor={Colors.primary}
            buttonInnerColor={Colors.primary}
            buttonSize={14}
            // value="telephone"
            onPress={() => {
              setOption('telephone')
              navigation.navigate('telephoneNo')
            }}
            // color={Colors.primary}

            isSelected={option === 'telephone' ? true : false}
            // theme={{colors: {accent: Colors.primary}}}
          />
          <Text style={styles.selectionText} allowFontScaling={false}>
            Search by Telephone{' '}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            setOption('document')
            navigation.navigate('document')
          }}
          style={styles.optionSelectionItem}>
          <RadioButton
            obj={{
              value: option,
            }}
            buttonOuterColor={Colors.primary}
            buttonInnerColor={Colors.primary}
            buttonSize={14}
            // value="document"
            onPress={() => {
              setOption('document')
              navigation.navigate('document')
            }}
            // color={Colors.primary}

            isSelected={option === 'document' ? true : false}
            theme={{colors: {accent: Colors.primary}}}
          />
          <Text style={styles.selectionText} allowFontScaling={false}>
            Search by Document Num
          </Text>
        </TouchableOpacity>
        <View style={styles.logo}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
          />
        </View>
      </ScrollView>
      <BottomBar />
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
    paddingVertical: 30,
    paddingBottom: '12%',
  },
  optionSelectionItem: {
    backgroundColor: '#fff',
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 15,
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
  },
  selectionText: {
    marginLeft: 15,
    // marginRight: 'auto',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: 'black',
    textAlign: 'center',
  },
  logo: {
    width: '75%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 50,
    marginHorizontal: 20,
  },
  logoImage: {
    width: '100%',
    height: 30,
    marginTop: 30,
  },
})

export default VerifyNIN
