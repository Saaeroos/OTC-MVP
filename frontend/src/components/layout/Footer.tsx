import React from 'react';

const TEXT = {
  FOOTER: 'OTC Trade Capture MVP',
};

export function Footer() {
  return (
    <footer className="mt-auto py-8 border-t border-zinc-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">{TEXT.FOOTER}</p>
      </div>
    </footer>
  );
}
