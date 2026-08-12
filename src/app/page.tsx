import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import PortfolioCarousel from '@/components/PortfolioCarousel';
import DesignGallery from '@/components/DesignGallery';
import PricingSection from '@/components/PricingSection';
import ProcessSection from '@/components/ProcessSection';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let packages: Array<{
    id: string; title: string; postCount: number; price: string;
    features: string; thumbnailImages: string; isPopular: boolean; order: number;
  }> = [];
  let portfolioItems: Array<{
    id: string; 
    clientName: string; 
    username: string;
    category: string;
    bio: string;
    link: string;
    postsCount: number;
    followers: string;
    following: number;
    mockupImageUrl: string; 
    imagesJson: string;
    order: number;
  }> = [];
  let galleryImages: Array<{
    id: string; category: string; imageUrl: string; title: string | null; order: number;
  }> = [];
  let galleryCategories: Array<{
    id: string; name: string; order: number;
  }> = [];
  let siteContentMap: Record<string, { textValue: string | null; primaryImageUrl: string | null }> = {};

  try {
    packages = await prisma.package.findMany({
      orderBy: { order: 'asc' }
    }) as typeof packages;
  } catch (error) {
    console.error("Error fetching packages:", error);
  }



  try {
    portfolioItems = await prisma.portfolioItem.findMany({
      orderBy: { order: 'asc' }
    }) as typeof portfolioItems;
  } catch (error) {
    console.error("Error fetching portfolioItems:", error);
  }

  try {
    galleryImages = await prisma.galleryImage.findMany({
      orderBy: { order: 'asc' }
    }) as typeof galleryImages;
  } catch (error) {
    console.error("Error fetching galleryImages:", error);
  }

  try {
    galleryCategories = await prisma.galleryCategory.findMany({
      orderBy: { order: 'asc' }
    }) as typeof galleryCategories;

    if (galleryCategories.length === 0) {
      const defaultCat = await prisma.galleryCategory.create({
        data: { name: 'Sürücü Kursu', order: 1 }
      });
      galleryCategories = [defaultCat];
    }
  } catch (error) {
    console.error("Error fetching galleryCategories:", error);
  }

  try {
    const siteContentRows = await prisma.siteContent.findMany();
    for (const row of siteContentRows) {
      siteContentMap[row.sectionKey] = {
        textValue: row.textValue,
        primaryImageUrl: row.primaryImageUrl,
      };
    }
  } catch (error) {
    console.error("Error fetching siteContent:", error);
  }

  const heroContent = {
    badge: siteContentMap['hero_badge']?.textValue || 'MARKANIZA ÖZEL',
    title: siteContentMap['hero_title']?.textValue || 'Sosyal Medya Tasarımı ile Fark Yaratın!',
    subtitle: siteContentMap['hero_subtitle']?.textValue || 'Markanız için özel olarak hazırladığımız sosyal medya tasarımları ile markanızı dijitalde bir adım öne taşıyın.',
    image: siteContentMap['hero_image']?.primaryImageUrl || null,
  };

  return (
    <main className="min-h-screen font-sans bg-white selection:bg-fantas-blue selection:text-white">
      <Navbar />
      
      <section id="anasayfa">
        <HeroSection heroContent={heroContent} />
      </section>
      
      <section id="calismalarimiz">
        <PortfolioCarousel items={portfolioItems} />
      </section>
      


      <section id="galeri">
        <DesignGallery images={galleryImages} categories={galleryCategories} />
      </section>
      
      <section id="paketler">
        <PricingSection packages={packages} />
      </section>
      
      <section id="surec">
        <ProcessSection />
      </section>
      
      <section id="iletisim">
        <Footer />
      </section>
    </main>
  );
}
