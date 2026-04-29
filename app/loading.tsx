import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-screen bg-rd-neutral-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2
          size={32}
          strokeWidth={1.5}
          className="text-rd-primary-700 animate-spin"
          aria-hidden="true"
        />
        <p className="text-sm text-rd-neutral-500">Yükleniyor...</p>
      </div>
    </main>
  );
}
