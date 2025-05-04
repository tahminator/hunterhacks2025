import { apiRouter } from "@/api";
import { getLocalExternalIp } from "@/lib/os";
import { authMiddleware } from "@/middleware/auth";
import { cookieParser } from "@/middleware/cookie-parser";
import "dotenv/config";
import express from "express";
import morgan from "morgan";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser);
app.use(authMiddleware);

app.use(morgan("tiny"));

app.use("/api", apiRouter);

app.listen(3000, "0.0.0.0", () => {
  const ip = getLocalExternalIp() ?? "localhost";
  console.log(`Server listening on http://${ip}:3000`);
  console.log(`Server listening on http://127.0.:3000`);
});
