import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/app/components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Plataforma de Recetas",
    description: "Las mejores recetas",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="es">
            <body className={`${inter.className} bg-slate-900 text-slate-100 min-h-screen`}>
                <Navbar />
                {children}
            </body>
        </html>
    )
}