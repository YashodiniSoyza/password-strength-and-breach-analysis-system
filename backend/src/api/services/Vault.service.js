import vault from "../models/Vault.model.js";

export const createVault = async (vaultObj) => {
  return await vault
    .create(vaultObj)
    .then(async (data) => {
      await data.save();
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const getVaultByUserId = async (userId) => {
  return await vault
    .find({ userId: userId })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const updateVaultById = async (id, vaultObj) => {
  return await vault
    .findByIdAndUpdate(id, vaultObj, { new: true })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

module.exports = {
  createVault,
  getVaultByUserId,
  updateVaultById,
};
