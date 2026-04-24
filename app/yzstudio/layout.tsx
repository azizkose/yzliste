import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "yzstudio — Premium Araçlar",
  description: "Mankene giydirme, premium video ve deneysel AI araçları.",
  robots: { index: false, follow: false },
};

export default function YzstudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
