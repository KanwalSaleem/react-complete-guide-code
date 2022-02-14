import React, {useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Menu} from 'react-native-paper'

const ChecklistItem = (props) => {
  const [visible, setVisible] = useState(false)
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.number}>{props.number}</Text>
      <Text style={styles.text} adjustsFontSizeToFit={true}>
        {props.message}
      </Text>
      <Menu
        style={{marginTop: 30}}
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TouchableOpacity onPress={() => setVisible(true)}>
            <Icon name="more-vert" size={25} />
          </TouchableOpacity>
        }>
        <Menu.Item
          onPress={() => {
            setVisible(false)
            props.onEdit()
          }}
          title="Edit"
        />
        <Menu.Item
          onPress={props.onRemove.bind(this, props.id)}
          title="Delete"
        />
      </Menu>
    </View>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 5,
    // paddingTop: 10,

    borderBottomColor: '#707070',
    borderBottomWidth: 1,
  },
  number: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    maxWidth: '80%',
    textAlign: 'left',
    lineHeight: 20,
    marginBottom: 10,
  },
})

export default ChecklistItem
