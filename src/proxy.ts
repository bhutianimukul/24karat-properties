import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const auth = request.headers.get("authorization");

  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = Buffer.from(encoded, "base64").toString("utf-8");
      const colonIndex = decoded.indexOf(":");
      const user = decoded.slice(0, colonIndex);
      const pass = decoded.slice(colonIndex + 1);
      const validUser = process.env.ADMIN_USER || "";
      const validPass = process.env.ADMIN_PASSWORD || "";

      if (user === validUser && pass === validPass) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="24 Karat Admin"' },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
