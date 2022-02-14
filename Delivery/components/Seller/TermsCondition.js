import React, {useState, useContext} from 'react'
import {View, StyleSheet, Text, Linking} from 'react-native'
import {List, ActivityIndicator} from 'react-native-paper'
import BlueButton from './BlueButton'
import colors from '../../constants/colors'
import {AppContext} from '../../context/auth'

const TermsCondition = () => {
  const {user, updateUserProfile, login} = useContext(AppContext)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    <List.Accordion
      expanded={user.fbMarket?.commerceAccount?.catalog !== undefined && open}
      onPress={() =>
        user.fbMarket?.facebookPage?.id && setOpen((prev) => !prev)
      }
      style={{
        // borderRadius: 10,
        backgroundColor: 'white',
      }}
      // titleStyle={{borderRadius: 10}}
      title="Terms Condition">
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 16,
            color: 'black',
            fontFamily: 'Poppins-Regular',
          }}>
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontFamily: 'Poppins-Regular',
            }}>
            By proceeding, you accept {''}
            <Text
              style={styles.blueText}
              onPress={() =>
                Linking.openURL(
                  'https://www.facebook.com/business/help/2371372636254534',
                )
              }>
              Facebook Commerce Manager.
            </Text>
          </Text>
        </Text>
        {user.fbMarket?.userAgreement === false && (
          <>
            {loading ? (
              <ActivityIndicator color={colors.blue} />
            ) : (
              <BlueButton
                onPress={() => {
                  setLoading(true)
                  updateUserProfile({
                    'fbMarket.userAgreement': true,
                  }).then(({user: newUser}) => {
                    setLoading(false)
                    if (newUser) {
                      login((prev) => ({
                        ...prev,
                        fbMarket: newUser.fbMarket,
                      }))
                    }
                  })
                }}>
                Finish Setup
              </BlueButton>
            )}
          </>
        )}
      </View>
    </List.Accordion>
  )
}

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'row',
    paddingHorizontal: 5,
  },
  blueText: {
    color: colors.blue,
  },
})

export default TermsCondition
