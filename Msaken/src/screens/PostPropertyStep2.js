import React, {useState, useRef, useContext, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import colors from '../common/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Modal, Portal, Button} from 'react-native-paper';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useForm} from 'react-hook-form';
import Input from '../components/Common/Input';
import DocumentPicker from 'react-native-document-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';

const PostProperty2 = ({route, navigation}) => {
  const {language, selectedLanguage} = useContext(AuthContext);

  const postPropertyStep1Data = route.params;

  const [images, setImages] = useState([]);

  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();

  const [docData, setDocData] = useState();
  const [videoUrl, setVideoUrl] = useState('');
  const [floorData, setFloorData] = useState();

  const [meidaVisible, setMediaVisible] = useState(false);

  const floorPlan = require('../assets/floorplan.png');
  const videoImage = require('../assets/videoIcon.png');

  const {
    control,
    handleSubmit,
    formState: {isValid, errors},
    register,
    reset,
    setValue,
  } = useForm({
    mode: 'all',
  });

  const name = register('name');
  const phone = register('phone');
  const email = register('email');
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const photo = useRef();

  const setVideo = text => {
    setVideoUrl(text);
  };

  const MediatTips = () => {
    return (
      <Portal>
        <Modal
          visible={meidaVisible}
          onDismiss={() => setMediaVisible(false)}
          contentContainerStyle={styles.modalContainer}>
          <View>
            <View
              style={[
                styles.modalTilteContainer,
                selectedLanguage === 'arabic' && {flexDirection: 'row-reverse'},
              ]}>
              <Text style={[styles.modalTiltle]}>
                {language.msakenTipsForTakenPhotos}
              </Text>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setMediaVisible(false)}
                style={styles.closeIcon}>
                <Icon name="close" size={15} color={colors.grey} />
              </TouchableOpacity>
            </View>
            <View style={styles.tipsImageContainer}>
              <Image
                source={require('../assets/mediaTips.jpg')}
                style={styles.tipsImage}
              />
            </View>
            <View style={styles.tipsTextContainer}>
              <View
                style={[
                  styles.tipsView,
                  selectedLanguage === 'arabic' && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                <View style={styles.bulletPoints} />
                <Text
                  style={[
                    styles.mediaTipsText,
                    selectedLanguage === 'arabic' && {textAlign: 'right'},
                  ]}>
                  {
                    language.avoidTakingPicturesWhenThereIsNoNaturalLightTakeThemPreferablyDuringTheDay
                  }
                </Text>
              </View>

              <View
                style={[
                  styles.tipsView,
                  selectedLanguage === 'arabic' && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                <View style={styles.bulletPoints} />
                <Text
                  style={[
                    styles.mediaTipsText,
                    selectedLanguage === 'arabic' && {textAlign: 'right'},
                  ]}>
                  {
                    language.includePicturesOfTheCommonAreasSetTheRoomPictureAsMainPhoto
                  }
                </Text>
              </View>
              <View
                style={[
                  styles.tipsView,
                  selectedLanguage === 'arabic' && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                <View style={styles.bulletPoints} />
                <Text
                  style={[
                    styles.mediaTipsText,
                    selectedLanguage === 'arabic' && {textAlign: 'right'},
                  ]}>
                  {
                    language.uploadMoreThanPicturesAtLeastItShouldBePicturesPerBedroom
                  }
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setMediaVisible(false)}
              style={[styles.applyButton, {width: '50%'}]}>
              <Text style={styles.applyText}>{language.ok}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    );
  };

  const videoPickerhandler = async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [
          // DocumentPicker.types.pdf,
          // DocumentPicker.types.docx,
          // DocumentPicker.types.doc,
          // DocumentPicker.types.images,
          DocumentPicker.types.video,
        ],
      });

      setDocData(response[0]);

      setValue('doc', response[0]);
    } catch (e) {
      console.log(e);
    }
  };
  const floorPickerHandler = async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          // DocumentPicker.types.docx,
          // DocumentPicker.types.doc,
          DocumentPicker.types.images,
        ],
      });

      setFloorData(response[0]);

      setValue('floorDoc', response[0]);
    } catch (e) {
      console.log(e);
    }
  };

  const accessCamera = () => {
    const options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
    };

    launchCamera(options, response => {
      if (response.cancel) {
        return Alert.alert(
          'Cancelled',
          'Module was cancelled'[{text: 'Cancel', style: 'cancel'}],
        );
      }

      photo.current = response.assets ? response.assets[0] : undefined;
      response.assets && images.push(photo.current);
      // setImages(photo.current);
      // images[index] = uri
      setCameraModalVisible(false);
      setValue('photo', images);
    });
  };

  // {Function to launch gallery for main photo}

  const accessGallery = () => {
    const options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
    };

    launchImageLibrary(options, response => {
      if (response.cancel) {
        return Alert.alert(
          'Cancelled',
          'Module was cancelled'[{text: 'Cancel', style: 'cancel'}],
        );
      }
      console.log(response.assets);

      photo.current = response.assets ? response.assets[0] : undefined;
      response.assets && images.push(photo.current);
      // setImages(photo.current);
      setValue('photo', images);
      setCameraModalVisible(false);
    });
  };
  const removeImage = item => {
    setCameraModalVisible(true);
    setImages(prev => prev.filter(image => item.uri !== image.uri));
  };

  const imagePickModal = () => {
    return (
      <Portal>
        <Modal
          visible={cameraModalVisible}
          onDismiss={() => setCameraModalVisible(false)}
          contentContainerStyle={styles.imageModalContainer}>
          {/* <View> */}
          <Text
            style={[
              styles.alertHeading,
              selectedLanguage === 'arabic' && {textAlign: 'right'},
            ]}>
            {language.chooseAnOption}
          </Text>
          <View style={styles.modalButtonsContainer}>
            <Button
              onPress={accessCamera}
              color={colors.themeRed}
              style={{
                fontSize: 16,
                fontFamily: 'Roboto-Regular',
              }}>
              {language.takeAPhoto}
            </Button>
            <Button
              onPress={accessGallery}
              color={colors.themeRed}
              style={{
                fontSize: 16,
                fontFamily: 'Roboto-Regular',
              }}>
              {language.chooseAPhoto}
            </Button>
          </View>
          {/* </View> */}
        </Modal>
      </Portal>
    );
  };

  const onSubmit = data => {
    console.log(images);
    if (images.length >= 3) {
      navigation.navigate('postPropertyStep3', {
        postPropertyStep1Data: postPropertyStep1Data,
        step2FieldData: data,
        images: images,
        videoUrl: videoUrl,
        videoData: docData,
        floorData: floorData,
      });
    } else {
      Alert.alert('', language.uploadAtleastThreeImagesToPostTheProperty);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView contentContainerStyle={styles.screen}>
        <View style={{marginTop: 20}}>
          <View style={styles.contactContainer}>
            <Text
              style={[
                styles.propertyTitle,
                selectedLanguage === 'arabic' && {textAlign: 'right'},
              ]}>
              {language.contactInformation}
            </Text>
            <View
              style={[
                styles.propertyNameContainer,
                errors.name && {borderColor: colors.themeRed},
              ]}>
              <Input
                placeholder={language.name}
                name="name"
                control={control}
                rules={{required: true}}
                style={[
                  styles.inputText,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}
                ref={e => {
                  name.ref(e);
                  nameRef.current = e;
                }}
                onSubmitEditing={() => {
                  emailRef.current.focus();
                }}
                blurOnSubmit={false}
              />
            </View>

            <View
              style={[
                styles.propertyNameContainer,
                errors.email && styles.redBorder,
              ]}>
              <Input
                placeholder={language.email}
                name="email"
                control={control}
                style={[
                  styles.inputText,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}
                rules={{
                  required: true,
                  pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                }}
                ref={e => {
                  email.ref(e);
                  emailRef.current = e;
                }}
                onSubmitEditing={() => {
                  phoneRef.current.focus();
                }}
                blurOnSubmit={false}
                placeholderTextColor={Colors.darkGrey}
              />
            </View>
            <View
              style={[
                styles.propertyNameContainer,
                errors.phone && styles.redBorder,
              ]}>
              <Input
                placeholder={language.phoneNumber}
                name="phone"
                control={control}
                style={[
                  styles.inputText,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}
                rules={{
                  required: true,
                  type: 'number',
                  maxLength: 15,
                  minLength: 10,
                }}
                keyboardType="phone-pad"
                maxLength={15}
                ref={e => {
                  phone.ref(e);
                  phoneRef.current = e;
                }}
                onSubmitEditing={() => {
                  phoneRef.current.focus();
                }}
                blurOnSubmit={false}
                placeholderTextColor={Colors.darkGrey}
              />
            </View>
          </View>
          <View style={styles.mediaContainer}>
            <View
              style={[
                styles.mediaView,
                selectedLanguage === 'arabic' && {flexDirection: 'row-reverse'},
              ]}>
              <Text style={styles.mediaTitle}>{language.media}</Text>
              <TouchableOpacity
                style={[
                  styles.tipsContainer,
                  selectedLanguage === 'arabic' && {
                    flexDirection: 'row-reverse',
                  },
                ]}
                activeOpacity={0.6}
                onPress={() => setMediaVisible(true)}>
                <Icon name="photo-camera" size={20} />
                <Text style={styles.tipText}>{language.tips}</Text>
              </TouchableOpacity>
            </View>
            {/* <View style={styles.videoArea}>
              <View style={[styles.videoContainer, {width: '50%'}]}>
                <Text style={styles.propertyTitle}>{language.videoUrl}</Text>
                <Text style={styles.videoText}>
                  {
                    language.addOneVideoToYourListingToProvideMoreClarityToPotentialBuyerAboutYourListing
                  }
                </Text>
                <View style={[styles.propertyNameContainer]}>
                  <TextInput
                    placeholder="Enter URL"
                    style={styles.inputText}
                    multiline={true}
                    value={videoUrl}
                    onChangeText={setVideo}
                  />
                </View>
              </View>
              <View style={[styles.videoContainer, {width: '50%'}]}>
                <Text style={styles.propertyTitle}>{language.video}</Text>
                <Text style={styles.videoText}>
                  {
                    language.addOneVideoToYourListingToProvideMoreClarityToPotentialBuyerAboutYourListing
                  }
                </Text>
                {!docData?.uri ? (
                  <TouchableOpacity
                    onPress={videoPickerhandler}
                    style={styles.videoIconContainer}>
                    <Icon name="add" color={colors.grey} size={40} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.fileView, {width: '40%'}]}
                    onPress={videoPickerhandler}
                    // onLongPress={() => setDocData()}
                  >
                    <Image
                      style={styles.videoImage}
                      // source={{uri: docData?.uri}}
                      source={videoImage}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View> */}

            <View style={[styles.videoArea]}>
              <View style={{width: '100%'}}>
                <Text
                  style={[
                    styles.propertyTitle,
                    selectedLanguage === 'arabic' && {textAlign: 'right'},
                  ]}>
                  {language.videoUrl}
                </Text>
                <Text
                  style={[
                    styles.videoText,
                    selectedLanguage === 'arabic' && {textAlign: 'right'},
                  ]}>
                  {
                    language.addVideoToYourListingToProvideMoreClarityToPotentialBuyerAboutYourListing
                  }
                </Text>
                <View style={[styles.propertyNameContainer]}>
                  <TextInput
                    placeholder="Enter URL"
                    style={[
                      styles.inputText,
                      selectedLanguage === 'arabic' && {textAlign: 'right'},
                    ]}
                    multiline={true}
                    value={videoUrl}
                    onChangeText={setVideo}
                  />
                </View>
              </View>
            </View>
            <View style={styles.videoContainer}>
              <Text
                style={[
                  styles.propertyTitle,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}>
                {language.photos}
              </Text>
              <Text
                style={[
                  styles.videoText,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}>
                {
                  language.useJpgOrPngImagesTheFirstPhotoWillBeTheMainImageForYourListing
                }
              </Text>
              <View
                style={[
                  styles.imagepickerMainContainer,
                  selectedLanguage === 'arabic' && {
                    flexDirection: 'row-reverse',
                  },
                ]}>
                {images.length > 0 &&
                  images.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.imagePickerContainer}
                        // onLongPress={removeImage.bind(this, item)}

                        onPress={removeImage.bind(this, item)}>
                        <Image
                          source={{uri: item.uri}}
                          style={styles.fileImage}
                        />
                      </TouchableOpacity>
                    );
                  })}
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => setCameraModalVisible(true)}
                  style={styles.imageContainer}>
                  <Icon name="add" color={colors.grey} size={40} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.videoContainer}>
              <Text
                style={[
                  styles.propertyTitle,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}>
                {language.floorplan}
              </Text>
              <Text
                style={[
                  styles.videoText,
                  selectedLanguage === 'arabic' && {textAlign: 'right'},
                ]}>
                {language.useGpgOrPngImagesOrPdf}
              </Text>

              {!floorData ? (
                <TouchableOpacity
                  onPress={floorPickerHandler}
                  style={[
                    styles.documentContainer,
                    selectedLanguage === 'arabic' && {
                      alignSelf: 'flex-end',
                    },
                  ]}>
                  <Icon name="add" color={colors.grey} size={40} />
                </TouchableOpacity>
              ) : floorData.type.includes('image') ? (
                <TouchableOpacity
                  style={[
                    styles.fileView,
                    selectedLanguage === 'arabic' && {alignSelf: 'flex-end'},
                  ]}
                  onPress={floorPickerHandler}>
                  <Image
                    style={styles.fileImage}
                    source={{uri: floorData.uri}}
                  />
                </TouchableOpacity>
              ) : (
                <View
                  style={[
                    styles.fileView,
                    selectedLanguage === 'arabic' && {
                      alignSelf: 'flex-end',
                    },
                  ]}>
                  <Image style={styles.fileImage} source={floorPlan} />
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={handleSubmit(onSubmit)}
            style={styles.applyButton}>
            <Text style={styles.applyText}>{language.next}</Text>
          </TouchableOpacity>
          {MediatTips()}
          {imagePickModal()}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  screen: {
    // flex: 1,
    backgroundColor: colors.themeWhite,
  },

  propertyContainer: {
    marginHorizontal: 10,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    fontFamily: 'Roboto-Medium',
  },
  propertyInnerContainer: {
    flexDirection: 'row',
  },
  propertyMainView: {
    width: '31%',
    marginRight: 10,
    alignItems: 'center',
    paddingVertical: 15,
    marginVertical: 10,
  },
  propertyView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyText: {
    fontSize: 14,
    paddingLeft: 2,
    fontFamily: 'Roboto-Regular',
    color: Colors.darkGrey,
  },
  propertyNameContainer: {
    backgroundColor: colors.inputBgGrey,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
    height: 50,
    borderRadius: 30,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    borderColor: colors.inputBgGrey,
    flexBasis: '90%',
    justifyContent: 'center',
  },
  redBorder: {
    borderColor: colors.themeRed,
  },

  inputText: {
    fontSize: 14,
    color: colors.darkGrey,
    fontFamily: 'Roboto-Regular',
    flexBasis: '90%',
  },

  applyButton: {
    backgroundColor: colors.themeRed,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    justifyContent: 'center',
    borderRadius: 30,
    marginVertical: 10,
  },
  applyText: {
    color: colors.themeWhite,
    fontSize: 14,
    // fontWeight: 'bold',
    fontFamily: 'Roboto_Bold',
  },
  contactContainer: {
    marginHorizontal: 10,
  },
  mediaContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  mediaView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  mediaTitle: {
    fontSize: 18,
    // fontWeight: 'bold',
    fontFamily: 'Roboto_Bold',
  },
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '25%',
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    paddingVertical: 5,
  },
  videoContainer: {},

  tipText: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
  modalContainer: {
    backgroundColor: colors.themeWhite,
    width: '90%',
    alignSelf: 'center',
  },
  modalTilteContainer: {
    backgroundColor: colors.inputBgGrey,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'flex-end',
  },
  modalTiltle: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Medium',
  },
  closeIcon: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 15,
    alignItems: 'center',
  },
  tipsTextContainer: {
    marginHorizontal: 20,
  },
  tipsView: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  bulletPoints: {
    width: '4%',
    borderWidth: 3,
    borderRadius: 20,
    borderColor: colors.themeRed,
    height: 10,
    marginTop: 5,
  },
  mediaTipsText: {
    fontSize: 14,
    marginHorizontal: 5,
    fontFamily: 'Roboto-Regular',
  },
  tipsImageContainer: {
    marginBottom: 10,
    marginHorizontal: 20,
    width: '60%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  tipsImage: {
    width: '100%',
    height: 200,
  },
  videoText: {
    color: colors.darkGrey,
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
  videoIconContainer: {
    width: '40%',
    backgroundColor: colors.inputBgGrey,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    padding: 5,
    height: 50,
  },
  documentContainer: {
    width: '20%',
    backgroundColor: colors.inputBgGrey,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    padding: 5,
    height: 50,
  },
  fileView: {
    marginTop: 5,
    width: '20%',
  },
  fileImage: {
    width: '100%',
    height: 50,
    borderRadius: 10,
  },
  imageModalContainer: {
    backgroundColor: 'white',
    padding: 10,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 5,
  },
  alertHeading: {
    fontSize: 20,
    fontFamily: 'Roboto-Medium',
  },
  modalButtonsContainer: {
    marginTop: 20,
  },
  imagepickerMainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // marginHorizontal: 10,
  },
  imagePickerContainer: {
    // marginVertical: 10,
    width: '20%',
    height: 50,
    margin: 5,
  },
  imageContainer: {
    width: '20%',
    backgroundColor: colors.inputBgGrey,
    alignItems: 'center',
    borderRadius: 10,
    padding: 5,
    height: 50,
    margin: 5,
  },

  videoArea: {
    flexDirection: 'row',
  },
  videoImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
});

export default PostProperty2;
