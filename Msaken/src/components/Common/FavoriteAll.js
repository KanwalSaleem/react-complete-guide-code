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
import FA from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from '../../context/AuthContext';
import AgentInfo from './AgentInfo';
import RentSaleInfo from './RentSaleInfo';

const FavoriteAll = props => {
  const images = [require('../../assets/placeholder.jpg')];
  const navigation = useNavigation();
  const agentImages = [require('../../assets/property.png')];
  const {language, selectedLanguage} = useContext(AuthContext);

  return (
    <View style={{...styles.listContainer, ...props.style}}>
      <FlatList
        data={props.data}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View>
            <Text
              style={[
                styles.title,
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {language.noFavoritesToShow}
            </Text>
          </View>
        )}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return item.role === 'agent' ? (
            <AgentInfo
              data={item}
              agent={true}
              likeHandler={props.agentLikeHandler}
            />
          ) : (
            <RentSaleInfo data={item} likeHandler={props.likeHandler} />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    // paddingHorizontal: 20,

    marginVertical: 10,
    // paddingBottom: 50,
  },
  itemContainer: {
    // marginHorizontal: 20,
    backgroundColor: colors.themeWhite,
    marginVertical: 10,
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
    marginLeft: 20,
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

export default FavoriteAll;
