import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Send, CheckCircle, Globe, Package, Users, Award } from 'lucide-react';

export default function Contact() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith('ar');
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const statsItems = [
    { id: 1, icon: Globe, value: '45+', label: t('stats.countries', 'دولة حول العالم'), sub: t('stats.countries_sub', 'شبكة وكلاء عالمية') },
    { id: 2, icon: Package, value: '50,000+', label: t('stats.shipments', 'شحنة سنوياً'), sub: t('stats.shipments_sub', 'كفاءة تشغيلية عالية') },
    { id: 3, icon: Users, value: '500+', label: t('stats.clients', 'عميل موثوق'), sub: t('stats.clients_sub', 'شركات وأفراد') },
    { id: 4, icon: Award, value: '15+', label: t('stats.experience', 'عاماً من الخبرة'), sub: t('stats.experience_sub', 'وفق أعلى المعايير') },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا يتم ربط الـ Submit مع السيرفس الخاصة بك مثل EmailJS أو الـ API
    setIsSubmitted(true);
  };

  return (
    <div className="bg-neutral-50" dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* ─── سكشن أرقام تتحدث عن نفسها (ثيم الإشعاع الأزرق النفاث المباين) ─── */}
      <section id="stats" className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl px-6 py-16 bg-gradient-to-br from-[#030712] via-[#0b192c] to-[#0284c7] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          
          {/* التدرج الشعاعي الإضافي لزيادة عمق إشعاع الأزرق اللوجستي */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.4),transparent_60%)] pointer-events-none" />
          
          {/* مصفوفة النقاط البيضاء الدقيقة الواضحة بشفافية شبه معدومة */}
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

          {/* نصوص القسم */}
          <div className="relative z-10 text-center mb-14">
            <h2 className="font-cairo font-black text-white text-3xl sm:text-4xl mb-3 tracking-wide">
              {t('stats.title', 'أرقام تتحدث عن نفسها')}
            </h2>
            <p className="text-cyan-100/80 font-cairo text-sm sm:text-base max-w-xl mx-auto">
              {t('stats.subtitle', 'ثقة مبنية على سنوات من العمل والإنجاز التشغيلي اللوجستي المتكامل')}
            </p>
          </div>

          {/* شبكة بطاقات الإحصائيات الأربعة العاكسة للضوء الخلفي */}
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-6 px-2">
            {statsItems.map((item) => (
              <div 
                key={item.id} 
                className="flex flex-col items-center p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="p-3 bg-white/5 rounded-xl text-gold-400 mb-4 group-hover:scale-110 transition-transform">
                  <item.icon size={24} />
                </div>
                <span className="text-white font-cairo font-black text-2xl sm:text-3xl mb-1 tracking-tight" dir="ltr">
                  {item.value}
                </span>
                <span className="text-cyan-50 font-cairo font-bold text-sm text-center mb-1">
                  {item.label}
                </span>
                <span className="text-neutral-400 font-cairo text-xs text-center group-hover:text-neutral-300 transition-colors">
                  {item.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── سكشن اتصل بنا (الترتيب الجغرافي الأول الأجمل المتزن لـ أراك) ─── */}
      <section id="contact" className="pb-20 pt-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 items-stretch">
          
          {/* 1️⃣ كرت بيانات الاتصال الجانبي (مستقل وعمودي ليعطي التوازن البصري الأنيق) */}
          <div className="relative lg:col-span-1 p-8 bg-[#030712] rounded-3xl overflow-hidden shadow-2xl border border-white/5 flex flex-col justify-between min-h-[450px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_60%)] pointer-events-none" />
            
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="contact-card-dots" width="24" height="24" patternUnits="userSpaceOnUse">
                    <circle cx="12" cy="12" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#contact-card-dots)" />
              </svg>
            </div>

            <div className="relative z-10 space-y-8">
              <h3 className="font-cairo font-black text-white text-2xl border-b border-white/10 pb-4">
                {t('nav.contact', 'اتصل بنا')}
              </h3>

              {/* المقر الرئيسي */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-xl text-gold-400 flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div className="space-y-1">
                  <span className="block text-xs text-neutral-400 font-cairo">{t('contact.info.address.title', 'المقر الرئيسي')}</span>
                  <span className="block text-white font-cairo font-bold text-sm sm:text-base leading-relaxed">
                    {t('contact.info.address.value', 'شارع التحلية، جدة، المملكة العربية السعودية')}
                  </span>
                </div>
              </div>

              {/* البريد الإلكتروني */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-xl text-gold-400 flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div className="space-y-1">
                  <span className="block text-xs text-neutral-400 font-cairo">{t('contact.info.email.title', 'البريد الإلكتروني')}</span>
                  <a 
                    href="mailto:info@araaklogistics.com" 
                    className="block text-white font-mono font-bold text-sm sm:text-base hover:text-gold-400 transition-colors"
                  >
                    info@araaklogistics.com
                  </a>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/5 mt-8 space-y-1">
              <span className="block text-xs text-neutral-400 font-cairo">{t('contact.social.title', 'تابعنا على منصات التواصل')}</span>
              <p className="font-cairo text-gold-400/90 font-medium text-xs italic">
                {t('contact.social.coming_soon', 'قريباً – التكامل الكامل مع منصات التواصل الاجتماعي')}
              </p>
            </div>
          </div>

          {/* 2️⃣ نموذج فورم المراسلة الذكي (ممتد وموازن للكتلة الجانبية) */}
          <div className="relative lg:col-span-2 p-8 bg-[#030712] rounded-3xl overflow-hidden shadow-2xl border border-white/5 flex flex-col justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="contact-form-dots" width="24" height="24" patternUnits="userSpaceOnUse">
                    <circle cx="12" cy="12" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#contact-form-dots)" />
              </svg>
            </div>

            {isSubmitted ? (
              <div className="relative z-10 text-center py-12">
                <CheckCircle className="text-emerald-500 mx-auto mb-4 animate-bounce" size={56} />
                <h3 className="font-cairo text-xl font-bold text-white">{t('contact.success.title', 'تم الإرسال بنجاح')}</h3>
                <p className="font-cairo text-neutral-400 mt-2 text-sm">{t('contact.success.desc', 'شكراً لتواصلك معنا. سيقوم فريقنا بالرد عليك في أقرب وقت ممكن.')}</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="font-cairo mt-6 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold text-sm border border-white/10 transition-all"
                >
                  {t('contact.success.btn', 'إرسال رسالة جديدة')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-neutral-300 text-xs font-semibold mb-1.5 font-cairo">{t('contact.fields.name.label', 'الاسم الكامل')}</label>
                    <input 
                      type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder={t('contact.fields.name.placeholder', 'أدخل اسمك الكريم')}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:border-gold-500 focus:bg-white/[0.06] text-white transition-all text-sm font-cairo placeholder:text-neutral-600"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 text-xs font-semibold mb-1.5 font-cairo">{t('contact.fields.email.label', 'البريد الإلكتروني')}</label>
                    <input 
                      type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:border-gold-500 focus:bg-white/[0.06] text-white transition-all text-sm font-mono placeholder:text-neutral-700" dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-neutral-300 text-xs font-semibold mb-1.5 font-cairo">{t('contact.fields.phone.label', 'رقم الجوال')}</label>
                    <input 
                      type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:border-gold-500 focus:bg-white/[0.06] text-white transition-all text-sm font-mono placeholder:text-neutral-700" dir="ltr" placeholder="+966 50 000 0000"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 text-xs font-semibold mb-1.5 font-cairo">{t('contact.fields.subject.label', 'موضوع الرسالة')}</label>
                    <input 
                      type="text" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                      placeholder={t('contact.fields.subject.placeholder', 'ما الذي تود الاستفسار عنه؟')}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:border-gold-500 focus:bg-white/[0.06] text-white transition-all text-sm font-cairo placeholder:text-neutral-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 text-xs font-semibold mb-1.5 font-cairo">{t('contact.fields.message.label', 'نص الرسالة')}</label>
                  <textarea 
                    rows={4} required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder={t('contact.fields.message.placeholder', 'اكتب تفاصيل استفسارك هنا...')}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:border-gold-500 focus:bg-white/[0.06] text-white transition-all text-sm font-cairo resize-none placeholder:text-neutral-600"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#f58224] to-[#ff9900] text-[#030712] font-cairo font-black rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Send size={16} className={isArabic ? 'rotate-180' : ''} />
                    {t('contact.buttons.submit', 'إرسال الرسالة')}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}