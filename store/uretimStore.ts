import { create } from "zustand";

interface UrunPaylasim {
  urunAdi: string;
  kategori: string;
  platform: string;
}

interface UretimStore {
  paylasim: UrunPaylasim;
  setPaylasim: (p: Partial<UrunPaylasim>) => void;
  sifirla: () => void;
}

const BOSLUK: UrunPaylasim = { urunAdi: "", kategori: "", platform: "trendyol" };

export const useUretimStore = create<UretimStore>((set) => ({
  paylasim: { ...BOSLUK },
  setPaylasim: (p) =>
    set((state) => ({ paylasim: { ...state.paylasim, ...p } })),
  sifirla: () => set({ paylasim: { ...BOSLUK } }),
}));
