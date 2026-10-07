import type { Metadata } from "next"
import AdminUnavailable from "../admin/login-info"

export const metadata: Metadata = {
  title: "Administration unavailable | CICA",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export default function AdminLoginInfoPage() {
  return <AdminUnavailable />
}
