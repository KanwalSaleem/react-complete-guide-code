import React from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import Colors from '../constants/Colors';

const AboutUs = () => {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.mainContainer}>
        <Text style={styles.text}>
          We are delighted to invite you to come and experience a deliciously
          arranged journey to explore exceptional tastes of fresh vegetables and
          fruits. Today`s fresh is the place to experience the flavors roller
          coaster ride with the heart warming fragrance of beautiful flowers.
          Here we provide you with vegetable salads, flower bouquets, fruit
          baskets and Fruit bouquets, nowadays these are the glittering stars of
          any party and gatherings that you are planning to host. Today`s fresh
          makes sure to provide you with the best quality products, quality
          comes first. We believe that the quality impact is long lasting than
          the price , it is not something we put in our products effortlessly
          rather its the quality of mesmerizing taste that we provide to our
          customers. Today`s fresh welcome you to join us in this wonderful
          journey of flavors of fresh fruits and vegetables and beautiful
          bouquets of flowers
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: Colors.backgroundColor,
  },
  mainContainer: {
    paddingVertical: 20,
    marginHorizontal: 10,
    marginTop: 40,
  },
  text: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'justify',
  },
});

export default AboutUs;
