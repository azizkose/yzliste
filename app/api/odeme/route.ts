import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import logger from "@/lib/logger";

const IYZICO_API_KEY = process.env.IYZICO_API_KEY!;
const IYZICO_SECRET_KEY = process.env.IYZICO_SECRET_KEY!;
const IYZICO_BASE_URL = "https://api.iyzipay.com"; // LIVE
const URI_PATH = "/payment/iyzipos/checkoutform/initialize/auth/ecom";

import { PAKETLER as PAKET_TANIM } from "@/lib/paketler";

const PAKETLER: Record<string, { isim: string; kredi: number; tutar: number }> = {
  baslangic: { isim: PAKET_TANIM.baslangic.isimApi, kredi: PAKET_TANIM.baslangic.kredi, tutar: PAKET_TANIM.baslangic.fiyat },
  populer:   { isim: PAKET_TANIM.populer.isimApi,   kredi: PAKET_TANIM.populer.kredi,   tutar: PAKET_TANIM.populer.fiyat   },
  buyuk:     { isim: PAKET_TANIM.buyuk.isimApi,     kredi: PAKET_TANIM.buyuk.kredi,     tutar: PAKET_TANIM.buyuk.fiyat     },
};

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

export async function POST(req: NextRequest) {
  const { paket, userId, email } = await req.json();

  const paketBilgi = PAKETLER[paket];
  if (!paketBilgi) return NextResponse.json({ hata: "Gecersiz paket" }, { status: 400 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  // Profil bilgileri — fatura için
  const { data: profil } = await supabase
    .from("profiles")
    .select("ad_soyad, fatura_tipi, tc_kimlik, vergi_no, adres, sehir")
    .eq("id", userId)
    .single();

  const { data: odeme } = await supabase
    .from("payments")
    .insert({ user_id: userId, paket, kredi: paketBilgi.kredi, tutar: paketBilgi.tutar, durum: "bekliyor" })
    .select()
    .single();

  const conversationId = randomString(12);
  const callbackBase = process.env.NEXT_PUBLIC_SITE_URL || "https://yzliste.com";
  const randomKey = randomString(20);

  // Kimlik numarası — TC veya vergi no
  const identityNumber = profil?.tc_kimlik || profil?.vergi_no || "74300864791";
  const adSoyad = profil?.ad_soyad || email.split("@")[0];
  const adParcalari = adSoyad.split(" ");
  const ad = adParcalari[0] || adSoyad;
  const soyad = adParcalari.slice(1).join(" ") || "Kullanici";
  const adres = profil?.adres || "Istanbul";
  const sehir = profil?.sehir || "Istanbul";

  const requestBody = {
    locale: "tr",
    conversationId,
    price: paketBilgi.tutar.toFixed(2),
    paidPrice: paketBilgi.tutar.toFixed(2),
    currency: "TRY",
    basketId: odeme?.id || conversationId,
    paymentGroup: "PRODUCT",
    callbackUrl: `${callbackBase}/api/odeme/callback`,
    enabledInstallments: [1, 2, 3, 6, 9],
    buyer: {
      id: userId,
      name: ad,
      surname: soyad,
      gsmNumber: "+905350000000",
      email,
      identityNumber,
      registrationAddress: adres,
      ip: req.headers.get("x-forwarded-for") || "85.34.78.112",
      city: sehir,
      country: "Turkey",
    },
    shippingAddress: { contactName: adSoyad, city: sehir, country: "Turkey", address: adres },
    billingAddress: { contactName: adSoyad, city: sehir, country: "Turkey", address: adres },
    basketItems: [
      {
        id: paket,
        name: paketBilgi.isim,
        category1: "Dijital Urun",
        itemType: "VIRTUAL",
        price: paketBilgi.tutar.toFixed(2),
      },
    ],
  };

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

  if (data.status !== "success") {
    logger.error({ data }, "iyzico hata yanıtı");
    return NextResponse.json({ hata: data.errorMessage || "Odeme baslatılamadı" }, { status: 400 });
  }

  await supabase.from("payments").update({ iyzico_token: data.token }).eq("id", odeme?.id);

  return NextResponse.json({ checkoutFormContent: data.checkoutFormContent, token: data.token });
}
