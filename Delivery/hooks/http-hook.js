import {useState, useCallback, useEffect, useRef} from 'react'

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  const activeHttpRequests = useRef([])

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      const httpAbortCntrl = new AbortController()
      activeHttpRequests.current.push(httpAbortCntrl)

      setIsLoading(true)
      try {
        // eslint-disable-next-line no-undef
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCntrl.signal,
        })
        const responseData = await response.json()
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCntrl,
        )
        console.log(response)

        if (!response.ok) {
          // console.log(responseData.message)
          throw new Error(responseData.message)
        }
        // console.log(response)
        setIsLoading(false)

        return responseData
      } catch (e) {
        console.log(e)
        setError(e.message)
        setIsLoading(false)
        throw e
      }
    },
    [],
  )
  const clearError = () => {
    setError(null)
  }

  useEffect(() => {
    return () =>
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort())
  }, [])

  return {isLoading, error, sendRequest, clearError}
}

// {item.selected_option == '1' ? (
//   // correct option
//   <>
//     {item.quiz_answer == '1' ? (

//        <View style={styles.optionView}>

//                           <Text style={styles.option}>A</Text>

//         <TouchableOpacity
//           style={[
//             styles.optionText,

//             {
//               backgroundColor: 'green',
//             },
//           ]}
//           onPress={() => {
//             handleClick(item.question_id, 1)
//           }}>
//           <Text style={{fontSize: 14}}>
//             {item.quiz_option_1}
//           </Text>
//         </TouchableOpacity>
// </View>
// <View style={styles.optionView}>

//                           <Text style={styles.option}>B</Text>

//         <TouchableOpacity
//           style={[
//             styles.optionText,

//             {
//               backgroundColor: 'grey',
//             },
//           ]}
//           onPress={() => {
//             handleClick(item.question_id, 1)
//           }}>
//           <Text style={{fontSize: 14}}>
//             {item.quiz_option_1}
//           </Text>
//         </TouchableOpacity>
//         </View>
//         <View style={styles.optionView}>

//                           <Text style={styles.option}>A</Text>
//         <TouchableOpacity
//           style={[
//             styles.optionText,

//             {
//               backgroundColor: 'grey',
//             },
//           ]}
//           onPress={() => {
//             handleClick(item.question_id, 1)
//           }}>
//           <Text style={{fontSize: 14}}>
//             {item.quiz_option_1}
//           </Text>
//         </TouchableOpacity>
//         </View>

//         <View style={styles.optionView}>

//                           <Text style={styles.option}>A</Text>

//         <TouchableOpacity
//           style={[
//             styles.optionText,

//             {
//               backgroundColor: 'grey',
//             },
//           ]}
//           onPress={() => {
//             handleClick(item.question_id, 1)
//           }}>
//           <Text style={{fontSize: 14}}>
//             {item.quiz_option_1}
//           </Text>
//         </TouchableOpacity>
//         </View>
//       </>
//     ) : null}

//     {/* second wrong */}
//     {item.quiz_answer == '2' ? (
//       <>
//        <View style={styles.optionView}>

//                           <Text style={styles.option}>A</Text>

//         <TouchableOpacity
//           style={[
//             styles.optionText,

//             {
//               backgroundColor: 'red',
//             },
//           ]}
//           onPress={() => {
//             handleClick(item.question_id, 1)
//           }}>
//           <Text style={{fontSize: 14}}>
//             {item.quiz_option_1}
//           </Text>
//         </TouchableOpacity>
//         </View>
//         <View style={styles.optionView}>

//                           <Text style={styles.option}>A</Text>

//         <TouchableOpacity
//           style={[
//             styles.optionText,

//             {
//               backgroundColor: 'green',
//             },
//           ]}
//           onPress={() => {
//             handleClick(item.question_id, 1)
//           }}>
//           <Text style={{fontSize: 14}}>
//             {item.quiz_option_1}
//           </Text>
//         </TouchableOpacity>
//         </View>
//         <View style={styles.optionView}>

//                           <Text style={styles.option}>A</Text>

//         <TouchableOpacity
//           style={[
//             styles.optionText,

//             {
//               backgroundColor: 'grey',
//             },
//           ]}
//           onPress={() => {
//             handleClick(item.question_id, 1)
//           }}>
//           <Text style={{fontSize: 14}}>
//             {item.quiz_option_1}
//           </Text>
//         </TouchableOpacity>
//         </View>
//         <View style={styles.optionView}>

//                           <Text style={styles.option}>A</Text>

//         <TouchableOpacity
//           style={[
//             styles.optionText,

//             {
//               backgroundColor: 'grey',
//             },
//           ]}
//           onPress={() => {
//             handleClick(item.question_id, 1)
//           }}>
//           <Text style={{fontSize: 14}}>
//             {item.quiz_option_2}
//           </Text>
//         </TouchableOpacity>
//         </View>
//       </>
//     ) : null}
//     {/* third wrong */}
//     {item.quiz_answer == '3' ? (
//       <>
//        <View style={styles.optionView}>

//                           <Text style={styles.option}>A</Text>

//         <TouchableOpacity
//           style={[
//             styles.optionText,

//             {
//               backgroundColor: 'red',
//             },
//           ]}
//           onPress={() => {
//             handleClick(item.question_id, 1)
//           }}>
//           <Text style={{fontSize: 14}}>
//             {item.quiz_option_1}
//           </Text>
//         </TouchableOpacity>
//         </View>
//         <View style={styles.optionView}>

//                           <Text style={styles.option}>A</Text>

//         <TouchableOpacity
//           style={[
//             styles.optionText,

//             {
//               backgroundColor: 'grey',
//             },
//           ]}
//           onPress={() => {
//             handleClick(item.question_id, 1)
//           }}>
//           <Text style={{fontSize: 14}}>
//             {item.quiz_option_1}
//           </Text>
//         </TouchableOpacity>
//         </View>
//         <View style={styles.optionView}>

//                           <Text style={styles.option}>A</Text>

//         <TouchableOpacity
//           style={[
//             styles.optionText,

//             {
//               backgroundColor: 'green',
//             },
//           ]}
//           onPress={() => {
//             handleClick(item.question_id, 1)
//           }}>
//           <Text style={{fontSize: 14}}>
//             {item.quiz_option_1}
//           </Text>
//         </TouchableOpacity>
//         </View>
//         <View style={styles.optionView}>

//                           <Text style={styles.option}>A</Text>

//         <TouchableOpacity
//           style={[
//             styles.optionText,

//             {
//               backgroundColor: 'grey',
//             },
//           ]}
//           onPress={() => {
//             handleClick(item.question_id, 1)
//           }}>
//           <Text style={{fontSize: 14}}>
//             {item.quiz_option_1}
//           </Text>
//         </TouchableOpacity>
//         </View>
//       </>
//     ) : null}
//     {item.quiz_answer == '4' ? (
//       <>
//        <View style={styles.optionView}>

//                           <Text style={styles.option}>A</Text>

//         <TouchableOpacity
//           style={[
//             styles.optionText,

//             {
//               backgroundColor: 'red',
//             },
//           ]}
//           onPress={() => {
//             handleClick(item.question_id, 1)
//           }}>
//           <Text style={{fontSize: 14}}>
//             {item.quiz_option_1}
//           </Text>
//         </TouchableOpacity>
//         </View>
//         <View style={styles.optionView}>

//                           <Text style={styles.option}>A</Text>

//         <TouchableOpacity
//           style={[
//             styles.optionText,

//             {
//               backgroundColor: 'grey',
//             },
//           ]}
//           onPress={() => {
//             handleClick(item.question_id, 1)
//           }}>
//           <Text style={{fontSize: 14}}>
//             {item.quiz_option_1}
//           </Text>
//         </TouchableOpacity>
//         </View>
//         <View style={styles.optionView}>

//                           <Text style={styles.option}>A</Text>

//         <TouchableOpacity
//           style={[
//             styles.optionText,

//             {
//               backgroundColor: 'grey',
//             },
//           ]}
//           onPress={() => {
//             handleClick(item.question_id, 1)
//           }}>
//           <Text style={{fontSize: 14}}>
//             {item.quiz_option_1}
//           </Text>
//         </TouchableOpacity>
//         </View>
//         <View style={styles.optionView}>

//                           <Text style={styles.option}>A</Text>

//         <TouchableOpacity
//           style={[
//             styles.optionText,

//             {
//               backgroundColor: 'green',
//             },
//           ]}
//           onPress={() => {
//             handleClick(item.question_id, 1)
//           }}>
//           <Text style={{fontSize: 14}}>
//             {item.quiz_option_1}
//           </Text>
//         </TouchableOpacity>
//         </View>
//       </>
//     ) : null}
//   </>
// ) : null}
