import { OcrSingleton } from "@/lib/ocr";
import { multer } from "@/lib/uploads";
import { Router } from "express";
import { generateObject, generateText } from "ai";
import { model } from "@/lib/ai";
import { db } from "@/lib/db";
import { z } from "zod";
import { reportSchema } from "@/lib/schema/report";
import { severitySchema } from "@/lib/schema/allergies";

export const reportRouter = Router();

const supportedImageTypes = ["bmp", "jpg", "png", "pbm", "webp"];

const severityText = (severity: z.infer<typeof severitySchema>) => {
  switch (severity) {
    case "low":
      return "slight";
    case "med":
      return "medium";
    case "high":
      return "severe";
    default:
      return "";
  }
};

reportRouter.post("/generate", multer.single("image"), async (req, res) => {
  if (!res.locals.user || !res.locals.session) {
    res.status(400).json({
      message: "You are not authenticated.",
    });
    return;
  }

  const { restaurantName, isJustMe } = req.body as {
    restaurantName: string;
    isJustMe: string;
  };

  if (!restaurantName) {
    res.status(400).json({
      message: "Restaurant name is missing from form data.",
    });
    return;
  }

  if (!req.file) {
    res.status(400).json({
      message: "No file found.",
    });
    return;
  }

  const extension = req.file.originalname.split(".")[1];

  if (!supportedImageTypes.includes(extension)) {
    res.status(400).json({
      message: "File doesn't have a valid extension.",
    });
    return;
  }

  const ocrSingleton = new OcrSingleton();
  const ocr = await ocrSingleton.getOcr();

  const {
    data: { text: ocrText },
  } = await ocr.recognize(req.file.buffer);

  const { text: strippedText } = await generateText({
    model,
    prompt: `Remove the extra noise from this OCR text.\
    For context, it is a restaurant menu, so make sure to keep those items.\
    You can split menu items by new lines

${ocrText}
    `,
  });

  let profiles: ({
    allergies: {
      id: string;
      severity: AllergySeverity;
      itemName: string;
      profileId: string;
    }[];
  } & {
    id: string;
    firstName: string;
    lastName: string;
    profileUrl: string;
    userId: string;
  })[];
  if (isJustMe === "1") {
    profiles = await db.profile.findMany({
      where: {
        activeForUser: {
          id: res.locals.user.id,
        },
      },
      include: {
        allergies: true,
      },
    });
  } else {
    profiles = await db.profile.findMany({
      where: {
        userId: res.locals.user.id,
      },
      include: {
        allergies: true,
      },
    });
  }

  let result: z.infer<typeof reportSchema>[] = [];

  for (const profile of profiles) {
    const { object } = await generateObject({
      model,
      prompt: `Hi, my name is ${profile.firstName} ${profile.lastName} and I have ${profile.allergies.map(
        (a) => `a ${severityText(a.severity)} ${a.itemName} allergy,`,
      )}. Given that, analyze the ingredients found in each item on this menu from ${restaurantName}.

      ${strippedText}

      Give me a description of why I cannot eat the item, things to possibly to be cautious about, and more.
      In your description, do not include a warning about cross-contamination or inquiring the restaurant. This is already disclosed.`,
      schemaName: "allergies_report",
      schema: reportSchema,
    });
    result.push(object);
  }

  res.status(200).json({
    message: "Your report is complete!",
    data: result,
  });
});

// This is a test endpoint that returns the same shape as the actual endpoint, with 1 profile.
reportRouter.post(
  "/generate/test/1",
  multer.single("image"),
  async (req, res) => {
    const result = [
      {
        name: "Tahmid Ahmed",
        foods: [
          {
            title: "Big Mac®",
            description:
              "The Big Mac contains a sesame seed bun, beef patties, Big Mac sauce, lettuce, cheese, pickles, and onions. The bun and Big Mac sauce contain gluten, which poses a severe risk due to your gluten allergy. Additionally, the cheese contains milk, which could trigger your milk chocolate allergy, albeit slightly.",
            severity: "high",
          },
          {
            title: "Quarter Pounder® with Cheese",
            description:
              "This burger includes a sesame seed bun, beef patty, cheese, pickles, onions, ketchup, and mustard. The bun contains gluten, making it unsafe for you. The cheese also contains milk, which could cause a mild reaction due to your milk chocolate allergy.",
            severity: "high",
          },
          {
            title: "Quarter Pounder® Bacon Deluxe",
            description:
              "The Quarter Pounder Bacon Deluxe features a sesame seed bun, beef patty, bacon, cheese, lettuce, tomato, pickles, onions, ketchup, and mustard. The bun contains gluten, posing a severe risk. The cheese contains milk, which could trigger a slight allergic reaction.",
            severity: "high",
          },
          {
            title: "Double Quarter Pounder®",
            description:
              "This item includes a sesame seed bun, two beef patties, cheese, pickles, onions, ketchup, and mustard. The bun contains gluten, which is highly unsafe for you. The cheese contains milk, which could cause a mild reaction due to your milk chocolate allergy.",
            severity: "high",
          },
          {
            title: "Cheeseburger",
            description:
              "The cheeseburger consists of a sesame seed bun, beef patty, cheese, pickles, onions, ketchup, and mustard. The bun contains gluten, posing a severe risk. The cheese contains milk, which could trigger a slight allergic reaction.",
            severity: "high",
          },
        ],
      },
    ] as z.infer<typeof reportSchema>[];

    res.status(200).json({
      message: "Your report is complete!",
      data: result,
    });
  },
);

// This is a test endpoint that returns the same shape as the actual endpoint, with 2 profile.
reportRouter.post(
  "/generate/test/2",
  multer.single("image"),
  async (req, res) => {
    const result = [
      {
        name: "Tahmid Ahmed",
        foods: [
          {
            title: "Big Mac®",
            description:
              "The Big Mac contains a sesame seed bun, beef patties, Big Mac sauce, lettuce, cheese, pickles, and onions. The bun and Big Mac sauce contain gluten, which poses a severe risk due to your gluten allergy. Additionally, the cheese contains milk, which could trigger your milk chocolate allergy, albeit slightly.",
            severity: "high",
          },
          {
            title: "Quarter Pounder® with Cheese",
            description:
              "This burger includes a sesame seed bun, beef patty, cheese, pickles, onions, ketchup, and mustard. The bun contains gluten, posing a severe risk. The cheese contains milk, which could trigger your milk chocolate allergy.",
            severity: "high",
          },
          {
            title: "Quarter Pounder® Bacon Deluxe",
            description:
              "This item features a sesame seed bun, beef patty, bacon, cheese, lettuce, tomato, pickles, onions, ketchup, and mustard. The bun contains gluten, posing a severe risk. The cheese contains milk, which could trigger your milk chocolate allergy.",
            severity: "high",
          },
          {
            title: "Double Quarter Pounder®",
            description:
              "This burger includes a sesame seed bun, two beef patties, cheese, pickles, onions, ketchup, and mustard. The bun contains gluten, posing a severe risk. The cheese contains milk, which could trigger your milk chocolate allergy.",
            severity: "high",
          },
          {
            title: "Cheeseburger",
            description:
              "The cheeseburger consists of a sesame seed bun, beef patty, cheese, pickles, onions, ketchup, and mustard. The bun contains gluten, posing a severe risk. The cheese contains milk, which could trigger your milk chocolate allergy.",
            severity: "high",
          },
        ],
      },
      {
        name: "Bob Cage",
        foods: [
          {
            title: "Big Mac®",
            description:
              "The Big Mac contains cheese, which is a dairy product and can trigger your medium milk allergy. Additionally, the sauce may contain milk derivatives.",
            severity: "med",
          },
          {
            title: "Quarter Pounder® with Cheese",
            description:
              "This burger includes cheese, posing a risk due to your milk allergy. The bun and sauce may also contain milk derivatives.",
            severity: "med",
          },
          {
            title: "Quarter Pounder® Bacon Deluxe",
            description:
              "Contains cheese, which is problematic for your milk allergy. The sauce and bun may also have milk derivatives.",
            severity: "med",
          },
          {
            title: "Double Quarter Pounder®",
            description:
              "While this item does not explicitly list cheese, it may still contain milk derivatives in the bun or sauce.",
            severity: "med",
          },
          {
            title: "Cheeseburger",
            description:
              "The presence of cheese makes this item unsuitable due to your milk allergy. The bun and sauce may also contain milk derivatives.",
            severity: "med",
          },
        ],
      },
    ] as z.infer<typeof reportSchema>[];

    res.status(200).json({
      message: "Your report is complete!",
      data: result,
    });
  },
);
