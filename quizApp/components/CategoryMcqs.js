import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {Card, Title} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {CardStyleInterpolators} from '@react-navigation/stack'
import Colors from '../constants/Colors'
import {Item} from 'react-native-paper/lib/typescript/components/List/List'

const CategoryMcqs = props => {
  const navigation = useNavigation()

  return (
    // <View style={styles.container}>
    <FlatList
      data={props.Data}
      nestedScrollEnabled
      keyExtractor={(item, index) => item.category_id}
      renderItem={({item}) => {
        return (
          <View>
            <Card style={{...styles.card, ...props.card}}>
              <Card.Content>
                <Title>{item.Category_Name}</Title>

                <FlatList
                  data={item.Sub_Cat}
                  keyExtractor={(item, index) => item.sub_category_id}
                  numColumns={3}
                  renderItem={({item}) => {
                    return (
                      <View style={styles.categoryRow}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('categoryQuestions', {
                              subCategoryId: item.sub_category_id,
                              subCategoryName: item.sub_category_name,
                            })
                          }>
                          <View style={styles.categoryOption}>
                            <View style={styles.imageView}>
                              <Image
                                style={styles.optionImage}
                                source={{
                                  uri: item.sub_category_icon
                                    ? item.sub_category_icon
                                    : '',
                                }}
                              />
                            </View>
                            <View style={styles.textView}>
                              <Text style={styles.text}>
                                {item.sub_category_name}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )
                  }}
                />
              </Card.Content>
            </Card>
          </View>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 250,
  },
  card: {
    // height: 300,
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    paddingBottom: 100,
  },
  itemContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  categoryRow: {
    flex: 1,
    justifyContent: 'space-around',
    marginTop: 30,
    // paddingHorizontal: 10,
  },
  categoryOption: {
    maxWidth: 100,
    height: 100,
    // width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageView: {
    height: 70,
  },
  optionImage: {
    width: 60,
    height: 60,
  },
  textView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    textAlignVertical: 'top',
  },
  text: {
    // width: '100%',
    textAlign: 'center',
    textAlignVertical: 'top',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22
  },
  modalView: {
    width: '80%',
    height: 470,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    // padding: 35,
    // alignItems: "center",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  topBar: {
    width: '100%',
    height: 60,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    // justifyContent: 'space-around',
    // alignItems: 'center',
    position: 'absolute', //Here is the trick
    top: 0, //Here is the trick
    // paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  topBarText: {
    // marginLeft: 10,
    color: 'white',
    fontSize: 16,
    //  fontWeight: '700'
    textAlignVertical: 'center',
  },
  topIcon: {
    // marginLeft: 40,
  },
  modalFileds: {
    paddingTop: 70,
    // marginVertical: 20
    marginHorizontal: 10,
  },

  createQuiz: {
    marginTop: 70,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 30,
  },
  quizText: {
    height: 50,
    textAlignVertical: 'center',
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
})

export default CategoryMcqs
