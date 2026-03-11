import { headers } from "next/headers";
import { NextResponse } from "next/server";

/** Check Basic Auth from request headers. Returns true if valid. */
export async function verifyBasicAuth(): Promise<boolean> {
  const headersList = await headers();
  const auth = headersList.get("authorization");

  if (!auth) return false;

  const [scheme, encoded] = auth.split(" ");
  if (scheme !== "Basic" || !encoded) return false;

  const decoded = atob(encoded);
  const [user, pass] = decoded.split(":");
  const validUser = process.env.ADMIN_USER || "";
  const validPass = process.env.ADMIN_PASSWORD || "";

  return user === validUser && pass === validPass;
}

/** Return a 401 response that triggers Basic Auth prompt */
export function unauthorizedResponse() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="24 Karat Admin"' },
  });
}

/** For API routes: check auth and return 401 if invalid */
export async function requireApiAuth(): Promise<NextResponse | null> {
  const valid = await verifyBasicAuth();
  if (!valid) return unauthorizedResponse();
  return null;
}
