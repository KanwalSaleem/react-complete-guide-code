import React, {useState, useRef, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
  Share,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import colors from '../../common/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Item} from 'react-native-paper/lib/typescript/components/List/List';
import {useNavigation} from '@react-navigation/native';
import HouseInfo from './HouseInfo';
import SliderComp from './SliderComp';
import {Card, Title} from 'react-native-paper';
import {AuthContext} from '../../context/AuthContext';
import FA from 'react-native-vector-icons/FontAwesome';

const RentSaleInfo = props => {
  const images = [require('../../assets/placeholder.jpg')];
  const navigation = useNavigation();
  const agentImages = [require('../../assets/property.png')];
  const {language, selectedLanguage} = useContext(AuthContext);

  const ShareProperty = shareLink => {
    Share.share({
      message: shareLink,
    });
  };

  const item = props.data;

  return (
    <TouchableOpacity
      style={[styles.itemContainer]}
      activeOpacity={0.6}
      onPress={() => navigation.navigate('houseProperty', {p_id: item.id})}>
      {item.premiumStatus && (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {}}
          style={[
            styles.premiumStyle,
            {
              backgroundColor:
                item.premiumStatus === 'Premium' ? colors.themeRed : '#000000',
            },
          ]}>
          <Text style={styles.premiumText}>{item.premiumStatus}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.navigate('houseProperty', {p_id: item.id})}>
        <SliderComp
          images={
            item.multiple_image
              ? item.multiple_image.length > 0
                ? item.multiple_image.map(item => ({
                    uri: `https://xionex.in/msaken/admin/public/uploads/products/${item.image}`,
                  }))
                : images
              : agentImages
          }
          // sliderStyle={{width: '95%'}}
          onCurrentImagePressed={() =>
            navigation.navigate('houseProperty', {p_id: item.id})
          }
        />
      </TouchableOpacity>

      <View style={styles.detailsContainer}>
        <View style={styles.optionConatiner}>
          <Text style={styles.title}>{item.name} </Text>

          <View style={styles.iconView}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={props.likeHandler.bind(
                this,
                item.id,
                props.myFavourite ? 0 : item.likestatus == 1 ? 0 : 1,
              )}>
              <Icon
                name={
                  props.myFavourite
                    ? 'favorite'
                    : item.likestatus == 1
                    ? 'favorite'
                    : 'favorite-border'
                }
                size={20}
                color={colors.themeRed}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => ShareProperty(item.prourl)}
              style={{marginLeft: 8, justifyContent: 'center'}}>
              {props.agent ? (
                <FA name="share" size={17} color={colors.darkGrey} />
              ) : (
                <Image
                  style={styles.shareImage}
                  source={require('../../assets/share.png')}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.address}>{item.p_location}</Text>
        </View>

        <View style={{marginTop: 10}}>
          <HouseInfo data={item} price={false} />
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {item.price + ' SAR'}{' '}
            {item.property_for === 'rent' && (
              <Text
                style={[
                  styles.price,
                  {fontSize: 10, fontFamily: 'Roboto-Medium'},
                ]}>
                /{language.month}
              </Text>
            )}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: colors.themeWhite,
    marginVertical: 10,
    width: '95%',
    alignSelf: 'center',
    elevation: 1,
  },
  sliderConatiner: {},
  image: {
    width: '100%',
    height: 150,
  },
  detailsContainer: {
    padding: 10,
  },
  optionConatiner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    // fontWeight: 'bold',
    fontFamily: 'Roboto-Medium',
    color: 'black',
    fontSize: 14,
  },
  iconView: {
    flexDirection: 'row',
  },
  address: {
    marginLeft: 3,
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.inputFontBlack,
  },
  addressContainer: {
    marginTop: 5,
    flexDirection: 'row',
    // alignItems: 'center',
  },

  houseContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  houseItem: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    color: colors.grey,
    marginLeft: 5,
    fontSize: 12,
  },
  priceContainer: {
    marginTop: 5,
  },
  price: {
    fontSize: 18,
    color: colors.themeRed,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
  },

  premiumText: {
    fontSize: 10,
    fontFamily: 'Roboto-Medium',
    color: colors.themeWhite,
  },
  premiumStyle: {
    width: '25%',
    paddingVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: colors.themeRed,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  shareImage: {
    width: 14,
    height: 16,
  },
});

export default RentSaleInfo;
