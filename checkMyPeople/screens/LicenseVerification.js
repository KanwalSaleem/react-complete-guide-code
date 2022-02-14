import React, {
  useLayoutEffect,
  useState,
  useContext,
  useRef,
  useEffect,
} from 'react'

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native'
import Card from '../components/Card'
import FieldInfo from '../components/FieldInfo'
import AuthButton from '../components/AuthButton'
import Colors from '../constants/Colors'
import fonts from '../constants/fonts'
import RNPrint from 'react-native-print'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {CommonActions} from '@react-navigation/native'
import {AuthContext} from '../context/Auth'
import ProgressDialog from '../components/ProgressDialog'
import verificationResult from '../constants/verificationResult'
import CaspioUrl from '../constants/CaspioUrl'
import tables from '../constants/CaspioTableNames'

const LicensVerification = ({route, navigation}) => {
  const [detailOpen, setDetailOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const {user, authToken} = useContext(AuthContext)
  const {
    params: {item},
  } = route

  const printHTML = async () => {
    await RNPrint.print({
      html: verificationResult(item),
    })
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <></>,
      title: route.params?.searchByPhone === true ? 'PICTURE ID' : 'Verify NIN',
    })
  }, [navigation, route.params?.searchByPhone])

  useEffect(() => {
    setLoading(true)

    fetch(
      `${CaspioUrl}/rest/v2/tables/${tables.memberVerification}/records?response=rows`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body:
          route.params?.searchByPhone === true
            ? JSON.stringify({
                First_Name: item.firstname,
                Middle_Name: item.middlename,
                Last_Name: item.surname,
                Phone: route.params?.phone,
                // Email: user.email,
                // docnumber: item.documentno,
                // birthdate: item.birthdate,
                Cust_id: user.CustomerID,
              })
            : route.params?.searchByDocument === true
            ? JSON.stringify({
                First_Name: item.firstname,
                Middle_Name: item.middlename,
                Last_Name: item.surname,
                // NIN: item.nin,
                // Email: user.email,
                // docnumber: item.documentno,
                DOCID: item.documentno,
                // birthdate: item.birthdate,
                Cust_id: user.CustomerID,
              })
            : JSON.stringify({
                First_Name: item.firstname,
                Middle_Name: item.middlename,
                Last_Name: item.surname,
                NIN: item.nin,
                // Email: user.email,
                // docnumber: item.documentno,
                // DOCID: item.DOCID,
                // birthdate: item.birthdate,
                Cust_id: user.CustomerID,
              }),
      },
    )
      .then((res) => res.json())
      .then((data) => console.log('ver data', data))
      .catch((e) => console.log(e))
      .finally(() => setLoading(false))
  }, [authToken, item])
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.screen}>
        <ProgressDialog loading={loading} />
        <Text style={fonts.paragraph} allowFontScaling={false}>
          This report is generated under Identity Verification License issued by
          National Identity Management Commission (NIMC).
        </Text>
        <Text style={fonts.paragraph} allowFontScaling={false}>
          Checkmypeople accepts no liability for the verification of this NIN or
          for the consequences of any action taken based on the information
          provided through this platform.
        </Text>
        <Card style={styles.card}>
          <Image
            source={{uri: `data:image/png;base64,${item.photo}`}}
            style={{
              aspectRatio: 3 / 3,
              width: 180,
              height: 150,
              alignSelf: 'center',
              borderRadius: 10,
              // resizeMode: 'contain',
            }}
          />
          <Text style={styles.genderBox} allowFontScaling={false}>
            {item.gender === 'm' ? 'Male' : 'Female'}
          </Text>
          <Text style={styles.blueHeading} allowFontScaling={false}>
            Personal Information
          </Text>

          <>
            <FieldInfo
              style={styles.fieldContainer}
              title="National Identification Number (NIN)"
              text={item.nin}
            />
            <FieldInfo
              style={styles.fieldContainer}
              title="Tracking ID"
              text={item.trackingId}
            />
          </>

          <FieldInfo
            style={styles.fieldContainer}
            title="First Name"
            text={item.firstname}
          />
          <FieldInfo
            style={styles.fieldContainer}
            title="Middle Name"
            text={item.middlename}
          />
          <FieldInfo
            style={styles.fieldContainer}
            title="Last Name"
            text={item.surname}
          />

          <>
            <FieldInfo
              style={styles.fieldContainer}
              title="Date of birth"
              text={item.birthdate}
            />
            <FieldInfo
              style={styles.fieldContainer}
              title="Residence"
              text={item.residence_Town}
            />
            {detailOpen ? (
              <>
                <FieldInfo
                  style={styles.fieldContainer}
                  title="Address"
                  text={item.residence_AdressLine1}
                />
                <FieldInfo
                  style={styles.fieldContainer}
                  title="Telephone"
                  text={item.telephoneno}
                />
                <FieldInfo
                  style={styles.fieldContainer}
                  title="Email Address"
                  text={item.email}
                />
                <FieldInfo
                  style={styles.fieldContainer}
                  title="Marital Status"
                  text={item.maritalstatus}
                />
                <FieldInfo
                  style={styles.fieldContainer}
                  title="Residence Status"
                  text={item.residencestatus}
                />
                <FieldInfo
                  style={styles.fieldContainer}
                  title="Profession"
                  text={item.profession}
                />
                <FieldInfo
                  style={styles.fieldContainer}
                  title="Origin State"
                  text={item.self_origin_state}
                />
                <FieldInfo
                  style={styles.fieldContainer}
                  title="Origin LGA"
                  text={item.self_origin_lga}
                />
                <FieldInfo
                  style={styles.fieldContainer}
                  title="Next of Kin Data"
                  text={item.kinData}
                />
              </>
            ) : (
              <></>
            )}
          </>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.expandButton}
            onPress={() => setDetailOpen((prev) => !prev)}>
            <Icon
              name={detailOpen ? 'expand-less' : 'more-horiz'}
              color="white"
              size={20}
            />
          </TouchableOpacity>
        </Card>

        <AuthButton style={styles.button} onPress={printHTML}>
          Print
        </AuthButton>
        <AuthButton style={styles.button}>Send as Mail</AuthButton>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.closeButton}
          onPress={
            () =>
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    {
                      name: user ? 'dashboard' : 'profile',
                    },
                    {
                      name: 'verifynin',
                      params: {
                        replacedFromLicense: true,
                      },
                    },
                  ],
                }),
              )
            // navigation.replace('verifynin')
          }>
          <Icon name={'close'} color="white" size={20} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    // flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    paddingVertical: 20,
    // paddingBottom: 30,
  },
  card: {width: '85%', padding: 10, paddingTop: 30, marginBottom: 20},
  genderBox: {
    color: 'black',
    borderWidth: 1,
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    fontFamily: 'Inter-Regular',
    marginLeft: 10,
  },
  fieldContainer: {
    marginLeft: 10,
    marginBottom: 15,
  },
  blueHeading: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
    marginBottom: 10,
    marginLeft: 10,
  },
  button: {
    marginTop: 20,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
  },
  expandButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    alignSelf: 'center',
    position: 'absolute',
    bottom: -20,
  },
  closeButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 20,
  },
})

export default LicensVerification
