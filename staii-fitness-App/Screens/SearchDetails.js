import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Colors from '../Constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PrimaryButton from '../Components/PrimaryButton';

const SearchDetails = ({route, navigation}) => {
  const {params} = route;
  const player = useRef();
  const [loading, setLoading] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);

  // const analyse = () => {
  //   if (!params.exp_video_path) {
  //     return Alert.alert('', 'Expert video not Available')
  //   }
  //   if (!params.std_video_path) {
  //     return Alert.alert('', 'Student video not Available')
  //   }
  //   setLoadingAnalysis(true)
  //   fetch('https://repit.staiideploy.com/repeat', {
  //     method: 'POST',
  //     headers: {'Content-Type': 'application/json'},
  //     body: JSON.stringify({
  //       // academy: user.academy,
  //       // sports: user.sport.Sport_Name,
  //       Expert_ID: item.exp_id,
  //       academy: item.academy,
  //       sports: item.sports,
  //       Exp_video_path: item.exp_video_path,
  //       Stu_video_path: item.std_video_path,
  //       Student_ID: item.std_id,
  //       mongo_userid: 'dsights',
  //       mongo_password: 'dsights',
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
  //       // setRequestLoading(false);
  //       console.log(res, 'kll')
  //       if (res.detail) {
  //         return Alert.alert('', res.detail[0].msg)
  //       }
  //       console.log(res)
  //       navigation.navigate('analysis1', {
  //         data: res,
  //       })
  //       // props.navigation.navigate('analysis1')
  //     })
  //     .catch((e) => {
  //       Alert.alert('', e.message)
  //       console.log(e)
  //       // setRequestLoading(false);
  //     })
  //     .finally(() => setLoadingAnalysis(false))
  // }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.mainVideoContainer}>
        <LinearGradient
          colors={['#212121', '#730000']}
          style={styles.videoContainer}>
          {!playVideo ? (
            <TouchableOpacity
              style={styles.videoLoaderContainer}
              activeOpacity={0.6}
              onPress={() => setPlayVideo(true)}>
              <Icon name="play-arrow" size={35} color={Colors.primary} />
            </TouchableOpacity>
          ) : (
            <>
              {loading && <ActivityIndicator color="#DADADACC" size={70} />}

              {params.std_public_path ? (
                <Video
                  source={{
                    uri: params.std_public_path,
                  }}
                  ref={ref => {
                    player.current = ref;
                  }}
                  style={[
                    styles.backgroundVideo,
                    {
                      display: loading ? 'none' : 'flex',
                      height: 323,
                      width: '100%',
                    },
                  ]}
                  controls={true}
                  resizeMode={'cover'}
                  bufferConfig={{
                    minBufferMs: 15000,
                    maxBufferMs: 50000,
                    bufferForPlaybackMs: 2500,
                    bufferForPlaybackAfterRebufferMs: 5000,
                  }}
                  onBuffer={e => console.log(e, 'heelo')}
                  onVideoBuffer={e => console.log(e, 'video')}
                  onLoad={e => setLoading(false)}
                  disableFocus
                  paused
                  onLoadStart={e => {
                    setLoading(true);
                  }}
                  posterResizeMode="cover"
                  onError={() => console.log('error')}
                />
              ) : (
                <Text
                  style={{
                    fontSize: 20,
                    alignSelf: 'center',
                    color: 'white',
                    fontFamily: 'Inter-Regular',
                  }}>
                  Video Not Available
                </Text>
              )}
            </>
          )}
          <Text style={styles.videoTitle}>{params.std_video_name}</Text>
        </LinearGradient>

        <View style={styles.titleContainer}>
          <Text style={styles.subTitle}>Video Title - UID</Text>
          <View style={styles.coachConatiner}>
            <Text style={styles.coach}>Coach Name</Text>
            <View style={styles.sportContainer}>
              <Text style={styles.sport}>{params.sports}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Video Description</Text>

        <Text style={styles.descriptionText}>
          {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisi quis
          ipsum, venenatis, augue. Ut ornare dolor scelerisque magna
          suspendisse. Ultricies commodo sit scelerisque gravida nisi quam
          ornare. Non ornare molestie donec bibendum egestas. Morbi arcu sit at
          nunc ornare. */}
        </Text>
      </View>
      {loadingAnalysis ? (
        <ActivityIndicator size="large" color={'white'} style={styles.button} />
      ) : (
        <PrimaryButton
          style={[styles.button, {height: 70, borderRadius: 60, width: '100%'}]}
          activeOpacity={0.6}
          childrenStyle={styles.childrenStyle}
          onPress={() => {
            navigation.navigate('analysis1', {
              athleteName: params.athleteName,
              improvementList: params.improvment_list,
              overallScore: params.final_similarity_score_ed,
              expertVideo: {
                exp_video_name: params.exp_video_name,
                exp_public_path: params.exp_public_path,
              },
              sports: params.sports,
              data: {
                'Expert Repetition Count': params.exp_repet_count,
                'Student Repetition Count': params.stu_repet_count,
                'Expert video duration': `${params.exp_duration}Second`,
                'Student video duration': `${params.stu_duration}Second`,
              },
            });
          }}>
          Analyse
        </PrimaryButton>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    // flex: 1,
    backgroundColor: Colors.black,
  },

  mainVideoContainer: {
    height: 452,
  },
  videoTitle: {
    position: 'absolute',
    bottom: 10,
    marginLeft: 15,
    fontFamily: 'Inter-Regular',
    fontSize: 30,
    color: Colors.white,
    fontWeight: '800',
  },
  videoContainer: {
    height: 323,
    justifyContent: 'center',
  },
  titleContainer: {
    marginHorizontal: 15,
    height: 129,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Inter-ExtraBold',
    fontSize: 22,
    color: Colors.white,
  },
  subTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 22,
    color: Colors.white,
    fontWeight: '800',
  },
  coachConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
  },
  coach: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: '#7D7D7D',
    maxWidth: '50%',
  },
  sportContainer: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    maxWidth: '50%',
    height: 40,
    paddingHorizontal: 20,
  },

  sport: {
    fontFamily: 'Inter-ExtraBold',
    fontSize: 15,
    color: Colors.black,
  },
  descriptionContainer: {
    paddingHorizontal: 15,
  },
  descriptionTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#7D7B63',
    fontStyle: 'italic',
  },
  descriptionText: {
    marginTop: 10,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.white,
    lineHeight: 23,
    marginBottom: '30%',
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
  button: {
    // position: 'absolute',
    // bottom: 0,
    marginTop: 30,
  },
  childrenStyle: {
    fontSize: 22,
    fontFamily: 'Inter-ExtraBold',
  },
});

export default SearchDetails;
