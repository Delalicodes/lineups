'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-900 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 max-w-4xl w-full border border-green-100/30 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/5 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-100/10 via-transparent to-transparent opacity-70" />
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center mb-8 sm:mb-12 bg-gradient-to-r from-green-700 via-green-600 to-green-500 bg-clip-text text-transparent drop-shadow-sm">
          Football Lineup Manager
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 relative z-10">
          <Link 
            href="/setup"
            className="group bg-gradient-to-br from-white to-green-50/80 border-2 border-green-200/50 rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:border-green-400/70 hover:shadow-xl hover:shadow-green-900/10 flex flex-col items-center relative overflow-hidden transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-green-50/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative bg-gradient-to-br from-green-100/50 to-white rounded-2xl p-4 mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
              <Image
                src="/file.svg"
                alt="Setup"
                width={80}
                height={80}
                className="relative z-10 drop-shadow-sm"
              />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-3 relative z-10 drop-shadow-sm">
              Team Setup
            </h2>
            <p className="text-gray-600 text-center relative z-10 text-sm sm:text-base">
              Create and manage your teams, players, and formations
            </p>
          </Link>

          <Link
            href="/lineup"
            className="group bg-gradient-to-br from-white to-green-50/80 border-2 border-green-200/50 rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:border-green-400/70 hover:shadow-xl hover:shadow-green-900/10 flex flex-col items-center relative overflow-hidden transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_var(--tw-gradient-stops))] from-green-50/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative bg-gradient-to-br from-green-100/50 to-white rounded-2xl p-4 mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
              <Image
                src="/window.svg"
                alt="Lineup"
                width={80}
                height={80}
                className="relative z-10 drop-shadow-sm"
              />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-3 relative z-10 drop-shadow-sm">
              View Lineup
            </h2>
            <p className="text-gray-600 text-center relative z-10 text-sm sm:text-base">
              Visualize your team formations on the field
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}