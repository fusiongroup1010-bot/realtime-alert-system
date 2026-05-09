'use client';
import { Search, Bell, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

export default function TopNav() {
  const pathname = usePathname();
  const { selectedDate, setSelectedDate, currentTime, currentUserRole, setCurrentUserRole } = useAppContext();
  
  const getPageName = () => {
    if (pathname === '/') return { vi: 'Tháp Điều Khiển', en: 'Control Tower' };
    if (pathname.startsWith('/incidents')) return { vi: 'Sự Cố Trực Tiếp', en: 'Live Incidents' };
    if (pathname.startsWith('/rules')) return { vi: 'Bộ Quy Tắc', en: 'Rule Engine' };
    if (pathname.startsWith('/audit')) return { vi: 'Nhật Ký Hệ Thống', en: 'Audit History' };
    if (pathname.startsWith('/health')) return { vi: 'Sức Khỏe Hệ Thống', en: 'System Health' };
    if (pathname.startsWith('/shifts')) return { vi: 'Lịch Trực', en: 'Shift Roster' };
    if (pathname.startsWith('/integrations')) return { vi: 'Tích Hợp', en: 'Integrations' };
    return { vi: 'Bảng Điều Khiển', en: 'Dashboard' };
  };

  const pageName = getPageName();

  return (
    <header className="h-[72px] bg-background/80 backdrop-blur-md border-b border-borderSubtle flex items-center justify-between px-6 md:px-10 shrink-0 sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-white tracking-tight flex flex-col leading-tight">
          <span>{pageName.vi}</span>
          <span className="text-[10px] text-textSecondary uppercase font-medium">{pageName.en}</span>
        </h1>
        <div className="hidden md:flex items-center px-2 py-1 rounded bg-surface border border-borderSubtle">
          <span className="text-xs text-textSecondary font-mono">Hi Fusion / {pageName.en.toLowerCase().replace(' ', '-')}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        {/* Real-time Clock */}
        <div className="hidden lg:flex flex-col items-end px-3 py-1.5 bg-surface/50 border border-borderSubtle rounded-xl min-w-[120px]">
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-accentGlow" />
            <span className="text-sm font-mono font-bold text-white leading-none">{currentTime}</span>
          </div>
          <span className="text-[8px] text-textSecondary uppercase mt-1">Giờ hệ thống / Local Time</span>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center bg-surface border border-borderSubtle rounded-xl px-3 py-1.5 space-x-2 hover:border-accentGlow transition-colors">
          <div className="flex flex-col">
            <span className="text-[8px] text-textSecondary uppercase font-bold leading-tight">Quyền / Role</span>
            <select 
              value={currentUserRole}
              onChange={(e) => setCurrentUserRole(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              <option value="Executor" className="bg-surface text-white">Executor</option>
              <option value="Manager" className="bg-surface text-white">Manager</option>
            </select>
          </div>
        </div>

        {/* Date Picker / Calendar */}
        <div className="flex items-center bg-surface border border-borderSubtle rounded-xl px-3 py-1.5 space-x-2 hover:border-accentGlow transition-colors group cursor-pointer">
          <CalendarIcon className="w-4 h-4 text-textSecondary group-hover:text-white transition-colors" />
          <div className="flex flex-col">
            <span className="text-[8px] text-textSecondary uppercase font-bold leading-tight">Ngày xem / View Date</span>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer [color-scheme:dark]"
            />
          </div>
        </div>

        <button className="p-2 relative text-textSecondary hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-p1 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulseFast"></span>
        </button>
      </div>
    </header>
  );
}

