import { useTranslation } from 'react-i18next';
import { Plane, Building, CreditCard, Users } from 'lucide-react';

export default function Partners() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith('ar');

  // مصفوفة الشركاء اللوجستيين ومزودي الخدمات مستدعاة ديناميكياً
  const partnerCategories = [
    {
      icon: Plane,
      title: t('partners.categories.air_cargo', 'شركاء الشحن الجوي'),
      partners: ['Saudi Arabian Airlines Cargo', 'Emirates SkyCargo', 'Lufthansa Cargo', 'Qatar Airways Cargo'],
    },
    {
      icon: Building,
      title: t('partners.categories.banking', 'الشركاء المصرفيون'),
      partners: isArabic 
        ? ['البنك الأهلي السعودي', 'بنك الراجحي', 'بنك الرياض', 'مصرف الإنماء'] 
        : ['SNB Bank', 'Al Rajhi Bank', 'Riyad Bank', 'Alinma Bank'],
    },
    {
      icon: CreditCard,
      title: t('partners.categories.clearance', 'شركاء التخليص والجمارك'),
      partners: isArabic 
        ? ['الهيئة العامة للجمارك', 'مؤسسة الموانئ السعودية', 'المنافذ الجمركية'] 
        : ['Zakat, Tax and Customs Authority', 'Saudi Ports Authority (MAWANI)', 'Customs Ports'],
    },
    {
      icon: Users,
      title: t('partners.categories.hajj', 'مطوفو حجاج الدول'),
      partners: isArabic 
        ? ['مؤسسات طوافة الدول العربية', 'شركات الحج والعمرة المعتمدة'] 
        : ['Arab Countries Mutawwif Organizations', 'Approved Hajj & Umrah Companies'],
    },
  ];

  // مصفوفة الشهادات والاعتمادات الدولية
  const achievements = [
    { value: 'ISO 9001', label: t('partners.achievements.iso', 'شهادة الجودة الدولية') },
    { value: 'IATA', label: t('partners.achievements.iata', 'عضوية اتحاد الشحن الجوي') },
    { value: 'FIATA', label: t('partners.achievements.fiata', 'الاتحاد الدولي لوسطاء الشحن') },
    { value: '2030', label: t('partners.achievements.vision', 'شريك رؤية المملكة') },
  ];

  return (
    <section id="partners" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* رأس القسم */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-200 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-500" />
            <span className="text-brand-700 font-cairo text-sm font-semibold">
              {t('partners.badge', 'شبكة الشراكات')}
            </span>
          </div>
          <h2 className="font-cairo font-black text-neutral-900 text-4xl mb-4">
            {t('partners.title', 'شركاؤنا وإنجازاتنا')}
          </h2>
          <p className="text-neutral-600 font-cairo text-lg max-w-2xl mx-auto leading-relaxed">
            {t('partners.subtitle', 'نعتز ببناء علاقات ممتدة مستندين على رصيد الثقة وشراكات النجاح السابقة مع كبرى المؤسسات العالمية')}
          </p>
        </div>

        {/* شبكة الشهادات والأوسمة التقديرية */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {achievements.map((a) => (
            <div key={a.value} className="text-center p-6 bg-neutral-50 border border-neutral-200 rounded-2xl hover:border-brand-300 hover:shadow-card transition-all duration-200">
              <div className="font-cairo font-black text-brand-600 text-2xl mb-2">{a.value}</div>
              <div className="text-neutral-600 font-cairo text-sm">{a.label}</div>
            </div>
          ))}
        </div>

        {/* شبكة تصنيفات الشركاء اللوجستيين والمحليين */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {partnerCategories.map((cat) => (
            <div key={cat.title} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 hover:shadow-card transition-all duration-200">
              <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center mb-4 shadow-brand">
                <cat.icon size={22} className="text-white" />
              </div>
              <h4 className="font-cairo font-bold text-neutral-900 text-base mb-4">{cat.title}</h4>
              <ul className="space-y-2">
                {cat.partners.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                    <span className="text-neutral-600 font-cairo text-sm">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* بانر دعوة الشراكة الاستراتيجية (CTA Banner) */}
        <div className="mt-16 bg-hero-gradient rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots2" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots2)" />
            </svg>
          </div>
          <div className="relative">
            <h3 className="font-cairo font-black text-white text-3xl mb-4">
              {t('partners.cta.title', 'هل تريد أن تكون شريكنا؟')}
            </h3>
            <p className="text-white/70 font-cairo text-lg mb-8 max-w-xl mx-auto">
              {t('partners.cta.desc', 'انضم إلى شبكة شركاء لاراك لوجستيك واستفد من خبراتنا التشغيلية وشبكتنا العالمية.')}
            </p>
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3.5 bg-gold-gradient text-brand-900 font-cairo font-bold text-base rounded-xl shadow-gold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              {t('partners.cta.btn', 'تواصل معنا الآن')}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}