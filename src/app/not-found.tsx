import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-8xl sm:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fantas-blue to-indigo-600 tracking-tighter">
        404
      </h1>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4">
        Sayfa Bulunamadı
      </h2>
      <p className="text-gray-500 mt-3 max-w-md text-sm sm:text-base leading-relaxed">
        Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 bg-fantas-blue text-white font-bold px-8 py-3.5 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 text-sm"
      >
        ← Ana Sayfaya Dön
      </Link>
    </div>
  );
}
