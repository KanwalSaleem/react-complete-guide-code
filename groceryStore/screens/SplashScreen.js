import React from 'react';
import {View, StyleSheet} from 'react-native';
import Colors from '../constants/Colors';
// import FastImage from 'react-native-fast-image';

const Splash = () => {
  return (
    <View style={styles.container}>
      {/* <FastImage
        style={styles.image}
        source={require('../assets/splash2.gif')}
        resizeMode={FastImage.resizeMode.cover}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    justifyContent: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default Splash;
