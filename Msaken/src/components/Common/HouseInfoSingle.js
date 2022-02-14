import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';

import colors from '../../common/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HouseInfoSingle = props => {
  const Data = props.data;

  return (
    <View style={styles.houseContainer}>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>
          {Data.price + 'SAR'}
          {Data.property_for === 'rent' && (
            <Text
              style={[
                styles.price,
                {fontSize: 10, fontFamily: 'Roboto-Medium'},
              ]}>
              /mo
            </Text>
          )}
        </Text>
      </View>
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
      <View style={[styles.houseItem, styles.borderLeft, {width: '27%'}]}>
        <Image
          source={require('../../assets/land_gray.png')}
          style={[styles.icon, {width: 17, height: 17}]}
        />
        <Text style={styles.itemText}>{Data.land_area + ' sq. m'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  houseContainer: {
    borderWidth: 2,
    borderRadius: 30,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: colors.inputBgGrey,
    marginRight: -10,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    height: 70,
    marginVertical: 10,
  },
  priceContainer: {
    paddingRight: 5,
    minWidth: '28%',
    maxWidth: '30%',
  },
  price: {
    fontSize: 14,
    color: colors.themeRed,
    fontFamily: 'Roboto-Bold',
  },
  houseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '11%',
  },
  itemText: {
    color: colors.darkGrey,
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    paddingHorizontal: 2,
  },

  icon: {
    width: 18,
    height: 18,
    resizeMode: 'center',
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: colors.inputBgGrey,
    paddingLeft: 4,
  },
});

export default HouseInfoSingle;
