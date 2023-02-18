import breach from "../models/Breach.model";
import leakedData from "../models/LeakedData.model";
import "dotenv/config";

export const createBreach = async (breachObj) => {
  return await breach
    .create(breachObj)
    .then(async (data) => {
      await data.save();
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const getBreach = async (id) => {
  return await breach
    .findById(id)
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Breach not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const getAllBreaches = async () => {
  return await breach
    .find()
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const updateBreach = async (id, breachObj) => {
  return await breach
    .findByIdAndUpdate(id, breachObj, { new: true })
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Breach not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const deleteBreach = async (id) => {
  return await breach
    .findByIdAndDelete(id)
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Breach not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const importBreaches = async (leackedData) => {
  return await leakedData
    .insertMany(leackedData)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const getLeakedDataByBreachId = async (breachId) => {
  return await leakedData
    .find({ breachId: breachId })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
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
};
