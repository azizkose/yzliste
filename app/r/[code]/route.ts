import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  if (!code || !/^[a-z0-9]{6,12}$/i.test(code)) {
    return NextResponse.redirect(new URL("/", _req.url));
  }

  const res = NextResponse.redirect(new URL("/", _req.url));
  res.cookies.set("ref_code", code.toLowerCase(), {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30, // 30 gün
    path: "/",
    sameSite: "lax",
  });
  return res;
}
