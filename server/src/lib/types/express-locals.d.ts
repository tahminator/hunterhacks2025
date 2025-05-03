import { Session, User } from "@prisma/client";

declare global {
  namespace Express {
    interface Locals {
      user: Omit<User, "password"> | null;
      session: Session | null;
      cookie: Record<string, string>;
    }
  }
}
