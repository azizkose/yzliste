import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const IYZICO_API_KEY = process.env.IYZICO_API_KEY!;
const IYZICO_SECRET_KEY = process.env.IYZICO_SECRET_KEY!;
const IYZICO_BASE_URL = "https://sandbox-api.iyzipay.com";

const PAKETLER: Record<string, { isim: string; kredi: number; tutar: number }> = {
  baslangic: { isim: "Baslangic Paketi", kredi: 10, tutar: 29 },
  populer: { isim: "Populer Paket", kredi: 30, tutar: 79 },
  sinırsiz: { isim: "Sinirsiz Paket", kredi: 9999, tutar: 199 },
};

function randomString(length: number): string {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

function iyzicoImzaOlustur(randomKey: string, payload: string): string {
  const hash = crypto
    .createHmac("sha256", IYZICO_SECRET_KEY)
    .update(IYZICO_API_KEY + randomKey + IYZICO_SECRET_KEY + payload)
    .digest("base64");
  return hash;
}

export async function POST(req: NextRequest) {
  const { paket, userId, email } = await req.json();

  const paketBilgi = PAKETLER[paket];
  if (!paketBilgi) {
    return NextResponse.json({ hata: "Gecersiz paket" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { data: odeme } = await supabase
    .from("payments")
    .insert({ user_id: userId, paket, kredi: paketBilgi.kredi, tutar: paketBilgi.tutar, durum: "bekliyor" })
    .select()
    .single();

  const conversationId = randomString(12);
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yzliste.vercel.app";

  const requestBody = {
    locale: "tr",
    conversationId,
    price: paketBilgi.tutar.toFixed(2),
    paidPrice: paketBilgi.tutar.toFixed(2),
    currency: "TRY",
    basketId: odeme?.id || conversationId,
    paymentGroup: "PRODUCT",
    callbackUrl: `${appBaseUrl}/api/odeme/callback`,
    enabledInstallments: [1, 2, 3, 6, 9],
    buyer: {
      id: userId,
      name: email.split("@")[0],
      surname: "Kullanici",
      gsmNumber: "+905350000000",
      email,
      identityNumber: "74300864791",
      registrationAddress: "Istanbul",
      ip: req.headers.get("x-forwarded-for") || "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
    },
    shippingAddress: { contactName: email.split("@")[0], city: "Istanbul", country: "Turkey", address: "Istanbul" },
    billingAddress: { contactName: email.split("@")[0], city: "Istanbul", country: "Turkey", address: "Istanbul" },
    basketItems: [
      { id: paket, name: paketBilgi.isim, category1: "Dijital Urun", itemType: "VIRTUAL", price: paketBilgi.tutar.toFixed(2) },
    ],
  };

  const payload = JSON.stringify(requestBody);
  const randomKey = randomString(8);
  const imza = iyzicoImzaOlustur(randomKey, payload);

  const response = await fetch(`${IYZICO_BASE_URL}/payment/iyzipos/checkoutform/initialize/auth/ecom`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `IYZWSv2 apiKey=${IYZICO_API_KEY}&randomKey=${randomKey}&signature=${imza}`,
    },
    body: payload,
  });

  const data = await response.json();

  if (data.status !== "success") {
    console.error("Iyzico hata:", JSON.stringify(data));
    return NextResponse.json({ hata: data.errorMessage || "Odeme baslatılamadı" }, { status: 400 });
  }

  await supabase.from("payments").update({ iyzico_token: data.token }).eq("id", odeme?.id);

  return NextResponse.json({ checkoutFormContent: data.checkoutFormContent, token: data.token });
}
