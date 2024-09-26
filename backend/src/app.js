import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import logger from "./utils/logger";
import "dotenv/config";
import routes from "./api/routes";
import responseHandler from "./utils/response.handler";
import { connect } from "./utils/database.connection";

const app = express();
const PORT = process.env.PORT || "8090";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Register Middleware Chain
app.use(limiter);
app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// fix Content Security Policy (CSP) misconfiguration
app.use(
  helmet.contentSecurityPolicy({
    directives:{
      defaultSrc: ["'self'"], // Only allow content from the same origin
      scriptSrc: ["'self'"],  // Allow only scripts from your local server
      styleSrc: ["'self'"],   // Allow only styles from your local server
      imgSrc: ["'self'", "data:"], // Allow images from your local server and inline data URIs
      fontSrc: ["'self'"],    // Allow only local fonts
      connectSrc: ["'self'", "http://localhost:5000"], // Allow API calls to the backend
      frameAncestors: ["'none'"], // Prevent clickjacking by disallowing framing
      objectSrc: ["'none'"],  // Disallow embedding of objects like Flash
    }
  })
);

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
