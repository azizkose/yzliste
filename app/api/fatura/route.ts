import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

const PARASUT_API = "https://api.parasut.com/v4";
const PARASUT_COMPANY_ID = process.env.PARASUT_COMPANY_ID!;
const PARASUT_CLIENT_ID = process.env.PARASUT_CLIENT_ID!;
const PARASUT_CLIENT_SECRET = process.env.PARASUT_CLIENT_SECRET!;
const PARASUT_USERNAME = process.env.PARASUT_USERNAME!;
const PARASUT_PASSWORD = process.env.PARASUT_PASSWORD!;

async function parasutToken(): Promise<string | null> {
  if (!PARASUT_CLIENT_ID) return null;
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
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

/**
 * GET /api/fatura?odemeId=xxx&action=pdf|email
 */
export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ hata: "Giriş gerekli" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const odemeId = searchParams.get("odemeId");
  const action = searchParams.get("action") ?? "pdf";

  if (!odemeId) return NextResponse.json({ hata: "odemeId eksik" }, { status: 400 });

  // Ödemeyi doğrula — sadece kendi ödemesine erişebilir
  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
  const { data: odeme } = await adminSupabase
    .from("payments")
    .select("id, user_id, parasut_fatura_id, durum, paket, tutar, created_at")
    .eq("id", odemeId)
    .eq("user_id", user.id)
    .eq("durum", "basarili")
    .single();

  if (!odeme) return NextResponse.json({ hata: "Ödeme bulunamadı" }, { status: 404 });
  if (!odeme.parasut_fatura_id) {
    return NextResponse.json({ hata: "Fatura henüz oluşturulmamış. Lütfen destek@yzliste.com ile iletişime geçin." }, { status: 404 });
  }

  const token = await parasutToken();
  if (!token) return NextResponse.json({ hata: "Fatura sistemi şu anda kullanılamıyor." }, { status: 503 });

  if (action === "pdf") {
    // Paraşüt PDF URL'sini al
    try {
      const res = await fetch(
        `${PARASUT_API}/${PARASUT_COMPANY_ID}/sales_invoices/${odeme.parasut_fatura_id}?include=e_archive`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      const pdfUrl = data.data?.relationships?.e_archive?.links?.related;
      if (!pdfUrl) return NextResponse.json({ hata: "PDF oluşturulamadı." }, { status: 404 });

      return NextResponse.json({ pdf_url: pdfUrl });
    } catch {
      return NextResponse.json({ hata: "PDF alınamadı." }, { status: 500 });
    }
  }

  if (action === "email") {
    // Paraşüt e-posta gönder
    try {
      await fetch(
        `${PARASUT_API}/${PARASUT_COMPANY_ID}/sales_invoices/${odeme.parasut_fatura_id}/send_sms`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/vnd.api+json" },
          body: JSON.stringify({ data: { type: "send_sms_notification" } }),
        }
      );

      await adminSupabase
        .from("payments")
        .update({ fatura_email_gonderildi: true })
        .eq("id", odemeId);

      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ hata: "E-posta gönderilemedi." }, { status: 500 });
    }
  }

  return NextResponse.json({ hata: "Geçersiz action." }, { status: 400 });
}
