import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ProgressBar, Modal, Portal, Button} from 'react-native-paper';

import StepIndicator from 'react-native-step-indicator';

import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Dropdown} from 'react-native-element-dropdown';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import SwipeButton from 'rn-swipe-button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useFocusEffect} from '@react-navigation/native';
import Colors from '../Constants/Colors';
// import Icon from 'react-native-vector-icons/mna'
import PrimaryButton from '../Components/PrimaryButton';
import ApiUrl from '../Constants/ApiUrl';

import AppContext from '../Context/AppContext';
import check from '../assets/Check.png';
import folderIcon from '../assets/folder.png';

const Analyse = props => {
  const [step, setStep] = useState(0);

  const [expertVideo, setExpertVideo] = useState(null);
  const [loadingVideoList, setLoadingVideoList] = useState(false);
  const [visible, setVisible] = useState(false);
  // const [expertNames, setExpertNames] = useState([])
  const [expertName, setExpertName] = useState('');
  const [athleteName, setAthleteName] = useState('');
  // const [athletes, setAthletes] = useState([])
  // const [sportName, setSportName] = useState('')

  const {user, athletes, expertNames} = useContext(AppContext);

  const [expertVideos, setExpertVideos] = useState([]);
  const [note, setNote] = useState('');
  const player = useRef();
  const [loading, setLoading] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);

  const [studentVideoName, setStudentVideoName] = useState('');
  const [studentVideo, setStudentVideo] = useState();

  const [progress, setProgress] = useState(0);
  const [requestLoading, setRequestLoading] = useState(false);

  const interval = useRef(null);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setExpertVideo(null);
        setAthleteName('');
        // setAthletes([])

        // setSports([])
        setStudentVideoName('');
        setStep(0);
        setProgress(0);
        clearInterval(interval.current);
      };
    }, []),
  );

  const getExpertFilters = ({value, Sport_Name}) => {
    setExpertName({value, Sport_Name});
    setLoadingVideoList(true);
    fetch(
      `https://regis.staiideploy.com/expert_filter?academy=${user.accadamy_id}&sports=${Sport_Name}&Expert_ID=${value}&mongo_userid=dsights&mongo_password=dsights`,
    )
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.length === 0) {
          return Alert.alert('', 'No experts available');
        }
        console.log(data);
        setExpertVideos(data);
      })
      .catch(e => Alert.alert('', e.message))
      .finally(() => setLoadingVideoList(false));
  };

  const onSubmit = async () => {
    if (step < 1) {
      if (!expertVideo) {
        return Alert.alert('', 'Expert Video is required', [
          {style: 'default'},
        ]);
      }
      setStep(1);
    } else if (step === 1) {
      if (!studentVideoName) {
        return Alert.alert('', 'Video Name is Required');
      } else if (!studentVideo) {
        return Alert.alert('', 'Video is required');
      } else if (!athleteName) {
        return Alert.alert('', 'Athlete Name is required');
      }
      setStep(2);
    } else if (step === 2) {
      if (!note) {
        return Alert.alert('', 'Please Write a Note');
      }
      //https://student.staiideploy.com/student_api
      setRequestLoading(true);
      try {
        const response = await fetch(
          'https://student.staiideploy.com/student_api',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              academy: user.accadamy_id,
              Expert_ID: expertName.value,
              Exp_video_path: expertVideo.exp_video_path,
              Student_ID: athleteName.value,
              Stu_video_path: `${studentVideo}mp4`,

              sports: athleteName.Sport_Name,
              mongo_userid: 'dsights',
              mongo_password: 'dsights',
            }),
          },
        );
        const resData = await response.json();
        console.log(resData, 'kkalsjdkl');

        if (resData.s_code == 502) {
          Alert.alert('', resData.msg);
          setRequestLoading(false);
          // throw new Error(resData.msg);
        }

        if (!response.ok) {
          setRequestLoading(false);

          Alert.alert('', JSON.stringify(resData));
          throw new Error(resData);
        }

        await fetch('https://repit.staiideploy.com/repeat', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            // academy: user.academy,
            // sports: user.sport.Sport_Name,
            Expert_ID: expertName.value,
            academy: user.accadamy_id,
            sports: athleteName.Sport_Name,
            Exp_video_path: expertVideo.exp_video_path,
            Stu_video_path: `${studentVideo}mp4`,
            Student_ID: athleteName.value,
            mongo_userid: 'dsights',
            mongo_password: 'dsights',
          }),
        })
          .then(res => res.json())
          .then(res => {
            // setRequestLoading(false)
            console.log(res, 'kll');

            console.log(res);
            props.navigation.navigate('analysis1', {
              data: res,
              improvementList: resData.improvment_list,
              overallScore: resData.overall_score,
              expertVideo: expertVideo,
              athleteName,
              sports: expertName.Sport_Name,
            });
            // props.navigation.navigate('analysis1')
          })
          .catch(e => {
            Alert.alert('', e.message);
            console.log(e);
            // setRequestLoading(false)
          })
          .finally(() => setRequestLoading(false));
      } catch (e) {
        Alert.alert(e.message);
      }
      setRequestLoading(false);
    }
  };

  const studentVideoHandler = text => {
    setStudentVideoName(text);
  };

  const stepItem = ({position, stepStatus}) => {
    return (
      <>
        {stepStatus === 'finished' && (
          <LinearGradient
            colors={['#0038F5', '#9F03FF']}
            style={{padding: 20}}
            start={{x: 0, y: 0.5}}
            end={{x: 1, y: 0.5}}>
            <Image source={check} style={{width: 20, height: 20}} />
          </LinearGradient>
        )}
        {stepStatus === 'current' && (
          <LinearGradient
            colors={['#0038F5', '#9F03FF']}
            start={{x: 0, y: 0.5}}
            end={{x: 1, y: 0.5}}
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'DMSans-Bold',
              }}>
              {position + 1}
            </Text>
          </LinearGradient>
        )}
        {stepStatus === 'unfinished' && (
          <LinearGradient
            colors={['#333333', '#333333']}
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'DMSans-Bold',
              }}>
              {position + 1}
            </Text>
          </LinearGradient>
        )}
      </>
    );
  };
  const submitButton = () => {
    if (step < 2) {
      return (
        <PrimaryButton style={styles.button} onPress={onSubmit}>
          Next
        </PrimaryButton>
      );
    } else {
      return (
        <SwipeButton
          disabledRailBackgroundColor="#cccc"
          onSwipeSuccess={onSubmit}
          railBackgroundColor={Colors.primary}
          // shouldResetAfterSuccess

          containerStyles={{borderRadius: 30, paddingVertical: 5}}
          // railStyles={{borderRadius: 20}}
          // containerStyles={{paddingLeft: 10, paddingVertical: 5}}
          // railStyles={{paddingRight: 10}}
          titleStyles={{fontFamily: 'Inter-ExtraBold'}}
          thumbIconBackgroundColor="#FFFFFF"
          railFillBackgroundColor={Colors.primary}
          thumbIconBorderColor="white"
          railFillBorderColor={Colors.primary}
          title="Swipe to Analyse"
          thumbIconComponent={() => (
            <Icon name="arrow-forward" color={'black'} size={16} />
          )}
        />
      );
    }
  };
  // console.log(studentVideo)

  const accessCamera = () => {
    const options = {
      path: 'images',
      mediaType: 'video',
      saveToPhotos: true,
      videoQuality: 'high',
    };

    launchCamera(options, response => {
      setProgress(0);
      console.log(response);
      if (response.cancel) {
        return Alert.alert(
          'Cancelled',
          'Module was cancelled'[{text: 'Cancel', style: 'cancel'}],
        );
      }
      if (response.assets) {
        uploadSelectedVideo(response.assets[0]);

        // setStudentVideo(response.assets[0])
      }

      setVisible(false);
    });
  };
  const accessGallery = () => {
    const options = {
      path: 'images',
      mediaType: 'video',
    };

    launchImageLibrary(options, response => {
      if (response.cancel) {
        return Alert.alert(
          'Cancelled',
          'Module was cancelled'[{text: 'Cancel', style: 'cancel'}],
        );
      }
      if (response.assets) {
        setProgress(0);
        uploadSelectedVideo(response.assets[0]);
      }

      setVisible(false);
    });
  };

  const uploadSelectedVideo = async videoToUpload => {
    const formData = new FormData();
    formData.append('fileToUpload', {
      name: videoToUpload.fileName,
      uri: videoToUpload.uri,
      type: videoToUpload.type,
    });
    formData.append('token', 'asdkjfhalisdhglsadsfgsdgad');
    clearInterval(interval.current);
    try {
      interval.current = setInterval(() => {
        setProgress(prev => {
          console.log(prev, 'prev');
          if (prev < 0.7) {
            return prev + 0.1;
          }
          return 0.7;
        });
      }, 3000);

      const response = await fetch(
        'https://staiigs.sector7.space/uploadVideo.php',
        {
          method: 'POST',
          body: formData,
        },
      );
      // console.log(response, 'videoRes');
      clearInterval(interval.current);
      const resData = await response.json();
      if (!response.ok) {
        console.log('asdadads');
        setProgress(0);

        throw new Error(resData.message);
      }
      console.log('upload video', resData);
      setProgress(1);
      setStudentVideo(resData.urlTogcp);
      // clearInterval(interval.current)
      return await resData;
    } catch (e) {
      Alert.alert('', e.message);
      console.log(e);
    }
  };

  const pickerHandler = () => {
    return (
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContainer}>
          {/* <View> */}
          <Text style={styles.alertHeading}>Choose an Option</Text>
          <View style={styles.modalButtonsContainer}>
            <Button onPress={accessCamera} color={Colors.primary}>
              Record a Video
            </Button>
            <Button
              onPress={accessGallery}
              color={Colors.primary}
              style={{
                fontSize: 20,
              }}>
              Choose from Library
            </Button>
          </View>
          {/* </View> */}
        </Modal>
      </Portal>
    );
  };

  const noteHandler = text => {
    setNote(text);
  };

  useEffect(() => {
    console.log(expertVideo);
  }, [expertVideo]);

  return (
    <SafeAreaView style={styles.screen}>
      <StepIndicator
        renderStepIndicator={stepItem}
        currentPosition={step}
        stepCount={3}
        customStyles={{
          stepIndicatorUnFinishedColor: '#333333',
          separatorStrokeWidth: 1,
          currentStepStrokeWidth: 0,
          labelColor: 'white',
          separatorUnFinishedColor: 'grey',
          separatorfinishedColor: 'grey',
        }}
      />
      <KeyboardAwareScrollView contentContainerStyle={{paddingBottom: 10}}>
        {step === 0 && (
          <>
            <Text style={styles.description}>
              Choose the expert’s video recording that serves as the benchmark
              for analysis
            </Text>
            <View>
              <Dropdown
                data={expertNames}
                valueField="value"
                labelField="label"
                search={true}
                style={styles.dropDownStyle}
                containerStyle={{
                  backgroundColor: '#2b2e3d',
                  borderRadius: 10,
                }}
                maxHeight={230}
                searchPlaceholder="Search"
                placeholder="Expert`s Name"
                selectedTextStyle={{color: 'white'}}
                onChange={getExpertFilters}
                activeColor="#2b2e3d"
                value={expertName.value}
                selectedStyle={{backgroundColor: '#000000'}}
                showsVerticalScrollIndicator={true}
                placeholderStyle={{color: 'grey'}}
              />
              {/* <Dropdown
                data={sports}
                valueField="value"
                labelField="label"
                search={true}
                style={styles.dropDownStyle}
                containerStyle={{
                  backgroundColor: '#2b2e3d',
                  borderRadius: 10,
                }}
                maxHeight={230}
                searchPlaceholder="Search"
                placeholder="Experts Sports"
                selectedTextStyle={{color: 'white'}}
                onChange={getExpertFilters}
                activeColor="#2b2e3d"
                value={expertSportName}
                selectedStyle={{backgroundColor: '#000000'}}
                showsVerticalScrollIndicator={true}
                placeholderStyle={{color: 'grey'}}
              /> */}
              {loadingVideoList ? (
                <ActivityIndicator
                  style={{marginTop: 20}}
                  size={'large'}
                  color={'white'}
                />
              ) : (
                <Dropdown
                  onFocus={() => setExpertVideo()}
                  data={expertVideos}
                  valueField="exp_video_path"
                  labelField={'exp_video_name'}
                  search={true}
                  inputSearchStyle={{height: 40}}
                  style={styles.dropDownStyle}
                  containerStyle={{
                    backgroundColor: '#2b2e3d',
                    borderRadius: 10,
                  }}
                  maxHeight={230}
                  searchPlaceholder="Search"
                  placeholder="Expert`s Video"
                  selectedTextStyle={{color: 'white'}}
                  onChange={value => setExpertVideo(value)}
                  activeColor="#2b2e3d"
                  value={expertVideo}
                  selectedStyle={{backgroundColor: '#000000'}}
                  showsVerticalScrollIndicator={true}
                  placeholderStyle={{color: 'grey'}}
                />
              )}
            </View>
            <>
              {expertVideo && (
                <View style={styles.videoContainer}>
                  {!playVideo ? (
                    <TouchableOpacity
                      style={styles.videoLoaderContainer}
                      activeOpacity={0.6}
                      onPress={() => setPlayVideo(true)}>
                      <Icon
                        name="play-arrow"
                        size={35}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>
                  ) : (
                    <>
                      {loading && (
                        <ActivityIndicator color="#DADADACC" size={70} />
                      )}

                      {expertVideo.exp_public_path ? (
                        <Video
                          source={{
                            // uri:
                            //   expertVideo ||
                            //   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                            uri: expertVideo.exp_public_path,
                          }}
                          ref={ref => {
                            player.current = ref;
                          }}
                          style={[
                            styles.backgroundVideo,
                            {
                              display: loading ? 'none' : 'flex',
                              height: 295,
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
                            fontFamily: 'Inter-Regular',
                            color: 'white',
                          }}>
                          Video Not Available
                        </Text>
                      )}
                    </>
                  )}
                </View>
              )}
            </>
            <Text
              style={[
                styles.description,
                {marginTop: expertVideo ? 10 : '85%'},
              ]}>
              Can’t find the video you’re looking for?
            </Text>
          </>
        )}
        {/* Step 2 starts here */}
        {step === 1 && (
          <>
            <View style={styles.videoUploadButton}>
              <TouchableOpacity onPress={() => setVisible(true)}>
                <Image source={folderIcon} style={styles.folderIcon} />

                <View style={{marginTop: 10, marginBottom: 10}}>
                  <Text style={styles.uploadText}>Upload</Text>
                  <Text style={styles.uploadText}>athlete’s video</Text>
                  <Text style={styles.uploadText}>recording</Text>
                </View>
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  fontSize: 12,
                  color: 'grey',
                  alignSelf: 'center',
                }}>
                Max Size : 20 MB
              </Text>
              <ProgressBar
                progress={progress}
                color="green"
                style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  marginTop: 10,
                  width: '100%',
                  // alignSelf: 'center',
                }}
              />
            </View>
            <View
              style={{
                borderRadius: 5,
                // borderColor: 'white',
                borderWidth: 0.5,
                paddingHorizontal: 3,
                marginTop: '50%',

                width: '95%',
                alignSelf: 'center',
                backgroundColor: '#2B2E3D',
              }}>
              <TextInput
                placeholder="Video Name"
                placeholderTextColor={'grey'}
                style={{color: 'white', flexGrow: 1}}
                value={studentVideoName}
                onChangeText={studentVideoHandler}
              />
            </View>

            <Dropdown
              data={athletes}
              valueField="value"
              labelField="label"
              search={true}
              style={[styles.dropDownStyle, {marginBottom: 20}]}
              containerStyle={{
                backgroundColor: '#2b2e3d',
                borderRadius: 10,
              }}
              searchPlaceholder="Search"
              placeholder="Athlete Name"
              selectedTextStyle={{color: 'white'}}
              onChange={text => setAthleteName(text)}
              activeColor="#2b2e3d"
              value={athleteName.value}
              maxHeight={230}
              selectedStyle={{backgroundColor: '#000000'}}
              showsVerticalScrollIndicator={true}
              placeholderStyle={{color: 'grey'}}
            />
            <View>
              {/* <Dropdown
                data={sports}
                valueField="value"
                labelField="label"
                search={true}
                style={styles.dropDownStyle}
                containerStyle={{
                  backgroundColor: '#2b2e3d',
                  borderRadius: 10,
                }}
                maxHeight={230}
                searchPlaceholder="Search"
                placeholder="Sports"
                selectedTextStyle={{color: 'white'}}
                onChange={(text) => setSportName(text.value)}
                activeColor="#2b2e3d"
                value={sportName}
                selectedStyle={{backgroundColor: '#000000'}}
                showsVerticalScrollIndicator={true}
                placeholderStyle={{color: 'grey'}}
              /> */}
            </View>
          </>
        )}
        {step === 2 && (
          <TextInput
            value={note}
            onChangeText={noteHandler}
            multiline={true}
            style={{
              backgroundColor: '#2B2E3D',
              height: 450,
              marginVertical: 30,
              borderRadius: 10,
              textAlignVertical: 'center',
              color: 'white',
              fontSize: 16,
              fontFamily: 'Inter-Medium',
              textAlign: 'center',
            }}
            placeholderTextColor="#878694"
            placeholder="Tap to add your notes
          here"
          />
        )}
        {pickerHandler()}
        {requestLoading ? (
          <ActivityIndicator style={{marginTop: 20}} size={60} color="white" />
        ) : (
          submitButton()
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
  },
  description: {
    alignSelf: 'center',
    marginTop: 40,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: 'white',
  },
  videoContainer: {
    height: 295,
    justifyContent: 'center',
    backgroundColor: '#770000',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 15,
  },
  videoLoaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: 57,
    height: 57,
    borderRadius: 57,
    alignSelf: 'center',
  },
  button: {
    marginTop: 10,
  },
  videoUploadButton: {
    padding: 10,
    paddingTop: 30,
    borderWidth: 0.5,
    borderStyle: 'dashed',
    borderRadius: 10,
    borderColor: 'grey',
    // alignItems: 'center',
    marginTop: 40,
  },
  folderIcon: {
    width: 48,
    height: 36,
    alignSelf: 'center',
  },
  uploadText: {
    fontFamily: 'Inter-Regular',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
  modalContainer: {
    padding: 20,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 5,
    backgroundColor: '#2B2E3D',
    zIndex: 100,
    opacity: 1,
  },
  modalButtonsContainer: {
    marginTop: 20,
  },
  alertHeading: {
    fontSize: 23,
    color: 'white',
    alignSelf: 'center',
  },
  dropDownStyle: {
    backgroundColor: '#2b2e3d',
    padding: 5,
    borderRadius: 5,
    paddingVertical: 5,
    width: '95%',
    marginTop: 10,
    alignSelf: 'center',
  },
});

export default Analyse;
