import { OcrSingleton } from "@/lib/ocr";
import { multer } from "@/lib/uploads";
import { Router } from "express";

const supportedImageTypes = ["bmp", "jpg", "png", "pbm", "webp"];

export const ocrRouter = Router();

ocrRouter.post("/", multer.single("image"), async (req, res) => {
  if (!res.locals.user || !res.locals.session) {
    res.status(400).json({
      message: "You are not authenticated.",
    });
    return;
  }

  if (!req.file) {
    res.status(400).json({
      message: "No file found.",
    });
    return;
  }

  const extension = req.file.filename.split(".")[1];
  if (!supportedImageTypes.includes(extension)) {
    res.status(400).json({
      message: "File doesn't have a valid extension.",
    });
    return;
  }

  const ocrSingleton = new OcrSingleton();
  const ocr = await ocrSingleton.getOcr();

  const result = await ocr.recognize(req.file.buffer);

  res.status(200).json({
    data: { text: result.data.text },
  });

  await ocrSingleton.terminate();
  return;
});
