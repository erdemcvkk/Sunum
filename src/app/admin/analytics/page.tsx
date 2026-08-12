'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart3, MousePointerClick, Users, TrendingUp, Clock, Trash2, RefreshCw, Globe, ExternalLink } from 'lucide-react';

interface AnalyticsData {
  summary: {
    total: number;
    today: number;
    week: number;
    month: number;
    uniqueVisitors: number;
  };
  topElements: Array<{ trackId: string; text: string; count: number }>;
  pageStats: Array<{ url: string; count: number }>;
  recentClicks: Array<{
    id: string;
    elementType: string;
    elementText: string;
    trackId: string;
    pageUrl: string;
    sessionId: string;
    createdAt: string;
  }>;
  dailyTrend: Array<{ day: string; count: number | bigint }>;
}

const TRACK_LABELS: Record<string, string> = {
  'whatsapp-cta': '💬 WhatsApp İletişim',
  'whatsapp-process': '💬 WhatsApp (Süreç)',
  'hero-designs-btn': '🎨 Tasarımları İncele',
  'hero-packages-btn': '📦 Paketleri Gör',
  'package-buy': '🛒 Paketi Al',
  'package-details': '👁 Paket Detay',
  'nav-anasayfa': '🏠 Nav: Anasayfa',
  'nav-calismalarimiz': '💼 Nav: Çalışmalarımız',
  'nav-galeri': '🖼 Nav: Galeri',
  'nav-paketler': '📦 Nav: Paketler',
  'nav-iletisim': '📞 Nav: İletişim',
  'nav-surucu-kursu': '🚗 Nav: Sürücü Kursu',
  'footer-whatsapp': '💬 Footer WhatsApp',
  'footer-instagram': '📸 Footer Instagram',
  'ready-package-preview': '👁 Hazır Paket Önizleme',
  'ready-package-buy': '🛒 Hazır Paket Al',
  'featured-package-buy': '🔥 Fırsat Paketi Al',
};

function getLabel(trackId: string): string {
  return TRACK_LABELS[trackId] || trackId;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function formatPageUrl(url: string): string {
  if (url === '/') return 'Ana Sayfa';
  if (url === '/surucu-kurslarina-ozel') return 'Sürücü Kurslarına Özel';
  return url;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Analytics fetch error:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClearData = async () => {
    if (!confirm('Tüm analitik verilerini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;
    setClearing(true);
    try {
      await fetch('/api/analytics', { method: 'DELETE' });
      await fetchData();
    } catch (err) {
      console.error('Clear error:', err);
    }
    setClearing(false);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-sm text-gray-500 font-medium">Analitik verileri yükleniyor...</span>
        </div>
      </div>
    );
  }

  const summary = data?.summary || { total: 0, today: 0, week: 0, month: 0, uniqueVisitors: 0 };
  const maxTrend = Math.max(...(data?.dailyTrend?.map(d => Number(d.count)) || [1]));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            Tıklama Analitikleri
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Ziyaretçi etkileşimlerini gerçek zamanlı olarak izleyin
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Yenile
          </button>
          <button
            onClick={handleClearData}
            disabled={clearing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 border border-red-200 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            {clearing ? 'Siliniyor...' : 'Verileri Temizle'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Bugün', value: summary.today, icon: Clock, color: 'blue', bg: 'bg-blue-50', border: 'border-blue-200' },
          { label: 'Bu Hafta', value: summary.week, icon: TrendingUp, color: 'emerald', bg: 'bg-emerald-50', border: 'border-emerald-200' },
          { label: 'Bu Ay', value: summary.month, icon: BarChart3, color: 'purple', bg: 'bg-purple-50', border: 'border-purple-200' },
          { label: 'Toplam', value: summary.total, icon: MousePointerClick, color: 'orange', bg: 'bg-orange-50', border: 'border-orange-200' },
          { label: 'Tekil Ziyaretçi', value: summary.uniqueVisitors, icon: Users, color: 'pink', bg: 'bg-pink-50', border: 'border-pink-200' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-2xl p-4 sm:p-5`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">{stat.value.toLocaleString('tr-TR')}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clicked Elements */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MousePointerClick className="w-5 h-5 text-blue-600" />
            En Çok Tıklanan Elementler
          </h2>
          {(!data?.topElements || data.topElements.length === 0) ? (
            <p className="text-sm text-gray-400 text-center py-8">Henüz veri yok</p>
          ) : (
            <div className="space-y-2.5">
              {data.topElements.map((el, idx) => {
                const maxCount = data.topElements[0]?.count || 1;
                const widthPct = Math.max(8, (el.count / maxCount) * 100);
                return (
                  <div key={`${el.trackId}-${idx}`} className="group">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-semibold text-gray-700 truncate max-w-[250px]">{getLabel(el.trackId)}</span>
                      <span className="font-extrabold text-gray-900 tabular-nums">{el.count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Page Stats */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            Sayfa Bazlı Tıklamalar
          </h2>
          {(!data?.pageStats || data.pageStats.length === 0) ? (
            <p className="text-sm text-gray-400 text-center py-8">Henüz veri yok</p>
          ) : (
            <div className="space-y-3">
              {data.pageStats.map((page, idx) => {
                const maxCount = data.pageStats[0]?.count || 1;
                const widthPct = Math.max(8, (page.count / maxCount) * 100);
                return (
                  <div key={`page-${idx}`}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-semibold text-gray-700 flex items-center gap-1">
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                        {formatPageUrl(page.url)}
                      </span>
                      <span className="font-extrabold text-gray-900 tabular-nums">{page.count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Daily Trend */}
      {data?.dailyTrend && data.dailyTrend.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Son 7 Günlük Trend
          </h2>
          <div className="flex items-end gap-2 h-32">
            {data.dailyTrend.map((day, idx) => {
              const count = Number(day.count);
              const heightPct = Math.max(4, (count / maxTrend) * 100);
              const dayLabel = new Date(day.day).toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric' });
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold text-gray-700 tabular-nums">{count}</span>
                  <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100px' }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-500"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-500">{dayLabel}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Clicks Table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-600" />
          Son Tıklamalar
        </h2>
        {(!data?.recentClicks || data.recentClicks.length === 0) ? (
          <p className="text-sm text-gray-400 text-center py-8">Henüz tıklama verisi yok. Ziyaretçiler siteye geldiğinde burada görünecek.</p>
        ) : (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2.5 pr-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Element</th>
                  <th className="text-left py-2.5 pr-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Sayfa</th>
                  <th className="text-left py-2.5 pr-4 font-bold text-gray-500 text-xs uppercase tracking-wider">Oturum</th>
                  <th className="text-left py-2.5 font-bold text-gray-500 text-xs uppercase tracking-wider">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {data.recentClicks.map((click) => (
                  <tr key={click.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 pr-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">{getLabel(click.trackId)}</span>
                        <span className="text-[11px] text-gray-400 truncate max-w-[200px]">{click.elementText.slice(0, 50)}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                        {formatPageUrl(click.pageUrl)}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className="text-xs text-gray-400 font-mono">{click.sessionId.slice(0, 12)}...</span>
                    </td>
                    <td className="py-2.5">
                      <span className="text-xs text-gray-500">{formatDate(click.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <div className="bg-blue-600 p-1.5 rounded-lg text-white shrink-0 mt-0.5">
          <BarChart3 className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-bold text-blue-900">Admin tıklamaları kaydedilmez</p>
          <p className="text-xs text-blue-700 mt-0.5">
            Admin paneline giriş yaptığınız sürece sizin tıklamalarınız istatistiklere dahil edilmez. 
            Yalnızca gerçek ziyaretçilerin etkileşimleri izlenir.
          </p>
        </div>
      </div>
    </div>
  );
}
