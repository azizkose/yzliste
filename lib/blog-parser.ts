import { readdir, readFile } from "fs/promises";
import path from "path";
import type { BlogYazisi, BlogBolum } from "@/app/blog/icerikler";

interface FrontMatter {
  slug: string;
  baslik: string;
  ozet: string;
  yayinTarihi: string;
  guncellemeTarihi?: string;
  yazarAdi: string;
  okumaSuresi: number;
  kategori: string;
  etiketler: string[];
  kapakGorsel?: string;
}

/**
 * YAML frontmatter'ı parse et
 * ---
 * slug: xxx
 * baslik: xxx
 * ---
 */
function parseFrontMatter(content: string): { frontMatter: FrontMatter; body: string } {
  // Normalize CRLF → LF (Windows line endings)
  const normalized = content.replace(/\r\n/g, '\n')
  const matches = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!matches) throw new Error("Frontmatter bulunamadı (--- ile başlayıp bitmeli)");

  const fm = matches[1]
  const body = matches[2];

  const metadata: Partial<FrontMatter> = {};

  // Her satırı key: value olarak parse et
  fm.split("\n").forEach((line) => {
    if (!line.trim()) return;
    const [key, ...valueParts] = line.split(":");
    const value = valueParts.join(":").trim();

    if (key.trim() === "slug") metadata.slug = value;
    if (key.trim() === "baslik") metadata.baslik = value;
    if (key.trim() === "ozet") metadata.ozet = value;
    if (key.trim() === "yayinTarihi") metadata.yayinTarihi = value;
    if (key.trim() === "guncellemeTarihi") metadata.guncellemeTarihi = value || undefined;
    if (key.trim() === "yazarAdi") metadata.yazarAdi = value;
    if (key.trim() === "okumaSuresi") metadata.okumaSuresi = parseInt(value, 10);
    if (key.trim() === "kategori") metadata.kategori = value;
    if (key.trim() === "etiketler") {
      metadata.etiketler = value.split(",").map((e) => e.trim());
    }
    if (key.trim() === "kapakGorsel") metadata.kapakGorsel = value || undefined;
  });

  if (!metadata.slug || !metadata.baslik || !metadata.ozet) {
    throw new Error("Eksik alanlar: slug, baslik, ozet zorunlu");
  }

  return {
    frontMatter: metadata as FrontMatter,
    body,
  };
}

/**
 * Markdown content'ini BlogBolum array'ine çevir
 *
 * Başlık tanıma:
 * - "# GİRİŞ" → giris
 * - "## BAŞLIK Adı" → baslik
 * - "## BİLGİ KUTUSU" → bilgi-kutusu
 * - "## SONUÇ" → sonuc
 *
 * Liste tanıma:
 * - "- madde 1\n- madde 2" → liste
 */
function parseContent(body: string): BlogBolum[] {
  const sections: BlogBolum[] = [];
  const lines = body.split("\n");

  let currentSection: Partial<BlogBolum> | null = null;
  let currentText = "";
  let currentMaddeler: string[] = [];

  const flushSection = () => {
    if (!currentSection) return;

    if ((currentSection.tip === "liste" || currentSection.tip === "video-grid") && currentMaddeler.length > 0) {
      currentSection.maddeler = currentMaddeler;
      sections.push(currentSection as BlogBolum);
    } else if (currentText.trim()) {
      currentSection.metin = currentText.trim();
      sections.push(currentSection as BlogBolum);
    }

    currentSection = null;
    currentText = "";
    currentMaddeler = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // # GİRİŞ
    if (line.match(/^#\s+GİRİŞ/i)) {
      flushSection();
      currentSection = { tip: "giris" };
      continue;
    }

    // ## BAŞLIK
    if (line.match(/^##\s+/)) {
      flushSection();
      const heading = line.replace(/^##\s+/, "").trim();

      if (heading.match(/^BİLGİ\s+KUTUSU/i)) {
        currentSection = { tip: "bilgi-kutusu" };
      } else if (heading.match(/^SONUÇ/i)) {
        currentSection = { tip: "sonuc" };
      } else if (heading.match(/^V[İI]DEO/i)) {
        currentSection = { tip: "video-grid" };
      } else {
        currentSection = { tip: "baslik", baslik: heading };
      }
      continue;
    }

    // Madde (- madde) tanıma
    if (line.match(/^-\s+/)) {
      const madde = line.replace(/^-\s+/, "").trim();

      if (currentSection?.tip !== "liste" && currentSection?.tip !== "video-grid") {
        flushSection();
        currentSection = { tip: "liste" };
        currentMaddeler = [];
      }

      currentMaddeler.push(madde);
      continue;
    }

    // Boş satır = paragraf sonu (ama liste devam edebilir)
    if (!line.trim()) {
      if (currentSection?.tip !== "liste") {
        currentText += "\n";
      }
      continue;
    }

    // Normal metin
    if (currentSection) {
      currentText += (currentText ? " " : "") + line.trim();
    }
  }

  flushSection();

  // Validasyon
  if (!sections.some((s) => s.tip === "giris")) {
    throw new Error("# GİRİŞ bölümü zorunlu");
  }
  if (!sections.some((s) => s.tip === "sonuc")) {
    throw new Error("## SONUÇ bölümü zorunlu");
  }

  return sections;
}

/**
 * .md dosyasını BlogYazisi objesine çevir
 */
export function parseBlogMarkdown(content: string): BlogYazisi {
  const { frontMatter, body } = parseFrontMatter(content);
  const icerik = parseContent(body);

  return {
    slug: frontMatter.slug,
    baslik: frontMatter.baslik,
    ozet: frontMatter.ozet,
    yayinTarihi: frontMatter.yayinTarihi,
    guncellemeTarihi: frontMatter.guncellemeTarihi,
    yazarAdi: frontMatter.yazarAdi,
    okumaSuresi: frontMatter.okumaSuresi,
    kategori: frontMatter.kategori,
    etiketler: frontMatter.etiketler,
    kapakGorsel: frontMatter.kapakGorsel,
    icerik,
  };
}

/**
 * posts/ klasöründeki tüm .md dosyalarını oku ve BlogYazisi array'ine çevir
 */
export async function loadBlogPostsFromMarkdown(): Promise<BlogYazisi[]> {
  const postsDir = path.join(process.cwd(), "app/blog/posts");
  const files = await readdir(postsDir);

  const mdFiles = files.filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  const yazis: BlogYazisi[] = [];

  for (const file of mdFiles) {
    try {
      const filePath = path.join(postsDir, file);
      const content = await readFile(filePath, "utf-8");
      const yazi = parseBlogMarkdown(content);
      yazis.push(yazi);
    } catch (error) {
      console.error(`Error parsing ${file}:`, error);
    }
  }

  // Tarih'e göre sırala (yeni yazılar başta)
  yazis.sort((a, b) => new Date(b.yayinTarihi).getTime() - new Date(a.yayinTarihi).getTime());

  return yazis;
}
