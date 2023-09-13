import axios from "axios";

let baseURL;
baseURL = process.env.REACT_APP_API_BASE_URL;

let Axios;

const init = () => {
  Axios = axios.create({
    baseURL: baseURL,
    timeout: 30000,
  });
  Axios.interceptors.request.use(handleSuccessRequest, handleErrorRequest);
  Axios.interceptors.response.use(handleSuccess, handleError);
};

const handleSuccessRequest = (request) => {
  if (localStorage.getItem("auth-token"))
    request.headers["auth-token"] = `${localStorage.getItem("auth-token")}`;
  return request;
};

const handleErrorRequest = (error) => {
  return Promise.reject(error);
};

const handleSuccess = (response) => {
  return response;
};

const handleError = (error) => {
  return Promise.reject(error.response);
};

init();

export default Axios;
