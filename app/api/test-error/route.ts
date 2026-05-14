import { NextResponse } from "next/server";

// Bu route sadece Sentry DSN doğrulaması için. Production'a deploy edildikten
// sonra bir kez çağrılır, Sentry dashboard'da görünüyor mu kontrol edilir.
// Ardından bu dosya silinebilir.
export async function GET() {
  throw new Error("Sentry test error — yzliste production DSN check");
  // eslint-disable-next-line no-unreachable
  return NextResponse.json({ ok: true });
}
