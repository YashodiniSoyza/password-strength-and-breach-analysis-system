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

export const getBreachesByIds = async (ids) => {
  return await breach
    .find({ _id: { $in: ids } })
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

export const checkForBreachesWithPassword = async (password) => {
  return await leakedData
    .find({ password: password }, { _id: 0, breachId: 1 })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const checkForBreachesWithUsername = async (username) => {
  return await leakedData
    .find({ username: username }, { _id: 0, breachId: 1 })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const checkForBreachesWithEmail = async (email) => {
  return await leakedData
    .find({ email: email }, { _id: 0, breachId: 1 })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const checkForBreachesWithPhone = async (phone) => {
  return await leakedData
    .find({ phone: phone }, { _id: 0, breachId: 1 })
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
  checkForBreachesWithPassword,
  checkForBreachesWithUsername,
  checkForBreachesWithEmail,
  checkForBreachesWithPhone,
  getBreachesByIds,
};
