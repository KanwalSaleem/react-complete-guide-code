import React, {useState, useCallback, useContext} from 'react';
import {View, Text, TextInput, StyleSheet, Alert, FlatList} from 'react-native';
import {color} from 'react-native-reanimated';
import Colors from '../Constants/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/native';
import AppContext from '../Context/AppContext';
import ProgressDialog from 'react-native-progress-dialog';

const Search = props => {
  const [analysisData, setAnalysisData] = useState([]);
  const {user} = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const athleteName = {
    Sport_Name: user.Sport_Name,
    label: user.user_name,
    value: user.user_id,
  };
  useFocusEffect(
    useCallback(() => {
      pastAnalytics();
    }, []),
  );
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
        date: '19 Nov',
        time: '11:23:46',
        // athleteName: 'Athlete Name',
        coachName: 'Coach Name',
      }));
      setAnalysisData(validAnalysis);
    } catch (e) {
      Alert.alert('', e.message);
    }
    setLoading(false);
  }, []);

  return (
    <View style={styles.screen}>
      <ProgressDialog visible={loading} />
      <View style={styles.mainContainer}>
        <Text style={styles.heading}>Videos</Text>
        {/* <View style={styles.input}>
          <Icon
            name="search"
            color={'#757575'}
            size={30}
            style={{marginRight: 5}}
          />

          <TextInput
            placeholder="Search...."
            placeholderTextColor={Colors.textIput}
            style={styles.search}
            value={search}
            onChangeText={updateSearch}
          />
        </View> */}
        <FlatList
          data={analysisData}
          keyExtractor={item => item.run_id}
          style={{height: '90%'}}
          ListEmptyComponent={
            <View
              style={{
                marginTop: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontSize: 20}}>
                No Videos Available
              </Text>
            </View>
          }
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.videoMainContainer}
              activeOpacity={0.6}
              onPress={() =>
                props.navigation.navigate('searchDetails', {
                  ...item,
                  athleteName,
                })
              }>
              <View style={styles.videoContainer}></View>
              <View style={styles.titleContainer}>
                <View style={styles.infoContainer}>
                  <Text style={styles.title}>{item.std_video_name}</Text>
                  <Text style={styles.subTitle}>Video Title - UID</Text>
                </View>

                <View style={styles.coachConatiner}>
                  <Text style={styles.coach}>Coach</Text>
                  <View style={styles.sportContainer}>
                    <Text style={styles.sport}>{item.sports}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  mainContainer: {
    marginTop: 60,
    paddingHorizontal: 15,
  },
  heading: {
    color: Colors.white,
    fontSize: 35,
    fontFamily: 'Inter-Bold',
  },
  input: {
    width: '100%',
    backgroundColor: '#313131',
    borderRadius: 100,
    paddingHorizontal: 10,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  search: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FBFBFB',
    flexBasis: '100%',
  },
  videoMainContainer: {
    marginTop: 50,
    flexDirection: 'row',
  },
  videoContainer: {
    backgroundColor: Colors.darkRed,
    width: '45%',
    height: 129,
    borderRadius: 10,
  },
  titleContainer: {
    width: '55%',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  infoContainer: {},
  title: {
    fontFamily: 'Inter-ExtraBold',
    fontSize: 22,
    color: Colors.white,
  },
  subTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.white,
    marginTop: 2,
  },
  coachConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  coach: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#7D7D7D',
    maxWidth: '50%',
  },
  sportContainer: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    maxWidth: '50%',
    paddingVertical: 5,
    paddingHorizontal: 12,
  },

  sport: {
    fontFamily: 'Inter-ExtraBold',
    fontSize: 12,
    color: Colors.black,
  },
});

export default Search;
