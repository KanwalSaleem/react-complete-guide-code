import React from 'react'
import {View, TextInput, StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const CommonSearch = (props) => {
  return (
    <View style={{...styles.inputContainer, ...props.style}}>
      <Icon name="search" color="#707070" size={25} />
      <TextInput
        placeholder={props.placeholder}
        style={styles.input}
        placeholderTextColor="#707070"
        multiline={true}
        onChangeText={props.onChangeText}
        value={props.value}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '90%',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#5ab1fc',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 25,

    // marginBottom: 20,
  },
  input: {
    color: '#707070',
    fontFamily: 'Segoe UI',
    fontSize: 14,
    flexGrow: 1,
  },
})

export default CommonSearch
