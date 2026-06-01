import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Stats from './components/Stats';
import TrackShipment from './components/TrackShipment';
import WhyAraak from './components/WhyAraak.tsx'; 
import QuoteForm from './components/QuoteForm';
import Partners from './components/Partners';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import AdminDashboard from './components/AdminDashboard'; // استيراد لوحة تحكم الإدارة المستقلة

function App() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith('ar');

  // 1. إنشاء المرجع البرمجي للوصول إلى نموذج التسعير المباشر
  const quoteFormRef = useRef<HTMLDivElement>(null);

  // 2. حالة للتحكم بفتح وإغلاق لوحة تحكم الإدارة العائمة
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // دالة التمرير السلس للأسفل عند النقر على زر طلب السعر
  const handleScrollToQuote = () => {
    quoteFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // تأثير لمراقبة لغة الموقع وقلب اتجاه الصفحة (RTL / LTR) تلقائياً
  useEffect(() => {
    const currentLang = i18n.language || 'ar';
    document.documentElement.dir = currentLang.startsWith('ar') ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [i18n.language]);

  return (
    <div 
      className={`relative min-h-screen bg-white text-gray-900 selection:bg-gold-500/30 selection:text-brand-950 transition-colors duration-150 ${
        isArabic ? 'font-cairo' : 'font-inter antialiased'
      }`}
    >
      <Header />
      <main>
        {/* 3. تمرير دالة التمرير ودالة تشغيل الآدمن (النقر الثلاثي المخفي) إلى الـ Hero */}
        <Hero 
          onQuoteClick={handleScrollToQuote} 
          onAdminTrigger={() => setIsAdminOpen(true)} 
        />
        
        <Services />
        <Stats />
        <TrackShipment />
        <WhyAraak />
        
        {/* تغليف نموذج التسعير بـ div يحمل المرجع المستهدف */}
        <div ref={quoteFormRef}>
          <QuoteForm />
        </div>
        
        <Partners />
        <Contact />
      </main>
      <Footer />
      <AIAssistant />

      {/* لوحة تحكم الإدارة العائمة والمستقلة عن الشات بوت */}
      <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}

export default App;