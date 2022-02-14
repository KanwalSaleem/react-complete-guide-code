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

const QuizResult = () => {
  const navigation = useNavigation()
  // const {subCategoryId, subCategoryName} = route.params
  const [isLoading, setLoading] = useState(true)
  const [resultData, setResultData] = useState([])

  const getQuizResult = useCallback(async () => {
    try {
      const UserDetailsJson = await AsyncStorage.getItem('User_Details')
      const UserDetails = JSON.parse(UserDetailsJson)
      const userId = UserDetails.User_id
      let base_url = 'https://www.worldmcqs.org/Admin/API/fetch.php'
      let uploadData = new FormData()
      uploadData.append('request_name', 'fetchResult')
      uploadData.append('user_id', userId)

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      })

      const responseData = await response.json()
      if (!response.ok) {
        throw new Error(responseData.message)
      } else {
        setResultData(responseData.Data)
      }
    } catch (error) {
      Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getQuizResult()
  }, [])

  // const date =

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={resultData}
          keyExtractor={(item, index) => item.quiz_id}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('quizMarks', {
                    totalMarks: item.Total_marks,
                    obtainMarks: item.Obtain_marks,
                  })
                }>
                <View style={styles.item}>
                  <View style={{}}>
                    <Text style={styles.title}>{item.quiz_tittle}</Text>
                    <Text style={styles.subTitle}>
                      Total Questions: {item.Total_questions}
                    </Text>
                    <Text style={styles.subTitle}>
                      Correct Answers: {item.Correct_answers}
                    </Text>
                    <Text style={styles.subTitle}>
                      Total Marks: {item.Total_marks}
                    </Text>
                    <Text style={styles.subTitle}>
                      Obtained Marks: {item.Obtain_marks}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    // paddingHorizontal: 10,
  },
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'white',
    marginHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subTitle: {
    fontSize: 16,
  },
})

export default QuizResult
