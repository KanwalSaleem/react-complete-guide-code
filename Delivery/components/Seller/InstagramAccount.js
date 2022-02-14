import React, {useEffect, useState, useContext} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native'
import {Avatar, List} from 'react-native-paper'
import colors from '../../constants/colors'
import {AppContext} from '../../context/auth'

const InstagramAccount = () => {
  const [insta, setInsta] = useState(null)
  const {user, updateUserProfile, login} = useContext(AppContext)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!user.fbMarket?.instagramAccount) {
      fetch(
        `https://graph.facebook.com/${user.fbMarket.facebookPage?.id}?fields=instagram_business_account&access_token=${user.fbMarket.user.access_token}`,
      )
        .then((res) => {
          console.log('ig:', res.instagram_business_account)
          return res.json()
        })
        .then(async (res) => {
          if (res.instagram_business_account) {
            return fetch(
              `https://graph.facebook.com/${res.instagram_business_account.id}?fields=username,profile_picture_url&access_token=${user.fbMarket.user.access_token}`,
            )
              .then((res) => res.json())
              .then((res) => {
                if (res.id) {
                  setInsta(res)
                  updateUserProfile({
                    'fbMarket.instagramAccount': insta,
                  }).then(({user: newUser}) => {
                    login((prev) => ({
                      ...prev,
                      fbMarket: newUser.fbMarket,
                    }))
                  })
                }
              })
          }
        })

        .catch((e) => console.log(e))
    } else if (
      user.fbMarket.instagramAccount &&
      !user.fbMarket.instagramAccount.id
    ) {
      updateUserProfile({
        'fbMarket.instagramAccount': null,
      }).then(({user: newUser}) =>
        login((prev) => ({...prev, fbMarket: newUser.fbMarket})),
      )
    }
  }, [user])

  return (
    <List.Accordion
      expanded={user.fbMarket?.facebookPage?.id !== undefined && open}
      onPress={() => setOpen((prev) => !prev)}
      style={{
        // borderRadius: 10,
        backgroundColor: 'white',
      }}
      // titleStyle={{borderRadius: 10}}
      title="Instagram Account"
      // left={(props) => <List.Icon {...props} icon="folder" />}
    >
      {user.fbMarket?.instagramAccount?.id ? (
        <>
          <Text style={styles.subtitle}>
            Post on Instagram directly from the product dashboard.
          </Text>
          <Avatar.Image
            source={{uri: user.fbMarket.instagramAccount?.profile_picture_url}}
          />
          <Text> {user.fbMarket?.instagramAccount?.username}</Text>
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>
            Connect Instagram account to post about your product directly from
            Delivery Pay product dashboard.
          </Text>
          {insta && (
            <Avatar.Image
              source={{uri: insta?.profile_picture_url}}
              style={styles.profileImage}
            />
          )}
          <Text>{insta?.username}</Text>
          {!insta && (
            <>
              <View style={styles.error}>
                <Text style={styles.subtitle}>
                  The connected Business Manager doesn’t own any Instagram
                  accounts connected to the Facebook Page. Add your Instagram
                  account to the connected Business Manager and Facebook Page or
                  learn more about{' '}
                  <Text
                    style={styles.blueText}
                    onPress={() =>
                      Linking.openURL(
                        'https://help.instagram.com/502981923235522',
                      )
                    }>
                    how to create a new business account on Instagram{' '}
                  </Text>
                </Text>
              </View>
              <Text style={[styles.subtitle, {marginTop: 10}]}>
                If you can’t find an Instagram account, learn more about how to
                {/* <TouchableOpacity style={{alignItems: 'center'}}> */}
                <Text
                  onPress={() =>
                    Linking.openURL(
                      'https://help.instagram.com/502981923235522',
                    )
                  }
                  style={styles.blueText}>
                  {' '}
                  create a new account{' '}
                </Text>
                {/* </TouchableOpacity> */}
                or how to{' '}
                <Text
                  style={styles.blueText}
                  onPress={() =>
                    Linking.openURL(
                      'https://www.facebook.com/business/help/1125825714110549?id=420299598837059',
                    )
                  }>
                  add an account to your Business Manager
                </Text>
                .
              </Text>
            </>
          )}
        </>
      )}
    </List.Accordion>
  )
}

const styles = StyleSheet.create({
  subtitle: {
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 10,
  },
  businessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 0.5,
    padding: 5,
  },
  itemDetail: {
    // alignItems: 'center',
  },
  profileImage: {marginLeft: 20, alignSelf: 'center'},
  blueText: {
    color: colors.blue,
  },
  error: {
    padding: 10,
    backgroundColor: '#fcebeb',
    borderColor: '#ff5757',
    borderWidth: 0.5,
    borderRadius: 10,
    marginHorizontal: 10,
  },
})

export default InstagramAccount
