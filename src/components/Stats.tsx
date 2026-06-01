import { useTranslation } from 'react-i18next';
import { Globe, Package, Users, Award } from 'lucide-react';

export default function Stats() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith('ar');

  const statsItems = [
    { id: 1, icon: Globe, value: '45+', label: t('stats.countries', 'دولة حول العالم'), sub: t('stats.countries_sub', 'شبكة وكلاء عالمية') },
    { id: 2, icon: Package, value: '50,000+', label: t('stats.shipments', 'شحنة سنوياً'), sub: t('stats.shipments_sub', 'كفاءة تشغيلية عالية') },
    { id: 3, icon: Users, value: '500+', label: t('stats.clients', 'عميل موثوق'), sub: t('stats.clients_sub', 'شركات وأفراد') },
    { id: 4, icon: Award, value: '15+', label: t('stats.experience', 'عاماً من الخبرة'), sub: t('stats.experience_sub', 'وفق أعلى المعايير') },
  ];

  return (
    /* القسم الخارجي يأخذ "القيم الفاتح المتباين" ليصنع التناوب المريح للعين في الموقع */
    <section 
      id="stats" 
      className="py-20 bg-neutral-50 px-4 sm:px-6 lg:px-8"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* الحاوية العملاقة الداخلية: كحلي ليلي متدرج بقوة إلى أزرق إشعاعي نفاث */}
      <div className="relative mx-auto max-w-7xl px-6 py-16 bg-gradient-to-br from-[#030712] via-[#0b192c] to-[#0284c7] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        
        {/* التدرج الشعاعي الإضافي لزيادة إشعاع اللون الأزرق في الزوايا */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.4),transparent_60%)] pointer-events-none" />
        
        {/* مصفوفة النقاط البيضاء الدقيقة بشفافية واضحة وشبه معدومة (Opaque & Vivid) */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="stats-dots-vivid" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="12" cy="12" r="1.2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stats-dots-vivid)" />
          </svg>
        </div>

        {/* النصوص العلوية للقسم */}
        <div className="relative z-10 text-center mb-14">
          <h2 className="font-cairo font-black text-white text-3xl sm:text-4xl mb-3 tracking-wide">
            {t('stats.title', 'أرقام تتحدث عن نفسها')}
          </h2>
          <p className="text-cyan-100/80 font-cairo text-sm sm:text-base max-w-xl mx-auto">
            {t('stats.subtitle', 'ثقة مبنية على سنوات من العمل والإنجاز التشغيلي المتكامل')}
          </p>
        </div>

        {/* شبكة كروت الإحصائيات الأربعة (زجاجية مدمجة لتعكس التدرج الأزرق الخلفي) */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-6 px-2">
          {statsItems.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col items-center p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 group hover:-translate-y-1"
            >
              {/* الأيقونة تضيء باللون الذهبي */}
              <div className="p-3 bg-white/5 rounded-xl text-gold-400 mb-4 group-hover:scale-110 transition-transform">
                <item.icon size={24} />
              </div>
              
              {/* الرقم الإحصائي ناصع البياض */}
              <span className="text-white font-cairo font-black text-2xl sm:text-3xl mb-1 tracking-tight" dir="ltr">
                {item.value}
              </span>
              
              {/* العنوان الصغير ملون بالأزرق السماوي الفاتح جداً ليتناسق مع الإشعاع */}
              <span className="text-cyan-50 font-cairo font-bold text-sm text-center mb-1">
                {item.label}
              </span>
              
              {/* النص المساعد السفلي */}
              <span className="text-neutral-400 font-cairo text-xs text-center group-hover:text-neutral-300 transition-colors">
                {item.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}