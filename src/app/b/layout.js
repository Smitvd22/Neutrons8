import { Inter } from "next/font/google"
import "@/app/globals.css"
import { Sidebar } from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "HealthScribe - Your Health Assistant",
  description: "Analyze symptoms, understand prescriptions, and get health advice",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-main min-h-screen`}>
        <Sidebar />
        <main className="ml-64 p-6">{children}</main>
      </body>
    </html>
  )
}

