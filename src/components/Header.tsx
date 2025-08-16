'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import { LanguageToggle } from './LanguageToggle';
import { Home, Bot, Bookmark } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = translations[language];

  const navItems = [
    { href: '/', label: t.navHome, icon: Home },
    { href: '/advisor', label: t.navAdvisor, icon: Bot },
    { href: '/bookmarks', label: t.navBookmarks, icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 no-print">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6 text-primary">
              <rect width="256" height="256" fill="none"></rect>
              <path d="M128,24a104,104,0,1,0,104,104A104.2,104.2,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm28-56H100a12,12,0,0,1-12-12V108a12,12,0,0,1,12-12h40a12,12,0,0,1,12,12v40A12,12,0,0,1,156,160Zm-44-12h20" fill="currentColor"></path>
            </svg>
            <span className="font-bold font-headline">{t.appName as string}</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-primary',
                pathname === item.href ? 'text-primary' : 'text-foreground/60'
              )}
            >
              {item.label as string}
            </Link>
          ))}
        </nav>
        <nav className="flex md:hidden items-center space-x-4 text-sm font-medium flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-primary p-2',
                pathname === item.href ? 'text-primary' : 'text-foreground/60'
              )}
              aria-label={item.label as string}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-end">
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
