import axios from "axios";
const BASE_URL = "https://api.abuseipdb.com/api/v2";

const API_KEY = process.env.ABUSEIP_DB_API_KEY;
 

//To fix CORs issues,
const allowedOrigins = process.env.CORS_ORIGIN;

export const checkIP = async (req, res, next) => {
  const { ip } = req.params;
  axios
    .get(`${BASE_URL}/check`, {
      headers: {
        Key: API_KEY,
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      params: {
        ipAddress: ip,
        maxAgeInDays: 365,
      },
    })
    .then((data) => {
      req.handleResponse.successRespond(res)(data.data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getReports = async (req, res, next) => {
  const { ip } = req.params;
  const origin = req.get('origin'); //To fix issue
  axios
    .get(`${BASE_URL}/reports`, {
      headers: {
        Key: API_KEY,
        Accept: "application/json",
        // "Access-Control-Allow-Origin": "*",  //fixed
        "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : undefined,
      },
      params: {
        ipAddress: ip,
        maxAgeInDays: 365,
        page: 1,
        perPage: 100,
      },
    })
    .then((data) => {
      req.handleResponse.successRespond(res)(data.data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

module.exports = {
  checkIP,
  getReports,
};
