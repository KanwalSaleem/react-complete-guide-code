import React, {useContext} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {List, ActivityIndicator, Avatar} from 'react-native-paper'
import {LoginManager, AccessToken} from 'react-native-fbsdk-next'
import BlueButton from '../../components/Seller/BlueButton'
import colors from '../../constants/colors'
import {AppContext} from '../../context/auth'

const ConnectFB = (props) => {
  const {login, user, updateUserProfile} = useContext(AppContext)

  return (
    <List.Accordion
      style={{
        // borderRadius: 10,
        backgroundColor: 'white',
      }}
      // titleStyle={{borderRadius: 10}}
      title="Facebook Account"
      // left={(props) => <List.Icon {...props} icon="folder" />}
    >
      <Text style={styles.subtitle}>
        Delivery Pay uses your personal Facebook account to access your business
        accounts.
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 10,
          paddingHorizontal: 5,
        }}>
        {user.fbMarket?.user?.id ? (
          <Avatar.Image
            size={45}
            source={{uri: user.fbMarket?.user?.profileImg}}
          />
        ) : (
          <Avatar.Image size={45} />
        )}
        <Text style={styles.subtitle}>
          {user.fbMarket?.user?.id
            ? user.fbMarket?.user?.name
            : 'Connect your Facebook account to get started.'}
        </Text>
      </View>

      {props.loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <>
          {user.fbMarket?.user?.id ? (
            <BlueButton
              onPress={() => {
                props.setLoading(true)
                LoginManager.logOut((res) => console.log(res))
                updateUserProfile({
                  'fbMarket.businessManager': {},
                  'fbMarket.commerceAccount': {},
                  'fbMarket.dataSharing': null,
                  'fbMarket.facebookPage': {},
                  'fbMarket.instagramAccount': {},
                  'fbMarket.user': {},
                  'fbMarket.userAgreement': false,
                })
                  .then(({user: newUser}) => {
                    props.setLoading(false)
                    console.log(newUser)
                    if (newUser) {
                      login((prev) => ({
                        ...prev,
                        fbMarket: newUser.fbMarket,
                      }))
                    }
                  })
                  .catch((e) => {
                    props.setLoading(false)
                    console.log(e)
                  })
              }}>
              Disconnect
            </BlueButton>
          ) : (
            <BlueButton
              onPress={() => {
                props.setLoading(true)
                LoginManager.logInWithPermissions(['public_profile'], {
                  scope:
                    'business_management,catalog_management,pages_read_engagement,pages_manage_posts,pages_show_list,instagram_basic,instagram_content_publish,publish_to_groups',
                  return_scopes: true,
                })
                  .then(
                    function (result) {
                      if (result.isCancelled) {
                        console.log('Login cancelled')
                      } else {
                        console.log(
                          'Login success with permissions: ' +
                            result.grantedPermissions.toString(),
                        )
                        AccessToken.getCurrentAccessToken().then((data) => {
                          // console.log(data)
                          fetch('https://deliverypay.in/api/addFbMarketUser', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              accessToken: data.accessToken,
                            }),
                          })
                            .then((res) => res.json())
                            .then((data) => {
                              props.setLoading(false)
                              // console.log(data)
                              if (data.code === 'ok') {
                                login((prev) => ({
                                  ...prev,
                                  fbMarket: data.fbMarket,
                                }))
                              }
                            })
                          // return data
                          // console.log(data.accessToken.toString())
                        })
                      }
                    },
                    function (error) {
                      console.log('Login fail with error: ' + error)
                    },
                  )
                  .catch((e) => {
                    props.setLoading(false)
                    console.log(e)
                  })
              }}>
              Connect
            </BlueButton>
          )}
        </>
      )}
    </List.Accordion>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 10,
  },
})

export default ConnectFB
