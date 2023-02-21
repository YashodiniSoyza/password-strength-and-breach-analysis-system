import vaultService from "../services/Vault.service.js";

export const getVaultByUserId = async (req, res, next) => {
  await vaultService
    .getVaultByUserId(req.body.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const updateVaultById = async (req, res, next) => {
  await vaultService
    .updateVaultById(req.params.id, req.body)
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
  getVaultByUserId,
  updateVaultById,
};
