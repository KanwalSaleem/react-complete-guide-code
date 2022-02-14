import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../Constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import {TextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import AppContext from '../../Context/AppContext';
const Analysis = ({props, params: {data, overallScore, athleteName}}) => {
  console.log(athleteName, 'sss');
  const navigation = useNavigation();
  // console.log(athleteName);
  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.analyseContainer}>
          <View style={styles.infoMainContainer}>
            <View style={styles.infoContainer}>
              <Text style={styles.bulletPoint}>{'\u25CF'}</Text>
              <Text style={styles.title}>Expert Reps</Text>
            </View>
            <Text style={styles.text}>{data['Expert Repetition Count']}</Text>
          </View>
          <View
            style={[
              styles.infoMainContainer,
              {flexDirection: 'row', width: '40%'},
            ]}>
            <LinearGradient
              colors={['#cccc', '#CCC', '#CCC']}
              style={{
                height: 60,
                width: 2,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                opacity: 0.4,
              }}></LinearGradient>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 10,
              }}>
              <View style={styles.infoContainer}>
                <Text style={[styles.bulletPoint, {color: '#FB596D'}]}>
                  {'\u25CF'}
                </Text>
                <Text style={styles.title}>Athlete Reps</Text>
              </View>
              <Text style={styles.text}>
                {data['Student Repetition Count']}
              </Text>
            </View>
            <LinearGradient
              colors={['#cccc', '#CCC', '#CCC']}
              style={{
                height: 60,
                width: 2,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                opacity: 0.4,
              }}></LinearGradient>
          </View>
          <View style={styles.infoMainContainer}>
            <View style={styles.infoContainer}>
              <Text style={[styles.bulletPoint, {color: '#4ED0ED'}]}>
                {'\u25CF'}
              </Text>
              <Text style={styles.title}>Deviation</Text>
            </View>
            <Text style={[styles.text, {color: '#A80000'}]}>
              {data['Expert Repetition Count'] -
                data['Student Repetition Count']}
            </Text>
          </View>
        </View>
        <View style={styles.analyseContainer}>
          <View style={styles.infoMainContainer}>
            <View style={styles.infoContainer}>
              <Text style={styles.bulletPoint}>{'\u25CF'}</Text>
              <Text style={styles.title}>Expert Time</Text>
            </View>
            <Text style={styles.text}>
              {data['Expert video duration'].replace('Second', '')}
            </Text>
          </View>
          <View
            style={[
              styles.infoMainContainer,
              {flexDirection: 'row', width: '40%'},
            ]}>
            <LinearGradient
              colors={['#cccc', '#CCC', '#CCC']}
              style={{
                height: 60,
                width: 2,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                opacity: 0.4,
              }}></LinearGradient>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 10,
              }}>
              <View style={styles.infoContainer}>
                <Text style={[styles.bulletPoint, {color: '#FB596D'}]}>
                  {'\u25CF'}
                </Text>
                <Text style={styles.title}>Athlete Time</Text>
              </View>
              <Text style={styles.text}>
                {data['Expert video duration'].replace('Second', '')}
              </Text>
            </View>
            <LinearGradient
              colors={['#cccc', '#CCC', '#CCC']}
              style={{
                height: 60,
                width: 2,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                opacity: 0.4,
              }}></LinearGradient>
          </View>
          <View style={styles.infoMainContainer}>
            <View style={styles.infoContainer}>
              <Text style={[styles.bulletPoint, {color: '#4ED0ED'}]}>
                {'\u25CF'}
              </Text>
              <Text style={styles.title}>Deviation</Text>
            </View>
            <Text style={[styles.text, {color: '#00A807'}]}>
              {data['Expert video duration'].replace('Second', '') -
                data['Student video duration'].replace('Second', '')}
            </Text>
          </View>
        </View>
        <View style={styles.scoreContainer}>
          <View style={styles.bodyScoreContainer}>
            <Text style={styles.scoreTitle}>Body Score</Text>
          </View>
          <TouchableOpacity
            style={[styles.bodyScoreContainer, {backgroundColor: '#24292B'}]}
            activeOpacity={0.6}
            onPress={() => {
              navigation.navigate('improvements', {athleteName});
            }}>
            <Text style={styles.scoreTitle}>Improvements</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.score}>{overallScore.toFixed(2)}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    height: '97%',
    marginTop: 15,
  },

  analyseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: 10,
    height: 89,
  },
  infoMainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },

  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulletPoint: {
    fontSize: 18,
    fontFamily: '',
    color: Colors.primary,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#A2A2A2',
    paddingLeft: 7,
  },
  text: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#ECECEC',
    marginTop: 5,
  },
  scoreContainer: {
    marginTop: 20,

    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    borderRightWidth: 4,
    borderRightColor: '#3427F8',
    flexDirection: 'row',
  },
  bodyScoreContainer: {
    width: '50%',
    backgroundColor: '#181722',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreTitle: {
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.white,
  },
  score: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 72,
    paddingHorizontal: 10,

    fontFamily: 'KronaOne-Regular',
    color: Colors.white,
  },
});

export default Analysis;
