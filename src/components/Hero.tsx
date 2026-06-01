import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Play, TrendingUp, Shield, Clock } from 'lucide-react';

// 1. تحديث الـ Interface ليشمل دالة التمرير ودالة فتح بوابة الآدمن المخفية
interface HeroProps {
  onQuoteClick: () => void;
  onAdminTrigger: () => void;
}

export default function Hero({ onQuoteClick, onAdminTrigger }: HeroProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith('ar');

  // مصفوفة الإحصائيات معتمدة على دالة الترجمة ومفاتيح مرنة
  const stats = [
    { value: '+500', label: t('hero.stats.clients', 'عميل موثوق'), icon: TrendingUp },
    { value: '99.2%', label: t('hero.stats.delivery', 'دقة التسليم'), icon: Shield },
    { value: '24/7', label: t('hero.stats.support', 'دعم متواصل'), icon: Clock },
  ];

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // دالة التقاط النقر الثلاثي السري والآمن
  const handleBadgeClick = (e: React.MouseEvent) => {
    if (e.detail === 3) {
      onAdminTrigger(); // تشغيل بوابة الإدارة فوراً عند الضغط 3 مرات متتالية
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #00172b 0%, #002e56 55%, #004581 100%)',
      }}
    >
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Geometric Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-brand-400/10 blur-3xl" />
        
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* محتوى النصوص والاتصال بالأزرار */}
          <div className="order-2 lg:order-1">
            
            {/* 🎯 الشارة العليا: تم ربطها بحدث handleBadgeClick لرصد الـ Triple Click السري */}
            <div 
              onClick={handleBadgeClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold-400/15 border border-gold-400/30 rounded-full mb-6 animate-fade-in cursor-default select-none active:scale-98 transition-transform"
            >
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              <span className="text-gold-300 font-cairo text-sm font-semibold">
                {t('hero.badge', 'رؤية 2030 – الشريك اللوجستي الأمثل')}
              </span>
            </div>

            {/* العنوان الرئيسي الديناميكي */}
            <h1 className="font-cairo font-black text-white leading-tight mb-4 animate-fade-up" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              {t('hero.title_part1', 'ريادة سلاسل الإمداد')}
              <br />
              <span className="text-gold-400">{t('hero.title_part2', 'من الباب إلى العالم')}</span>
            </h1>

            {/* الوصف */}
            <p className="text-white/70 font-cairo text-lg leading-relaxed mb-8 max-w-xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {t('hero.description', 'نجمع بين الخبرة التشغيلية العميقة والحلول الرقمية لتقديم محطة واحدة لكل احتياجاتك اللوجستية — شحن، تخزين، تخليص جمركي، وتوصيل في المملكة والشرق الأوسط.')}
            </p>

            {/* أزرار اتخاذ الإجراء (CTAs) */}
            <div className="flex flex-wrap gap-4 mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              {/* ربط الزر الأصفر بالدالة البرمجية الممررة للاستدعاء الفوري بدلاً من الـ ID اللوكال */}
              <button
                onClick={onQuoteClick}
                className="flex items-center gap-2 px-7 py-3.5 bg-gold-gradient text-brand-900 font-cairo font-bold text-base rounded-xl shadow-gold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                {t('hero.cta_quote', 'احصل على عرض سعر')}
                {isArabic ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </button>
              
              <button
                onClick={() => scrollTo('#services')}
                className="flex items-center gap-2 px-7 py-3.5 border border-white/30 text-white font-cairo font-semibold text-base rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-200"
              >
                <Play size={16} className={`fill-white ${isArabic ? '' : 'rotate-180'}`} />
                {t('hero.cta_services', 'استعرض خدماتنا')}
              </button>
            </div>

            {/* قسم الأرقام والإحصائيات */}
            <div className="grid grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              {stats.map((s, index) => (
                <div key={index} className="text-center">
                  <s.icon size={20} className="text-gold-400 mx-auto mb-2" />
                  <div className="text-white font-cairo font-black text-2xl">{s.value}</div>
                  <div className="text-white/50 font-cairo text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* الجزء البصري الأيمن (الكروت العائمة) */}
          <div className="order-1 lg:order-2 flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              
              {/* الصورة الرئيسية للصندوق اللوجستي */}
              <div className="relative w-80 h-80 lg:w-[420px] lg:h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg"
                  alt="Araak Logistics Operations"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 to-transparent" />
              </div>

              {/* الكرت العائم 1: شحنة آمنة */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-card-hover animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <Shield size={18} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-neutral-900 font-cairo font-bold text-sm">
                      {t('hero.cards.safe_shipment', 'شحنة آمنة')}
                    </div>
                    <div className="text-neutral-500 font-cairo text-xs">
                      {t('hero.cards.insurance', 'تغطية تأمينية كاملة')}
                    </div>
                  </div>
                </div>
              </div>

              {/* الكرت العائم 2: نمو مستدام */}
              <div className="absolute -top-6 -left-6 bg-brand-800 border border-white/10 rounded-2xl p-4 shadow-card-hover animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold-400/20 rounded-xl flex items-center justify-center">
                    <TrendingUp size={18} className="text-gold-400" />
                  </div>
                  <div>
                    <div className="text-white font-cairo font-bold text-sm">
                      {t('hero.cards.growth', 'نمو مستدام')}
                    </div>
                    <div className="text-white/50 font-cairo text-xs">
                      {t('hero.cards.growth_rate', '+30% سنوياً')}
                    </div>
                  </div>
                </div>
              </div>

              {/* كرت تصنيف نموذج العمل الاقتصادي */}
              <div className="absolute top-1/2 -left-14 -translate-y-1/2 bg-gold-gradient rounded-2xl p-3 shadow-gold animate-float" style={{ animationDelay: '2s' }}>
                <div className="text-brand-900 font-cairo font-black text-xs text-center leading-tight">
                  <div>4-in-1</div>
                  <div>Model</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* مؤشر التمرير السفلي */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1s' }}>
          <span className="text-white/40 font-cairo text-xs">{t('hero.scroll_down', 'تمرير للأسفل')}</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}