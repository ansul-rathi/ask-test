import axios from 'axios';
import { BASE_URL } from '../constants/config';


const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 3 * 60 * 1000,
  maxBodyLength: Infinity
});
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        // window?.location?.refresh();
        window?.location?.reload()
        // serviceWorkerRegistration.unregister();
      }
      return Promise.reject(
        (error.response && error.response.data) || 'Something went wrong',
      );
    }
    return Promise.reject(error);
  },
);


export default axiosInstance;
