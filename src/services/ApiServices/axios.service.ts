// import axios from "axios";
import axios, { AxiosInstance } from "axios";
import {  SITE_URL } from "../../utils/constants";

const axiosInstance1: AxiosInstance = axios.create({
  baseURL: SITE_URL,
});

// Create an axios instance for the second base URL


// axios.defaults.baseURL = SITE_URL;
// axios request interceptor~~~~~~~~~~~~

axiosInstance1.interceptors.request.use(
  (config) => {
    //   config.headers["api-access-token"] = token;
    return config;
  },
  (error) => {
    return error;
  }
);

// axios response interceptor~~~~~~~~~~~~~~~

axiosInstance1.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // TokenExpiryFunction(error);
    return error.response;
  }
);

// axiosInstance2.interceptors.request.use(
//   (config) => {
//     //   config.headers["api-access-token"] = token;
//     return config;
//   },
//   (error) => {
//     return error;
//   }
// );

// axios response interceptor~~~~~~~~~~~~~~~

// axiosInstance2.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     return error.response;
//   }
// );
// function to format url as and if params

function formatUrl(url: any, params: any) {
  if (params) {
    params =
      params && Object.keys(params).length > 0
        ? `?${new URLSearchParams(params).toString()}`
        : "";
  }
  return `${url}${params}`;
}

// get request function~~~~~~~~

export const apiCallGet = (url: any, params = {}) =>
  new Promise((resolve, reject) => {
    let ax =
      // window?.location?.pathname == "/cross-chain"
      //   ? axiosInstance2: 
        axiosInstance1;
    ax.get(formatUrl(url, params))
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error?.data);
      });
  });

// post request function~~~~~~~~

export const apiCallPostHeader = (
  url: any,
  data: any,
  params: any,
  jwt?: any
) =>
  new Promise((resolve, reject) => {
    let ax =
      // window?.location?.pathname == "/cross-chain"
      //   ? axiosInstance2: 
        axiosInstance1;
    const headers = {
      "Content-Type": "application/json",
      authorization: jwt,
      "Access-Control-Allow-Origin": "*",
    };
    ax.post(formatUrl(url, params), Object.keys(data).length ? data : {}, {
      headers: headers,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error?.data);
      });
  });



export const apiCallPost = (url: any, data: any, params: any) =>
  new Promise((resolve, reject) => {
    let ax =
      // window?.location?.pathname == "/cross-chain"
      //   ? axiosInstance2: 
        axiosInstance1;
    ax.post(formatUrl(url, params), Object.keys(data).length ? data : null)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error?.data);
      });
  });
