'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, ListChecks, User, Code2, GraduationCap, Menu } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

const NAV_ITEMS = [
  { href: '/problem-list', label: 'Problems', icon: ListChecks },
  { href: '/student-plan', label: 'Student Plan', icon: GraduationCap },
  { href: '/problem-detail', label: 'Problem Detail', icon: Code2 },
  { href: '/progress', label: 'Progress', icon: BarChart3 },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function CollapsibleSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const onResize = () => setCollapsed(window.innerWidth < 1100);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <aside
      className={`flex flex-col border-r border-zinc-800 bg-zinc-900/70 backdrop-blur-sm transition-all duration-300 ease-in-out z-20 ${
        collapsed ? 'w-14' : 'w-64'
      }`}
    >
      <div className={`flex items-center ${collapsed ? 'justify-center px-2 py-3' : 'justify-between px-3 py-3'} border-b border-zinc-800`}>
        <div className="flex items-center gap-3">
          <AppLogo size={20} />
          {!collapsed && <span className="text-zinc-100 font-semibold tracking-tight">AlgoFirst</span>}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed((s) => !s)}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={16} />
          </button>
        )}
      </div>

      <nav className={`flex-1 ${collapsed ? 'p-2 space-y-1' : 'p-2 space-y-1.5'}`}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center transition-colors ${collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'} rounded-md ${
                active
                  ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
              }`}
            >
              <Icon size={16} />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-zinc-800">
        {!collapsed ? (
          <div className="text-xs text-zinc-500">Tip: Press the menu icon to collapse</div>
        ) : (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-100"
            aria-label="Expand sidebar"
          >
            <Menu size={15} />
          </button>
        )}
      </div>
    </aside>
  );
}
