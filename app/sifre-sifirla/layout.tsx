import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Şifre sıfırla",
  robots: { index: false, follow: false },
};

export default function SifreSifirlaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
