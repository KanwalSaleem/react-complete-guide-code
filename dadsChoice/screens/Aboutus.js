import React, {useCallback, useEffect, useState} from 'react'
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'

import {useSelector} from 'react-redux'
import {WebView} from 'react-native-webview'
import fetch from 'node-fetch'
import {APIURL} from '../constants/url'

const AboutUs = () => {
  const [detail, setDetail] = useState()

  const token = useSelector((state) => state.auth.token)

  const fetchDetail = useCallback(
    async () => {
      // eslint-disable-next-line no-undef
      const headers = new Headers()

      headers.append('Accept', 'application/json')

      headers.append('Authorization', `Bearer ${token}`)

      const requestOptions = {
        method: 'GET',
        headers,
        //   redirect: 'follow',
      }

      try {
        const response = await fetch(`${APIURL}/api/about`, requestOptions)

        const resData = await response.json()

        // eslint-disable-next-line no-undef

        if (!response.ok) {
          throw new Error(resData.message)
        }
        setDetail(resData.data[0].content)
      } catch (e) {
        console.log(e)
      }
    },
    [token],
  )
  useEffect(
    () => {
      fetchDetail()
    },
    [fetchDetail],
  )

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Image
          style={styles.image}
          source={require('../assets/images/about.png')}
        />
      </View>
  
        <View style={{flex: 1}}>
          <WebView
            originWhitelist={['*']}
           
            
            source={{
              html: `
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              </head>
              <body>
          ${detail}
              </body>
            </html>`,
            }}

            // javaScriptEnabled={true}
            //  staWrtInLoadingState={true}
            //  renderLoading={() => <ActivityIndicator />}
          />
        </View>
    
        {/* // <View style={styles.textbody}>
        //   <Text style={styles.text}>
        //     There are many variations of passages of Lorem Ipsum available, but
        //     the majority have suffered alteration in some form, by injected
        //     humour, or randomised words which dont look even slightly
        //     believable. If you are going to use a passage of Lorem Ipsum, you
        //     need to be sure there isnt anything embarrassing hidden in the
        //     middle of text. All the Lorem Ipsum generators on the Internet tend
        //     to repeat predefined chunks as necessary, making this the first true
        //     generator on the Internet.
        //   </Text>

        //   <Text style={styles.text}>
        //     {'\n'} It is a long established fact that a reader will be
        //     distracted by the readable content of a page when looking at its
        //     layout. The point of using Lorem Ipsum is that it has a more-or-less
        //     normal distribution of letters, as opposed to using Content here,
        //     content here, making it look like readable English. l be distracted
        //     by the readable content of a page when looking at its layout. The
        //     point of using Lorem Ipsum is that it has a more-or-less normal
        //     distribution of letters, as opposed to using Content here, content
        //     here, making it look like readable English
        //   </Text>
        // </View> */}
        <ActivityIndicator />
    
    </ScrollView>
  )
}
export default AboutUs

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    paddingHorizontal: 10,
  },

  textbody: {
    padding: 8,
    // maxWidth: '90%',
  },

  text: {
    fontSize: 16,
  },

  image: {
    alignSelf: 'center',
    marginTop: 30,
    width: 287,
    height: 287,
  },
})
