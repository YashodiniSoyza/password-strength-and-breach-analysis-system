import express from "express";
import cors from "cors";
import logger from "./utils/logger";
import "dotenv/config";
import routes from "./api/routes";
import responseHandler from "./utils/response.handler";
import { connect } from "./utils/database.connection";

const app = express();
const PORT = process.env.PORT || "8090";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

// Register Middleware Chain
app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inject Response Handler
app.use((req, res, next) => {
  req.handleResponse = responseHandler;
  next();
});

//Handle Root API Call
app.get("/", (req, res, next) => {
  res.send(
    "<title>Password strength and Breach Analysis System</title><h1>Welcome to Password strength and Breach Analysis System</h1>"
  );
  next();
});

//Start the Server
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  connect();
  routes(app);
});
