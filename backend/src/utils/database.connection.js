import mongoose from "mongoose";
import config from "../configs";
import logger from "../utils/logger";

let database;

const connect = async () => {
  const MONGODB_URL = config.DB_CONNECTION_STRING;

  if (database) return;

  mongoose.set("strictQuery", false);

  mongoose
    .connect(MONGODB_URL)
    .then((connection) => {
      database = connection;
      logger.info("DB synched");
    })
    .catch((err) => {
      logger.error(err.message);
    });
};
export { connect };
