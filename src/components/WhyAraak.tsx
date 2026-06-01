import { useTranslation } from 'react-i18next';
import { Shield, Zap, Cpu, CheckCircle2, DollarSign, Globe } from 'lucide-react';

export default function WhyAraak() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith('ar');

  // مصفوفة الأيقونات والمفاتيح الفرعية للربط الديناميكي المستقر
  const features = [
    { key: 'transparency', icon: Shield },
    { key: 'speed', icon: Zap },
    { key: 'integration', icon: Cpu },
    { key: 'compliance', icon: CheckCircle2 },
    { key: 'pricing', icon: DollarSign },
    { key: 'vision', icon: Globe },
  ];

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* لمسة خلفية جمالية ناعمة جداً باللون الذهبي الخافت متناسقة مع الهوية الفاتحة */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,163,89,0.03),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* مقدمة القسم بتناسق الألوان الفاتحة والداكنة للنصوص */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <span className="inline-block text-brand-700 font-bold text-sm tracking-wider uppercase bg-brand-50 border border-brand-100 px-4 py-2 rounded-full mb-4">
              {t('why_araak.section_badge', 'لماذا أراك للوجستيات؟')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mt-2 mb-6 leading-tight">
              {t('why_araak.main_title', 'المزايا التنافسية')} <br />
              <span className="text-gold-600 font-bold text-2xl sm:text-3xl">{t('why_araak.accent_title', 'التي تصنع الفارق الحقيقي')}</span>
            </h2>
            <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
              {t('why_araak.description')}
            </p>
          </div>
          
          {/* كارت الرؤية الاستراتيجية - خلفية هادئة متباينة تحاكي طابع الهيدر البسيط */}
          <div className="bg-neutral-50 border border-neutral-200/80 p-8 rounded-3xl shadow-sm">
            <h3 className="text-xl font-bold text-brand-950 mb-3">{t('why_araak.vision.title', 'رؤيتنا الاستراتيجية')}</h3>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              {t('why_araak.vision.desc')}
            </p>
          </div>
        </div>

        {/* شبكة المزايا الستة بخلفيات فاتحة متناسقة تماماً مع روح الموقع */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="p-8 bg-neutral-50/60 border border-neutral-200/70 hover:border-brand-300 hover:bg-white rounded-3xl transition-all duration-300 group hover:-translate-y-1 hover:shadow-card"
              >
                {/* حاوية الأيقونة: كحلي داكن يتحول إلى ذهبي عند التحليق */}
                <div className="w-12 h-12 bg-brand-950 text-gold-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold-500 group-hover:text-brand-950 transition-colors duration-300">
                  <Icon size={22} />
                </div>
                <h4 className="text-lg font-bold text-neutral-900 mb-3 group-hover:text-brand-700 transition-colors">
                  {t(`why_araak.features.${item.key}.title`)}
                </h4>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {t(`why_araak.features.${item.key}.desc`)}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}