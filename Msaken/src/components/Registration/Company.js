import React, {useState, useEffect, useContext} from 'react';
import {Text, View, StyleSheet, TextInput, ScrollView} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ION from 'react-native-vector-icons/Ionicons';
import MON from 'react-native-vector-icons/MaterialIcons';
import color from '../../common/colors';
import {Checkbox, RadioButton} from 'react-native-paper';
import UserForm from './UserForm';
import {AuthContext} from '../../context/AuthContext';
import {Colors} from 'react-native/Libraries/NewAppScreen';

function Company({social}) {
  const {registrationType, setRegistrationType, language} =
    useContext(AuthContext);

  const [type, setType] = useState(registrationType);
  const [checked, setChecked] = useState(false);
  const [passVisible, setPassVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const registrationHandler = () => {
    // const register = await services.register
    console.log('e');
  };

  useEffect(() => {
    setRegistrationType(type);
  }, [type]);

  return (
    <View style={[styles.container]}>
      <ScrollView contentContainerStyle={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            paddingBottom: 5,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <RadioButton
              value="company"
              status={type === 'company' ? 'checked' : 'unchecked'}
              onPress={() => setType('company')}
              color={color.themeRed}
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Roboto-Regular',
                color: color.darkGrey,
              }}>
              {' '}
              {language.company}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <RadioButton
              value="agent"
              status={type === 'agent' ? 'checked' : 'unchecked'}
              color={color.themeRed}
              onPress={() => setType('agent')}
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Roboto-Regular',
                color: color.darkGrey,
              }}>
              {' '}
              {language.agent}
            </Text>
          </View>
        </View>

        {type === 'agent' ? (
          <UserForm role="agent" social={social} />
        ) : (
          <UserForm role="company" social={social} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  button: {
    margin: 12,
    padding: 10,
    backgroundColor: color.themeRed,
    borderRadius: 40,
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    padding: 1,
    marginBottom: 10,
    backgroundColor: color.inputBgGrey,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    borderRadius: 40,
    backgroundColor: color.inputBgGrey,
    color: '#424242',
  },
});

export default Company;
