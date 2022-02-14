import React, {forwardRef, useState} from 'react'
import {
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native'
import {useController, Controller} from 'react-hook-form'
import Colors from '../constants/Colors'
import {Picker} from '@react-native-picker/picker'
import fonts from '../constants/fonts'
import RNPickerSelect from 'react-native-picker-select'
import Icon from 'react-native-vector-icons/MaterialIcons'

const Input = forwardRef((props, ref) => {
  const {field} = useController({
    control: props.control,
    defaultValue: '',
    name: props.name,
    rules: props.rules,
  })

  const [passwordVisible, setPasswordVisible] = useState(true)

  return (
    <View
      style={[
        styles.fieldContainer,
        props.container,
        props.errors && styles.errorBorder,
      ]}>
      {!props.picker && (
        <TextInput
          allowFontScaling={false}
          value={field.value}
          onChangeText={field.onChange}
          style={[
            styles.input,
            props.style,
            props.showPassword && {flexBasis: '80%'},
          ]}
          placeholder={props.placeholder}
          secureTextEntry={props.showPassword && passwordVisible}
          multiline={props.multiline}
          numberOfLines={props.numberOfLines}
          returnKeyType={props.returnKeyType || 'next'}
          focusable={true}
          keyboardType={props.keyboardType}
          ref={ref}
          onSubmitEditing={props.onSubmitEditing}
          blurOnSubmit={props.blurOnSubmit}
          placeholderTextColor={'#BDBDBD'}
          maxLength={props.maxLength}
          editable={props.editable}
        />
      )}
      {props.showPassword && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={styles.showContainer}>
          {passwordVisible ? (
            <Text style={styles.showText} allowFontScaling={false}>
              Show
            </Text>
          ) : (
            <Text style={styles.showText} allowFontScaling={false}>
              Hide
            </Text>
          )}
        </TouchableOpacity>
      )}
      {props.picker && (
        <View style={styles.pickerContainer}>
          <Controller
            control={props.control}
            name={props.name}
            defaultValue={props.defaultPickerValue}
            render={({field: {value, onChange}}) => (
              <RNPickerSelect
                useNativeAndroidPickerStyle={false}
                pickerProps={{
                  mode: 'dropdown',
                  onFocus: props.onOpen,
                }}
                onValueChange={onChange}
                value={value}
                items={props.pickerValue.map((item) => ({
                  label: item,
                  value: item,
                }))}
                textInputProps={{
                  allowFontScaling: false,
                  value: value || props.label,
                }}
                style={{
                  doneDepressed: {color: 'black'},
                  placeholder: {
                    fontSize: 16,
                    margin: Platform.OS === 'ios' ? 15 : 0,
                    color: value ? 'black' : '#BDBDBD',
                  },

                  viewContainer: {height: 50, justifyContent: 'center'},
                  inputIOSContainer: {height: 60, justifyContent: 'center'},
                  inputAndroidContainer: {height: 50, justifyContent: 'center'},
                  inputIOS: {
                    marginLeft: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'black',
                    fontSize: 16,
                  },
                  inputAndroid: {
                    marginLeft: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'black',
                    fontSize: 16,
                  },
                }}
                placeholder={{label: props.label}}
                Icon={() => (
                  <Icon
                    name="expand-more"
                    style={{marginRight: 10}}
                    size={20}
                  />
                )}
              />
              // <Picker

              //   style={fonts.title}
              //   dropdownIconColor={Colors.primary}
              //   selectedValue={value}
              //   onValueChange={onChange}

              //   mode="dialog">
              //   <Picker.Item style={{color: Colors.grey}} label={props.label} />
              //   {props.pickerValue.map((item, index) => {
              //     return (
              //       <Picker.Item
              //         style={{color: Colors.grey}}
              //         label={item}
              //         value={item}
              //         key={item}
              //       />
              //     )
              //   })}
              // </Picker>
            )}
          />
        </View>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  input: {
    color: Colors.black,
    height: 50,
    fontSize: 16,
    // fontWeight: '600',
    fontFamily: 'Inter-Regular',
    paddingHorizontal: 10,
    flexBasis: '100%',
  },
  fieldContainer: {
    width: '90%',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#F6F6F6',
    borderColor: '#E8E8E8',
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorBorder: {
    borderColor: '#b55151',
  },
  showContainer: {
    paddingHorizontal: 10,
  },
  showText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.primary,
  },
  pickerContainer: {
    width: '100%',
  },
})

export default Input
