import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../constants/Colors';
import AuthButton from '../components/AuthButton';
import LinearGradient from 'react-native-linear-gradient';

const Wallet = () => {
  return (
    <View style={styles.screen}>
      <LinearGradient colors={['#E03D14', '#E0CD14']} style={styles.gradient}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>My Grocery Balance</Text>
          <Text style={[styles.title, {marginTop: 10}]}>Please Wait</Text>
        </View>

        <Icon color={Colors.black} name="account-balance-wallet" size={60} />
      </LinearGradient>
      <View style={styles.walletContainer}>
        <Image style={styles.image} source={require('../assets/logo.jpg')} />
        <Text style={styles.walletText}>
          You can use your grocery Cash for future purchases!
        </Text>
      </View>
      <AuthButton style={styles.button} onPress={() => {}}>
        ADD MONEY IN WALLET
      </AuthButton>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },

  button: {
    marginVertical: 20,
    backgroundColor: Colors.secondary,
  },
  gradient: {
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  titleContainer: {marginBottom: 20},
  title: {
    color: Colors.backgroundColor,
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
  },

  walletContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  image: {
    width: '40%',
    height: 120,
  },
  walletText: {
    marginTop: 5,
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    marginHorizontal: 10,
  },
});

export default Wallet;
