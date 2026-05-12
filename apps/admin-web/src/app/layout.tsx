// apps/admin-web/src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { AppProvider } from '@/context/AppContext';
import ThemeWrapper from '@/components/layout/ThemeWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Alert System',
  description: 'Realtime Alert & Escalation System Control Tower',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className={`${inter.className} antialiased`}>
        <AppProvider>
          <ThemeWrapper>
            {children}
          </ThemeWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
