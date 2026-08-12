import { getReadyPackages } from '@/app/actions/ready-packages';
import Navbar from '@/components/Navbar';
import ReadyPackagesSection from '@/components/ReadyPackagesSection';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Sürücü Kurslarına Özel Hazır Tasarımlar - Sosyal Medya Ajansı',
  description: 'Sürücü kursunuz için özel olarak hazırlanan, kayıt dönemlerinde ve kampanyalarda kullanabileceğiniz hazır sosyal medya tasarım setleri.',
};

export default async function SurucuKurslarinaOzelPage() {
  const readyPackages = await getReadyPackages();
  
  let packages: Array<{
    id: string; title: string; postCount: number; price: string;
    features: string; thumbnailImages: string; isPopular: boolean; order: number;
  }> = [];

  try {
    packages = await prisma.package.findMany({
      orderBy: { order: 'asc' }
    }) as typeof packages;
  } catch (error) {
    console.error("Error fetching packages for subpage:", error);
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-fantas-blue selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-24 pb-12">
        {/* Simple & Elegant Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sürücü Kurslarına Özel <br className="xs:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Hazır Tasarım Setleri
            </span>
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-3 rounded-full" />
        </div>

        {/* Ready Packages Listing Section */}
        <ReadyPackagesSection items={readyPackages} />

        {/* Pricing Section (Same as Homepage) */}
        <div className="border-t border-slate-100 mt-8">
          <PricingSection packages={packages} showMonthlyNote={true} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
