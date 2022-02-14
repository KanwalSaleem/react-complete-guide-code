import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  useReducer,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Toast from 'react-native-simple-toast';
import {english, arabic} from '../common/language';
import dashboardReducer from '../../store/reducers/dashboard';
import {Alert} from 'react-native';

export const AuthContext = createContext();

const defaultDashboardState = {
  selectedBathrooms: [],
  unit: [],
  PurchaseType: 'rent',
  landArea: [0, 100000],
  selectedBedrooms: [],
  price: [0, 99999],
  selectedPropertyType: [],
  address: '',
  community: [],
};

export const AuthProvider = props => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [dashBoardLoading, setDashBoardLoading] = useState(false);
  const [userCred, setUserCred] = useState('');
  const [passState, setPassState] = useState(undefined);
  const [registrationType, setRegistrationType] = useState('company');
  const [tokenGotType, setTokenGotType] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [isSkip, setIsSkip] = useState(false);

  // const [selectedBathrooms, setSelectedBathrooms] = useState([]);
  // const [unit, setUnit] = useState([]);
  // const [PurchaseType, setPurchaseType] = useState('rent');
  // const [landArea, setLandArea] = useState([]);
  // const [selectedBedrooms, setSelectedBedrooms] = useState([]);
  // const [price, setprice] = useState([]);
  // const [selectedPropertyType, setSelectedPropertyType] = useState([]);
  // const [address, setAddress] = useState('');
  // const [community, setCommunity] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [language, setLanguage] = useState(english);

  const [dashboardState, dispatchDashboardAction] = useReducer(
    dashboardReducer,
    defaultDashboardState,
  );

  const getProperties = useCallback(async () => {
    setDashBoardLoading(true);
    const jsonUserCred = JSON.parse(userCred);
    const token = jsonUserCred?.data?.token;
    console.log(dashboardState);
    try {
      let base_url =
        'https://xionex.in/msaken/admin/public/api/search-properties';
      let formdata = new FormData();

      dashboardState.selectedBathrooms.length > 0 &&
        formdata.append('bathrooms[]', `${dashboardState.selectedBathrooms}`);
      dashboardState.selectedBedrooms.length > 0 &&
        formdata.append('bedrooms[]', `${dashboardState.selectedBedrooms}`);
      dashboardState.unit.length > 0 &&
        formdata.append('amenities[]', `${dashboardState.unit}`);
      dashboardState.community.length > 0 &&
        formdata.append('comamenities[]', `${dashboardState.community}`);
      dashboardState.selectedPropertyType.length > 0 &&
        formdata.append(
          'product_type[]',
          `${dashboardState.selectedPropertyType}`,
        );
      dashboardState.address &&
        formdata.append('location', dashboardState.address);

      // dashboardState.price.length > 0 &&
      formdata.append('start_min', dashboardState.price[0]);
      formdata.append('end_max', dashboardState.price[1]);
      // dashboardState.landArea.length > 0 &&
      formdata.append('land_area_min', dashboardState.landArea[0]);
      formdata.append('land_area_max', dashboardState.landArea[1]);
      formdata.append('property_for', dashboardState.PurchaseType);
      formdata.append('userid', jsonUserCred.data.user.id);

      const headers = new Headers();
      // headers.append('Authorization', `Bearer${token}`);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        // headers: headers,
        body: formdata,
      });
      const responseData = await response.json();

      if (!responseData.error) {
        const parseData = responseData.data.map(item => ({
          ...item,
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
        }));

        setFilterData(parseData);
      } else {
        setFilterData([]);
      }
    } catch (error) {
      Alert.alert(error.message);
      // setDashBoardLoading(false);
    }
    setDashBoardLoading(false);
  }, [dashboardState, userCred]);

  const getPropertiesSkip = useCallback(async () => {
    setDashBoardLoading(true);

    try {
      let base_url =
        'https://xionex.in/msaken/admin/public/api/search-properties';
      let formdata = new FormData();
      console.log(dashboardState, 'dashboard');
      dashboardState.selectedBathrooms.length > 0 &&
        formdata.append('bathrooms[]', `${dashboardState.selectedBathrooms}`);
      dashboardState.selectedBedrooms.length > 0 &&
        formdata.append('bedrooms[]', `${dashboardState.selectedBedrooms}`);
      dashboardState.unit.length > 0 &&
        formdata.append('amenities[]', `${dashboardState.unit}`);
      dashboardState.community.length > 0 &&
        formdata.append('comamenities[]', `${dashboardState.community}`);
      dashboardState.selectedPropertyType.length > 0 &&
        formdata.append(
          'product_type[]',
          `${dashboardState.selectedPropertyType}`,
        );
      dashboardState.address &&
        formdata.append('location', dashboardState.address);

      // dashboardState.price.length > 0 &&
      formdata.append('start_min', dashboardState.price[0]);
      formdata.append('end_max', dashboardState.price[1]);
      // dashboardState.landArea.length > 0 &&
      formdata.append('land_area_min', dashboardState.landArea[0]);
      formdata.append('land_area_max', dashboardState.landArea[1]);
      formdata.append('property_for', dashboardState.PurchaseType);
      formdata.append('userid', null);

      // eslint-disable-next-line no-undef
      const response = await fetch(base_url, {
        method: 'post',
        body: formdata,
      });
      const responseData = await response.json();

      if (!responseData.error) {
        const parseData = responseData.data.map(item => ({
          ...item,
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
        }));

        setFilterData(parseData);
      } else {
        setFilterData([]);
      }
    } catch (error) {
      Alert.alert(error.message);
      // setDashBoardLoading(false);
    }
    setDashBoardLoading(false);
  }, [dashboardState]);

  const loginStatus = useCallback(async () => {
    setLoading(true);
    try {
      const value = await AsyncStorage.getItem('loginStatus');
      if (value !== null) {
        console.log(value);
        if (value == 'loggedIn') {
          const user = await AsyncStorage.getItem('userCredentials');
          if (user != null) {
            setUserCred(user);
          }
          // setIsLoggedIn(true);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }, []);

  const logOut = async () => {
    const loginType = await AsyncStorage.getItem('loginType');
    if (loginType == 'google') {
      try {
        await GoogleSignin.signOut();
        await AsyncStorage.setItem('loginStatus', 'loggedOut');
        await AsyncStorage.setItem('userCredentials', '');
        setIsLoggedIn(false);
      } catch (error) {
        console.error(error);
        Toast.show('Something went wrong !', Toast.SHORT);
      }
    } else {
      await AsyncStorage.setItem('loginStatus', 'loggedOut');
      await AsyncStorage.setItem('userCredentials', '');
      setIsLoggedIn(false);
    }
  };

  const languageHandler = language => {
    if (language === 'english') {
      setSelectedLanguage('english');
      setLanguage(english);
    } else {
      setSelectedLanguage('arabic');
      setLanguage(arabic);
    }
  };

  useEffect(() => {
    loginStatus();
  }, [loginStatus]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userCred,
        setUserCred,
        passState,
        setPassState,
        registrationType,
        setRegistrationType,
        tokenGotType,
        setTokenGotType,
        setFilterData,
        filterData,
        logOut,
        isLoading,
        setLoading,
        // selectedBathrooms,
        // setSelectedBathrooms,
        // unit,
        // setUnit,
        // PurchaseType,
        // setPurchaseType,
        // landArea,
        // setLandArea,
        // selectedBedrooms,
        // setSelectedBedrooms,
        // price,
        // setprice,
        // selectedPropertyType,
        // setSelectedPropertyType,
        // address,
        // setAddress,
        // community,
        // setCommunity,
        selectedLanguage,
        setSelectedLanguage,
        languageHandler,
        language,
        dashboardState,
        dispatchDashboardAction,
        dashBoardLoading,
        getProperties,
        getPropertiesSkip,
        isSkip,
        setIsSkip,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};
