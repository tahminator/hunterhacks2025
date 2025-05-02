import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { User, Session } from "@prisma/client";
import { db } from "@/lib/db";
import { Response } from "express";
import cookieGen from "@/lib/cookie-gen";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  userId: string,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session = await db.session.create({
    data: {
      id: sessionId,
      userId,
      // Expires in 30 days
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });
  return session;
}

export async function validateSessionToken(
  sessionId: string,
): Promise<SessionValidationResult> {
  const result = await db.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true,
    },
  });

  if (result === null) {
    return { session: null, user: null };
  }

  const { user, ...session } = result;

  if (Date.now() >= session.expiresAt.getTime()) {
    await db.session.delete({ where: { id: sessionId } });
    return { session: null, user: null };
  }

  // Regenerate new expiration date
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db.session.update({
      where: {
        id: session.id,
      },
      data: {
        expiresAt: session.expiresAt,
      },
    });
  }

  return { session, user };
}

export function setSessionTokenCookie(
  res: Response,
  sessionId: string,
  expiresAt: Date,
) {
  res.appendHeader(
    "Set-Cookie",
    cookieGen({
      name: "session",
      value: sessionId,
      httpOnly: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      expires: expiresAt.toUTCString(),
      path: "/",
    }),
  );
}

export function deleteSessionTokenCookie(res: Response) {
  res.appendHeader(
    "Set-Cookie",
    cookieGen({
      name: "session",
      sameSite: "Lax",
      maxAge: 0,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    }),
  );
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.session.delete({ where: { id: sessionId } });
}

export async function invalidateAllSessions(userId: string): Promise<void> {
  await db.session.deleteMany({
    where: {
      userId: userId,
    },
  });
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
