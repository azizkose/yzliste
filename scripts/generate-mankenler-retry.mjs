/**
 * Yarı boy çıkan mankenler için retry — güçlendirilmiş tam boy prompt
 */
import { fal } from "@fal-ai/client";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../public/mankenler");
mkdirSync(OUT_DIR, { recursive: true });

fal.config({ credentials: process.env.FAL_KEY });

const BASE = "full length fashion model photo showing entire body from top of head to feet, legs fully visible, feet on ground, white seamless studio background, soft studio lighting, face clearly visible, standing straight, arms at sides";

const MANKENLER = [
  {
    dosya: "kadin-1",
    prompt: `${BASE}, young woman, light fair caucasian skin, slim build, long dark straight hair, wearing plain white t-shirt and light blue jeans, full body visible including legs and feet, editorial fashion photography, professional studio shot, 3:4 portrait ratio`,
  },
  {
    dosya: "kadin-2",
    prompt: `${BASE}, young woman, medium olive tan skin, average build, shoulder length wavy brown hair, wearing simple black midi dress, full body visible including legs and feet, warm friendly smile, editorial fashion photography, professional studio shot, 3:4 portrait ratio`,
  },
  {
    dosya: "erkek-2",
    prompt: `${BASE}, young man, medium olive skin, average build, short dark hair, slight beard, wearing grey t-shirt and blue jeans, hands relaxed at sides, full body visible including legs and feet, friendly expression, editorial fashion photography, professional studio shot, 3:4 portrait ratio`,
  },
];

async function gorselIndir(url, dosyaYolu) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`İndirme hatası: ${res.status}`);
  const buf = await res.arrayBuffer();
  writeFileSync(dosyaYolu, Buffer.from(buf));
}

async function main() {
  console.log(`${MANKENLER.length} manken yeniden üretiliyor...\n`);
  for (const manken of MANKENLER) {
    console.log(`Üretiliyor: ${manken.dosya}...`);
    try {
      const result = await fal.subscribe("fal-ai/flux-pro/v1.1", {
        input: {
          prompt: manken.prompt,
          image_size: { width: 768, height: 1280 }, // Daha uzun — ayakları sığdırmak için
          num_inference_steps: 28,
          guidance_scale: 3.5,
          num_images: 1,
          safety_tolerance: "5",
        },
        logs: false,
      });
      const imageUrl = result?.data?.images?.[0]?.url;
      if (!imageUrl) throw new Error("URL alınamadı");
      const dosyaYolu = join(OUT_DIR, `${manken.dosya}.jpg`);
      await gorselIndir(imageUrl, dosyaYolu);
      console.log(`  ✓ ${manken.dosya}.jpg güncellendi`);
    } catch (e) {
      console.error(`  ✗ ${manken.dosya} HATA:`, e.message);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log("\nTamamlandı!");
}

main();
