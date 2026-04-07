import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const IYZICO_API_KEY = process.env.IYZICO_API_KEY!;
const IYZICO_SECRET_KEY = process.env.IYZICO_SECRET_KEY!;
const IYZICO_BASE_URL = "https://api.iyzipay.com"; // LIVE
const URI_PATH = "/payment/iyzipos/checkoutform/auth/ecom/detail";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yzliste.com";

// Paraşüt env
const PARASUT_CLIENT_ID = process.env.PARASUT_CLIENT_ID;
const PARASUT_CLIENT_SECRET = process.env.PARASUT_CLIENT_SECRET;
const PARASUT_USERNAME = process.env.PARASUT_USERNAME;
const PARASUT_PASSWORD = process.env.PARASUT_PASSWORD;
const PARASUT_COMPANY_ID = process.env.PARASUT_COMPANY_ID;

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

function redirect303(url: string): NextResponse {
  return NextResponse.redirect(url, { status: 303 });
}

// ===== PARAŞÜT FONKSİYONLARI =====

async function parasutToken(): Promise<string | null> {
  if (!PARASUT_CLIENT_ID || !PARASUT_CLIENT_SECRET || !PARASUT_USERNAME || !PARASUT_PASSWORD) {
    console.log("Parasut env eksik, fatura kesilmeyecek.");
    return null;
  }
  try {
    const res = await fetch("https://api.parasut.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: PARASUT_CLIENT_ID,
        client_secret: PARASUT_CLIENT_SECRET,
        username: PARASUT_USERNAME,
        password: PARASUT_PASSWORD,
        grant_type: "password",
        redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
      }),
    });
    const data = await res.json();
    return data.access_token || null;
  } catch (e) {
    console.error("Parasut token hatasi:", e);
    return null;
  }
}

async function parasutMusteriOlusturVeyaBul(
  token: string,
  email: string,
  adSoyad: string,
  tcKimlik?: string | null,
  vergiNo?: string | null
): Promise<string | null> {
  try {
    // Önce email ile ara
    const searchRes = await fetch(
      `https://api.parasut.com/v4/${PARASUT_COMPANY_ID}/contacts?filter[email]=${encodeURIComponent(email)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const searchData = await searchRes.json();
    if (searchData.data && searchData.data.length > 0) {
      return searchData.data[0].id;
    }

    // Yoksa oluştur
    const adParcalari = adSoyad.split(" ");
    const ad = adParcalari[0] || adSoyad;
    const soyad = adParcalari.slice(1).join(" ") || "-";

    const createRes = await fetch(
      `https://api.parasut.com/v4/${PARASUT_COMPANY_ID}/contacts`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/vnd.api+json" },
        body: JSON.stringify({
          data: {
            type: "contacts",
            attributes: {
              contact_type: "person",
              name: ad,
              surname: soyad,
              email,
              tax_number: vergiNo || tcKimlik || undefined,
              account_type: "customer",
            },
          },
        }),
      }
    );
    const createData = await createRes.json();
    return createData.data?.id || null;
  } catch (e) {
    console.error("Parasut musteri hatasi:", e);
    return null;
  }
}

async function parasutFaturaKes(
  token: string,
  musteriId: string,
  tutar: number,
  paketIsmi: string,
  odemeId: string
): Promise<string | null> {
  try {
    const bugun = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // KDV hariç tutar hesapla (%20 KDV)
    const kdvOrani = 20;
    const kdvsizTutar = parseFloat((tutar / 1.2).toFixed(2));

    const faturaRes = await fetch(
      `https://api.parasut.com/v4/${PARASUT_COMPANY_ID}/sales_invoices`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/vnd.api+json" },
        body: JSON.stringify({
          data: {
            type: "sales_invoices",
            attributes: {
              item_type: "invoice",
              description: `yzliste - ${paketIsmi}`,
              issue_date: bugun,
              due_date: bugun,
              currency: "TRL",
              invoice_id: odemeId.substring(0, 8).toUpperCase(),
            },
            relationships: {
              details: {
                data: [{
                  type: "sales_invoice_details",
                  attributes: {
                    quantity: 1,
                    unit_price: kdvsizTutar,
                    vat_rate: kdvOrani,
                    description: paketIsmi,
                  },
                }],
              },
              contact: {
                data: { type: "contacts", id: musteriId },
              },
            },
          },
        }),
      }
    );

    const faturaData = await faturaRes.json();
    const faturaId = faturaData.data?.id;
    if (!faturaId) {
      console.error("Parasut fatura olusturulamadi:", JSON.stringify(faturaData));
      return null;
    }

    // Tahsil et
    await fetch(
      `https://api.parasut.com/v4/${PARASUT_COMPANY_ID}/sales_invoices/${faturaId}/payments`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/vnd.api+json" },
        body: JSON.stringify({
          data: {
            type: "payments",
            attributes: {
              amount: tutar,
              date: bugun,
              currency: "TRL",
              payment_type: "credit_card",
              description: "iyzico online odeme",
            },
          },
        }),
      }
    );

    // E-arşiv olarak resmileştir
    const earsivRes = await fetch(
      `https://api.parasut.com/v4/${PARASUT_COMPANY_ID}/e_archives`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/vnd.api+json" },
        body: JSON.stringify({
          data: {
            type: "e_archives",
            relationships: {
              sales_invoice: {
                data: { id: faturaId, type: "sales_invoices" },
              },
            },
          },
        }),
      }
    );

    const earsivData = await earsivRes.json();
    console.log("E-arsiv olusturuldu:", earsivData.data?.id);

    return faturaId;
  } catch (e) {
    console.error("Parasut fatura hatasi:", e);
    return null;
  }
}

// ===== ANA ÖDEME DOĞRULAMA =====

async function odemeDogrula(token: string): Promise<NextResponse> {
  if (!token) return redirect303(`${SITE_URL}/?odeme=hata`);

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
  console.log("Iyzico callback:", JSON.stringify(data));

  if (data.status !== "success" || data.paymentStatus !== "SUCCESS") {
    await supabase.from("payments").update({ durum: "basarisiz" }).eq("iyzico_token", token);
    return redirect303(`${SITE_URL}/?odeme=hata`);
  }

  // Ödemeyi güncelle
  const { data: odeme } = await supabase
    .from("payments")
    .update({ durum: "basarili", iyzico_payment_id: data.paymentId?.toString() })
    .eq("iyzico_token", token)
    .select()
    .single();

  if (odeme) {
    // Kredi ekle
    const { data: profil } = await supabase
      .from("profiles")
      .select("kredi, email, ad_soyad, tc_kimlik, vergi_no")
      .eq("id", odeme.user_id)
      .single();

    if (profil) {
      const yeniKredi = profil.kredi + odeme.kredi;
      await supabase.from("profiles").update({ kredi: yeniKredi }).eq("id", odeme.user_id);

      // Paraşüt fatura — async, hata olursa ödemeyi etkileme
      try {
        const parasutAccessToken = await parasutToken();
        if (parasutAccessToken && profil.email) {
          const musteriId = await parasutMusteriOlusturVeyaBul(
            parasutAccessToken,
            profil.email,
            profil.ad_soyad || profil.email.split("@")[0],
            profil.tc_kimlik,
            profil.vergi_no
          );

          if (musteriId) {
            const paketler: Record<string, string> = {
              baslangic: "Baslangic Paketi - 10 Kredi",
              populer: "Populer Paket - 30 Kredi",
              buyuk: "Buyuk Paket - 100 Kredi",
            };
            await parasutFaturaKes(
              parasutAccessToken,
              musteriId,
              odeme.tutar,
              paketler[odeme.paket] || odeme.paket,
              odeme.id
            );
          }
        }
      } catch (e) {
        console.error("Parasut entegrasyon hatasi (odeme etkilenmedi):", e);
      }
    }
  }

  return redirect303(`${SITE_URL}/?odeme=basarili`);
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
