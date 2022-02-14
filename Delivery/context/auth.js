import {setState} from 'jest-circus'
import React, {createContext, useRef, useState} from 'react'

export const AppContext = createContext({})

export const AppProvider = (props) => {
  const [user, setUser] = useState()
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [otp, setOtp] = useState([])
  const [userType, setUserType] = useState('buyer')
  const object_items = useRef([])
  const [cart, setCart] = useState({
    items: [],
  })

  // const addToCart = (product) => {
  //   const productToAdd = cart.items.find((item) => item._id === product._id)
  //   const productAlreadyAdded = cart.items.includes(productToAdd)

  //   if (productAlreadyAdded) {
  //     const updatedItems = cart.items.map((item) => {
  //       if (item._id === productToAdd._id) {
  //         return {
  //           ...item,
  //           quantity: item.quantity + 1,
  //           price: item.price,
  //           sum: item.sum + item.price,
  //         }
  //       }
  //       return item
  //     })

  //     return setCart((prev) => ({
  //       ...prev,
  //       items: updatedItems,
  //       totalAmount: prev.totalAmount + product.price,
  //     }))
  //   } else
  //     setCart((prev) => ({
  //       ...prev,
  //       items: prev.items.concat({
  //         ...product,
  //         sum: product.price,
  //         quantity: 1,
  //       }),

  //       totalAmount: prev.totalAmount + product.price,
  //     }))
  // }

  const addToCart = (productToAdd, seller) => {
    if (object_items.current.length == 0) {
      object_items.current.push({
        seller: seller,
        products: [{...productToAdd, sum: productToAdd.price, quantity: 1}],
      })
    } else {
      var seller_exists = false
      object_items.current.map((row, index) => {
        var temp_products = []
        if (row.seller._id == seller._id) {
          var product_exist = false
          row.products.map((row_product) => {
            if (row_product._id == productToAdd._id) {
              var newsum = row_product.sum + row_product.price
              var newqty = row_product.quantity + 1
              temp_products.push({
                ...row_product,
                sum: newsum,
                quantity: newqty,
              })
              product_exist = true
            } else {
              temp_products.push(row_product)
            }
          })
          if (product_exist == false) {
            temp_products.push({
              ...productToAdd,
              sum: productToAdd.price,
              quantity: 1,
            })
          }
          object_items.current[index] = {
            seller: row.seller,
            products: temp_products,
          }
          seller_exists = true
        }
      })
      if (seller_exists == false) {
        object_items.current.push({
          seller: seller,
          products: [{...productToAdd, sum: productToAdd.price, quantity: 1}],
        })
      }
    }
    console.log(object_items.current)
    setCart({items: object_items.current})
  }

  // const addToCart = (productToAdd, seller) => {
  //   const checkSeller = cart.items.find(
  //     (item) => item.seller?._id === seller._id,
  //   )

  //   if (checkSeller?.seller._id === seller._id) {
  //     const productAlreadyAdded = checkSeller.products.find(
  //       (product) => product._id === productToAdd._id,
  //     )

  //     if (checkSeller.products.includes(productAlreadyAdded)) {
  //       console.log(checkSeller, 'checkSeller')
  //       const updatedProducts = checkSeller.products.map((product) => {
  //         if (productToAdd._id === product._id) {
  //           return {
  //             ...product,
  //             quantity: product.quantity + 1,
  //             price: product.price,
  //             sum: product.sum + product.price,
  //           }
  //         }
  //         return product
  //       })
  //       checkSeller.products = updatedProducts

  //       // setCart((prev) => ({
  //       //   ...prev,
  //       //   items: prev.items.map((item) => ({
  //       //     ...item,
  //       //     products: updatedProducts,
  //       //   })),
  //       // }))
  //     } else {
  //       setCart((prev) => ({
  //         ...prev,
  //         items: prev.items.map((item) => ({
  //           ...item,
  //           products: checkSeller.products.concat({
  //             ...productToAdd,
  //             sum: productToAdd.price,
  //             quantity: 1,
  //           }),
  //         })),
  //       }))
  //       //   // checkSeller.products.concat({
  //       //   //   ...productToAdd,
  //       //   //   sum: productToAdd.price,
  //       //   //   quantity: 1,
  //       //   // })
  //     }
  //   } else {
  //     setCart((prev) => ({
  //       ...prev,
  //       items: prev.items.concat({
  //         seller,
  //         products: [{...productToAdd, sum: productToAdd.price, quantity: 1}],
  //       }),
  //     }))
  //   }
  // }
  const removeFromCart = (productId, seller) => {
    const checkSeller = cart.items.find(
      (item) => item.seller._id === seller._id,
    )
    const productToRemove = checkSeller.products.find(
      (product) => product._id === productId,
    )
    if (cart.items.includes(checkSeller)) {
      if (checkSeller.products.includes(productToRemove)) {
        if (productToRemove.quantity > 1) {
          const reduceQuantity = checkSeller.products.map((product) => {
            if (product._id === productToRemove._id) {
              return {
                ...product,
                quantity: productToRemove.quantity - 1,
                sum: productToRemove.sum - product.price,
              }
            }
            return product
          })
          console.log(reduceQuantity)
          checkSeller.products = reduceQuantity
        } else {
          const filterProducts = checkSeller.products.filter(
            (product) => product._id !== productToRemove._id,
          )
          checkSeller.products = filterProducts
        }
      }
    }
    if (cart.items.includes(checkSeller) && checkSeller.products.length === 0) {
      setCart((prev) => {
        const filterItems = prev.items.filter(
          (item) => item.seller._id !== checkSeller.seller._id,
          (object_items.current = filterItems),
        )
        return {
          ...prev,
          items: filterItems,
        }
      })
      // setCart((prev) => ({
      //   ...prev,
      //   items: prev.items.filter(
      //     (item) => item.seller._id !== checkSeller.seller._id,
      //   ),
      // }))
    }

    setCart((prev) => {
      const newItems = prev.items.map((item) => {
        if (item.seller._id === checkSeller.seller._id) {
          return {...item, products: checkSeller.products}
        }

        return item
      })
      object_items.current = newItems
      return {...prev, items: newItems}
    })
  }

  // const removeFromCart = (productId) => {
  //   const removeProduct = cart.items.find((item) => productId === item._id)

  //   if (removeProduct.quantity > 1) {
  //     const reduceQuantity = cart.items.map((item) => {
  //       if (item._id === removeProduct._id) {
  //         return {
  //           ...item,
  //           quantity: removeProduct.quantity - 1,
  //           sum: removeProduct.sum - item.price,
  //         }
  //       }
  //       return item
  //     })
  //     // return {
  //     //   ...state,
  //     //   items: reduceQuantity,
  //     //   totalAmount: state.totalAmount - removeProduct.price,
  //     // }
  //     setCart((prev) => ({
  //       ...prev,
  //       items: reduceQuantity,
  //       totalAmount: prev.totalAmount - removeProduct.price,
  //     }))
  //   } else {
  //     const filterItems = cart.items.filter(
  //       (item) => removeProduct._id !== item._id,
  //     )
  //     setCart((prev) => ({
  //       ...prev,
  //       items: filterItems,
  //       totalAmount: prev.totalAmount - removeProduct.sum,
  //     }))
  //     // console.log(removeProduct)
  //   }
  // }

  const addToOtp = (value) => {
    setOtp((prevOtp) => [...prevOtp, value.toString()])
    console.log(otp)
  }

  const clearOtpValue = () => {
    const lastValue = otp.pop()

    setOtp((prevOtp) => prevOtp.filter((item) => item !== lastValue))
  }

  const login = (user) => {
    setUser(user)
  }
  const logout = () => setUser(null)

  const changeUserType = (user) => {
    setUserType(user)
  }

  const updateUserProfile = async (newData) => {
    return fetch('https://deliverypay.in/api/editUserProfile', {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({...newData}),
    }).then((res) => res.json())
  }

  const userForgotPassword = () => setIsForgotPassword(true)

  return (
    <AppContext.Provider
      value={{
        updateUserProfile,
        login,
        user,
        userForgotPassword,
        isForgotPassword,
        addToOtp,
        otp,
        clearOtpValue,
        changeUserType,
        userType,
        setOtp,
        logout,
        cart,
        addToCart,
        removeFromCart,
        setCart,
      }}>
      {props.children}
    </AppContext.Provider>
  )
}
