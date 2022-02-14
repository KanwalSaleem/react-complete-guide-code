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

const QuizContributer = ({route, navigation}) => {
  const {current} = route.params

  const [isLoading, setLoading] = useState(true)
  const [contributerData, setContributerData] = useState([])
  const getContributerQuiz = useCallback(async () => {
    try {
      let base_url = 'https://www.worldmcqs.org/Admin/API/fetch.php'
      let uploadData = new FormData()
      uploadData.append('request_name', 'fetchQuizList')
      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      })

      const responseData = await response.json()
      if (!response.ok) {
        throw new Error(responseData.message)
      } else {
        setContributerData(responseData.Data)
      }
    } catch (error) {
      Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getContributerQuiz()
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
          data={contributerData}
          keyExtractor={(item, index) => item.quiz_id}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('categoryQuiz', {
                    quizId: item.quiz_id,
                    current: current,
                  })
                }>
                <View style={styles.item}>
                  <View style={{width: '70%'}}>
                    <Text style={styles.title}>{item.quiz_tittle}</Text>
                    <Text style={styles.subTitle}>{item.quiz_creator}</Text>
                    <Text style={styles.subTitle}>
                      Total Marks: {item.quiz_total_marks}
                    </Text>
                  </View>
                  <View style={{width: '30%'}}>
                    <Text style={[styles.subTitle, {paddingTop: 10}]}>
                      {item.quiz_created_date}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default QuizContributer
