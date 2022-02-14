import React from 'react'
import dayjs from 'dayjs'
import {Text, StyleSheet} from 'react-native'
import Card from './Card'
import FieldInfo from './FieldInfo'

const VerificaionItem = ({item, index}) => {
  return (
    <Card
      style={[
        styles.card,
        {marginBottom: 15},
        index === 0 && {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        },
      ]}>
      {/* <FieldInfo
          style={styles.fieldContainer}
          title="Verify_ID"
          text="112146457687547"
        />
        <FieldInfo
          style={styles.fieldContainer}
          title="Invoice_ID"
          text="S7Y0ORZTK0000H3"
        />
        <FieldInfo
          style={styles.fieldContainer}
          title="Cust_ID"
          text="TSOHO"
        /> */}
      <FieldInfo
        style={styles.fieldContainer}
        title="Verify Date"
        text={dayjs(item.Verify_Date).format('DD-MM-YYYY')}
      />

      <FieldInfo
        style={styles.fieldContainer}
        title="First Name"
        text={item.First_Name}
      />

      <FieldInfo
        style={styles.fieldContainer}
        title="Last Name"
        text={item.Last_Name}
      />
      {item.NIN ? (
        <FieldInfo
          style={styles.fieldContainer}
          title={'NIN'}
          text={item.NIN}
        />
      ) : null}
      {item.DOCID ? (
        <FieldInfo
          style={styles.fieldContainer}
          title={'DOCID'}
          text={item.DOCID}
        />
      ) : null}
      {item.Phone ? (
        <FieldInfo
          style={styles.fieldContainer}
          title={'Phone'}
          text={item.Phone}
        />
      ) : null}

      {/* {item.NIN && (
        <FieldInfo
          style={styles.fieldContainer}
          title="NIN"
          text={item.NIN.toString() || ''}
        />
      )} */}
      {/* {item.DOCID && (
        <FieldInfo
          style={styles.fieldContainer}
          title="NIN"
          text={item.DOCID || ''}
        />
      )} */}
      {/* {item.Phone && (
        <FieldInfo
          style={styles.fieldContainer}
          title="Phone"
          text={item.Phone|| ''}
        />
      )} */}

      {/* <FieldInfo
            style={styles.fieldContainer}
            title="DOCID"
            text="******************"
          /> */}
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '85%',
    padding: 10,
    paddingTop: 30,
    shadowRadius: 0,
    elevation: 2,
    alignSelf: 'center',
  },

  fieldContainer: {
    marginLeft: 10,
    marginBottom: 15,
  },
})

export default VerificaionItem
