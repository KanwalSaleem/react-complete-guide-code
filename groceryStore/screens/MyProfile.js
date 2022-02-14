import React, {useState, useRef, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import {useForm} from 'react-hook-form';
import Colors from '../constants/Colors';
import AuthButton from '../components/AuthButton';
import Input from '../components/Input';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APIURL} from '../constants/Url';

const MyProfile = () => {
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(false);
  const {userDetails, isAuthenticated, setUserDetails} =
    useContext(AuthContext);

  const usernameRef = useRef();
  const mobileNoRef = useRef();
  const passwordRef = useRef();

  const {
    control,
    handleSubmit,
    formState: {errors},
    register,
    reset,
    setValue,
  } = useForm({
    mode: 'all',
  });

  const username = register('username');
  const mobileNo = register('mobileNo');
  const password = register('password');

  useEffect(() => {
    !isAuthenticated && navigation.navigate('authStack', {screen: 'loginForm'});
    reset({
      username: userDetails?.name,
      mobileNo: userDetails?.phone,
    });
  }, [
    isAuthenticated,
    navigation,
    reset,
    userDetails?.name,
    userDetails?.phone,
  ]);

  const onSubmit = async data => {
    setLoading(true);
    try {
      let base_url = `${APIURL}/API/editprofile.php`;

      let uploadData = new FormData();

      uploadData.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );
      uploadData.append('user_id', userDetails.user_id);
      uploadData.append('name', data.username);
      if (data.password != null) {
        uploadData.append('password', data.password);
      } else {
        uploadData.append('password', ' ');
      }

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      });

      const responseData = await response.json();
      if (responseData.status === false) {
        throw new Error(responseData.message);
      } else {
        Alert.alert('Success', responseData.Message);
        setUserDetails(prev => ({
          ...prev,
          name: data.username,
        }));

        const userDetailsJson = JSON.stringify(userDetails);
        AsyncStorage.setItem('userDetails', userDetailsJson);
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  };

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  ) : (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView style={styles.screen}>
        <View style={styles.fieldContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldText}>Name</Text>
            <View
              style={[styles.fieldArea, errors.username && styles.redBorder]}>
              <Input
                style={styles.input}
                control={control}
                name="username"
                rules={{required: true, minLength: 3}}
                ref={e => {
                  username.ref(e);
                  usernameRef.current = e;
                }}
                onSubmitEditing={() => {
                  mobileNoRef.current.focus();
                }}
                blurOnSubmit={false}
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.fieldText}>Mobile Number</Text>
            <View
              style={[styles.fieldArea, errors.mobileNo && styles.redBorder]}>
              <Input
                style={styles.input}
                control={control}
                name="mobileNo"
                rules={{required: true, maxLength: 15, minLength: 10}}
                maxLength={15}
                keyboardType={'number-pad'}
                ref={e => {
                  mobileNo.ref(e);
                  mobileNoRef.current = e;
                }}
                onSubmitEditing={() => {
                  passwordRef.current.focus();
                }}
                blurOnSubmit={false}
                returnKeyType="next"
                editable={false}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.fieldText}>Password</Text>
            <View
              style={[styles.fieldArea, errors.password && styles.redBorder]}>
              <Input
                style={styles.input}
                control={control}
                name="password"
                rules={{minLength: 6}}
                secureTextEntry={true}
                ref={e => {
                  password.ref(e);
                  passwordRef.current = e;
                }}
                onSubmitEditing={() => {
                  passwordRef.current.focus();
                }}
                blurOnSubmit={false}
                returnKeyType="next"
              />
            </View>
          </View>
        </View>

        <AuthButton
          onPress={handleSubmit(onSubmit)}
          style={styles.registerButton}
          disabled={!isAuthenticated}>
          Continue
        </AuthButton>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingHorizontal: 15,
  },
  fieldContainer: {
    marginTop: 40,
  },

  inputContainer: {
    marginTop: 20,
  },
  fieldText: {
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    marginBottom: 5,
  },
  fieldArea: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  redBorder: {
    borderColor: Colors.accent,
  },
  registerButton: {
    marginTop: 20,
    backgroundColor: Colors.accent,
  },
  countryCode: {
    width: '36%',
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 5,
    marginRight: 5,
  },
  imageContainer: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  imagePickerContainer: {
    width: 120,
    height: 120,
    backgroundColor: Colors.primary,
    borderRadius: 70,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 5,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    borderRadius: 70,
    alignSelf: 'center',
    borderWidth: 5,
    borderColor: Colors.accent,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 10,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 5,
  },
  alertHeading: {
    fontSize: 22,
    fontFamily: 'OpenSans-Regular',
  },
  modalButtonsContainer: {
    marginTop: 20,
  },
  imageButton: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
  },
});

export default MyProfile;
