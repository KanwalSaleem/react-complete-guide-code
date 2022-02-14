import React, {useEffect, useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native'
import {Portal, Modal, ActivityIndicator} from 'react-native-paper'
import colors from '../../constants/colors'
import {Controller, useForm} from 'react-hook-form'
import {Picker} from '@react-native-picker/picker'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DocumentPicker from 'react-native-document-picker'
import LinearGradient from 'react-native-linear-gradient'

const AddProductService = (props) => {
  // console.log(props, 'sdads')
  const [tags, setTags] = useState([])
  const [tag, setTag] = useState('')
  const [images, setImages] = useState([])
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: {errors},
  } = useForm({mode: 'all'})

  const addTag = () => {
    setTags((prev) => prev.concat(tag))
    setTag('')
  }
  const deleteTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tagToRemove !== tag))
  }
  const filePickerHandler = async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [
          // DocumentPicker.types.pdf,
          // DocumentPicker.types.docx,
          // DocumentPicker.types.doc,
          DocumentPicker.types.images,
        ],
        allowMultiSelection: true,
        mode: 'import',
      })

      // images[fileIndex] = {
      //   uri: response.uri,
      //   type: response.type,
      //   fileName: response.name,
      // }

      // const formData = new FormData()
      // formData.append('UploadFiles', {
      //   type: response[0].type,
      //   name: response[0].name,
      //   uri: response[0].fileCopyUri,
      // })
      // const headers = new Headers()
      // headers.append('Accept', '/')
      // headers.append('Content-Type', 'multipart/form-data')
      // try {
      //   const imageResponse = await fetch(
      //     `https://sassolution.org/Admin/API/cdn_image.php`,
      //     {
      //       body: formData,
      //       method: 'POST',
      //       headers,
      //     },
      //   )

      //   const resData = await imageResponse.json()
      //   console.log(resData)
      // } catch (e) {
      //   console.log(e)
      // }
      const uploadImages = async () => {
        // console.log(data.files, 'files')
        const formData = new FormData()
        // if (data.files) {
        // response.forEach((file) => formData.append('file', file.uri))
        response.forEach((file) =>
          formData.append('file', {
            type: file.type,
            name: file.name,
            uri: file.fileCopyUri,
          }),
        )

        console.log(formData)
        return fetch(`https://cdn.deliverypay.in/upload`, {
          method: 'POST',
          body: formData,
        })
      }

      uploadImages()
        .then((res) => res.json())
        .then(({files}) => {
          setValue(
            'files',
            files.map((image) => `https://cdn.deliverypay.in/${image}`),
          )
          setImages(files.map((image) => `https://cdn.deliverypay.in/${image}`))

          console.log(files)
        })

        .catch((e) => Alert.alert('', e.message))
    } catch (e) {
      console.log(e)
    }
  }

  const onSubmit = (data) => {
    props.onSubmit({...data, tags})
  }

  useEffect(() => {
    props.product && console.log(props, 'sdads')
    props.product != null ? setTags(props.product.tags) : setTags([])
    props.product != null ? setImages(props.product.images) : setImages([])
    props.product != null &&
      reset({
        productType: props?.product?.type,
        category: props?.product?.category,
        name: props?.product?.name,
        price: props?.product?.price?.toString(),
        available: props?.product?.available,
        description: props?.product?.dscr,
        discountType: props?.product?.discount?.type,
        discountAmount: props?.product?.discount?.amount.toString(),
        discountDescription: props?.product?.discount?.dscr,
      })

    return () => reset({})
  }, [props, reset])
  console.log(errors)

  return (
    <Portal>
      <Modal
        contentContainerStyle={styles.modalContainer}
        onDismiss={() => props.onDismiss(false)}
        visible={props.open}>
        <View style={styles.modalHeadingContainer}>
          <Text style={styles.modalHeading}>Add Product/ Service</Text>
        </View>
        <ScrollView>
          {/* <View style={styles.fieldArea}>
            <Controller
                name="amount"
                control={control}
                shouldUnregister={true}
                rules={{required: true}}
                render={({field: {value, onChange}}) => (
                  <TextInput
                    value={value.toString()}
                    onChangeText={onChange}
                    // style={[styles.field, errors.amount && styles.redBorder]}
                    placeholder="Name of the product/service"
                  />
                )}
              />
            </View> */}
          <View style={styles.fieldArea}>
            <Text style={styles.fieldHeading}>Type</Text>
            <View
              style={{
                borderColor: errors.productType ? colors.errorColor : 'grey',

                borderRadius: 10,
                width: '100%',
                alignSelf: 'center',
                marginBottom: 10,
                borderBottomWidth: 1,
              }}>
              <Controller
                name="productType"
                control={control}
                rules={{required: true}}
                render={({field: {value, onChange}}) => (
                  <Picker
                    dropdownIconColor={'black'}
                    mode="dropdown"
                    selectedValue={value}
                    onValueChange={onChange}>
                    <Picker.Item value="product" label="Product" />
                    <Picker.Item value="service" label="Service" />
                    <Picker.Item value="other" label="Other" />
                  </Picker>
                )}
              />
            </View>
          </View>

          <View style={styles.fieldArea}>
            <Text style={styles.fieldHeading}>Category</Text>
            <View
              style={{
                borderColor: errors.category ? colors.errorColor : 'grey',

                borderRadius: 10,
                width: '100%',
                alignSelf: 'center',
                marginBottom: 10,
                borderBottomWidth: 1,
              }}>
              <Controller
                name="category"
                control={control}
                dropdownIconColor={'black'}
                rules={{required: true}}
                render={({field: {value, onChange}}) => (
                  <Picker
                    mode="dropdown"
                    selectedValue={value}
                    onValueChange={onChange}>
                    <Picker.Item value={''} label="Category" />
                    {props.categories.length > 0 &&
                      props.categories.map((category) => (
                        <Picker.Item
                          key={category}
                          value={category}
                          label={category}
                        />
                      ))}
                  </Picker>
                )}
              />
            </View>
          </View>

          <View style={styles.fieldArea}>
            <Text style={styles.fieldHeading}>Name</Text>

            <Controller
              name="name"
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  style={{
                    ...styles.field,
                    borderBottomColor: errors.name && colors.errorColor,
                  }}
                />
              )}
            />
          </View>
          <View style={styles.fieldArea}>
            <Text style={styles.fieldHeading}>Price</Text>

            <Controller
              name="price"
              control={control}
              rules={{
                pattern: /^(0|[1-9][0-9]*)$/g,
                required: true,
              }}
              render={({field: {value, onChange}}) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  style={(styles.field, [errors.price && styles.redBorder])}
                  keyboardType={'numeric'}
                  placeholderTextColor="grey"
                />
              )}
            />
          </View>
          {watch('productType') === 'product' ? (
            <View style={[styles.fieldArea]}>
              <Text style={styles.fieldHeading}>Available in stock</Text>

              <Controller
                name="available"
                control={control}
                rules={{
                  pattern: /^(0|[1-9][0-9]*)$/g,
                  required: true,
                }}
                render={({field: {value, onChange}}) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    style={[styles.field, errors.pirce && styles.redBorder]}
                    keyboardType={'numeric'}
                    placeholderTextColor="grey"
                  />
                )}
              />
            </View>
          ) : (
            <View style={styles.fieldArea}>
              <Text style={styles.fieldHeading}>Availability</Text>
              <View
                style={{
                  borderColor: errors.available ? colors.errorColor : 'grey',

                  borderRadius: 10,
                  width: '100%',
                  alignSelf: 'center',
                  marginBottom: 10,
                  borderBottomWidth: 1,
                }}>
                <Controller
                  name="available"
                  control={control}
                  rules={{required: true}}
                  render={({field: {value, onChange}}) => (
                    <Picker
                      dropdownIconColor={'black'}
                      mode="dropdown"
                      selectedValue={value}
                      onValueChange={onChange}>
                      <Picker.Item value={''} label="Availability" />
                      <Picker.Item value="true" label="Available" />
                      <Picker.Item value="false" label="Not available" />
                    </Picker>
                  )}
                />
              </View>
            </View>
          )}

          <View style={styles.fieldArea}>
            <Text style={styles.fieldHeading}>
              Description of the product/service
            </Text>

            <Controller
              name="description"
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {value, onChange}}) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  style={[
                    {...styles.field, height: 70},
                    errors.description && styles.redBorder,
                  ]}
                  multiline={true}
                  placeholderTextColor="grey"
                />
              )}
            />
          </View>
          <View style={styles.fieldArea}>
            <Text style={styles.fieldHeading}>Tags</Text>
            <View style={styles.tagsView}>
              <View style={styles.tagsContainer}>
                {tags?.length > 0
                  ? tags?.map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                        <TouchableOpacity
                          onPress={deleteTag.bind(this, tag)}
                          style={{backgroundColor: '#ccc', borderRadius: 50}}>
                          <Icon color="grey" size={30} name="close" />
                        </TouchableOpacity>
                      </View>
                    ))
                  : null}
              </View>
              <View style={styles.tagForm}>
                <TextInput
                  style={styles.tagInput}
                  placeholderTextColor="grey"
                  value={tag}
                  onChangeText={(text) => setTag(text)}
                />
                <TouchableOpacity
                  style={styles.addTagButton}
                  onPress={addTag}
                  disabled={tag.length === 0}>
                  <Text style={styles.tagFormText}>Add Tag</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.imageField}>
            <Text style={styles.fieldHeading}>Images of the Product</Text>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.imagePickerContainer}
              onPress={filePickerHandler}>
              {images?.length > 0 ? (
                <Image
                  source={{
                    uri: images[0],
                  }}
                  style={styles.image}
                />
              ) : (
                <Icon name="photo-camera" size={30} color="#fff" />
              )}
            </TouchableOpacity>
            {props.product?.images && (
              <Text>{`${images?.length} Selected`}</Text>
            )}
          </View>
          <View style={styles.fieldArea}>
            <Text style={styles.fieldHeading}>HSN Code</Text>

            <Controller
              name="hsn"
              control={control}
              // rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextInput
                  placeholderTextColor="gray"
                  value={value}
                  onChangeText={onChange}
                  style={[styles.field, errors.hsn && styles.redBorder]}
                />
              )}
            />
          </View>
          <View style={styles.fieldArea}>
            <Text style={styles.fieldHeading}>Discount Type</Text>
            <View
              style={{
                borderColor: errors.discountType ? colors.errorColor : 'grey',

                borderRadius: 10,
                width: '100%',
                alignSelf: 'center',
                marginBottom: 10,
                borderBottomWidth: 1,
              }}>
              <Controller
                name="discountType"
                control={control}
                rules={{required: true}}
                render={({field: {value, onChange}}) => (
                  <Picker
                    dropdownIconColor={'black'}
                    mode="dropdown"
                    selectedValue={value}
                    onValueChange={onChange}>
                    <Picker.Item value="none" label="None" />
                    <Picker.Item value="percent" label="Percent" />
                    <Picker.Item value="flat" label="Flat" />
                  </Picker>
                )}
              />
            </View>
          </View>
          {watch('discountType') === 'flat' ||
          watch('discountType') === 'percent' ? (
            <View
              style={[
                styles.fieldArea,
                {display: watch('discontType') === 'none' ? 'none' : 'flex'},
              ]}>
              <Text style={styles.fieldHeading}>{`Discount Amount ${
                watch('discountType') === 'percent' ? '%' : ''
              }`}</Text>
              <Controller
                name="discountAmount"
                control={control}
                rules={{
                  pattern: /^(0|[1-9][0-9]*)$/g,
                  required: true,
                }}
                render={({field: {value, onChange}}) => (
                  <TextInput
                    placeholderTextColor="gray"
                    value={value}
                    onChangeText={onChange}
                    style={[
                      styles.field,
                      errors.discountAmount && styles.redBorder,
                    ]}
                    keyboardType={'numeric'}
                  />
                )}
              />
            </View>
          ) : null}
          {watch('discountType') === 'flat' ||
          watch('discountType') === 'percent' ? (
            <View
              style={[
                styles.fieldArea,
                {display: watch('discontType') === 'none' ? 'none' : 'flex'},
              ]}>
              <Text style={styles.fieldHeading}>Discount Description</Text>
              <Controller
                name="discountDescription"
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {value, onChange}}) => (
                  <TextInput
                    placeholderTextColor="gray"
                    value={value}
                    onChangeText={onChange}
                    style={[
                      styles.field,
                      errors.discountDescription && styles.redBorder,
                    ]}
                    multiline={true}
                  />
                )}
              />
            </View>
          ) : null}

          {props.isLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <TouchableOpacity
              activeOpacity={0.6}
              style={{marginTop: 20}}
              onPress={handleSubmit(onSubmit)}>
              <LinearGradient
                start={{x: 0, y: 1}}
                //   end={{x: 1, y: 0}}
                colors={['#2598b6', '#0b1a45']}
                style={{
                  borderRadius: 30,
                  height: 48,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                  width: 120,
                  alignSelf: 'center',
                }}>
                <Text style={{color: '#fff'}}>Submit</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </ScrollView>
      </Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#fff',
    // alignItems: 'center',
    width: '80%',
    // paddingVertical: 10,
    alignSelf: 'center',
    borderRadius: 5,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeadingContainer: {
    elevation: 2,

    backgroundColor: 'white',
    width: '100%',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
    // alignItems: 'center',
  },
  modalHeading: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: colors.blue,
  },
  fieldContainer: {
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 2,
    // width: '80%',
    // alignSelf: 'center',
    paddingLeft: 20,
    marginBottom: 20,
  },
  field: {
    width: '100%',
    alignSelf: 'center',
    borderBottomWidth: 1,
    fontSize: 16,
    borderBottomColor: '#cccc',
    color: '#000',
  },
  fieldArea: {
    paddingHorizontal: 10,
  },
  fieldHeading: {
    marginTop: 5,
    marginLeft: 10,
    // fontFamily: 'Poppins-SemiBol\',
    fontSize: 14,
    color: 'grey',
  },
  tagForm: {
    justifyContent: 'space-between',
    padding: 5,
    flexDirection: 'row',
    borderRadius: 30,
    borderColor: 'grey',
    borderWidth: 0.5,
  },
  addTagButton: {
    backgroundColor: colors.blue,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    padding: 10,
    justifyContent: 'center',
  },
  tagInput: {
    flexBasis: '60%',
    color: 'black',
  },
  tagFormText: {
    color: '#fff',
  },
  tagsContainer: {
    flexDirection: 'row',
    borderRadius: 30,
    borderWidth: 0.5,
    padding: 5,
    borderColor: 'grey',
    marginBottom: 10,
    flexWrap: 'wrap',
    minHeight: 50,
  },
  tag: {
    flexDirection: 'row',
    borderRadius: 30,
    borderWidth: 0.5,
    marginRight: 5,
    padding: 5,
    alignItems: 'center',
    marginBottom: 3,
  },
  tagText: {
    fontFamily: 'Poppins-Regular',
    marginRight: 5,
  },
  image: {
    borderWidth: 0.5,
    width: 130,
    height: 130,
    borderRadius: 20,
  },
  imageField: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerContainer: {
    width: 130,
    height: 130,
    backgroundColor: '#ccc',

    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redBorder: {
    borderBottomColor: colors.errorColor,
    borderBottomWidth: 1,
  },
})

export default AddProductService
