export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-100 rounded-full" />
        <div className="w-16 h-16 border-4 border-fantas-blue border-t-transparent rounded-full animate-spin absolute inset-0" />
      </div>
      <p className="mt-6 text-sm font-semibold text-gray-400 tracking-wider uppercase animate-pulse">
        Yükleniyor...
      </p>
    </div>
  );
}
