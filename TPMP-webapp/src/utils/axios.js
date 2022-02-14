import axios from 'axios';

// ----------------------------------------------------------------------

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    (response) => {
        // console.log(" response ========>", response)
        return response
    },
    (error) => {
        // console.log(" error =====>", error.response)
        return Promise.reject((error.response && error.response.data) || 'Something went wrong')
    }
);

export default axiosInstance;
