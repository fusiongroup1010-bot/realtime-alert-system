'use client';
import { Search, Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function TopNav() {
  const pathname = usePathname();
  
  const getPageName = () => {
    if (pathname === '/') return 'Dashboard';
    if (pathname.startsWith('/rules')) return 'Rule Management';
    if (pathname.startsWith('/audit')) return 'Audit Logs';
    if (pathname.startsWith('/shifts')) return 'Shift Management';
    return 'Admin';
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-xl font-semibold text-slate-800">{getPageName()}</h1>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-slate-50"
          />
        </div>
        
        <button className="p-2 relative text-slate-500 hover:text-blue-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
