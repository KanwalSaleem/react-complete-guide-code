import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
} from 'react-native'
import Colors from '../constants/Colors'
import {useSelector} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AuthButton from '../components/AuthButton'
import {useNavigation} from '@react-navigation/native'

const ProfileInfo = () => {
  const navigation = useNavigation()
  const user = useSelector((state) => state.auth.user)
  console.log(user)
  return (
    <View style={styles.mainScreen}>
      <View style={styles.mainContainer}>
        <ScrollView>
          <View style={[styles.whiteContainer, {marginTop: 50}]}>
            <View style={styles.mainDetailContainer}>
              <Image
                source={require('../assets/physician_profile.png')}
                style={styles.profileImage}
              />

              <Text style={styles.name}>Sara Richmond</Text>
              <Text style={styles.email}>Sararichmond@gmail.com</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="star" color="#F5DA28" size={25} />
                <Text style={styles.rating}>4.2 (124 reviews)</Text>
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldTitle}>Address line 1</Text>
              <Text style={styles.fieldDetail}>6650A NE Mt St Helens Ave</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldTitle}>Address line 2</Text>
              <Text style={styles.fieldDetail}>F2 1st Floor</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldTitle}>City</Text>
              <Text style={styles.fieldDetail}>San Francisco</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldTitle}>State/Province/Region</Text>
              <Text style={styles.fieldDetail}>California</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldTitle}>Zip Code</Text>
              <Text style={styles.fieldDetail}>94016</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldTitle}>Phone Number</Text>
              <Text style={styles.fieldDetail}>+1 9884584588</Text>
            </View>
          </View>
          {/* 2nd white Card */}
          <View style={styles.whiteContainer}>
            <View style={styles.headingContainer}>
              <Text style={[styles.name, {fontSize: 18}]}>
                Professional Information
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldTitle}>Occupation</Text>
              <Text style={styles.fieldDetail}>Licensed Physician</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldTitle}>License number</Text>
              <Text style={styles.fieldDetail}>1458458925</Text>
            </View>
            {user.role_id === 3 && (
              <>
                <View style={styles.field}>
                  <Text style={styles.fieldTitle}>States License Valid in</Text>
                  <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {[
                      'California',
                      'Virginia',
                      'Florida',
                      'Washington',
                      'Hawaii',
                      'Texas',
                      'Idaho',
                      'New Jersey',
                    ].map((state) => (
                      <Text
                        key={state}
                        style={{
                          padding: 5,
                          paddingHorizontal: 15,
                          borderRadius: 30,
                          borderWidth: 1,
                          marginRight: 10,
                          marginBottom: 10,
                          fontFamily: 'Roboto-Regular',
                          fontSize: 14,
                        }}>
                        {state}
                      </Text>
                    ))}
                  </View>
                </View>
                <View style={styles.field}>
                  <Text style={styles.fieldTitle}>Document</Text>
                  <View style={styles.documentContainer}>
                    <ImageBackground
                      source={require('../assets/upload.png')}
                      style={styles.documentInnerContainer}
                      imageStyle={styles.documentImage}>
                      <View style={styles.iconView}>
                        <Icon name="close" size={10} color="white" />
                      </View>
                    </ImageBackground>
                    <ImageBackground
                      source={require('../assets/upload.png')}
                      style={styles.documentInnerContainer}
                      imageStyle={styles.documentImage}>
                      <View style={styles.iconView}>
                        <Icon name="close" size={10} color="white" />
                      </View>
                    </ImageBackground>
                    <ImageBackground
                      source={require('../assets/upload.png')}
                      style={styles.documentInnerContainer}
                      imageStyle={styles.documentImage}>
                      <View style={styles.iconView}>
                        <Icon name="close" size={10} color="white" />
                      </View>
                    </ImageBackground>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* 3rd white Card for Care Giver */}
          {user.role_id === 2 && (
            <View style={styles.whiteContainer}>
              <View style={styles.headingContainer}>
                <Text style={[styles.name, {fontSize: 18}]}>
                  Vehicle Details
                </Text>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldTitle}>Drivers license number</Text>
                <Text style={styles.fieldDetail}>1248547589</Text>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldTitle}>Make</Text>
                <Text style={styles.fieldDetail}>Toyota</Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldTitle}>Model</Text>
                <Text style={styles.fieldDetail}>Camry</Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldTitle}>Year</Text>
                <Text style={styles.fieldDetail}>2020</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldTitle}>Vehicle Photo</Text>
                <Image
                  source={require('../assets/vehicle.jpg')}
                  style={styles.vehicleImage}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </View>
      <AuthButton onPress={() => navigation.navigate('editProfile')}>
        Edit Profile
      </AuthButton>
    </View>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flexGrow: 1,
    backgroundColor: Colors.black,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  mainContainer: {height: '93%'},
  whiteContainer: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  mainDetailContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 119,
    height: 119,
    borderRadius: 20,
    marginTop: -50,
  },

  name: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
  },
  email: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  rating: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
  },
  field: {
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    marginBottom: 2,
  },
  fieldDetail: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  headingContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    padding: 10,
    marginBottom: 20,
  },
  documentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },

  documentInnerContainer: {
    width: '23%',
    height: 69,
    resizeMode: 'contain',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 3,
    marginVertical: 10,
  },
  documentImage: {
    width: '100%',
  },
  iconView: {
    backgroundColor: 'black',
    alignSelf: 'flex-end',
    width: 16,
    height: 16,
    marginTop: 5,
    marginRight: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleImage: {
    marginVertical: 10,
    width: '90%',
    height: 138,
  },
})

export default ProfileInfo
