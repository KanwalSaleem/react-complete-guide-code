import React, {useRef, useState, useEffect, useCallback} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native'
import Colors from '../constants/Colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {useSelector} from 'react-redux'
import {useNavigation} from '@react-navigation/native'

const ReportScreen = () => {
  const navigation = useNavigation()
  const token = useSelector((state) => state.auth.token)
  const [isLoading, setLoading] = useState(false)

  return isLoading ? (
    <View style={styles.activity}>
      <ActivityIndicator size="large" color={Colors.red} />
    </View>
  ) : (
    <View style={styles.mainScreen}>
      <View style={styles.whiteContainer}>
        <View style={styles.mainContainer}></View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  activity: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  mainScreen: {
    flexGrow: 1,
    backgroundColor: Colors.black,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  whiteContainer: {
    width: '100%',
    backgroundColor: 'white',

    borderRadius: 10,
    marginBottom: 10,
    paddingVertical: 20,
  },
  mainContainer: {},
})

export default ReportScreen
