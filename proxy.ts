import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.AUTH_SECRET || "ecobloom-dev-secret-change-me";
const COOKIE_NAME = "ecobloom_session";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;

  let session: { userId: string; role: "CLIENT" | "ADMIN"; name: string } | null = null;
  if (token) {
    try {
      session = jwt.verify(token, SECRET) as any;
    } catch {
      session = null;
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!session || session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login?next=/admin", req.url));
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login?next=/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
