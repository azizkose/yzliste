/**
 * Default manken görseli üretici — fal-ai/flux-pro/v1.1
 * Çalıştır: node scripts/generate-mankenler.mjs
 * Çıktı: public/mankenler/kadin-1.jpg ... erkek-3.jpg
 */

import { fal } from "@fal-ai/client";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../public/mankenler");

mkdirSync(OUT_DIR, { recursive: true });

fal.config({ credentials: process.env.FAL_KEY });

const MANKENLER = [
  {
    dosya: "kadin-1",
    prompt: "Full body professional female fashion model, light fair skin, slim slender build, tall, long straight dark hair, standing straight facing camera, head to toe full body shot, white seamless studio cyclorama background, soft even studio lighting, face clearly visible, natural relaxed pose, arms at sides, neutral expression, simple fitted white t-shirt and light blue jeans, high quality fashion photography editorial style, sharp focus, no text, no watermark",
  },
  {
    dosya: "kadin-2",
    prompt: "Full body professional female fashion model, medium olive tan skin, average medium build, shoulder length wavy brown hair, standing straight facing camera, head to toe full body shot, white seamless studio cyclorama background, soft even studio lighting, face clearly visible, natural relaxed pose, arms slightly out, warm smile, simple black dress, high quality fashion photography editorial style, sharp focus, no text, no watermark",
  },
  {
    dosya: "kadin-3",
    prompt: "Full body professional female fashion model, dark brown skin, curvy full figure build, natural afro hair, standing straight facing camera, head to toe full body shot, white seamless studio cyclorama background, soft even studio lighting, face clearly visible, confident natural pose, arms at sides, bright confident expression, simple beige fitted outfit, high quality fashion photography editorial style, sharp focus, no text, no watermark",
  },
  {
    dosya: "erkek-1",
    prompt: "Full body professional male fashion model, light fair skin, athletic fit build, short neat brown hair, standing straight facing camera, head to toe full body shot, white seamless studio cyclorama background, soft even studio lighting, face clearly visible, natural relaxed pose, arms at sides, neutral confident expression, simple white shirt and dark chinos, high quality fashion photography editorial style, sharp focus, no text, no watermark",
  },
  {
    dosya: "erkek-2",
    prompt: "Full body professional male fashion model, medium olive skin, average build, short dark hair, slight beard stubble, standing straight facing camera, head to toe full body shot, white seamless studio cyclorama background, soft even studio lighting, face clearly visible, relaxed natural pose, hands in pockets, friendly expression, simple grey t-shirt and blue jeans, high quality fashion photography editorial style, sharp focus, no text, no watermark",
  },
  {
    dosya: "erkek-3",
    prompt: "Full body professional male fashion model, dark brown skin, athletic muscular build, very short cropped hair, standing straight facing camera, head to toe full body shot, white seamless studio cyclorama background, soft even studio lighting, face clearly visible, confident upright pose, arms at sides, strong confident expression, simple black polo shirt and black trousers, high quality fashion photography editorial style, sharp focus, no text, no watermark",
  },
];

async function gorselIndir(url, dosyaYolu) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`İndirme hatası: ${res.status}`);
  const buf = await res.arrayBuffer();
  writeFileSync(dosyaYolu, Buffer.from(buf));
}

async function main() {
  console.log(`${MANKENLER.length} manken üretiliyor...\n`);

  for (const manken of MANKENLER) {
    console.log(`Üretiliyor: ${manken.dosya}...`);
    try {
      const result = await fal.subscribe("fal-ai/flux-pro/v1.1", {
        input: {
          prompt: manken.prompt,
          image_size: { width: 768, height: 1152 },
          num_inference_steps: 28,
          guidance_scale: 3.5,
          num_images: 1,
          safety_tolerance: "5",
        },
        logs: false,
      });

      const imageUrl = result?.data?.images?.[0]?.url;
      if (!imageUrl) throw new Error("Görsel URL'i alınamadı");

      const dosyaYolu = join(OUT_DIR, `${manken.dosya}.jpg`);
      await gorselIndir(imageUrl, dosyaYolu);
      console.log(`  ✓ ${manken.dosya}.jpg kaydedildi (${imageUrl.substring(0, 60)}...)`);
    } catch (e) {
      console.error(`  ✗ ${manken.dosya} HATA:`, e.message);
    }

    // Rate limit için kısa bekleme
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("\nTamamlandı! public/mankenler/ klasörünü kontrol edin.");
}

main();
