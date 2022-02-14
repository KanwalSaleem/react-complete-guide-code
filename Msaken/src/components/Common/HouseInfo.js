import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';

import colors from '../../common/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HouseInfo = props => {
  const Data = props.data;

  return (
    <View style={styles.houseContainer}>
      <View style={styles.houseItem}>
        <Image
          source={require('../../assets/bedroom.png')}
          style={styles.icon}
        />
        <Text style={styles.itemText}>{Data.bedrooms}</Text>
      </View>
      <View style={[styles.houseItem, styles.borderLeft]}>
        <Image
          source={require('../../assets/living.png')}
          style={styles.icon}
        />
        <Text style={styles.itemText}>{Data.living_rooms}</Text>
      </View>
      <View style={[styles.houseItem, styles.borderLeft]}>
        <Image
          source={require('../../assets/bathroom.png')}
          style={styles.icon}
        />
        <Text style={styles.itemText}>{Data.bathrooms}</Text>
      </View>
      <View style={[styles.houseItem, styles.borderLeft]}>
        <Image
          source={require('../../assets/kitchen.png')}
          style={styles.icon}
        />
        <Text style={styles.itemText}>{Data.kitchens}</Text>
      </View>
      <View style={[styles.houseItem, styles.borderLeft, {width: '40%'}]}>
        <Image
          source={require('../../assets/land_gray.png')}
          style={[styles.icon, {width: 22, height: 22}]}
        />
        <Text style={styles.itemText}>{Data.land_area + ' sq. m'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  houseContainer: {
    flexDirection: 'row',
  },
  houseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '15%',
  },
  itemText: {
    color: colors.darkGrey,
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    paddingHorizontal: 2,
  },

  icon: {
    width: 25,
    height: 25,
    resizeMode: 'center',
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: colors.inputBgGrey,
    paddingLeft: 5,
  },
});

export default HouseInfo;
