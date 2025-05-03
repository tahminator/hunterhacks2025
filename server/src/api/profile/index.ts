import { db } from "@/lib/db";
import { allergiesSchema } from "@/lib/schema/allergies";
import { newProfileSchema } from "@/lib/schema/profile";
import { Router } from "express";

export const profileRouter = Router();

profileRouter.get("/active", async (req, res) => {
  if (!res.locals.user || !res.locals.session) {
    res.status(400).json({
      message: "You are not authenticated.",
    });
    return;
  }

  const profile = await db.profile.findFirst({
    where: {
      activeForUser: {
        id: res.locals.user.id,
      },
    },
    include: {
      allergies: true,
    },
  });

  if (!profile) {
    res.status(404).json({
      message: "Profile does not exist.",
    });
    return;
  }

  res.status(200).json({
    data: profile,
  });
});

profileRouter.get("/all", async (req, res) => {
  if (!res.locals.user || !res.locals.session) {
    res.status(400).json({
      message: "You are not authenticated.",
    });
    return;
  }

  const searchQuery = req.query["sq"] as string | undefined;
  const allergyQuery = req.query["aq"] as string | undefined;

  const profile = await db.profile.findMany({
    where: {
      userId: res.locals.user.id,
      ...(searchQuery && {
        OR: [
          {
            firstName: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        ],
      }),
      ...(allergyQuery && {
        allergies: {
          some: {
            itemName: {
              contains: allergyQuery,
              mode: "insensitive",
            },
          },
        },
      }),
    },
    include: {
      allergies: true,
    },
  });

  if (!profile) {
    res.status(404).json({
      message: "Profile does not exist.",
    });
    return;
  }

  res.status(200).json({
    data: profile,
  });
});

profileRouter.get("/:profileId", async (req, res) => {
  if (!res.locals.user || !res.locals.session) {
    res.status(400).json({
      message: "You are not authenticated.",
    });
    return;
  }

  const { profileId } = req.params;

  const profile = await db.profile.findUnique({
    where: {
      id: profileId,
      userId: res.locals.user.id,
    },
    include: {
      allergies: true,
    },
  });

  if (!profile) {
    res.status(404).json({
      message: "Profile does not exist.",
    });
    return;
  }

  res.status(200).json({
    data: profile,
  });
});

profileRouter.post("/add", async (req, res) => {
  if (!res.locals.user || !res.locals.session) {
    res.status(400).json({
      message: "You are not authenticated.",
    });
    return;
  }

  const parser = await newProfileSchema.safeParseAsync(req.body);

  if (!parser.success) {
    res.status(400).json({
      errors: parser.error.issues,
    });
    return;
  }

  const { firstName, lastName, allergies } = parser.data;

  const randomImageId = Math.floor(Math.random() * 236) + 1;

  const profile = await db.profile.create({
    data: {
      firstName,
      lastName,
      profileUrl: `https://picsum.photos/id/${randomImageId}/536/354`,
      userId: res.locals.user.id,
      allergies: {
        create: allergies.map(({ itemName, severity }) => ({
          itemName,
          severity,
        })),
      },
    },
    include: {
      allergies: true,
    },
  });

  res.status(200).json({
    message: "Profile successfully created!",
    data: profile,
  });
});

profileRouter.post("/:profileId/allergy/add", async (req, res) => {
  if (!res.locals.user || !res.locals.session) {
    res.status(400).json({
      message: "You are not authenticated.",
    });
    return;
  }

  const { profileId } = req.params;

  const parser = await allergiesSchema.safeParseAsync(req.body);

  if (!parser.success) {
    res.status(400).json({
      errors: parser.error.issues,
    });
    return;
  }

  const allergies = parser.data;

  const profile = await db.profile.update({
    where: {
      id: profileId,
    },
    data: {
      allergies: {
        create: allergies.map(({ itemName, severity }) => ({
          itemName,
          severity,
        })),
      },
    },
    include: {
      allergies: true,
    },
  });

  res.status(200).json({
    message: "Allergies added successfully!",
    data: profile,
  });
});
