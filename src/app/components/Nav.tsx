'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-green-600 text-white shadow-md' : 'text-green-700 hover:bg-green-50 hover:text-green-600';
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg mb-8 sticky top-0 z-50 border-b border-green-100/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent hover:from-green-600 hover:to-green-500 transition-all duration-300"
            >
              Football Lineup
            </Link>
          </div>
          <div className="hidden sm:flex space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive('/')}`}
            >
              Home
            </Link>
            <Link
              href="/setup"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive('/setup')}`}
            >
              Team Setup
            </Link>
            <Link
              href="/lineup"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive('/lineup')}`}
            >
              View Lineup
            </Link>
            <Link
              href="/match"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive('/match')}`}
            >
              Match Lineup
            </Link>
          </div>
          <div className="sm:hidden flex space-x-1">
            <Link
              href="/"
              className={`p-2 rounded-lg text-sm transition-all duration-300 ${isActive('/')}`}
            >
              Home
            </Link>
            <Link
              href="/setup"
              className={`p-2 rounded-lg text-sm transition-all duration-300 ${isActive('/setup')}`}
            >
              Setup
            </Link>
            <Link
              href="/lineup"
              className={`p-2 rounded-lg text-sm transition-all duration-300 ${isActive('/lineup')}`}
            >
              Lineup
            </Link>
            <Link
              href="/match"
              className={`p-2 rounded-lg text-sm transition-all duration-300 ${isActive('/match')}`}
            >
              Match
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}