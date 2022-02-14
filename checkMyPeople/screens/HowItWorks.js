import React from 'react'
import {View, Text, Image, ScrollView, StyleSheet, Linking} from 'react-native'
import Colors from '../constants/Colors'
import Title from '../components/Title'
import fonts from '../constants/fonts'
import Card from '../components/Card'

const HowItWorks = () => {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Card style={styles.card}>
        <Image source={require('../assets/how.png')} style={styles.image} />
      </Card>
      <Card style={styles.card}>
        <Text style={styles.sectionHeading} allowFontScaling={false}>
          What is Identity Verification Service (IVS)?
        </Text>
        <Text
          style={[fonts.paragraph, styles.leftText]}
          allowFontScaling={false}>
          CheckMyPeople is licensed by the National identity Management
          Commission (NIMC) to provide Identity Verification Services (IVS) for
          the Verification of the National Identification Number (NIN)
        </Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.sectionHeading} allowFontScaling={false}>
          What is the cost of NIN Verification?
        </Text>
        <Text style={[fonts.heading, styles.leftText]} allowFontScaling={false}>
          NIN Verification Fees:
        </Text>
        <Text style={[fonts.heading, styles.leftText]} allowFontScaling={false}>
          Guest = N300
        </Text>
        <Text style={[fonts.heading, styles.leftText]} allowFontScaling={false}>
          Member = N200
        </Text>
        <Text allowFontScaling={false}></Text>
        <Text
          style={[fonts.paragraph, styles.leftText]}
          allowFontScaling={false}>
          You must register first to become a member, then use the “Load Account
          Balance” to fund your wallet. Each verification draws down your wallet
          by N200.
        </Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.sectionHeading} allowFontScaling={false}>
          Select Search Type
        </Text>
        <Text
          style={[fonts.paragraph, styles.leftText]}
          allowFontScaling={false}>
          CheckMyPeople offers different types of searches for NIN Verification.
        </Text>
        <Text style={[fonts.heading, styles.leftText]} allowFontScaling={false}>
          Search by NIN
        </Text>
        <Text style={[fonts.heading, styles.leftText]} allowFontScaling={false}>
          Search by Telephone
        </Text>
        <Text style={[fonts.heading, styles.leftText]} allowFontScaling={false}>
          Search by Document Number
        </Text>
      </Card>
      {/* <Text></Text> */}
      <Card style={styles.card} allowFontScaling={false}>
        <Text style={styles.sectionHeading} allowFontScaling={false}>
          Search by Phone
        </Text>
        <Text
          style={[fonts.paragraph, styles.leftText]}
          allowFontScaling={false}>
          This is strictly to identify a person and not a means to NIN
          Verification, Only the Name, Sex and Picture is displayed. No NIN or
          Tracking ID is displayed
        </Text>
        <Text
          style={[fonts.paragraph, styles.leftText]}
          allowFontScaling={false}>
          For NIN Verification via phone refer to the CheckMyPeople website or
          contact Customer Support at{' '}
          <Text
            style={{color: Colors.primary}}
            allowFontScaling={false}
            onPress={() => Linking.openURL('mailto:support@checkmypeople.com')}>
            support@checkmypeople.com
          </Text>{' '}
          to request that service
        </Text>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    // flex: 1,
    backgroundColor: Colors.background,
    // alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  image: {
    width: '90%',
    height: 220,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  sectionHeading: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 10,
    color: 'black',
  },
  leftText: {
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  card: {
    padding: 10,
    marginTop: 15,
  },
})

export default HowItWorks
