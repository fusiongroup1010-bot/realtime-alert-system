'use client';
import { LayoutDashboard, Settings, ScrollText, Users, BellRing } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Rules', href: '/rules', icon: Settings },
    { name: 'Audit Logs', href: '/audit', icon: ScrollText },
    { name: 'Shifts', href: '/shifts', icon: Users },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <BellRing className="w-6 h-6 text-blue-500 mr-2" />
        <span className="font-bold text-lg tracking-wide">Hi Fusion</span>
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <li key={link.name}>
                <Link 
                  href={link.href}
                  className={clsx(
                    "flex items-center px-3 py-2.5 rounded-md transition-colors text-sm font-medium",
                    isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">
            AD
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-slate-400">CEO / System</p>
          </div>
        </div>
      </div>
    </div>
  );
}
