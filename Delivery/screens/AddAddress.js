import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import LinearGradient from 'react-native-linear-gradient'
import {useNavigation} from '@react-navigation/native'

const AddAddress = ({route, navigation}) => {
  // const {fullName, mobileNo} = route.params
  console.log(route)
  return (
    <View style={styles.screen}>
      <Image source={require('../assets/signupImage.png')} />

      <View style={styles.addressView}>
        <View style={styles.itemsView}>
          <Text style={styles.fullName}>Swati Mishra</Text>
          <Text style={styles.otherDetails}>Ward No - 7,Keuto Street</Text>
          <Text style={styles.otherDetails}>Landmark- shiv temple</Text>
          <Text style={styles.otherDetails}>West Bengal India 713371</Text>
          <Text style={styles.otherDetails}>Mobile No . 8637089622</Text>
        </View>
      </View>

      <View style={styles.addressView}>
        <View style={styles.itemsView}>
          <TouchableOpacity onPress={() => navigation.navigate('editAddress')}>
            <Icon
              stlyle={{paddingBottom: 5}}
              name="add"
              color="#D3D3D3"
              size={35}
            />
          </TouchableOpacity>
          <Text style={styles.addText}>Add Address</Text>
        </View>
      </View>

      <View style={styles.options}>
        <TouchableOpacity activeOpacity={0.6}>
          <LinearGradient
            colors={['#336CF9', '#1BE6D6']}
            style={styles.optionsView}
            start={{x: 0, y: 1.2}}
            end={{x: 1.2, y: 0}}>
            <Text style={styles.optionText}>Edit</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6}>
          <LinearGradient
            colors={['#336CF9', '#F64BBD']}
            style={styles.optionsView}
            start={{x: 0.1, y: 0.7}}
            end={{x: 1.2, y: 1}}>
            <Text style={styles.optionText}>Remove</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // backgroundColor: '#F6F6FA',
    backgroundColor: '#F8FAFF',
  },
  addressView: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    width: '80%',
    height: '30%',
    marginTop: 40,
    marginBottom: 20,
    // borderStyle: ,
    borderWidth: 1,
    borderColor: '#2699FB',
  },
  itemsView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullName: {
    fontFamily: 'Poppins-Regular',
    fontSize: 21,
    color: '#0D0E0F',
  },
  otherDetails: {
    fontFamily: 'Poppins-Regular',
    fontSize: 21,
    color: '#707070',
  },
  addText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 21,
    color: '#2699FB',
    textAlignVertical: 'center',
    paddingTop: 5,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // paddingTop: 40,
    // paddingHorizontal: 30,
    // width: '100%',
    alignContent: 'center',
    // alignSelf: 'center',
  },
  optionsView: {
    width: 120,
    // height: 200,
    paddingLeft: 5,
    borderRadius: 40,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#1BE6D6',
  },
  optionText: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    fontSize: 16,
  },
})
export default AddAddress
