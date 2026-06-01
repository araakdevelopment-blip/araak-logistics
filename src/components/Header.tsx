import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe } from 'lucide-react';
// استيراد ملف الصورة الخاص بالشعار من مجلد الـ components
import logoImg from './araak-logo.png'; 

export default function Header() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isArabic = i18n.language?.startsWith('ar');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLang = isArabic ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  // دالة الانتقال السلس إلى حقل طلب التسعير
  const handleScrollToQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('quote-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // إغلاق قائمة الجوال إذا كانت مفتوحة أثناء الضغط
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '#home', label: t('nav.home', 'الرئيسية') },
    { href: '#services', label: t('nav.services', 'خدماتنا') },
    { href: '#track', label: t('nav.track', 'تتبع الشحنة') },
    { href: '#about', label: t('nav.about', 'عن أراك للوجستيات') },
    { href: '#partners', label: t('nav.partners', 'شركاؤنا') },
    { href: '#contact', label: t('nav.contact', 'اتصل بنا') },
  ];

  return (
    <header
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`fixed z-50 transition-all duration-500 left-0 right-0 ${
        isScrolled
          ? 'top-4 max-w-7xl mx-auto rounded-2xl bg-[#030712]/80 backdrop-blur-md shadow-2xl py-3 border border-white/5 px-4 sm:px-6 lg:px-8'
          : 'top-0 bg-transparent py-5 px-4 sm:px-6 lg:px-8'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          
          {/* قسم الشعار بالصورة الأصلية للهوية */}
          <div className="flex-shrink-0 flex items-center">
            <a href="#home" className="block focus:outline-none">
              <img 
                src={logoImg} 
                alt="Araak Logistics Logo" 
                className="h-12 w-auto object-contain transition-transform duration-200 hover:scale-102" 
              />
            </a>
          </div>

          {/* روابط التصفح للشاشات الكبيرة */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-white/85 hover:text-gold-400 font-cairo font-medium text-sm transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* أزرار التحكم: اللغة + زر التمرير لطلب السعر للشاشات الكبيرة */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 rounded-full text-white/90 hover:bg-white/10 hover:border-gold-500 font-cairo font-semibold text-xs transition-all duration-200"
            >
              <Globe size={14} className="text-gold-400" />
              <span>{isArabic ? 'EN' : 'AR'}</span>
            </button>

            <button
              onClick={handleScrollToQuote}
              className="px-5 py-2.5 bg-gold-gradient text-brand-950 font-cairo font-black text-sm rounded-xl shadow-gold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              {t('nav.get_quote', 'طلب سعر')}
            </button>
          </div>

          {/* زر القائمة للشاشات الصغيرة (الجوال) */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 border border-white/20 rounded-full text-white text-xs font-semibold"
            >
              <Globe size={12} className="text-gold-400" />
              <span>{isArabic ? 'EN' : 'AR'}</span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-white/90 hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* القائمة المنسدلة للجوال باللون الكحلي الملكي المطابق */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#030712]/98 backdrop-blur-lg border-b border-white/10 animate-fade-down rounded-b-xl mt-2">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-white/90 hover:text-gold-400 hover:bg-white/5 rounded-xl font-cairo font-medium text-base transition-all"
              >
                {link.label}
              </a>
            ))}
            {/* زر التمرير لطلب السعر داخل قائمة الجوال */}
            <div className="pt-4 px-4">
              <button
                onClick={handleScrollToQuote}
                className="block w-full text-center py-3 bg-gold-gradient text-brand-950 font-cairo font-black rounded-xl shadow-gold cursor-pointer"
              >
                {t('nav.get_quote', 'طلب سعر')}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}