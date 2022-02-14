import React, {useContext, useState} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native'
import Colors from '../Constants/Colors'

import AppContext from '../Context/AppContext'
import PageSlider from '@pietile-native-kit/page-slider'
import OnBoarding1 from './OnBoarding1'
import OnBoarding2 from './OnBoarding2'
import OnBoarding3 from './OnBoarding3'
import {SafeAreaView} from 'react-native-safe-area-context'

const OnBoardingScreen = (props) => {
  const {setAppIntro} = useContext(AppContext)
  const skipIntro = () => setAppIntro(true)

  const [selectedPage, setSelectedPage] = useState(0)

  const changePageHandler = (page) => {
    if (selectedPage === 0) {
      //
      setSelectedPage(1)
    } else if (selectedPage === 1) {
      //
      setSelectedPage(2)
      console.log(selectedPage, 'as')
    } else if (selectedPage === 2) {
      console.log(page)
      //   skipIntro;
      skipIntro()
    }
    // console.log(page)
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <PageSlider
        selectedPage={selectedPage}
        style={styles.pageSlider}
        onSelectedPageChange={setSelectedPage}
        onCurrentPageChange={() => {}}>
        <OnBoarding1 next={() => setSelectedPage(1)} />
        <OnBoarding2 next={() => setSelectedPage(2)} />
        <OnBoarding3 next={skipIntro} />
      </PageSlider>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  pageSlider: {
    width: '100%',
  },
  page: {
    alignItems: 'center',
    height: 128,
    justifyContent: 'center',
    padding: 16,
  },
  mainContainer: {flex: 1},
  screen: {
    flex: 1,
  },
  heading: {
    color: Colors.lightGrey,
    fontSize: 40,
    fontFamily: 'KronaOne-Regular',
  },
  messageContainer: {marginVertical: 30},
  message: {
    color: Colors.lightGrey,
    fontSize: 20,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
  },
})
export default OnBoardingScreen
