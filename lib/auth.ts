import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Role } from "./types";

const SECRET = process.env.AUTH_SECRET || "ecobloom-dev-secret-change-me";
const COOKIE_NAME = "ecobloom_session";

export interface SessionPayload {
  userId: string;
  role: Role;
  name: string;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signSession(payload: SessionPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: "30d" });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = signSession(payload);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    // Opt-in only (set COOKIE_SECURE=true once deployed behind HTTPS).
    // Tying this to NODE_ENV alone breaks local "npm run start" testing
    // on hosts other than exactly "localhost" (127.0.0.1, LAN IP, VS
    // Code preview proxies, etc.), where the browser silently drops
    // Secure cookies sent over plain HTTP — that looks like "login does
    // nothing" with no error message.
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
