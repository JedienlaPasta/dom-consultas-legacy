import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import os from "os";

import rateLimit from "express-rate-limit";
import helmet from "helmet";

import rolesRoutes from "./routes/roles.js";
import permisosRoutes from "./routes/permisos.js";
import userRoutes from "./routes/user.js";
import logsRouter from "./routes/logs.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// export const filePath = __dirname+'/client/public/exportdata.xlsx'
// export const filePath = __dirname+'/tmp/exportdata.xlsx'
export const filePath = "/tmp/exportdata.xlsx";
dotenv.config();

app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { message: "Too many requests, please try again later." },
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors());

app.use(express.static("build"));

app.use("/roles", rolesRoutes);
app.use("/perm", permisosRoutes);
app.use("/users", userRoutes);
app.use("/logs", logsRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL || CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)),
  )
  .catch((error) => console.log(error.message));
