import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {Dropdown} from 'react-native-element-dropdown';
import Input from '../Components/Input';
import Colors from '../Constants/Colors';
import PrimaryButton from '../Components/PrimaryButton';
import AppContext from '../Context/AppContext';

const Profile = () => {
  const {user, tempId, setUser} = useContext(AppContext);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    formState: {errors},
    control,
    reset,
  } = useForm();

  const onSubmit = async data => {
    // console.log(data);
    const formData = new FormData();
    formData.append('token', 'ZFSgldjzfnvzkjdfbzdzfvbzdbdjkgSGVFddzfv');
    formData.append('coach_id', data.teacherName);
    formData.append('student_id', user.user_id);
    formData.append('height', data.height);
    formData.append('weight', data.weight);
    formData.append('name', data.name);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    try {
      const response = await fetch(
        `https://staiigs.sector7.space/staii/API/updateProfile.php`,
        {
          method: 'POST',
          body: formData,
          // headers,
        },
      );
      console.log(response);
      const resData = await response.json();
      Alert.alert('', 'Profile Updated');
      // setUser((prev) => ({
      //   ...prev,
      //   coach_id: data.teacherName,
      //   height: data.height,
      //   weight: data.weight,
      //   user_name: data.name,
      // }))
      console.log(resData);
    } catch (e) {
      Alert.alert('', e.message);
    }
  };

  useEffect(() => {
    reset({
      weight: user.weight,
      height: user.height,
      name: user.user_name,
      teacherName: user.coach_id,
    });
    const getExpertNames = () => {
      const formData = new FormData();
      formData.append('token', 'ZFSgldjzfnvzkjdfbzdzfvbzdbdjkgSGVFddzfv');
      formData.append('accadamy_id', user.accadamy_id);
      fetch('https://staiigs.sector7.space/staii/API/fetchUsers.php', {
        method: 'POST',
        body: formData,
      })
        .then(res => res.json())
        .then(res => {
          console.log(res);
          const validExperts = res.Experts.map(expert => ({
            value: expert.teacher_id,
            label: expert.teacher_name,
          }));

          setExperts(validExperts);
        })
        .catch(e => console.log(e));
    };

    getExpertNames();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.fieldHeading}>Name</Text>
      <Input
        containerStyle={{marginTop: 10}}
        name="name"
        control={control}
        placeholder="Name"
        rules={{required: 'Name is Required'}}
      />
      {errors.name && (
        <Text style={styles.errorStyle}>{errors.name.message}</Text>
      )}
      <Text style={styles.fieldHeading}>Expert`s Name</Text>
      <Controller
        control={control}
        name="teacherName"
        render={({field: {value, onChange}}) => (
          <Dropdown
            data={experts}
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
            onChange={item => onChange(item.value)}
            activeColor="#2b2e3d"
            value={value}
            selectedStyle={{backgroundColor: '#000000'}}
            showsVerticalScrollIndicator={true}
            placeholderStyle={{color: 'grey'}}
          />
        )}
      />

      {errors.teacherName && (
        <Text style={styles.errorStyle}>{errors.teacherName.message}</Text>
      )}
      <Text style={styles.fieldHeading}>Weight</Text>
      <Input
        containerStyle={{marginTop: 10}}
        keyboardType="number-pad"
        name="weight"
        control={control}
        placeholder="Weight"
        rules={{required: 'Weight is Required'}}
      />
      {errors.weight && (
        <Text style={styles.errorStyle}>{errors.weight.message}</Text>
      )}
      <Text style={styles.fieldHeading}>Height</Text>
      <Input
        containerStyle={{marginTop: 10}}
        keyboardType="number-pad"
        name="height"
        control={control}
        placeholder="Height"
        rules={{required: 'Height is Required'}}
      />
      {errors.height && (
        <Text style={styles.errorStyle}>{errors.height.message}</Text>
      )}
      {loading ? (
        <ActivityIndicator
          color={'white'}
          size={'large'}
          style={{marginTop: '30%'}}
        />
      ) : (
        <PrimaryButton
          style={{marginTop: '30%'}}
          onPress={handleSubmit(onSubmit)}>
          Submit
        </PrimaryButton>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    // flex: 1,
    backgroundColor: Colors.black,
    padding: 10,
    paddingTop: '10%',
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
  errorStyle: {
    fontFamily: 'DMSans-Bold',
    color: 'white',
    fontSize: 16,
    marginLeft: 20,
    marginTop: 5,
    // alignSelf: 'center',
  },
  fieldHeading: {
    fontFamily: 'DMSans-Bold',
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    marginTop: 30,
  },
});

export default Profile;
