import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import React from 'react'
import { ReactQueryProvider } from '../react-query-provider'
import '../globals.css'
import UnAuthenticatedNavBar from '@/components/unauthenticated-navbar'

export const metadata: Metadata = {
    title: 'TeachFlow',
    icons: {
        icon: '/teachflow-logo.ico',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <ReactQueryProvider>
                <body>
                    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
                        <UnAuthenticatedNavBar />

                        {children}
                    </div>

                    <Toaster richColors closeButton position="top-right" />
                </body>
            </ReactQueryProvider>
        </html>
    )
}
