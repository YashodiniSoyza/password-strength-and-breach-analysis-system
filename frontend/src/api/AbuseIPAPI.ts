import axios from "axios";
const BASE_URL = "http://localhost:8090";

class AbuseIPAPI {
  static checkIP(ip: string) {
    return axios.get(`${BASE_URL}/ip/check/${ip}`);
  }
}

export default AbuseIPAPI;
