import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Colors from '../../Constants/Colors';

const PrivateNotes = () => {
  const [notes, setNotes] = useState('');
  const [addNotes, setAddNotes] = useState(false);

  const updateNotes = text => {
    setNotes(text);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.notesContainer}>
        {!addNotes ? (
          <TouchableOpacity
            style={styles.titleContainer}
            activeOpacity={0.6}
            onPress={() => setAddNotes(true)}>
            <Text style={styles.title}>Tap to add your notes</Text>
            <Text style={styles.title}>notes</Text>
            <Text style={styles.title}>here</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Add your notes...."
              placeholderTextColor="#878694"
              style={styles.title}
              value={notes}
              onChangeText={updateNotes}
              multiline={true}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  notesContainer: {
    backgroundColor: '#22212F',
    height: '97%',
    marginTop: 15,
    borderRadius: 16,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#878694',
  },
  inputContainer: {
    paddingHorizontal: 10,
  },
});

export default PrivateNotes;
