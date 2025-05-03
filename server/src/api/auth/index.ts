import { loginSchema, signupSchema } from "@/lib/schema/auth";
import { Router } from "express";
import { compare, hash } from "bcrypt";
import { db } from "@/lib/db";
import {
  createSession,
  deleteSessionTokenCookie,
  generateSessionToken,
  invalidateSession,
  setSessionTokenCookie,
} from "@/lib/auth";
import cookieGen from "@/lib/cookie-gen";

export const authRouter = Router();

authRouter.get("/@me", async (req, res) => {
  if (!res.locals.user || !res.locals.user) {
    res.status(400).json({
      message: "You are not authenticated.",
    });
    return;
  }

  res.status(200).json({
    message: "You are authenticated!",
    data: {
      user: res.locals.user,
      session: res.locals.session,
    },
  });
});

authRouter.post("/signup", async (req, res) => {
  if (res.locals.user && res.locals.session) {
    res.status(403).json({
      message: "You are already authenticated!",
    });
    return;
  }

  const parser = await signupSchema.safeParseAsync(req.body);

  if (!parser.success) {
    res.status(400).json({
      errors: parser.error.issues,
    });
    return;
  }

  const { email, password, firstName, lastName, username } = parser.data;

  const hashedPassword = await hash(password, 10);

  const existingUser = await db.user.findUnique({
    where: {
      username,
    },
  });

  if (existingUser) {
    res.status(400).json({
      message: "User with given username already exists",
    });
  }

  const user = await db.user.create({
    data: {
      email,
      username,
      profileUrl: "https://picsum.photos/id/237/536/354",
      firstName,
      lastName,
      password: hashedPassword,
    },
  });

  const profile = await db.profile.create({
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      profileUrl: user.profileUrl,
      User: {
        connect: { username },
      },
    },
  });

  await db.user.update({
    where: { id: user.id },
    data: {
      activeProfileId: profile.id,
    },
  });

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSessionTokenCookie(res, session.id, session.expiresAt);

  res.status(200).json({
    message: "Your account has been created & you have been authenticated!",
  });

  // JSON is a possible way we can do authentication if needed.
  // res.status(200).json({
  //   name: "session",
  //   value: session.id,
  //   sameSite: "Lax",
  //   expires: session.expiresAt.toUTCString(),
  //   path: "/",
  // });
});

authRouter.post("/login", async (req, res) => {
  const parser = await loginSchema.safeParseAsync(req.body);

  if (!parser.success) {
    res.status(400).json({
      errors: parser.error.issues,
    });
    return;
  }

  const { username, password } = parser.data;

  const user = await db.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    res.status(400).json({
      message: "Failed to authenticate",
    });
    return;
  }

  const isValidPassword = await compare(password, user.password);

  if (!isValidPassword) {
    res.status(400).json({
      message: "Failed to authenticate",
    });
    return;
  }

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSessionTokenCookie(res, session.id, session.expiresAt);

  res.status(200).json({
    message: "You have been logged in!",
  });

  // JSON is a possible way we can do authentication if needed.
  // res.status(200).json({
  //   name: "session",
  //   value: session.id,
  //   sameSite: "Lax",
  //   expires: session.expiresAt.toUTCString(),
  //   path: "/",
  // });
});

authRouter.post("/logout", async (req, res) => {
  if (!res.locals.user || !res.locals.session) {
    res.status(403).json({
      message: "You are not authenticated.",
    });
    return;
  }

  try {
    await invalidateSession(res.locals.session.id);
  } catch {}
  deleteSessionTokenCookie(res);

  res.status(200).json({
    message: "You have been successfuly logged out!",
  });
});
