// apps/admin-web/src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Alert System',
  description: 'Realtime Alert & Escalation System Control Tower',
};

import { AppProvider } from '@/context/AppContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className={`${inter.className} bg-background text-textPrimary antialiased`}>
        <AppProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden relative">
              <TopNav />
              <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 lg:px-12">
                <div className="max-w-[1600px] mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
