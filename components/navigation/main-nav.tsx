'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, AlertTriangle, Shield, MessageSquare, ClipboardList, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { href: '/checkin', label: 'Check In', icon: Shield },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/requests', label: 'Requests', icon: MessageSquare },
  { href: '/tasks', label: 'Tasks', icon: ClipboardList },
  { href: '/bulletins', label: 'Bulletins', icon: MessageSquare },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 border-r bg-card p-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

