import express, {
  Request,
  Application,
  Response,
  NextFunction,
  urlencoded,
  json,
} from "express";
import dotenv from "dotenv";
import emailRoute from "./routes/emailRoute";
import authRoute from "./routes/authRoute";
import userRoute from "./routes/userRoute";
import profileRoute from "./routes/profileRoute";
import verificationRoute from "./routes/verificationRoute";
import cors from "cors";
import { errorHandler } from "./utils/errors/errorHandler";
import { authenticate } from "./middlewares/authentication";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(json());
app.use(urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use(cors());

app.use("/api/v1/email", emailRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/profile", authenticate, profileRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/verify", verificationRoute);

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  errorHandler.handleError(err, res);
});

try {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
