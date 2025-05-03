import { authRouter } from "@/api/auth";
import { ocrRouter } from "@/api/ocr";
import { profileRouter } from "@/api/profile";
import { Router } from "express";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/ocr", ocrRouter);
apiRouter.use("/profile", profileRouter);
