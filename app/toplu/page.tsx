import { redirect } from "next/navigation";

export default function TopluPage() {
  redirect("/uret?tab=metin&giris=excel");
}
