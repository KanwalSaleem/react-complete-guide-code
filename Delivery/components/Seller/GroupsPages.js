import React, {useEffect, useState, useContext} from 'react'
import {FlatList, View, Text, StyleSheet, Alert} from 'react-native'
import {Modal, Portal, ActivityIndicator} from 'react-native-paper'
import {AppContext} from '../../context/auth'
import colors from '../../constants/colors'
import PageItem from './PageItem'
import BlueButton from './BlueButton'

const GroupsPages = (props) => {
  const [pages, setPages] = useState([])
  const [pagesToSend, setPagesToSend] = useState([])
  const [groups, setGroups] = useState([])
  const [groupsToSend, setGroupsToSend] = useState([])
  const [instaAccounts, setInstaAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [instaToSend, setInstaToSend] = useState([])
  const {user} = useContext(AppContext)
  const addPage = (item) => {
    //   const pageToAdd = pagesToSend.find((page) => page.id === id)

    if (pagesToSend.includes(item)) {
      const filterPages = pagesToSend.filter((page) => item.id !== page.id)
      setPagesToSend(filterPages)
    } else {
      setPagesToSend((prev) => prev.concat(item))
    }
  }

  const addGroup = (item) => {
    if (groupsToSend.includes(item)) {
      const filterGroups = groupsToSend.filter((group) => item.id !== group.id)
      setGroupsToSend(filterGroups)
    } else {
      setGroupsToSend((prev) => prev.concat(item))
    }
  }
  const addInsta = (item) => {
    if (instaToSend.includes(item)) {
      const filterGroups = instaToSend.filter((group) => item.id !== group.id)
      setInstaToSend(filterGroups)
    } else {
      setInstaToSend((prev) => prev.concat(item))
    }
  }

  const sendToSocialMedia = async () => {
    console.log(instaToSend.length)
    if (
      groupsToSend.length === 0 &&
      pagesToSend.length === 0 &&
      instaToSend.length === 0
    ) {
      Alert.alert('', 'Please select any of the following first')
    } else {
      setLoading(true)
      try {
        const response = await fetch(
          `https://deliverypay.in/api/shareProducts`,
          {
            method: 'POST',
            body: JSON.stringify({
              groups: groupsToSend,
              pages: pagesToSend,
              products: [props.id],
              igs: instaToSend,
            }),
            headers: {
              'content-type': 'Application/json',
            },
          },
        )
        const resData = response.json()

        if (!response.ok) {
          throw new Error(resData.message)
        }
        Alert.alert('Success', 'Posted Successfully')
        props.onDismiss(false)

        console.log(response)
      } catch (e) {
        Alert.alert('Err', e.message)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch(
      `https://graph.facebook.com/v11.0/me/accounts?access_token=${user.fbMarket.user.access_token}&fields=instagram_business_account%7Bprofile_picture_url%2C%20username%7D%2Cpicture%7Burl%7D%2Caccess_token%2Ccategory%2Cname&method=get&pretty=0&sdk=joey&suppress_http_code=1`,
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        setPages(res.data)
        const getInstaAccounts = res.data.filter((item) => {
          if ('instagram_business_account' in item) {
            return true
          } else {
            return false
          }
        })
        setInstaAccounts(getInstaAccounts)
      })
      .catch((e) => console.log(e))

    fetch(
      `https://graph.facebook.com/v11.0/me/groups?access_token=${user.fbMarket.user.access_token}&fields=name%2Cpicture%7Burl%7D&method=get&pretty=0&sdk=joey&suppress_http_code=1`,
    )
      .then((res) => res.json())
      .then((res) => {
        setGroups(res.data)
        console.log(res.data, 'groups')
      })
      .catch((e) => console.log(e))
  }, [user.fbMarket.user.access_token])

  return (
    <Portal>
      <Modal
        contentContainerStyle={styles.modalContainer}
        visible={props.visible}
        dismissable={true}
        onDismiss={props.onDismiss}
        style={{paddingBottom: 30}}>
        <View style={styles.modalHeadingContainer}>
          <Text style={styles.modalHeading}>Share on Social media</Text>
        </View>

        <FlatList
          style={{
            borderBottomWidth: 0.5,
            height: instaAccounts.length > 0 ? '60%' : '33%',
          }}
          // contentContainerStyle={{flexGrow: 0.5}}
          renderItem={({item}) => (
            <PageItem
              key={item.id}
              image={item.picture.data.url}
              name={item.name}
              category={item.category}
              onPress={addPage.bind(this, item)}
              selected={pagesToSend.includes(item) ? 'checked' : 'unchecked'}
            />
          )}
          data={pages}
          ListHeaderComponent={
            <View style={{width: '100%', paddingHorizontal: 10}}>
              <Text style={{fontSize: 20, fontFamily: 'Poppins-SemiBold'}}>
                Pages
              </Text>
            </View>
          }
        />

        {instaAccounts.length > 0 && (
          <FlatList
            style={{borderBottomWidth: 0.5, height: '33%'}}
            // contentContainerStyle={{flexGrow: 0.5}}
            renderItem={({item}) => (
              <PageItem
                key={item.id}
                image={item.instagram_business_account.profile_picture_url}
                name={item.name}
                category={item.category}
                onPress={addInsta.bind(this, item)}
                selected={instaToSend.includes(item) ? 'checked' : 'unchecked'}
              />
            )}
            data={instaAccounts}
            ListHeaderComponent={
              <View style={{width: '100%', paddingHorizontal: 10}}>
                <Text style={{fontSize: 20, fontFamily: 'Poppins-SemiBold'}}>
                  Instagram
                </Text>
              </View>
            }
          />
        )}
        <FlatList
          style={{
            marginBottom: 10,
            borderBottomWidth: 0.5,
            maxHeight: instaAccounts.length > 0 ? '50%' : '33%',
          }}
          renderItem={({item}) => (
            <PageItem
              key={item.id}
              image={item.picture.data.url}
              category={item.name}
              name={''}
              onPress={addGroup.bind(this, item)}
              selected={groupsToSend.includes(item) ? 'checked' : 'unchecked'}
            />
          )}
          data={groups}
          ListHeaderComponent={
            <View style={{width: '100%', paddingHorizontal: 10}}>
              <Text style={{fontSize: 20, fontFamily: 'Poppins-SemiBold'}}>
                Groups
              </Text>
            </View>
          }
        />
        {loading ? (
          <ActivityIndicator
            color={colors.primary}
            style={{marginVertical: 10}}
          />
        ) : (
          <BlueButton onPress={sendToSocialMedia}>Post</BlueButton>
        )}
      </Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#fff',
    // alignItems: 'center',
    width: '90%',
    // paddingVertical: 10,
    alignSelf: 'center',
    borderRadius: 5,
    paddingBottom: 10,
    maxHeight: '100%',
  },
  modalHeadingContainer: {
    elevation: 2,

    backgroundColor: 'white',
    width: '100%',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
    // alignItems: 'center',
  },
  modalHeading: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: colors.blue,
  },
})

export default GroupsPages
