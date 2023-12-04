import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/material.css'
import '@/styles/globals.css'

import Providers from '@/components/Providers'
import AuthContext from '@/components/Authentication/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Social events',
  description: 'App to create and share social events in a company',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <Providers>
        <main>
          {/* <NextIntlClientProvider messages={messages}> */}
            <AuthContext>
              {children}
            </AuthContext>
          {/* </NextIntlClientProvider> */}
        </main>
        </Providers>
      </body>
    </html>
  )
}
