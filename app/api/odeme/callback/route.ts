import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const IYZICO_API_KEY = process.env.IYZICO_API_KEY!;
const IYZICO_SECRET_KEY = process.env.IYZICO_SECRET_KEY!;
const IYZICO_BASE_URL = "https://sandbox-api.iyzipay.com";
const URI_PATH = "/payment/iyzipos/checkoutform/auth/ecom/detail";

function randomString(length: number): string {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

function iyzicoAuth(randomKey: string, body: string): string {
  const encryptedData = crypto
    .createHmac("sha256", IYZICO_SECRET_KEY)
    .update(randomKey + URI_PATH + body)
    .digest("hex");
  const authorizationString = `apiKey:${IYZICO_API_KEY}&randomKey:${randomKey}&signature:${encryptedData}`;
  return Buffer.from(authorizationString).toString("base64");
}

async function odemeDogrula(token: string): Promise<NextResponse> {
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yzliste.vercel.app";

  if (!token) {
    return NextResponse.redirect(`${appBaseUrl}/?odeme=hata`);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const randomKey = randomString(20);
  const requestBody = { locale: "tr", conversationId: randomString(12), token };
  const body = JSON.stringify(requestBody);
  const authHeader = iyzicoAuth(randomKey, body);

  const response = await fetch(`${IYZICO_BASE_URL}${URI_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `IYZWSv2 ${authHeader}`,
      "x-iyzi-rnd": randomKey,
    },
    body,
  });

  const data = await response.json();
  console.log("Iyzico callback yanit:", JSON.stringify(data));

  if (data.status !== "success" || data.paymentStatus !== "SUCCESS") {
    await supabase.from("payments").update({ durum: "basarisiz" }).eq("iyzico_token", token);
    return NextResponse.redirect(`${appBaseUrl}/?odeme=hata`);
  }

  const { data: odeme } = await supabase
    .from("payments")
    .update({ durum: "basarili", iyzico_payment_id: data.paymentId?.toString() })
    .eq("iyzico_token", token)
    .select()
    .single();

  if (odeme) {
    const { data: profil } = await supabase
      .from("profiles")
      .select("kredi")
      .eq("id", odeme.user_id)
      .single();

    if (profil) {
      const yeniKredi = odeme.paket === "sinırsiz" ? 9999 : profil.kredi + odeme.kredi;
      await supabase.from("profiles").update({ kredi: yeniKredi }).eq("id", odeme.user_id);
    }
  }

  return NextResponse.redirect(`${appBaseUrl}/?odeme=basarili`);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const token = formData.get("token") as string;
  return odemeDogrula(token);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") || "";
  return odemeDogrula(token);
}
