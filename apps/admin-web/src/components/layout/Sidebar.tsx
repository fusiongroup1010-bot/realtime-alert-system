'use client';
import { LayoutDashboard, ShieldAlert, Settings, ScrollText, Upload, Puzzle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import { useAppContext } from '@/context/AppContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUserRole } = useAppContext();

  const userProfile = currentUserRole === 'Manager' 
    ? { name: 'Trần Thị Quản Lý', id: 'ID-MGR-01', initials: 'TL' }
    : { name: 'Nguyễn Văn A', id: 'ID-EXEC-01', initials: 'VA' };

  const menuGroups = [
    {
      title: 'VẬN HÀNH / OPERATIONS',
      items: [
        { name: 'Tháp Điều Khiển / Control Tower', href: '/', icon: LayoutDashboard },
        { name: 'Sự Cố Trực Tiếp / Live Incidents', href: '/incidents', icon: ShieldAlert },
        { name: 'Bộ Quy Tắc / Rule Engine', href: '/rules', icon: Settings },
      ]
    },
    {
      title: 'DỮ LIỆU / DATA',
      items: [
        { name: 'Nạp Dữ Liệu / Data Upload', href: '/integrations', icon: Upload },
        { name: 'Nhật Ký Hệ Thống / Audit History', href: '/audit', icon: ScrollText },
      ]
    },
  ];

  return (
    <div className="w-[260px] h-full bg-background border-r border-borderSubtle flex flex-col shrink-0 z-20">
      <div className="h-[72px] flex items-center px-6 border-b border-borderSubtle">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">Alert System</span>
      </div>
      
      <div className="px-6 py-4 border-b border-borderSubtle flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-resolved shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulseFast" />
          <span className="text-xs font-semibold tracking-wider text-resolved uppercase">Hệ Thống Ổn Định / System Healthy</span>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-8 px-4">
            <h3 className="text-[10px] font-bold text-textSecondary uppercase tracking-widest px-3 mb-3">
              {group.title}
            </h3>
            <ul className="space-y-1">
              {group.items.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                
                return (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="relative block"
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="sidebar-active"
                          className="absolute inset-0 bg-white/5 rounded-lg border border-white/10"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <div className={clsx(
                        "relative flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm font-medium z-10",
                        isActive ? "text-white" : "text-textSecondary hover:text-white"
                      )}>
                        <Icon className={clsx("w-[18px] h-[18px] mr-3", isActive ? "text-accentGlow" : "opacity-70")} />
                        {link.name}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      
      <div className="p-4 border-t border-borderSubtle">
        <div className="flex items-center bg-surface/50 p-3 rounded-xl border border-borderSubtle hover:bg-surface transition-colors cursor-pointer group">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-sm font-bold text-indigo-400 group-hover:bg-indigo-500/30 transition-colors">
              {userProfile.initials}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-resolved rounded-full border-2 border-background"></div>
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{userProfile.name}</p>
            <p className="text-xs text-textSecondary truncate">{userProfile.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
