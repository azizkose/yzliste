"use client";
import { useState } from "react";
import { Share2, Link2 } from "lucide-react";
import Toast, { type ToastMessage } from "@/components/primitives/Toast";

interface Props {
  url: string;
  title: string;
}

export default function BlogPaylas({ url, title }: Props) {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const fullUrl = `https://www.yzliste.com${url}`;

  const handleKopyala = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setToast({ id: "copy", type: "success", message: "Link kopyalandı" });
    } catch {
      setToast({ id: "copy-err", type: "error", message: "Kopyalanamadı" });
    }
  };

  return (
    <>
      <Toast toast={toast} onDismiss={() => setToast(null)} />
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs text-rd-neutral-500">
          <Share2 size={13} strokeWidth={1.5} aria-hidden="true" />
          Paylaş:
        </span>
        <a
          href={`https://x.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X'te paylaş"
          className="size-9 rounded-lg bg-rd-neutral-100 hover:bg-rd-primary-50 flex items-center justify-center transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4 fill-current text-rd-neutral-700"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn'de paylaş"
          className="size-9 rounded-lg bg-rd-neutral-100 hover:bg-rd-primary-50 flex items-center justify-center transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4 fill-current text-rd-neutral-700"
            aria-hidden="true"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
        <button
          type="button"
          onClick={handleKopyala}
          aria-label="Linki kopyala"
          className="size-9 rounded-lg bg-rd-neutral-100 hover:bg-rd-primary-50 flex items-center justify-center transition-colors"
        >
          <Link2
            size={15}
            strokeWidth={1.5}
            className="text-rd-neutral-700"
            aria-hidden="true"
          />
        </button>
      </div>
    </>
  );
}
