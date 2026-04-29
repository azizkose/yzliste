import type { Metadata } from "next";
import Link from "next/link";
import { FileQuestion } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: { absolute: "Sayfa bulunamadı | yzliste" },
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] bg-rd-neutral-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-sm w-full text-center">
          <FileQuestion
            size={64}
            strokeWidth={1.5}
            className="text-rd-neutral-300 mx-auto mb-6"
            aria-hidden="true"
          />
          <h1
            className="text-2xl font-medium text-rd-neutral-900 mb-3"
            style={{ fontFamily: "var(--font-rd-display)" }}
          >
            Sayfa bulunamadı
          </h1>
          <p className="text-sm text-rd-neutral-500 mb-8 leading-relaxed">
            Aradığın sayfa taşınmış veya hiç var olmamış olabilir.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-rd-primary-700 hover:bg-rd-primary-800 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              Anasayfaya dön
            </Link>
            <Link
              href="/uret"
              className="border border-rd-neutral-300 hover:border-rd-primary-400 text-rd-neutral-700 hover:text-rd-primary-700 font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              Üretmeye başla
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
