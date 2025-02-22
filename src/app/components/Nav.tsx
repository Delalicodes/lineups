'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-green-700 text-white' : 'text-green-800 hover:bg-green-50';
  };

  return (
    <nav className="bg-white shadow-md mb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-green-800">
              Football Lineup
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded-md transition-colors ${isActive('/')}`}
            >
              Home
            </Link>
            <Link
              href="/setup"
              className={`px-4 py-2 rounded-md transition-colors ${isActive('/setup')}`}
            >
              Team Setup
            </Link>
            <Link
              href="/lineup"
              className={`px-4 py-2 rounded-md transition-colors ${isActive('/lineup')}`}
            >
              View Lineup
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}