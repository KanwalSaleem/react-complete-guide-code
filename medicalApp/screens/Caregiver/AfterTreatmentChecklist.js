import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native'
import Colors from '../../constants/Colors'
import {useSelector} from 'react-redux'

import {RadioButton, ActivityIndicator} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {APIURL} from '../../constants/url'
import AuthButton from '../../components/AuthButton'

// const checkList = [
//   {
//     id: 1,
//     message: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
//   },
//   {
//     id: 2,
//     message: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
//   },
//   {
//     id: 3,
//     message: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
//   },
//   {
//     id: 4,
//     message: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
//   },
//   {
//     id: 5,
//     message: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
//   },
// ]

const AfterTreatmentChecklist = ({route, navigation}) => {
  const [loading, setLoading] = useState(false)
  const [itemId, setItemId] = useState('')
  console.log(route.params.data.checklist.diagnosis)
  const [notes, setNotes] = useState(
    route.params.data.checklist.diagnosis.map((item) => ({
      message: item.message,
      id: Math.random(Math.random() * Math.random),
      comment: '',
    })),
  )

  const [checklist, setChecklist] = useState(
    route.params.data.checklist.diagnosis.map((item) => ({
      message: item.message,
      id: Math.random(Math.random() * Math.random),
      comment: '',
    })),
  )
  const token = useSelector((state) => state.auth.token)
  console.log(route.params.data.id)
  const completeTreatment = async () => {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${token}`)
    const formData = new FormData()
    formData.append('request_id', route.params.data.id)
    formData.append(
      'treatment_diagnosis',
      `${checklist.map((item) => {
        delete item.id
        return item
      })}`,
    )
    console.log(
      checklist.map((item) => {
        delete item.id
        return item
      }),
    )
    setLoading(true)
    try {
      const response = await fetch(
        `${APIURL}/api/care-giver/treatment-complete`,
        {
          body: formData,
          headers,
          method: 'POST',
          redirect: 'follow',
        },
      )
      const resData = await response.json()
      console.log(resData)

      if (!response.ok) {
        throw new Error(resData.message)
      }
      if (resData.success) {
        Alert.alert('Success', resData.message, [
          {
            onPress: () => navigation.navigate('home'),
          },
        ])
      }
      if (!resData.success) {
        Alert.alert('Unsuccesful', resData.message)
      }
    } catch (e) {
      Alert.alert(e.message)
    }
    setLoading(false)
  }
  const addComment = (id, comment) => {
    console.log('sadasdsa')
    const updateChecklist = checklist.map((item) => {
      if (item.id === id) {
        return {...item, comment}
      }
      return item
    })
    setChecklist(updateChecklist)
  }
  const noteComment = (index, comment) => {
    const updateChecklist = checklist.map((item, itemIndex) => {
      if (index === itemIndex) {
        return {...item, comment}
      }
      return item
    })
    setChecklist(updateChecklist)
  }

  return (
    <View style={styles.mainScreen}>
      <ScrollView contentContainerStyle={{}}>
        <View style={styles.whiteContainer}>
          <View>
            {checklist.length > 0 &&
              checklist.map((item, index) => (
                <View key={item.id}>
                  <View style={styles.itemContainer}>
                    <Text style={styles.number}>{index + 1}</Text>
                    <Text style={styles.text} adjustsFontSizeToFit={true}>
                      {item.message}
                    </Text>
                  </View>
                  <View style={styles.checkboxOptionsContainer}>
                    <View style={styles.optionContainer}>
                      <RadioButton
                        value="done"
                        color={Colors.primary}
                        onPress={addComment.bind(this, item.id, 'done')}
                        status={
                          item.comment === 'done' ? 'checked' : 'unchecked'
                        }
                      />
                      <Text>Done</Text>
                    </View>
                    <View style={styles.optionContainer}>
                      <RadioButton
                        color={Colors.primary}
                        value="notDone"
                        onPress={addComment.bind(this, item.id, 'not done')}
                        status={
                          item.comment === 'not done' ? 'checked' : 'unchecked'
                        }
                      />
                      <Text>Not Done</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.optionContainer}
                      onPress={() => setItemId(item.id)}>
                      <Text
                        style={[
                          styles.noteButtonText,
                          itemId === item.id && styles.redNoteText,
                        ]}>
                        Write Note
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {item.id === itemId && (
                    <View style={styles.noteContainer}>
                      <TextInput
                        style={styles.noteInput}
                        placeholder="Write a Note"
                        onChangeText={(text) => {
                          noteComment(index, text)
                        }}
                        value={item.comment}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          setItemId('')
                        }}>
                        <Icon name="check-circle" size={30} color="red" />
                        <Text>Save</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{marginTop: 35}} />
      ) : (
        <AuthButton
          style={{width: '100%', height: 50}}
          onPress={completeTreatment}>
          Submit
        </AuthButton>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    // flexGrow: 1,
    backgroundColor: Colors.black,
    // paddingVertical: 20,
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  whiteContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    // marginBottom: 10,
    // paddingBottom: 30,
  },
  itemContainer: {
    flexDirection: 'row',

    paddingTop: 10,
    paddingBottom: 5,
    // paddingTop: 10,
    paddingHorizontal: 10,
  },
  number: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginRight: 40,
    // alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    maxWidth: '80%',
    textAlign: 'left',
    lineHeight: 20,
    marginBottom: 10,
  },
  checkboxOptionsContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: '15%',
  },
  noteContainer: {
    // width: '80%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  noteInput: {
    width: '75%',
    borderWidth: 0.5,
    height: 64,
    backgroundColor: '#F6F1F1',
    marginRight: 5,
    textAlignVertical: 'top',
  },
  noteButtonText: {
    color: 'black',
    fontFamily: 'Roboto-Regular',
  },
  redNoteText: {
    color: Colors.primary,
  },
})
export default AfterTreatmentChecklist
