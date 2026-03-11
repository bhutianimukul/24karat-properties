import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const envUser = process.env.ADMIN_USER;
  const envPass = process.env.ADMIN_PASSWORD;

  if (!auth) {
    return NextResponse.json({
      hasAuth: false,
      hasEnvUser: !!envUser,
      hasEnvPass: !!envPass,
      envUserLength: envUser?.length,
      envPassLength: envPass?.length,
    });
  }

  const [scheme, encoded] = auth.split(" ");
  const decoded = Buffer.from(encoded || "", "base64").toString("utf-8");
  const colonIndex = decoded.indexOf(":");
  const user = decoded.slice(0, colonIndex);
  const pass = decoded.slice(colonIndex + 1);

  return NextResponse.json({
    scheme,
    decodedUser: user,
    decodedPassLength: pass.length,
    envUserValue: envUser,
    envPassLength: envPass?.length,
    match: user === envUser && pass === envPass,
  });
}
