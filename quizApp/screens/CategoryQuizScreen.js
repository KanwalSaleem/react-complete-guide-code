import React, {useState, useEffect, useCallback, useRef} from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  RecyclerViewBackedScrollViewBase,
  ActivityIndicator,
} from 'react-native'
import Colors from '../constants/Colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {createWorklet, set} from 'react-native-reanimated'
import {Item} from 'react-native-paper/lib/typescript/components/List/List'
import FormData from 'form-data'
import AsyncStorage from '@react-native-async-storage/async-storage'

const CategoryQuizScreen = ({route, navigation}) => {
  const {quizId, current} = route.params

  const subCategoryName = current.subCategoryName
  const [quizData, setQuizData] = useState([])
  const [tempdata, settempData] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)
  const [quizSelectionError, setQuizSelectionError] = useState(true)

  const getQuiz = useCallback(async () => {
    try {
      let base_url = 'https://www.worldmcqs.org/Admin/API/fetch.php'
      let uploadData = new FormData()
      uploadData.append('request_name', 'fetchQuizbyid')
      uploadData.append('quiz_id', quizId)
      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message)
      } else {
        setQuizData(responseData.Data)
        // console.log(responseData.Data)
      }
    } catch (error) {
      Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }, [quizId])

  const createQuiz = useCallback(async () => {
    try {
      const UserDetailsJson = await AsyncStorage.getItem('User_Details')
      const UserDetails = JSON.parse(UserDetailsJson)
      const userId = UserDetails.User_id
      let base_url = 'https://www.worldmcqs.org/Admin/API/postdata.php'
      let uploadData = new FormData()
      uploadData.append('request_name', 'GenerateQuiz')
      uploadData.append('user_id', userId)
      uploadData.append('sub_category_id', current.subCategoryId)
      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      })

      const responseData = await response.json()
      if (!response.ok) {
        throw new Error(responseData.message)
      } else {
        setQuizData(responseData.Data)
      }
    } catch (error) {
      Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }, [current.subCategoryId])

  const completeQuiz = useCallback(async () => {
    setLoading(true)
    try {
      const stringData = JSON.stringify(quizData)
      const UserDetailsJson = await AsyncStorage.getItem('User_Details')
      const UserDetails = JSON.parse(UserDetailsJson)
      const userId = UserDetails.User_id
      let base_url = 'https://www.worldmcqs.org/Admin/API/postdata.php'
      let uploadData = new FormData()
      uploadData.append('request_name', 'PostQuizAnswer')
      uploadData.append('user_id', userId)
      uploadData.append('Data', stringData)

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      })

      const responseData = await response.json()
      if (!response.ok) {
        throw new Error(responseData.message)
      } else {
        Alert.alert(responseData.Message)
        if (responseData.Response === 200) {
          navigation.navigate('quiz')
        }
      }
    } catch (error) {
      Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }, [navigation, quizData])

  const submitQuiz = () => {
    const submitData = []

    quizData.forEach(rows => {
      setQuizSelectionError(false)
      if (rows.selected_option == null || rows.selected_option == 'Error') {
        setQuizSelectionError(true)
        submitData.push({
          question_id: rows.question_id,
          mcqs_id: rows.mcqs_id,
          quiz_id: rows.quiz_id,
          quiz_question_type: rows.quiz_question_type,
          quiz_question: rows.quiz_question,
          quiz_options_type: rows.quiz_options_type,
          quiz_option_1: rows.quiz_option_1,
          quiz_option_2: rows.quiz_option_2,
          quiz_option_3: rows.quiz_option_3,
          quiz_option_4: rows.quiz_option_4,
          quiz_answer: rows.quiz_answer,
          selected_option: 'Error',
        })
      } else {
        submitData.push({
          question_id: rows.question_id,
          mcqs_id: rows.mcqs_id,
          quiz_id: rows.quiz_id,
          quiz_question_type: rows.quiz_question_type,
          quiz_question: rows.quiz_question,
          quiz_options_type: rows.quiz_options_type,
          quiz_option_1: rows.quiz_option_1,
          quiz_option_2: rows.quiz_option_2,
          quiz_option_3: rows.quiz_option_3,
          quiz_option_4: rows.quiz_option_4,
          quiz_answer: rows.quiz_answer,
          selected_option: rows.selected_option,
        })
      }
    })
    setQuizData(submitData)

    if (quizSelectionError == false) {
      completeQuiz()
    }
  }

  useEffect(() => {
    if (route.params?.current) {
      createQuiz()
    } else {
      getQuiz()
    }
  }, [createQuiz, getQuiz, route.params])

  const [selesctedOption, setSelectedOption] = useState([])
  const [quizOption, setQuizOption] = useState([])
  const [rightQuestions, setRightQuestions] = useState([])
  const [wrongQuestions, setWrongQuestions] = useState([])
  const handleClick = (itemid, text) => {
    const tempobj = []
    quizData.forEach(rows => {
      if (rows.question_id == itemid) {
        tempobj.push({
          question_id: rows.question_id,
          mcqs_id: rows.mcqs_id,
          quiz_id: rows.quiz_id,
          quiz_question_type: rows.quiz_question_type,
          quiz_question: rows.quiz_question,
          quiz_options_type: rows.quiz_options_type,
          quiz_option_1: rows.quiz_option_1,
          quiz_option_2: rows.quiz_option_2,
          quiz_option_3: rows.quiz_option_3,
          quiz_option_4: rows.quiz_option_4,
          quiz_answer: rows.quiz_answer,
          selected_option: text,
        })

        // if (rows.quiz_answer == text) {
        //   setRightQuestions((prev) => prev.concat(itemid))
        //   console.log(rows.quiz_answer)
        //   console.log(text, 'selected')
        //   console.log(true)
        // } else if (rows.quiz_answer != text) {
        //   setWrongQuestions((prev) => prev.concat(itemid))
        //   console.log(false)
        // }
      } else {
        tempobj.push({
          question_id: rows.question_id,
          mcqs_id: rows.mcqs_id,
          quiz_id: rows.quiz_id,
          quiz_question_type: rows.quiz_question_type,
          quiz_question: rows.quiz_question,
          quiz_options_type: rows.quiz_options_type,
          quiz_option_1: rows.quiz_option_1,
          quiz_option_2: rows.quiz_option_2,
          quiz_option_3: rows.quiz_option_3,
          quiz_option_4: rows.quiz_option_4,
          quiz_answer: rows.quiz_answer,
          selected_option: rows.selected_option,
        })
      }
    })
    setQuizData(tempobj)

    // setQuizData(quizData)
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      {isLoading ? (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <View style={styles.screen}>
          <Text style={styles.categoryHeading}>{subCategoryName}</Text>
          <SafeAreaView style={styles.questionContainer}>
            <FlatList
              data={quizData}
              initialNumToRender={10}
              extraData={true}
              keyExtractor={item => item.question_id}
              renderItem={({item, index}) => {
                return (
                  <View
                    style={[
                      styles.item,
                      {
                        backgroundColor:
                          item.selected_option == 'Error' ? '#EC5C52' : 'white',
                      },
                    ]}>
                    <View style={styles.questionView}>
                      <Text style={styles.question}>Question {index + 1}</Text>
                    </View>
                    {item.quiz_question_type === 'image' ? (
                      <TouchableOpacity
                        onLongPress={() => {
                          navigation.navigate('zoomImage', {
                            image1: item.quiz_question,
                            image2: item.quiz_option_1,
                            image3: item.quiz_option_2,
                            image4: item.quiz_option_3,
                            image5: item.quiz_option_4,
                          })
                        }}>
                        <Image
                          style={styles.imageQuizQues}
                          source={{
                            uri:
                              'https://worldmcqs.org/Admin/assets/Images/' +
                              item.quiz_question,
                          }}
                        />
                      </TouchableOpacity>
                    ) : (
                      <Text style={{fontSize: 15, color: Colors.primary}}>
                        {item.quiz_question}
                      </Text>
                    )}
                    <View style={{marginTop: 10}}>
                      {item.quiz_options_type === 'image' ? (
                        <View>
                          {item.selected_option === null && (
                            <>
                              <View style={styles.imageOptionView}>
                                <TouchableOpacity>
                                  <Text style={styles.option}>A</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={[
                                    {
                                      marginLeft: 5,
                                      width: '80%',
                                      justifyContent: 'center',
                                      borderWidth: 2,
                                      borderColor:
                                        item.selected_option == '1'
                                          ? Colors.primary
                                          : 'lightgrey',
                                    },
                                  ]}
                                  onPress={() =>
                                    handleClick(item.question_id, 1)
                                  }
                                  onLongPress={() => {
                                    navigation.navigate('zoomImage', {
                                      image1: item.quiz_option_1,
                                      image2: item.quiz_option_2,
                                      image3: item.quiz_option_3,
                                      image4: item.quiz_option_4,
                                      image5: item.quiz_question,
                                    })
                                  }}>
                                  <Image
                                    style={styles.imageQuizOption}
                                    source={{
                                      uri:
                                        'https://worldmcqs.org/Admin/assets/Images/' +
                                        item.quiz_option_1,
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                              <View style={styles.imageOptionView}>
                                <TouchableOpacity>
                                  <Text style={styles.option}>B</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={[
                                    {
                                      marginLeft: 5,
                                      width: '80%',
                                      justifyContent: 'center',
                                      borderWidth: 2,
                                      borderColor:
                                        item.selected_option == '2'
                                          ? Colors.primary
                                          : 'lightgrey',
                                    },
                                  ]}
                                  onPress={() =>
                                    handleClick(item.question_id, 2)
                                  }
                                  onLongPress={() => {
                                    navigation.navigate('zoomImage', {
                                      image1: item.quiz_option_2,
                                      image2: item.quiz_option_3,
                                      image3: item.quiz_option_4,
                                      image4: item.quiz_option_1,
                                      image5: item.quiz_question,
                                    })
                                  }}>
                                  <Image
                                    style={styles.imageQuizOption}
                                    source={{
                                      uri:
                                        'https://worldmcqs.org/Admin/assets/Images/' +
                                        item.quiz_option_2,
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                              <View style={styles.imageOptionView}>
                                <TouchableOpacity>
                                  <Text style={styles.option}>C</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={[
                                    {
                                      marginLeft: 5,
                                      width: '80%',
                                      justifyContent: 'center',
                                      borderWidth: 2,
                                      borderColor:
                                        item.selected_option == '3'
                                          ? Colors.primary
                                          : 'lightgrey',
                                    },
                                  ]}
                                  onPress={() =>
                                    handleClick(item.question_id, 3)
                                  }
                                  onLongPress={() => {
                                    navigation.navigate('zoomImage', {
                                      image1: item.quiz_option_3,
                                      image2: item.quiz_option_4,
                                      image3: item.quiz_option_1,
                                      image4: item.quiz_option_2,
                                      image5: item.quiz_question,
                                    })
                                  }}>
                                  <Image
                                    style={styles.imageQuizOption}
                                    source={{
                                      uri:
                                        'https://worldmcqs.org/Admin/assets/Images/' +
                                        item.quiz_option_3,
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                              <View style={styles.imageOptionView}>
                                <TouchableOpacity>
                                  <Text style={styles.option}>D</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={[
                                    {
                                      marginLeft: 5,
                                      width: '80%',
                                      justifyContent: 'center',
                                      borderWidth: 2,
                                      borderColor:
                                        item.selected_option == '4'
                                          ? Colors.primary
                                          : 'lightgrey',
                                    },
                                  ]}
                                  onPress={() =>
                                    handleClick(item.question_id, 4)
                                  }
                                  onLongPress={() => {
                                    navigation.navigate('zoomImage', {
                                      image1: item.quiz_option_4,
                                      image2: item.quiz_question,
                                      image3: item.quiz_option_1,
                                      image4: item.quiz_option_2,
                                      image5: item.quiz_option_3,
                                    })
                                  }}>
                                  <Image
                                    style={styles.imageQuizOption}
                                    source={{
                                      uri:
                                        'https://worldmcqs.org/Admin/assets/Images/' +
                                        item.quiz_option_4,
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                            </>
                          )}

                          {item.selected_option === 'Error' && (
                            <>
                              <View style={styles.imageOptionView}>
                                <TouchableOpacity>
                                  <Text style={styles.option}>A</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={[
                                    {
                                      marginLeft: 5,
                                      width: '80%',
                                      justifyContent: 'center',
                                      borderWidth: 2,
                                      borderColor:
                                        item.selected_option == '1'
                                          ? Colors.primary
                                          : 'lightgrey',
                                    },
                                  ]}
                                  onPress={() =>
                                    handleClick(item.question_id, 1)
                                  }
                                  onLongPress={() => {
                                    navigation.navigate('zoomImage', {
                                      image1: item.quiz_option_1,
                                      image2: item.quiz_option_2,
                                      image3: item.quiz_option_3,
                                      image4: item.quiz_option_4,
                                      image5: item.quiz_question,
                                    })
                                  }}>
                                  <Image
                                    style={styles.imageQuizOption}
                                    source={{
                                      uri:
                                        'https://worldmcqs.org/Admin/assets/Images/' +
                                        item.quiz_option_1,
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                              <View style={styles.imageOptionView}>
                                <TouchableOpacity>
                                  <Text style={styles.option}>B</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={[
                                    {
                                      marginLeft: 5,
                                      width: '80%',
                                      justifyContent: 'center',
                                      borderWidth: 2,
                                      borderColor:
                                        item.selected_option == '2'
                                          ? Colors.primary
                                          : 'lightgrey',
                                    },
                                  ]}
                                  onPress={() =>
                                    handleClick(item.question_id, 2)
                                  }
                                  onLongPress={() => {
                                    navigation.navigate('zoomImage', {
                                      image1: item.quiz_option_2,
                                      image2: item.quiz_option_3,
                                      image3: item.quiz_option_4,
                                      image4: item.quiz_option_1,
                                      image5: item.quiz_question,
                                    })
                                  }}>
                                  <Image
                                    style={styles.imageQuizOption}
                                    source={{
                                      uri:
                                        'https://worldmcqs.org/Admin/assets/Images/' +
                                        item.quiz_option_2,
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                              <View style={styles.imageOptionView}>
                                <TouchableOpacity>
                                  <Text style={styles.option}>C</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={[
                                    {
                                      marginLeft: 5,
                                      width: '80%',
                                      justifyContent: 'center',
                                      borderWidth: 2,
                                      borderColor:
                                        item.selected_option == '3'
                                          ? Colors.primary
                                          : 'lightgrey',
                                    },
                                  ]}
                                  onPress={() =>
                                    handleClick(item.question_id, 3)
                                  }
                                  onLongPress={() => {
                                    navigation.navigate('zoomImage', {
                                      image1: item.quiz_option_3,
                                      image2: item.quiz_option_4,
                                      image3: item.quiz_option_1,
                                      image4: item.quiz_option_2,
                                      image5: item.quiz_question,
                                    })
                                  }}>
                                  <Image
                                    style={styles.imageQuizOption}
                                    source={{
                                      uri:
                                        'https://worldmcqs.org/Admin/assets/Images/' +
                                        item.quiz_option_3,
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                              <View style={styles.imageOptionView}>
                                <TouchableOpacity>
                                  <Text style={styles.option}>D</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={[
                                    {
                                      marginLeft: 5,
                                      width: '80%',
                                      justifyContent: 'center',
                                      borderWidth: 2,
                                      borderColor:
                                        item.selected_option == '4'
                                          ? Colors.primary
                                          : 'lightgrey',
                                    },
                                  ]}
                                  onPress={() =>
                                    handleClick(item.question_id, 4)
                                  }
                                  onLongPress={() => {
                                    navigation.navigate('zoomImage', {
                                      image1: item.quiz_option_4,
                                      image2: item.quiz_question,
                                      image3: item.quiz_option_1,
                                      image4: item.quiz_option_2,
                                      image5: item.quiz_option_3,
                                    })
                                  }}>
                                  <Image
                                    style={styles.imageQuizOption}
                                    source={{
                                      uri:
                                        'https://worldmcqs.org/Admin/assets/Images/' +
                                        item.quiz_option_4,
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                            </>
                          )}

                          {item.selected_option == '1' ? (
                            <>
                              {item.quiz_answer == '1' ? (
                                <>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>A</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_1,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>B</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_2,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>C</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_3,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>D</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_4,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}

                              {item.quiz_answer == '2' ? (
                                <>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>A</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_1,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>B</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_2,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>C</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_3,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>D</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_4,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}

                              {item.quiz_answer == '3' ? (
                                <>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>A</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_1,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>B</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_2,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>C</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_3,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>D</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_4,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}

                              {item.quiz_answer == '4' ? (
                                <>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>A</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_1,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>B</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_2,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>C</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      onLongPress={() => {
                                        navigation.navigate('zoomImage', {
                                          image1: item.quiz_option_3,
                                          image2: item.quiz_option_4,
                                          image3: item.quiz_option_1,
                                          image4: item.quiz_option_2,
                                          image5: item.quiz_question,
                                        })
                                      }}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_3,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>D</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_4,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}
                            </>
                          ) : null}

                          {item.selected_option == '2' ? (
                            <>
                              {item.quiz_answer == '1' ? (
                                <>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>A</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_1,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>B</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_2,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>C</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_3,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>D</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_4,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}

                              {item.quiz_answer == '2' ? (
                                <>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>A</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_1,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>B</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_2,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>C</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_3,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>D</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_4,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}

                              {item.quiz_answer == '3' ? (
                                <>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>A</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_1,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>B</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_2,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>C</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_3,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>D</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_4,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}

                              {item.quiz_answer == '4' ? (
                                <>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>A</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_1,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>B</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_2,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>C</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_3,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>D</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_4,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}
                            </>
                          ) : null}

                          {item.selected_option == '3' ? (
                            <>
                              {item.quiz_answer == '1' ? (
                                <>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>A</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_1,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>B</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_2,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>C</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_3,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>D</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_4,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}

                              {item.quiz_answer == '2' ? (
                                <>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>A</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_1,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>B</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_2,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>C</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_3,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>D</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_4,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}

                              {item.quiz_answer == '3' ? (
                                <>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>A</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_1,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>B</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_2,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>C</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_3,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>D</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_4,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}

                              {item.quiz_answer == '4' ? (
                                <>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>A</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_1,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>B</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_2,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>C</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_3,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>D</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_4,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}
                            </>
                          ) : null}

                          {item.selected_option == '4' ? (
                            <>
                              {item.quiz_answer == '1' ? (
                                <>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>A</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_1,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>B</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_2,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>C</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_3,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>D</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_4,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}

                              {item.quiz_answer == '2' ? (
                                <>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>A</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_1,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>B</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_2,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>C</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_3,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>D</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_4,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}

                              {item.quiz_answer == '3' ? (
                                <>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>A</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_1,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>B</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_2,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>C</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_3,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>D</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_4,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}

                              {item.quiz_answer == '4' ? (
                                <>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>A</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_1,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>B</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_2,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>C</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_3,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.imageOptionView}>
                                    <TouchableOpacity>
                                      <Text style={styles.option}>D</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        {
                                          marginLeft: 5,
                                          width: '80%',
                                          justifyContent: 'center',
                                          borderWidth: 2,
                                          borderColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Image
                                        style={styles.imageQuizOption}
                                        source={{
                                          uri:
                                            'https://worldmcqs.org/Admin/assets/Images/' +
                                            item.quiz_option_4,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}
                            </>
                          ) : null}
                        </View>
                      ) : (
                        <View>
                          {item.selected_option === null && (
                            <>
                              <View style={styles.optionView}>
                                <Text style={styles.option}>A</Text>

                                <TouchableOpacity
                                  style={[
                                    styles.optionText,

                                    {
                                      backgroundColor:
                                        item.selected_option == '1'
                                          ? Colors.primary
                                          : 'lightgrey',
                                    },
                                  ]}
                                  onPress={() => {
                                    handleClick(item.question_id, 1)
                                  }}>
                                  <Text style={{fontSize: 14}}>
                                    {item.quiz_option_1}
                                  </Text>
                                </TouchableOpacity>
                              </View>

                              <View style={styles.optionView}>
                                <Text style={styles.option}>B</Text>
                                <TouchableOpacity
                                  style={[
                                    styles.optionText,
                                    {
                                      backgroundColor:
                                        item.selected_option == '2'
                                          ? Colors.primary
                                          : 'lightgrey',
                                    },
                                    // {
                                    //   backgroundColor:
                                    //     rightQuestions.includes(item.question_id) &&
                                    //     item.quiz_answer == '2' &&
                                    //     'green',
                                    // },
                                    // {
                                    //   backgroundColor:
                                    //     wrongQuestions.includes(item.question_id) &&
                                    //     item.quiz_answer == '2' &&
                                    //     'red',
                                    // },
                                  ]}
                                  onPress={() =>
                                    handleClick(item.question_id, 2)
                                  }>
                                  <Text style={{fontSize: 14}}>
                                    {item.quiz_option_2}
                                  </Text>
                                </TouchableOpacity>
                              </View>

                              <View style={styles.optionView}>
                                <Text style={styles.option}>C</Text>
                                <TouchableOpacity
                                  style={[
                                    styles.optionText,
                                    {
                                      backgroundColor:
                                        item.selected_option == '3'
                                          ? Colors.primary
                                          : 'lightgrey',
                                    },
                                  ]}
                                  onPress={() =>
                                    handleClick(item.question_id, 3)
                                  }>
                                  <Text style={{fontSize: 14}}>
                                    {item.quiz_option_3}
                                  </Text>
                                </TouchableOpacity>
                              </View>

                              <View style={styles.optionView}>
                                <Text style={styles.option}>D</Text>
                                <TouchableOpacity
                                  style={[
                                    styles.optionText,
                                    {
                                      backgroundColor:
                                        item.selected_option == '4'
                                          ? Colors.primary
                                          : 'lightgrey',
                                    },
                                  ]}
                                  onPress={() =>
                                    handleClick(item.question_id, 4)
                                  }>
                                  <Text style={{fontSize: 14}}>
                                    {item.quiz_option_4}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </>
                          )}
                          {item.selected_option === 'Error' && (
                            <>
                              <View style={styles.optionView}>
                                <Text style={styles.option}>A</Text>

                                <TouchableOpacity
                                  style={[
                                    styles.optionText,

                                    {
                                      backgroundColor:
                                        item.selected_option == '1'
                                          ? Colors.primary
                                          : 'lightgrey',
                                    },
                                  ]}
                                  onPress={() => {
                                    handleClick(item.question_id, 1)
                                  }}>
                                  <Text style={{fontSize: 14}}>
                                    {item.quiz_option_1}
                                  </Text>
                                </TouchableOpacity>
                              </View>

                              <View style={styles.optionView}>
                                <Text style={styles.option}>B</Text>
                                <TouchableOpacity
                                  style={[
                                    styles.optionText,
                                    {
                                      backgroundColor:
                                        item.selected_option == '2'
                                          ? Colors.primary
                                          : 'lightgrey',
                                    },
                                    // {
                                    //   backgroundColor:
                                    //     rightQuestions.includes(item.question_id) &&
                                    //     item.quiz_answer == '2' &&
                                    //     'green',
                                    // },
                                    // {
                                    //   backgroundColor:
                                    //     wrongQuestions.includes(item.question_id) &&
                                    //     item.quiz_answer == '2' &&
                                    //     'red',
                                    // },
                                  ]}
                                  onPress={() =>
                                    handleClick(item.question_id, 2)
                                  }>
                                  <Text style={{fontSize: 14}}>
                                    {item.quiz_option_2}
                                  </Text>
                                </TouchableOpacity>
                              </View>

                              <View style={styles.optionView}>
                                <Text style={styles.option}>C</Text>
                                <TouchableOpacity
                                  style={[
                                    styles.optionText,
                                    {
                                      backgroundColor:
                                        item.selected_option == '3'
                                          ? Colors.primary
                                          : 'lightgrey',
                                    },
                                  ]}
                                  onPress={() =>
                                    handleClick(item.question_id, 3)
                                  }>
                                  <Text style={{fontSize: 14}}>
                                    {item.quiz_option_3}
                                  </Text>
                                </TouchableOpacity>
                              </View>

                              <View style={styles.optionView}>
                                <Text style={styles.option}>D</Text>
                                <TouchableOpacity
                                  style={[
                                    styles.optionText,
                                    {
                                      backgroundColor:
                                        item.selected_option == '4'
                                          ? Colors.primary
                                          : 'lightgrey',
                                    },
                                  ]}
                                  onPress={() =>
                                    handleClick(item.question_id, 4)
                                  }>
                                  <Text style={{fontSize: 14}}>
                                    {item.quiz_option_4}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </>
                          )}
                          {item.selected_option == '1' ? (
                            <>
                              {item.quiz_answer == '1' ? (
                                <>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>A</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_1}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>B</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_2}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>C</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_3}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>D</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_4}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}
                              {item.quiz_answer == '2' ? (
                                <>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>A</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_1}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>B</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_2}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>C</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_3}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>D</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_4}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}
                              {item.quiz_answer == '3' ? (
                                <>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>A</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_1}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>B</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_2}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>C</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_3}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>D</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_4}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}
                              {item.quiz_answer == '4' ? (
                                <>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>A</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_1}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>A</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_1}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>B</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_1}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>C</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_3}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}
                            </>
                          ) : null}

                          {item.selected_option == '2' ? (
                            <>
                              {item.quiz_answer == '1' ? (
                                <>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>A</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_1}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>B</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_2}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>C</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_3}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>D</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      onPress={() => {
                                        handleClick(item.question_id, 1)
                                      }}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_4}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}
                              {item.quiz_answer == '2' ? (
                                <>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>A</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_1}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>B</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_2}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>C</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_3}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>D</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_4}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}
                              {item.quiz_answer == '3' ? (
                                <>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>A</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_1}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>B</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_2}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>C</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'green',
                                        },
                                      ]}
                                      onPress={() => {
                                        handleClick(item.question_id, 3)
                                      }}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_1}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>D</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_4}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}
                              {item.quiz_answer == '4' ? (
                                <>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>A</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_1}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>B</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_2}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>C</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_3}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>D</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_2}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}
                            </>
                          ) : null}

                          {item.selected_option == '3' ? (
                            <>
                              {item.quiz_answer == '1' ? (
                                <>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>A</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_1}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>B</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_2}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>C</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_3}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>D</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_4}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}
                              {item.quiz_answer == '2' ? (
                                <>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>A</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_1}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>B</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_2}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>C</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_3}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>D</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_4}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}
                              {item.quiz_answer == '3' ? (
                                <>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>A</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_1}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>B</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_2}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>C</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_3}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>D</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_4}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}
                              {item.quiz_answer == '4' ? (
                                <>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>A</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_1}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>B</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_2}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>C</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_3}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>D</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_4}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}
                            </>
                          ) : null}
                          {item.selected_option == '4' ? (
                            <>
                              {item.quiz_answer == '1' ? (
                                <>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>A</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_1}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>B</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_2}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>C</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_3}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>D</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_4}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}
                              {item.quiz_answer == '2' ? (
                                <>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>D</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_4}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>A</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_1}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>B</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_2}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>C</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_3}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}
                              {item.quiz_answer == '3' ? (
                                <>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>D</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_4}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>A</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_1}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>B</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_2}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>C</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'red',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_3}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}
                              {item.quiz_answer == '4' ? (
                                <>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>A</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_1}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>B</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_2}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>C</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'lightgrey',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_3}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.optionView}>
                                    <Text style={styles.option}>D</Text>

                                    <TouchableOpacity
                                      style={[
                                        styles.optionText,

                                        {
                                          backgroundColor: 'green',
                                        },
                                      ]}
                                      disabled={true}>
                                      <Text style={{fontSize: 14}}>
                                        {item.quiz_option_3}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </>
                              ) : null}
                            </>
                          ) : null}
                        </View>
                      )}
                    </View>
                  </View>
                )
              }}
            />
          </SafeAreaView>
          <TouchableOpacity style={styles.submitButton} onPress={submitQuiz}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '',
    paddingVertical: 15,
  },
  activity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryHeading: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
    paddingVertical: 10,
    marginTop: 20,
  },
  questionContainer: {
    // marginHorizontal: 8,
    // paddingHorizontal: 10,
    borderRadius: 10,
    // paddingBottom: 60,
    marginBottom: 10,
    height: '90%',
    // paddingVertical: 20,
  },

  item: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
    backgroundColor: 'white',
    // margin: 10,

    //   padding: 20,
    //   alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 10,
    // borderWidth: 2,
    borderRadius: 10,
    // borderColor: 'white',
    marginHorizontal: 10,
  },
  questionView: {
    // paddingBottom: 10,
    borderBottomWidth: 1,
    // marginRight: 60,
  },
  question: {
    color: 'grey',
    fontWeight: '700',
    fontSize: 14,
    paddingBottom: 5,
  },
  optionView: {
    flexDirection: 'row',
    marginTop: 8,
    paddingRight: 15,
  },
  imageOptionView: {
    flexDirection: 'row',
    marginTop: 10,
  },
  option: {
    backgroundColor: Colors.primary,
    color: 'white',
    padding: 12,
    fontSize: 14,
    textAlign: 'center',
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
  },
  optionText: {
    marginLeft: 5,
    fontSize: 12,
    borderRadius: 20,
    // backgroundColor: 'lightgrey',
    width: '90%',
    textAlignVertical: 'center',
    justifyContent: 'center',
    // textAlign: 'left',
    paddingLeft: 10,
    //   marginRight: 10,
  },

  imageQuizQues: {
    // marginRight: 400,
    // width: '100%',
    height: 30,
    fontSize: 14,
  },
  imageQuizOption: {
    width: '80%',
    height: 30,
    // paddingRight: 30,
  },
  optionContainer: {
    paddingBottom: 10,
  },
  submitButton: {
    // marginVertical: 10,
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    width: '40%',
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
})
export default CategoryQuizScreen
