import React, {useEffect, useState, useCallback, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';

import Colors from '../Constants/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomBar from '../Components/BottomBar';
import AppContext from '../Context/AppContext';
import ProgressDialog from 'react-native-progress-dialog';

const DashBoard = props => {
  const {user} = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const athleteName = {
    Sport_Name: user.Sport_Name,
    label: user.user_name,
    value: user.user_id,
  };

  const pastAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://history.staiideploy.com/past_analysis?academy=${user.accadamy_id}&sports=${user.Sport_Name}&Student_ID=${user.user_id}&mongo_userid=dsights&mongo_password=dsights`,
      );
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message);
      }
      console.log(resData);
      const validAnalysis = resData.map(item => ({
        ...item,
        date: '',
        time: '',
        // athleteName: '',rr
        coachName: '',
      }));
      setAnalysisData(validAnalysis);
    } catch (e) {
      Alert.alert('', e.message);
    }
    setLoading(false);
  }, [user.user_id]);

  const goToVideo = item =>
    props.navigation.navigate('searchDetails', {...item, athleteName});

  useEffect(() => {
    pastAnalytics();
  }, [pastAnalytics]);
  const [analysisData, setAnalysisData] = useState([]);

  return (
    <View style={styles.screen}>
      <ProgressDialog visible={loading} />
      {/* <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => props.navigation.navigate('search')}
        style={styles.input}>
        <Icon
          name="search"
          color={Colors.grey}
          size={30}
          style={{marginRight: 5}}
        />
        <Text style={styles.search}>Search....</Text>
      </TouchableOpacity> */}
      <View style={styles.pastContainer}>
        <Text style={styles.pastTitle}>Past Analytics</Text>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => props.navigation.navigate('search')}>
          <Text style={styles.seeTitle}>See more</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.analysContainer}>
        <FlatList
          ListEmptyComponent={
            <Text style={{color: 'white', fontSize: 20}}>
              No Analysis available
            </Text>
          }
          horizontal={true}
          data={analysisData}
          keyExtractor={(item, index) => item.run_id}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={goToVideo.bind(this, item)}
                activeOpacity={0.6}
                style={styles.itemContainer}>
                <View style={styles.videoContainer}>
                  <TouchableOpacity
                    style={styles.videoLoaderContainer}
                    activeOpacity={0.6}>
                    <Icon name="play-arrow" size={35} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.titleConainer}>
                  <View style={styles.dateConainer}>
                    <Text style={styles.bulletText}>{'\u25CF'}</Text>
                    <Text style={styles.dateText}>{item.date}</Text>
                    <Text
                      style={[
                        styles.dateText,
                        {color: Colors.datkGrey, marginLeft: 5},
                      ]}>
                      {item.time}
                    </Text>
                  </View>
                  <Text style={styles.analysTitle}>{item.run_id}</Text>
                  <View style={styles.infoContainer}>
                    <View style={styles.infoInnerContainer}>
                      <Text style={styles.infoText}>{item.coachName}</Text>
                      <Text style={styles.infoText}>{item.exp_video_name}</Text>
                      <Text style={styles.infoText}>{item.athleteName}</Text>
                    </View>
                    <View style={styles.sportContainer}>
                      <Text style={styles.sportText}>{item.sports}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <BottomBar />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.black,
    alignItems: 'center',
  },

  input: {
    marginTop: 120,
    width: '90%',
    backgroundColor: '#22212F',
    borderRadius: 16,
    paddingHorizontal: 10,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },

  search: {
    fontFamily: 'Inter-Regular',
    fontSize: 19,
    color: Colors.textIput,
    flexBasis: '100%',
  },
  pastContainer: {
    width: '90%',
    marginVertical: 30,
    marginTop: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  pastTitle: {
    fontFamily: 'Inter-ExtraBold',
    fontSize: 24,
    color: Colors.headingColor,
  },
  seeTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 19,
    color: '#778CDC',
  },
  analysContainer: {
    paddingLeft: 30,
    width: '100%',
  },
  itemContainer: {
    width: 250,
    marginHorizontal: 10,
  },
  videoContainer: {
    backgroundColor: '#2B293C',
    height: 175,
    justifyContent: 'center',
    width: '100%',
    borderRadius: 16,
  },
  titleConainer: {marginVertical: 10},
  dateConainer: {
    flexDirection: 'row',
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.headingColor,
    fontStyle: 'italic',
  },
  bulletText: {
    marginRight: 7,
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: Colors.primary,
  },
  analysTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 19,
    color: '#B2C1FB',
    marginTop: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoInnerContainer: {width: '65%'},

  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.datkGrey,
  },

  sportContainer: {
    // width: '35%',
    // height: 45,
    backgroundColor: '#213327',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: 5,
    padding: 10,
  },
  sportText: {
    fontFamily: 'Inter-Regular',
    fontWeight: '800',
    fontSize: 17,
    color: '#68F359',
  },
  videoLoaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DADADACC',
    width: 57,
    height: 57,
    borderRadius: 57,
    alignSelf: 'center',
  },
});

export default DashBoard;
