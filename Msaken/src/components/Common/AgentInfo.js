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

const AgentInfo = props => {
  const images = [require('../../assets/placeholder.jpg')];
  const navigation = useNavigation();

  const ShareProperty = shareLink => {
    Share.share({
      message: shareLink,
    });
  };

  const item = props.data;

  return (
    <TouchableOpacity
      style={[styles.itemContainer, item.id === 154 && {display: 'none'}]}
      activeOpacity={0.6}
      onPress={() => navigation.navigate('agentDetails', item.id)}>
      <TouchableOpacity
        activeOpacity={0.6}
        // onPress={() => navigation.navigate('agentDetails')}

        onPress={() => console.log('press')}>
        <SliderComp
          images={
            item.coverimage
              ? [
                  {
                    uri: `https://xionex.in/msaken/admin/public/uploads/products/${item.coverimage}`,
                  },
                ]
              : images
          }
          // sliderStyle={{width: '100%'}}
          onCurrentImagePressed={() =>
            navigation.navigate('agentDetails', item.id)
          }
        />
      </TouchableOpacity>

      <View style={styles.detailsContainer}>
        <View style={styles.optionConatiner}>
          <Text style={styles.title}>{item.full_name} </Text>

          <View style={styles.iconView}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={props.likeHandler.bind(this, item.id)}>
              <Icon
                name={item.likestatus == 1 ? 'favorite' : 'favorite-border'}
                size={20}
                color={colors.themeRed}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() =>
                ShareProperty(
                  `https://xionex.in/msaken/#/agentdetails/id/${item.id}`,
                )
              }
              style={{
                marginLeft: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={styles.shareImage}
                source={require('../../assets/share.png')}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.addressContainer}>
          <Icon name="location-on" color={colors.themeRed} size={15} />
          <Text style={styles.address}>{item.company_add}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    // paddingHorizontal: 20,

    alignItems: 'center',
    marginVertical: 10,
    // paddingBottom: 50,
  },
  itemContainer: {
    // marginHorizontal: 20,
    backgroundColor: colors.themeWhite,
    marginVertical: 10,
    elevation: 1,
    // paddingHorizontal: 2,
    width: '95%',
    alignSelf: 'center',
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
  // statusButton: {
  //   marginLeft: 10,
  //   width: '25%',
  //   padding: 5,
  //   alignItems: 'center',
  // },
  // status: {
  //   fontSize: 12,
  //   color: colors.themeWhite,
  // },
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

export default AgentInfo;
