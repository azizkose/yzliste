import { redirect } from 'next/navigation'

// Araç şu an / yolunda. /app URL'si oraya yönlendiriyor.
// İleride araç içeriği buraya taşınacak.
export default function AppPage() {
  redirect('/')
}
