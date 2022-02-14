import React from 'react'
import {Image} from 'react-native'

const StartScreen = () => {
    return <Image
    style={{width:'100%',height:'100%',resizeMode:"cover"}}
    source={require('../assets/splash.png')}
    />
}

export default StartScreen