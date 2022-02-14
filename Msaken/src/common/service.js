import Axios from 'axios';

const BASE_URL = 'https://xionex.in/msaken/admin/public/api/';

const ApiJSON = {
  register: 'register',
  login: 'login',
  forgetPassword: 'forgot-password',
  sendOTP: 'send-otp',
  verifyOTP: 'verify-otp',
  socialLogin: 'social-login',
  resetPassword: 'reset-password',
};

const formDataHeader = {
  headers: {'Content-Type': 'multipart/form-data'},
};

export default {
  register: data => {
    return Axios.post(BASE_URL + ApiJSON.register, data, formDataHeader);
  },
  login: query => {
    return Axios.post(BASE_URL + ApiJSON.login+ query);
  },
  forgotPassword: query => {
    return Axios.post(BASE_URL + ApiJSON.forgetPassword+ query);
  },
  getOTP: query => {
    return Axios.post(BASE_URL + ApiJSON.sendOTP + query);
  },
  verifyOTP: query => {
    return Axios.post(BASE_URL + ApiJSON.verifyOTP + query);
  },
  resetPassword: query => {
    console.log(BASE_URL + ApiJSON.resetPassword + query);
    return Axios.post(BASE_URL + ApiJSON.resetPassword + query);
  },
  socialLogin: data => {

    return Axios.post(BASE_URL + ApiJSON.socialLogin , data, formDataHeader);
  },
};
