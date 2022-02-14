import React, {useEffect, useState} from 'react'
import {FlatList, View, Text, StyleSheet} from 'react-native'

import {useHttpClient} from '../hooks/http-hook'

const Chat = ({navigation}) => {
  const [messages, setMessages] = useState([])
  const [chatMessage, setChatMessage] = useState('')
  const {sendRequest, error, isLoading, clearError} = useHttpClient()

  useEffect(() => {
    // const unsubscribe = navigation('focus', async () => {
    //   try {
    //     const response = await sendRequest('https://deliverypay.in')
    //   } catch (e) {
    //     console.log(e)
    //   }
    // })
    // return unsubscribe
  }, [navigation])

  return <View>{/* <FlatList /> */}</View>
}

const styles = StyleSheet.create({})

export default Chat
