import React from 'react';

export default function Header() {
  return (
    <header className="w-full py-8 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">PDF → HTML5 Flipbook</h1>
          <p className="text-slate-300 mt-1 text-sm sm:text-base">Create a single-file, password-protected flipbook with realistic page turns.</p>
        </div>
        <div className="hidden sm:block text-slate-300 text-sm">Optimized for phones • Swipe the page edge</div>
      </div>
    </header>
  );
}
