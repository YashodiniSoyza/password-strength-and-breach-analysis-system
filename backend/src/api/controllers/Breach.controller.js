import breachService from "../services/Breach.service.js";
import Breach from "../models/Breach.model.js";
import formidable from "formidable";
import fs from "fs";
import readline from "readline";
import xlsx from "node-xlsx";

export const createBreach = async (req, res, next) => {
  const breach = new Breach({
    name: req.body.name,
    domain: req.body.domain,
    logo: req.body.logo,
    description: req.body.description,
    breachDate: req.body.breachDate,
    compromisedAccounts: req.body.compromisedAccounts,
    compromisedData: req.body.compromisedData,
  });

  await breachService
    .createBreach(breach)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getBreach = async (req, res, next) => {
  await breachService
    .getBreach(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getAllBreaches = async (req, res, next) => {
  await breachService
    .getAllBreaches()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const updateBreach = async (req, res, next) => {
  await breachService
    .updateBreach(req.params.id, req.body)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const deleteBreach = async (req, res, next) => {
  await breachService
    .deleteBreach(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const importBreaches = async (req, res, next) => {
  //max file size 10MB
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const form = formidable({
    multiples: true,
    maxFileSize: MAX_FILE_SIZE, //max file size
  });
  form.uploadDir = "/uploads/";

  form.parse(req, async (err, fields, files) => {
    if (err) {
      req.handleResponse.errorRespond(res)(err);
      return;
    }

    const fileType = fields.fileType;
    const fileColumns = fields.fileColumns.split(",");
    const file = files.file;
    const leakedData = [];

    if (fileType === "txt") {
      const fileStream = fs.createReadStream(file.filepath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        const data = line.split(",");
        const leakedDataObj = {};
        fileColumns.forEach((column, index) => {
          leakedDataObj[column] = data[index];
        });
        leakedData.push(leakedDataObj);
      }
    } else if (fileType === "csv") {
      const data = fs.readFileSync(file.filepath, "utf8");

      const lines = data.split("\n");
      lines.pop();
      lines.forEach((line) => {
        const d = line.split(",");
        const leakedDataObj = {};
        fileColumns.forEach((column, index) => {
          leakedDataObj[column] = d[index];
        });
        leakedData.push(leakedDataObj);
      });
    } else if (fileType === "json") {
      const fileStream = fs.readFileSync(file.filepath);
      const data = JSON.parse(fileStream);

      data.forEach((record) => {
        const leakedDataObj = {};
        fileColumns.forEach((column) => {
          leakedDataObj[column] = record[column];
        });
        leakedData.push(leakedDataObj);
      });
    } else if (fileType === "excel") {
      const fileStream = fs.readFileSync(file.filepath);
      const workSheetsFromFile = xlsx.parse(fileStream);
      for (let i = 0; i < workSheetsFromFile.length; i++) {
        const sheet = workSheetsFromFile[i];
        const data = sheet.data;
        data.forEach((record) => {
          const leakedDataObj = {};
          fileColumns.forEach((column, index) => {
            leakedDataObj[column] = record[index];
          });
          leakedData.push(leakedDataObj);
        });
      }
    } else {
      req.handleResponse.errorRespond(res)("Invalid file type");
      return;
    }

    const leakedDataFinal = [];
    for (let i = 0; i < leakedData.length; i++) {
      const finalOBd = {
        breachId: req.params.id,
        email: leakedData[i].email ? leakedData[i].email : "",
        password: leakedData[i].password ? leakedData[i].password : "",
        username: leakedData[i].username ? leakedData[i].username : "",
        phone: leakedData[i].phone ? leakedData[i].phone : "",
        hash: leakedData[i].hash ? leakedData[i].hash : "",
      };
      leakedDataFinal.push(finalOBd);
    }

    await breachService
      .importBreaches(leakedDataFinal)
      .then((data) => {
        req.handleResponse.successRespond(res)(data);
        next();
      })
      .catch((err) => {
        req.handleResponse.errorRespond(res)(err);
        next();
      });
    return;
  });
};

export const getLeakedDataByBreachId = async (req, res, next) => {
  await breachService
    .getLeakedDataByBreachId(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const checkForBreachesWithPassword = async (req, res, next) => {
  const { password } = req.body;
  await breachService
    .checkForBreachesWithPassword(password)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const checkForBreachesWithUsername = async (req, res, next) => {
  const { username } = req.body;
  await breachService
    .checkForBreachesWithUsername(username)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const checkForBreachesWithEmail = async (req, res, next) => {
  const { email } = req.body;
  await breachService
    .checkForBreachesWithEmail(email)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const checkForBreachesWithPhone = async (req, res, next) => {
  const { phone } = req.body;
  await breachService
    .checkForBreachesWithPhone(phone)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const checkForBreachesWithHash = async (req, res, next) => {
  const { hash } = req.body;
  await breachService
    .checkForBreachesWithHash(hash)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getBreachesByIds = async (req, res, next) => {
  const { ids } = req.body;
  const idsArray = ids.split(",");
  await breachService
    .getBreachesByIds(idsArray)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

module.exports = {
  createBreach,
  getBreach,
  getAllBreaches,
  updateBreach,
  deleteBreach,
  importBreaches,
  getLeakedDataByBreachId,
  checkForBreachesWithPassword,
  checkForBreachesWithUsername,
  checkForBreachesWithEmail,
  checkForBreachesWithPhone,
  checkForBreachesWithHash,
  getBreachesByIds,
};
