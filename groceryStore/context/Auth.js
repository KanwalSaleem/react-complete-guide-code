import React, {createContext, useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, ToastAndroid, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import {APIURL} from '../constants/Url';

export const AuthContext = createContext({});

export const AuthProvider = props => {
  const [isLoading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [subCategoryId, setSubCategoryId] = useState();

  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
  });

  const AddCart = useCallback(
    product => {
      const productToAdd = cart.items.find(item => {
        return item.id === product.id;
      });
      const productAlreadyAdded = cart.items.includes(productToAdd);

      if (productAlreadyAdded) {
        const updatedItems = cart.items.map(item => {
          if (item.id === productToAdd.id) {
            return {
              ...item,
              quantity: item.quantity + 1,
              price: item.price,
              sum: (parseFloat(item.sum) + item.price).toFixed(2),
            };
          }
          return item;
        });

        {
          setCart(prev => {
            const cartDetails = JSON.stringify({
              ...prev,
              items: updatedItems,
              totalAmount: (
                parseFloat(cart.totalAmount) + product.price
              ).toFixed(2),
            });
            AsyncStorage.setItem('cart', cartDetails);
            return {
              ...prev,
              items: updatedItems,
              totalAmount: (
                parseFloat(cart.totalAmount) + product.price
              ).toFixed(2),
            };
          });
        }
      } else {
        setCart(prev => {
          const newItems = prev.items.concat({
            ...product,
            sum: product.price,
            quantity: 1,
          });
          const cartDetails = JSON.stringify({
            ...prev,
            items: newItems,
            totalAmount: (parseFloat(cart.totalAmount) + product.price).toFixed(
              2,
            ),
          });
          AsyncStorage.setItem('cart', cartDetails);
          return {
            ...prev,
            items: newItems,
            totalAmount: (parseFloat(cart.totalAmount) + product.price).toFixed(
              2,
            ),
          };
        });
      }
    },
    [cart],
  );

  const RemoveCart = useCallback(
    product => {
      const productToRemove = cart.items.find(item => {
        return item.id === product.id;
      });
      const productAlreadyPresent = cart.items.includes(productToRemove);

      if (productAlreadyPresent) {
        ///fix updatedItems

        if (productToRemove.quantity > 1) {
          const reduceQuantity = cart.items.map(item => {
            if (item.id === productToRemove.id) {
              return {
                ...item,
                quantity: item.quantity - 1,
                price: item.price,
                sum: (parseFloat(item.sum) - item.price).toFixed(2),
              };
            }
            return item;
          });
          setCart(prev => {
            const cartDetails = JSON.stringify({
              ...prev,
              items: reduceQuantity,
              totalAmount: (
                parseFloat(cart.totalAmount) - product.price
              ).toFixed(2),
            });
            AsyncStorage.setItem('cart', cartDetails);
            return {
              ...prev,
              items: reduceQuantity,
              totalAmount: (
                parseFloat(cart.totalAmount) - product.price
              ).toFixed(2),
            };
          });
        } else {
          setCart(prev => {
            const filterItems = prev.items.filter(
              item => item.id !== productToRemove.id,
            );

            const cartDetails = JSON.stringify({
              ...prev,
              items: filterItems,
              totalAmount: (
                parseFloat(prev.totalAmount) - productToRemove.price
              ).toFixed(2),
            });
            AsyncStorage.setItem('cart', cartDetails);

            return {
              ...prev,
              items: filterItems,
              totalAmount: (
                parseFloat(prev.totalAmount) - productToRemove.price
              ).toFixed(2),
            };
          });
        }
      }
    },

    [cart],
  );

  const RemoveProduct = useCallback(
    product => {
      const productToRemove = cart.items.find(item => {
        return item.id === product.id;
      });
      const productAlreadyPresent = cart.items.includes(productToRemove);

      if (productAlreadyPresent) {
        ///fix updatedItems
        if (productToRemove) {
          setCart(prev => {
            const filterItems = prev.items.filter(
              item => item.id !== productToRemove.id,
            );

            const cartDetails = JSON.stringify({
              ...prev,
              items: filterItems,
              totalAmount: (
                parseFloat(prev.totalAmount) - parseFloat(productToRemove.sum)
              ).toFixed(2),
            });
            AsyncStorage.setItem('cart', cartDetails);

            return {
              ...prev,
              items: filterItems,
              totalAmount: (
                parseFloat(prev.totalAmount) - parseFloat(productToRemove.sum)
              ).toFixed(2),
            };
          });
        }
      }
    },

    [cart.items],
  );

  const Logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('userDetails');
      setUserDetails({});
      setIsAuthenticated(false);

      let base_url = `${APIURL}/API/login.php`;
      let uploadData = new FormData();

      uploadData.append(
        'token',
        'as23rlkjadsnlkcj23qkjnfsDKJcnzdfb3353ads54vd3favaeveavgbqaerbVEWDSC',
      );

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: uploadData,
      });

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const getLocalCart = async () => {
      const cartDetails = await AsyncStorage.getItem('cart');

      if (cartDetails != null) {
        setCart(JSON.parse(cartDetails));
      }
    };

    getLocalCart();
  }, [setCart]);

  const getUserDetails = useCallback(async () => {
    try {
      const UserDetailsJson = await AsyncStorage.getItem('userDetails');

      if (UserDetailsJson != null) {
        const UserDetails = JSON.parse(UserDetailsJson);
        setUserDetails(UserDetails);
        setIsAuthenticated(true);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        AddCart,
        cart,
        setCart,
        RemoveCart,
        RemoveProduct,
        userDetails,
        setUserDetails,
        getUserDetails,
        isAuthenticated,
        subCategoryId,
        setSubCategoryId,
        Logout,
        setIsAuthenticated,
        isLoading,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};
