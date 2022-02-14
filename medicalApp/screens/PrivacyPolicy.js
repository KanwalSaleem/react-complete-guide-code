import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../constants/Colors'

import {useNavigation} from '@react-navigation/native'

const PrivacyPolicy = () => {
  const navigation = useNavigation()
  return (
    <View style={styles.mainScreen}>
      <View style={styles.condionsView}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('signUp')
          }}
          style={styles.iconView}>
          <Icon
            name="arrow-back-ios"
            color={Colors.backgroundColor}
            size={20}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <Icon name="notifications" color={Colors.backgroundColor} size={30} />
      </View>
      <ScrollView contentContainerStyle={styles.screen}>
        <Text style={styles.text}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industrys standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.It is a long established fact that a
          reader will be distracted by the readable content of a page when
          looking at its layout. The point of using Lorem Ipsum is that it has a
          more-or-less normal distribution of letters, as opposed to using
          Content here, content here, making it look like readable English. Many
          desktop publishing packages and web page editors now use Lorem Ipsum
          as their default model text, and a search for lorem ipsum will uncover
          many web sites still in their infancy. Various versions have evolved
          over the years, sometimes by accident, sometimes on purpose (injected
          humour and the like).
        </Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,

    backgroundColor: Colors.black,

    paddingVertical: 20,
  },
  screen: {
    marginHorizontal: 10,

    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  title: {
    color: Colors.backgroundColor,
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
  },
  condionsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  iconView: {
    borderRadius: 100,
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    textAlign: 'center',
  },
  text: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    lineHeight: 30,
  },
})
export default PrivacyPolicy
