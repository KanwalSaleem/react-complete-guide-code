import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {ProgressBar, Portal, Modal, Button} from 'react-native-paper';

import {Dropdown} from 'react-native-element-dropdown';
import Colors from '../Constants/Colors';
import BlueButton from '../Components/BlueButton';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AppContext from '../Context/AppContext';
import ApiUrl from '../Constants/ApiUrl';

const UploadExpertVideo = () => {
  const [videoName, setVideoName] = useState('');

  const [sportName, setSportName] = useState('');
  const [sports, setSports] = useState([{value: '1', label: '1'}]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const [coachName, setCoachName] = useState('');
  // const [coaches, setCoaches] = useState([{value: '1', label: '1'}])
  const [visible, setVisible] = useState(false);
  const [video, setVideo] = useState();
  const [progress, setProgress] = useState(0);
  const interval = useRef(null);
  const {user, expertNames: coaches} = useContext(AppContext);
  const progressInterval = useRef();

  const onSubmit = async () => {
    if (!video) {
      return Alert.alert('', 'Video is required');
    }
    if (!videoName) {
      return Alert.alert('', 'Video Name is required');
    }
    if (!coachName) {
      return Alert.alert('', 'Coach Name is required');
    }

    if (!description) {
      return Alert.alert('', 'Description is required');
    }
    setLoading(true);
    try {
      //https://expert.staiideploy.com/expert_api
      const response = await fetch(
        'https://expert.staiideploy.com/expert_api ',
        {
          method: 'POST',
          body: JSON.stringify({
            academy: user.accadamy_id,
            sports: coachName.Sport_Name,
            Expert_ID: user.user_id,
            Exp_video_path: `${video}mp4`,
            mongo_userid: 'dsights',
            mongo_password: 'dsights',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const resData = await response.json();
      console.log('response', resData);

      if (resData.s_code == 200) {
        setSportName('');
        setDescription('');
        setVideoName('');
        setVideo();
        setProgress(0);
        Alert.alert('', 'Expert Video Uploaded Successfully');
      } else if (resData.s_code == 502) {
        Alert.alert('', resData.msg);
        throw new Error(resData.msg);
      }

      console.log(resData);
    } catch (e) {
      Alert.alert('', e.message);
    }
    setLoading(false);
  };

  const uploadSelectedVideo = async videoToUpload => {
    const formData = new FormData();
    formData.append('fileToUpload', {
      name: videoToUpload.fileName,
      uri: videoToUpload.uri,
      type: videoToUpload.type,
    });
    formData.append('token', 'asdkjfhalisdhglsadsfgsdgad');
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
      clearInterval(interval.current);
      const resData = await response.json();
      console.log(response, 'asdasd');
      if (!response.ok) {
        setProgress(0);
        console.log('asdadads');
        throw new Error(resData.message);
      }
      console.log(resData);
      setProgress(1.0);
      setVideo(resData.urlTogcp);
      // setProgress(0)
      clearInterval(progressInterval.current);
      return resData;
    } catch (e) {
      setProgress(0);
      Alert.alert(e.message);
      console.log(e);
    }
  };
  const accessCamera = () => {
    const options = {
      path: 'images',
      mediaType: 'video',
      videoQuality: 'high',
    };

    launchCamera(options, response => {
      if (response.cancel) {
        return Alert.alert(
          'Cancelled',
          'Module was cancelled'[{text: 'Cancel', style: 'cancel'}],
        );
      }
      if (response.assets) {
        setProgress(0);
        // setVideo(response.assets[0])
        uploadSelectedVideo(response.assets[0]);
      }

      // register('photo', {value: photo.current})
      // photo.current = response.assets ? response.assets[0] : undefined
      // images[index] = uri
      // setValue('photo', photo.current, {
      //   shouldValidate: true,
      //   shouldDirty: true,
      // })
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
        // setVideo(response.assets[0])
        uploadSelectedVideo(response.assets[0]);
      }

      // photo.current = response.assets ? response.assets[0] : undefined
      // setValue('photo', photo.current)
      setVisible(false);
    });
  };

  // }, [user.accadamy_id])

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

  return (
    <View style={styles.screen}>
      {pickerHandler()}
      <Text style={styles.heading}>Upload Expert Video</Text>
      <View style={styles.videoContainer}>
        <TouchableOpacity onPress={() => setVisible(true)}>
          <Image
            source={require('../assets/image.png')}
            style={{width: 24, height: 24, alignSelf: 'center'}}
          />
          <Text
            style={[
              styles.heading,
              {fontSize: 20, marginTop: 5, alignSelf: 'center'},
            ]}>
            Shoot or{' '}
            <Text style={{textDecorationLine: 'underline'}}>browse</Text> a file
          </Text>
        </TouchableOpacity>
        <Text style={styles.videoSizeText}>MP4 or MOV. (Max 500MB)</Text>
        <ProgressBar
          progress={progress}
          color={Colors.primary}
          visible={true}
          style={{backgroundColor: 'white', borderRadius: 10, marginTop: 15}}
        />
      </View>
      <Text style={styles.informationHeading}>Information</Text>
      <View
        style={{
          borderRadius: 5,
          // borderColor: 'white',
          borderWidth: 0.5,
          paddingHorizontal: 3,
          // marginTop: 60,
          width: '100%',
          alignSelf: 'center',
          backgroundColor: '#2B2E3D',
        }}>
        <TextInput
          placeholder="Video Name"
          placeholderTextColor={'white'}
          style={{color: 'white', flexGrow: 1}}
          value={videoName}
          onChangeText={setVideoName}
        />
      </View>

      <Dropdown
        data={coaches}
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
        onChange={({value, Sport_Name}) => setCoachName({value, Sport_Name})}
        activeColor="#2b2e3d"
        value={coachName.value}
        selectedStyle={{backgroundColor: '#000000'}}
        showsVerticalScrollIndicator={true}
        placeholderStyle={{color: 'white'}}
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
        placeholder="Sports"
        selectedTextStyle={{color: 'white'}}
        onChange={(text) => setSportName(text.value)}
        activeColor="#2b2e3d"
        value={sportName}
        selectedStyle={{backgroundColor: '#000000'}}
        showsVerticalScrollIndicator={true}
        placeholderStyle={{color: 'white'}}
      /> */}

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={text => setDescription(text)}
        style={styles.descriptionText}
        placeholderTextColor={'white'}
      />
      {loading ? (
        <ActivityIndicator
          size={'large'}
          color={'white'}
          style={{marginTop: 20}}
        />
      ) : (
        <BlueButton
          style={{marginTop: 20, width: '100%'}}
          icon={true}
          onPress={onSubmit}>
          Upload to Bank
        </BlueButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
  },
  heading: {
    color: 'white',
    fontFamily: 'Epilogue-VariableFont_wght',
    fontWeight: '700',
    fontSize: 24,
  },
  videoContainer: {
    backgroundColor: '#333',
    width: '98%',
    padding: 10,
    paddingVertical: 25,

    borderRadius: 20,
    // alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  videoSizeText: {
    fontFamily: 'Epilogue-VariableFont_wght',
    fontWeight: '500',
    fontSize: 13,
    marginTop: 5,
    color: '#F8F8F8',
    alignSelf: 'center',
  },
  informationHeading: {
    fontFamily: 'Epilogue-VariableFont_wght',
    fontSize: 18,
    color: 'white',
    fontWeight: '700',
    marginVertical: 10,
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
    width: '99%',
    marginTop: 10,
    alignSelf: 'center',
  },
  descriptionText: {
    borderRadius: 5,
    // borderColor: 'white',
    borderWidth: 0.5,
    paddingHorizontal: 3,
    // marginTop: 100,
    marginTop: 10,
    fontSize: 16,
    height: 154,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#2B2E3D',
    textAlignVertical: 'top',
    color: 'white',
    padding: 10,
    paddingLeft: 15,
  },
});

export default UploadExpertVideo;
