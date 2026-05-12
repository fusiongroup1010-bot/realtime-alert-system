'use client';
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import Login from '@/components/auth/Login';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { currentUserRole, currentUser } = useAppContext();

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className={currentUserRole === 'Manager' ? 'manager-mode h-full' : 'h-full'}>
      <div className="flex h-screen overflow-hidden bg-background transition-colors duration-300">
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
    </div>
  );
}
