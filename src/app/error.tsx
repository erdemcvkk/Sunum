'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-red-50 p-4 rounded-full mb-6">
        <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
        Bir Hata Oluştu
      </h2>
      <p className="text-gray-500 mt-3 max-w-md text-sm sm:text-base leading-relaxed">
        Beklenmedik bir hata meydana geldi. Lütfen tekrar deneyin veya ana sayfaya dönün.
      </p>
      <div className="flex gap-3 mt-8">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-fantas-blue text-white font-bold px-6 py-3 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 text-sm"
        >
          Tekrar Dene
        </button>
        <a
          href="/"
          className="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-700 font-bold px-6 py-3 rounded-full hover:border-fantas-blue hover:text-fantas-blue transition-all text-sm"
        >
          Ana Sayfa
        </a>
      </div>
    </div>
  );
}
