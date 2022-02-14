import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Colors from '../constants/Colors';

const ContactUs = () => {
  return (
    <ImageBackground
      style={styles.screen}
      source={require('../assets/footer.jpeg')}>
      <View style={styles.contactContainer}>
        <Image
          source={require('../assets/logoImg.png')}
          style={{
            width: 170,
            height: 170,
            borderRadius: 10,
            alignSelf: 'center',
          }}
        />
        <Text style={styles.contactHeading}>Contact Us</Text>

        <View style={styles.addressContainer}>
          <Icon name="phone-enabled" size={30} color={'#eee'} />
          <TouchableOpacity onPress={() => Linking.openURL('tel:0312-1364884')}>
            <Text style={[styles.addressText]}>0312-1364884</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.addressContainer}>
          <Icon name="mail" size={30} color={'#eee'} />
          <TouchableOpacity
            onPress={() => Linking.openURL('mailto: yousufkhan_82@yahoo.com')}>
            <Text style={[styles.addressText]}>yousufkhan_82@yahoo.com</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.addressContainer}>
          <Text style={styles.addressTitle}>WhatsApp:</Text>
          <Text style={styles.addressText}>+92 300 3525608</Text>
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.addressTitle}>Email:</Text>
          <Text style={styles.addressText}>yousufkhan_82@yahoo.com</Text>
        </View> */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
    paddingTop: 60,
  },
  contactContainer: {
    margin: 10,
    alignItems: 'center',
  },
  addressContainer: {
    flexDirection: 'row',
    marginTop: 40,
    // alignItems: 'center',
  },
  addressTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
  },
  addressText: {
    marginLeft: 5,
    textAlign: 'left',
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
  },
  contactHeading: {
    marginTop: 40,
    fontSize: 26,
    elevation: 5,
    color: '#333',
    fontFamily: 'Roboto-Bold',
    alignSelf: 'center',
  },
});

export default ContactUs;
