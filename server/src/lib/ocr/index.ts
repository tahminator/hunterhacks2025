import { createWorker } from "tesseract.js";

export class OcrSingleton {
  ocr: Tesseract.Worker | null;

  constructor() {
    this.ocr = null;
  }

  public async getOcr() {
    if (!this.ocr) {
      this.ocr = await createWorker(["eng", "spa", "chi_sim"]);
    }

    return this.ocr;
  }

  public async terminate() {
    if (!this.ocr) {
      return;
    }

    this.ocr.terminate();
    this.ocr = null;
  }
}
