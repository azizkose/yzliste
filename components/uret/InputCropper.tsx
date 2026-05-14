"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Crop, Check } from "lucide-react"
import type { Kategori } from "@/lib/fal/prompts/index"

interface InputCropperProps {
  imageBase64: string
  kategori: Kategori | null
  onCropDone: (croppedBase64: string) => void
  onSkip: () => void
}

const KATEGORI_ASPECT: Record<Kategori, number> = {
  giyim: 2 / 3,
  ayakkabi_canta: 1,
  kozmetik: 1,
  taki_aksesuar: 1,
  genel: 1,
}

export default function InputCropper({ imageBase64, kategori, onCropDone, onSkip }: InputCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  const aspect = kategori ? KATEGORI_ASPECT[kategori] : 1

  const onCropComplete = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_: any, areaPixels: any) => {
      setCroppedAreaPixels(areaPixels)
    },
    []
  )

  async function applyCrop() {
    if (!croppedAreaPixels) return
    const cropped = await getCroppedImg(imageBase64, croppedAreaPixels)
    onCropDone(cropped)
  }

  return (
    <div className="bg-white border border-rd-neutral-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-rd-neutral-700">
        <Crop size={16} strokeWidth={1.5} />
        Ürünü çerçeveye sığdır
      </div>
      <p className="text-xs text-rd-neutral-500">
        Ürünün etrafındaki boş alanı kırpıp doğru oranda sığdır. Daha iyi sonuç için ürün çerçeveyi doldursun.
      </p>

      <div
        className="relative bg-rd-neutral-100 rounded-lg overflow-hidden"
        style={{ height: "min(360px, 75vw)" }}
      >
        <Cropper
          image={imageBase64}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="flex-1"
          aria-label="Zoom"
        />
        <span className="text-xs text-rd-neutral-500 w-12 text-right">{zoom.toFixed(1)}x</span>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onSkip}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-rd-neutral-500 border border-rd-neutral-200 bg-white hover:bg-rd-neutral-50"
        >
          Crop yapma
        </button>
        <button
          type="button"
          onClick={applyCrop}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-rd-primary-800 hover:bg-rd-primary-900 flex items-center gap-1"
        >
          <Check size={12} strokeWidth={2} /> Crop'u uygula
        </button>
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<string> {
  const image = new Image()
  image.src = imageSrc
  await new Promise<void>((r) => {
    image.onload = () => r()
    // Already loaded case
    if (image.complete) r()
  })

  const canvas = document.createElement("canvas")
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  const ctx = canvas.getContext("2d")!
  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y,
    pixelCrop.width, pixelCrop.height,
    0, 0,
    pixelCrop.width, pixelCrop.height,
  )
  return canvas.toDataURL("image/jpeg", 0.92)
}
