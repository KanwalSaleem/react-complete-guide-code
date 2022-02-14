import axios from 'axios';
// const URL = "http://13.127.11.93/api/v1/admin/"
// ----------------------------------------------------------------------

// const axiosInstance = axios.create();

// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
// );

// export default axiosInstance;

export const makeAxiosCall = (method, url_path, data = {}) => {
    const BASE_URL = "http://13.127.11.93/api/v1/admin/"
    var url = `${BASE_URL}${url_path}`
    const headers = {
        "x-auth-token": sessionStorage.getItem("token")
    }
    let authOptions = {
        method,
        url,
        data,
        headers
    }
    return axios(authOptions)
        .then((response) => {
            return { error: null, response: response, success: true }
        })
        .catch((error) => {
            if (error.response) {
                if (error.response.status == 401) {
                    sessionStorage.clear()
                    window.location.replace("/login")
                }
                return { error: error, response: null, success: false }
            }
        })
}