import React, {useState, useCallback, useEffect} from 'react'
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FormData from 'form-data'
import Colors from '../constants/Colors'
import Icon from 'react-native-vector-icons/MaterialIcons'

const QuizMarks = ({route, navigation}) => {
  const {obtainMarks, totalMarks} = route.params
  const result = obtainMarks / totalMarks

  return (
    <View style={styles.container}>
      {result < 0.7 ? (
        <View style={styles.statusContainer}>
          <View style={[styles.iconView, {backgroundColor: 'red'}]}>
            <Icon name="close" color="white" size={60} />
          </View>
          <Text style={styles.statusText}>Failed the quiz</Text>
        </View>
      ) : (
        <View style={styles.statusContainer}>
          <View style={[styles.iconView, {backgroundColor: 'green'}]}>
            <Icon name="check" color="white" size={60} />
          </View>
          <Text style={styles.statusText}>Well Done</Text>
        </View>
      )}
      <Text style={styles.marks}>
        {obtainMarks}/{totalMarks}
      </Text>
      <Text style={styles.text}>70% marks is passing marks.</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>GO BACK</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marks: {
    color: Colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
  },
  button: {
    marginTop: 40,
    width: '80%',
    height: '8%',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    marginBottom: 70,
    alignItems: 'center',
  },
  iconView: {
    width: '70%',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 50,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    color: 'grey',
    fontWeight: 'bold',
  },
})

export default QuizMarks
