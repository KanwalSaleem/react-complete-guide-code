import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import color from '../common/colors';
import {useNavigation} from '@react-navigation/native';
import {Card} from 'react-native-paper';
import {AuthContext} from '../context/AuthContext';

const AboutUs = () => {
  const navigation = useNavigation();
  const {language} = useContext(AuthContext);

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.mainContainer}>
        <Card style={styles.infoContainer}>
          <View style={styles.imageContainer}>
            <View style={styles.titleContainer}>
              <View style={styles.titleView}>
                <Text style={styles.title}>{language.msaken}</Text>
                <Text style={styles.subTitle}>{language.realEstate}</Text>
              </View>
              <Text style={styles.infoText}>
                {
                  language.msakenGroupIsReinventingRealEstateToMakeItEasierYoMoveOnToTheNextChapter
                }
              </Text>
            </View>
            <Image
              source={require('../assets/about-us.png')}
              style={styles.image}
            />
          </View>
          <View style={styles.missionContainer}>
            <Text style={styles.missionTilte}>{language.ourMission}</Text>
            <Text style={[styles.infoText, {fontSize: 14}]}>
              {language.aboutUsDetails}
            </Text>
          </View>
        </Card>
        <View style={styles.contactContainer}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => navigation.navigate('helpUs')}>
            <Text style={styles.buttonTitle}>{language.contactUs}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: color.themeWhite,
  },
  mainContainer: {
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
  infoContainer: {
    paddingBottom: 30,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  imageContainer: {
    backgroundColor: color.inputBgGrey,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  titleContainer: {
    paddingLeft: 5,
    width: '50%',
    alignItems: 'center',
  },
  image: {
    width: '50%',
    height: 150,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Roboto-Bold',
    color: color.themeRed,
  },
  subTitle: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#3B3B3B',
    letterSpacing: 2,
  },
  titleView: {
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: color.darkGrey,
  },
  missionContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  missionTilte: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: color.titleBlack,
    marginBottom: 10,
  },
  contactContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  buttonContainer: {
    marginTop: 20,
    backgroundColor: '#36384C',
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  buttonTitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: color.themeWhite,
  },
});

export default AboutUs;
