import { ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
// استيراد الشعار الحقيقي المباشر من نفس المجلد
import logo from './araak-logo.png'; 

// تحويل عناصر القوائم إلى مفاتيح مطابقة لملفات الـ JSON لضمان ديناميكية الترجمة
const footerLinks = {
  services: [
    { key: 'b2b', href: '#services' },
    { key: 'b2c', href: '#services' },
    { key: 'b2g', href: '#services' },
    { key: 'hajj', href: '#services' },
    { key: 'customs', href: '#services' },
    { key: 'air_cargo', href: '#services' },
  ],
  company: [
    { key: 'about_us', href: '#about' },
    { key: 'partners', href: '#partners' },
    { key: 'track', href: '#track' },
    { key: 'quote', href: '#quote' },
    { key: 'contact', href: '#contact' },
  ],
  legal: [
    { key: 'privacy', href: '#' },
    { key: 'terms', href: '#' },
    { key: 'return', href: '#' },
  ],
};

export default function Footer() {
  const { t } = useTranslation();

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const scrollTo = (href: string) => {
    if (href === '#') return;
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-950 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-10">
          
          {/* Brand & Logo Section */}
          <div className="lg:col-span-1">
            <div className="flex flex-col gap-4 mb-5">
              <div className="flex items-center justify-start">
                <img 
                  src={logo} 
                  alt={t('footer.about_title')} 
                  className="h-16 w-auto object-contain brightness-110"
                />
              </div>
            </div>
            
            <p className="text-white/50 font-cairo text-sm leading-relaxed mb-6">
              {t('footer.about_desc')}
            </p>
            <div className="space-y-2">
              <p className="text-white/40 font-cairo text-xs">{t('footer.location')}</p>
              <a href="mailto:info@araaklogistics.com" className="text-gold-400 font-inter text-sm hover:text-gold-300 transition-colors block" dir="ltr">info@araak.org</a>
              <p className="text-white/40 font-inter text-xs" dir="ltr">www.araaklogistics.com</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-cairo font-bold text-base mb-5 pb-3 border-b border-white/10">
              {t('footer.services_title')}
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.services.map((l) => (
                <li key={l.key}>
                  <a href={l.href} onClick={(e) => { e.preventDefault(); scrollTo(l.href); }}
                    className="text-white/50 hover:text-white font-cairo text-sm transition-colors">
                    {t(`footer.links.${l.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-cairo font-bold text-base mb-5 pb-3 border-b border-white/10">
              {t('footer.company_title')}
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((l) => (
                <li key={l.key}>
                  <a href={l.href} onClick={(e) => { e.preventDefault(); scrollTo(l.href); }}
                    className="text-white/50 hover:text-white font-cairo text-sm transition-colors">
                    {t(`footer.links.${l.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Legal */}
          <div>
            <h4 className="text-white font-cairo font-bold text-base mb-5 pb-3 border-b border-white/10">
              {t('footer.newsletter_title')}
            </h4>
            <p className="text-white/50 font-cairo text-sm mb-4">{t('footer.newsletter_desc')}</p>
            <div className="flex gap-2 mb-6">
              <input
                type="email"
                placeholder={t('footer.email_placeholder')}
                className="flex-1 px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl font-cairo text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-all"
                dir="ltr"
              />
              <button className="px-4 py-2.5 bg-gold-gradient text-brand-900 font-cairo font-bold text-sm rounded-xl hover:shadow-gold transition-all">
                {t('footer.subscribe_btn')}
              </button>
            </div>
            <ul className="space-y-2">
              {footerLinks.legal.map((l) => (
                <li key={l.key}>
                  <a href={l.href} className="text-white/30 hover:text-white/60 font-cairo text-xs transition-colors">
                    {t(`footer.links.${l.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between flex-wrap gap-4">
          <p className="text-white/30 font-cairo text-sm">
            © {new Date().getFullYear()} {t('footer.links.about_us')} – {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            <p className="text-white/20 font-cairo text-xs">{t('footer.powered_by')}</p>
            <button
              onClick={scrollTop}
              className="w-9 h-9 bg-white/10 hover:bg-gold-gradient rounded-xl flex items-center justify-center transition-all duration-200 group"
              aria-label="Back to top"
            >
              <ArrowUp size={16} className="text-white/60 group-hover:text-brand-900 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}