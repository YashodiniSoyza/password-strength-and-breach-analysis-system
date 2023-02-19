import axios from "axios";
import requestConfig from "./config";
import requestConfigJson from "./configJson";

const BASE_URL = "http://localhost:8090";

class BreachAPI {
  static getBreaches() {
    return axios.get(`${BASE_URL}/breach`, requestConfig);
  }

  static addBreach(values: {
    name: string;
    domain: string;
    logo: string;
    description: string;
    breachDate: string;
    compromisedAccounts: number;
    compromisedData: string;
  }) {
    return axios.post(`${BASE_URL}/breach`, values, requestConfigJson);
  }

  static updateBreach(values: {
    id: string;
    name: string;
    domain: string;
    logo: string;
    description: string;
    breachDate: string;
    compromisedAccounts: number;
    compromisedData: string;
  }) {
    let breach = {
      id: values.id,
      name: values.name,
      domain: values.domain,
      logo: values.logo,
      description: values.description,
      breachDate: values.breachDate,
      compromisedAccounts: values.compromisedAccounts,
      compromisedData: values.compromisedData,
    };
    return axios.put(
      `${BASE_URL}/breach/${values.id}`,
      breach,
      requestConfigJson
    );
  }

  static deleteBreach(id: string) {
    return axios.delete(`${BASE_URL}/breach/${id}`, requestConfig);
  }

  static importBreaches(values: {
    id: string;
    file: File | null;
    fileType: string;
    fileColumns: string;
  }) {
    const formData = new FormData();
    formData.append("file", values.file!);
    formData.append("fileType", values.fileType);
    formData.append("fileColumns", values.fileColumns);

    return axios.post(
      `${BASE_URL}/breach/import/${values.id}`,
      formData,
      requestConfig
    );
  }

  static getLeakedDataByBreachId(id: string) {
    return axios.get(`${BASE_URL}/breach/leakedData/${id}`, requestConfig);
  }

  static searchEmail(email: string) {
    const obj = {
      email: email,
    };
    return axios.post(
      `${BASE_URL}/breach/leakedData/email`,
      obj,
      requestConfigJson
    );
  }

  static searchUsername(username: string) {
    const obj = {
      username: username,
    };
    return axios.post(
      `${BASE_URL}/breach/leakedData/username`,
      obj,
      requestConfigJson
    );
  }

  static searchPassword(password: string) {
    const obj = {
      password: password,
    };
    return axios.post(
      `${BASE_URL}/breach/leakedData/password`,
      obj,
      requestConfigJson
    );
  }

  static searchPhone(phone: string) {
    const obj = {
      phone: phone,
    };
    return axios.post(
      `${BASE_URL}/breach/leakedData/phone`,
      obj,
      requestConfigJson
    );
  }

  static getBreachesByIds(ids: string[]) {
    const idsString = ids.join(",");
    const obj = {
      ids: idsString,
    };
    return axios.post(`${BASE_URL}/breach/getByIds`, obj, requestConfigJson);
  }
}

export default BreachAPI;
