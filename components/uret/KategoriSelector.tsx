"use client"

import { Shirt, ShoppingBag, Sparkles, Gem, Home, Cpu, Baby, Gift, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UstKategori } from "@/lib/constants/kategori-mapping"

const KATEGORILER: {
  id: UstKategori
  label: string
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
  aciklama: string
}[] = [
  { id: "giyim",          label: "Giyim",            Icon: Shirt,        aciklama: "Tişört, gömlek, kazak, elbise" },
  { id: "ayakkabi_canta", label: "Ayakkabı/Çanta",   Icon: ShoppingBag,  aciklama: "Ayakkabı, bot, çanta, cüzdan" },
  { id: "kozmetik",       label: "Kozmetik/Bakım",   Icon: Sparkles,     aciklama: "Krem, parfüm, makyaj" },
  { id: "taki_aksesuar",  label: "Takı/Aksesuar",    Icon: Gem,          aciklama: "Kolye, küpe, yüzük, saat" },
  { id: "ev_dekor",       label: "Ev & Dekor",       Icon: Home,         aciklama: "Mutfak, dekor, halı, mum" },
  { id: "elektronik",     label: "Elektronik",       Icon: Cpu,          aciklama: "Telefon aks., kulaklık, küçük alet" },
  { id: "bebek_oyuncak",  label: "Bebek & Oyuncak",  Icon: Baby,         aciklama: "Bebek bakım, oyuncak, eğitici" },
  { id: "gida_hediye",    label: "Gıda & Hediye",    Icon: Gift,         aciklama: "Çikolata, kahve, çiçek, hediye" },
  { id: "diger",          label: "Diğer",            Icon: Package,      aciklama: "Spor, evcil, hobi, otomotiv" },
]

interface Props {
  value: UstKategori | null
  onChange: (k: UstKategori) => void
  zorunlu?: boolean
}

export default function KategoriSelector({ value, onChange, zorunlu }: Props) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-rd-neutral-600">
        Ürün tipi <span className="text-rd-danger-700">*</span>
        {zorunlu && (
          <span className="ml-1 text-xs text-rd-neutral-500 font-normal">(tüm içerik türleri için zorunlu)</span>
        )}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {KATEGORILER.map(({ id, label, Icon, aciklama }) => {
          const secili = value === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-pressed={secili}
              className={cn(
                "flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border transition-colors text-center",
                secili
                  ? "border-rd-primary-700 bg-rd-primary-50 text-rd-primary-700"
                  : "border-rd-neutral-200 bg-white text-rd-neutral-600 hover:bg-rd-neutral-50 hover:border-rd-neutral-300"
              )}
            >
              <Icon size={18} strokeWidth={1.5} />
              <span className="text-xs font-medium leading-tight">{label}</span>
              <span className="text-xs text-rd-neutral-400 leading-tight hidden sm:block">{aciklama}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { KATEGORILER }
export type { UstKategori }
