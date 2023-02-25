import statsService from "../services/Stats.service.js";

export const getHomeStats = async (req, res, next) => {
  await statsService
    .getHomeStats()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const adminDashboardStats = async (req, res, next) => {
  await statsService
    .adminDashboardStats()
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
  getHomeStats,
  adminDashboardStats,
};
