import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
// import axios from '../utils/axios';
import axios from 'axios';
import { isValidToken, setSession } from '../utils/jwt';
import customPic from '../image/img.png';
import { APIURL } from '../constants/ApiUrl';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user, token } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      token
    };
  },
  LOGIN: (state, action) => {
    const { user, token } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
      token
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
});

AuthProvider.propTypes = {
  children: PropTypes.node
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        const userData = localStorage.getItem('USER_DATA');
        const parseUser = JSON.parse(userData);
        // if (accessToken && isValidToken(accessToken)) {
        if (accessToken) {
          setSession(accessToken);
          // const response = await axios.get('/api/account/my-account');
          // const { user } = response.data;

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user: parseUser,
              token: accessToken
            }
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    // setSession('jfkgjfdjljslkjglkjlkjsdflkjdslfjldsjflkj');

    // localStorage.setItem(
    //   'USER_DATA',
    //   JSON.stringify({
    //     contactNumber: 322132,
    //     countryCode: +92,
    //     email: '123@gmail.com',
    //     firstName: 'Mohammad',
    //     lastName: 'Sodais',
    //     profilePic: customPic
    //   })
    // );
    // dispatch({
    //   type: 'INITIALIZE',
    //   payload: {
    //     isAuthenticated: true,
    //     user: {
    //       contactNumber: 322132,
    //       countryCode: +92,
    //       email: '123@gmail.com',
    //       firstName: 'Mohammad',
    //       lastName: 'Sodais',
    //       profilePic: customPic
    //     }
    //   }
    // });

    return axios
      .post(`${APIURL}/session/login`, { email, password })
      .then((response) => {
        let user_data = {
          contactNumber: response.data.data.contactNumber,
          countryCode: response.data.data.countryCode,
          email: response.data.data.email,
          firstName: response.data.data.firstName,
          lastName: response.data.data.lastName,
          profilePic: response.data.data.profilePic
        };

        localStorage.setItem('USER_DATA', JSON.stringify(user_data));
        console.log(response.data.data.loginData.token);
        setSession(response.data.data.loginData.token);
        dispatch({
          type: 'LOGIN',
          payload: {
            user: response.data.data,
            token: response.data.data.loginData.token
          }
        });
        return { error: null, response: response.data, success: true };
      })
      .catch((error) => {
        if (error.response) {
          return { error: error.response.data, response: null, success: false };
        }
      });
  };

  const register = async (email, password, firstName, lastName) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  const resetPassword = () => {};

  const updateProfile = () => {};

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
