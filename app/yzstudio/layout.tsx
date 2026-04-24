import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "yzstudio — Premium AI Görsel Araçları | yzliste",
  description: "Mankenlere kıyafet giydirme, stüdyo çekimi ve daha fazlası. yzliste premium AI görsel araçları.",
  robots: { index: false, follow: false },
};

export default function YzstudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
