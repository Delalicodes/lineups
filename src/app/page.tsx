'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-800 to-green-900 flex items-center justify-center p-8">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-12 max-w-4xl w-full border border-green-100">
        <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
          Football Lineup Manager
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link 
            href="/setup"
            className="group bg-white border-2 border-green-200 rounded-xl p-8 transition-all duration-300 hover:bg-green-50 hover:border-green-400 hover:shadow-xl flex flex-col items-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Image
              src="/file.svg"
              alt="Setup"
              width={80}
              height={80}
              className="mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10"
            />
            <h2 className="text-2xl font-bold text-green-800 mb-3 relative z-10">Team Setup</h2>
            <p className="text-gray-600 text-center relative z-10">
              Create and manage your teams, players, and formations
            </p>
          </Link>

          <Link
            href="/lineup"
            className="group bg-white border-2 border-green-200 rounded-xl p-8 transition-all duration-300 hover:bg-green-50 hover:border-green-400 hover:shadow-xl flex flex-col items-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Image
              src="/window.svg"
              alt="Lineup"
              width={80}
              height={80}
              className="mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10"
            />
            <h2 className="text-2xl font-bold text-green-800 mb-3 relative z-10">View Lineup</h2>
            <p className="text-gray-600 text-center relative z-10">
              Visualize your team formations on the field
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}