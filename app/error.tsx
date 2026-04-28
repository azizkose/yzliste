"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import * as Sentry from "@sentry/nextjs";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-rd-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <AlertTriangle
          size={64}
          strokeWidth={1.5}
          className="text-rd-warning-600 mx-auto mb-6"
          aria-hidden="true"
        />
        <h1
          className="text-2xl font-medium text-rd-neutral-900 mb-3"
          style={{ fontFamily: "var(--font-rd-display)" }}
        >
          Bir şeyler ters gitti
        </h1>
        <p className="text-sm text-rd-neutral-500 mb-8 leading-relaxed">
          Hatamız için özür dileriz. Tekrar denersen düzelir, ya da{" "}
          <a
            href="mailto:destek@yzliste.com"
            className="text-rd-primary-600 hover:text-rd-primary-700 underline underline-offset-2"
          >
            destek@yzliste.com
          </a>
          &apos;a yaz.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="bg-rd-primary-700 hover:bg-rd-primary-800 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            Tekrar dene
          </button>
          <Link
            href="/"
            className="border border-rd-neutral-300 hover:border-rd-primary-400 text-rd-neutral-700 hover:text-rd-primary-700 font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            Anasayfa
          </Link>
        </div>
      </div>
    </main>
  );
}
