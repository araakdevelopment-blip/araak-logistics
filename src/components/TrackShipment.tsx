import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Package, CheckCircle, Truck, Warehouse, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { supabase, type ShipmentTracking } from '../lib/supabase';

const iconMap: Record<string, React.ElementType> = {
  package: Package,
  warehouse: Warehouse,
  truck: Truck,
  check: CheckCircle,
  'check-circle': CheckCircle,
};

export default function TrackShipment() {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShipmentTracking | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  const isArabic = i18n.language?.startsWith('ar');

  const statusStyles: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    in_transit: { bg: 'bg-brand-50', text: 'text-brand-700', dot: 'bg-brand-500', label: t('track.status.in_transit', 'في الطريق') },
    delivered:  { bg: 'bg-success-50', text: 'text-success-700', dot: 'bg-success-500', label: t('track.status.delivered', 'تم التسليم') },
    pending:    { bg: 'bg-warning-50', text: 'text-warning-600', dot: 'bg-warning-500', label: t('track.status.pending', 'قيد المعالجة') },
    customs:    { bg: 'bg-gold-50', text: 'text-gold-700', dot: 'bg-gold-500', label: t('track.status.customs', 'التخليص الجمركي') },
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    setError('');

    try {
      const { data, error: err } = await supabase
        .from('shipment_tracking')
        .select('*')
        .eq('tracking_number', query.trim().toUpperCase())
        .maybeSingle();

      if (err) throw err;
      if (!data) {
        setNotFound(true);
      } else {
        setResult(data);
      }
    } catch {
      setError(t('track.error_msg', 'حدث خطأ أثناء البحث، يرجى المحاولة لاحقاً.'));
    } finally {
      setLoading(false);
    }
  };

  const normalizedStatus = result?.status ? result.status.toLowerCase().replace(/ /g, '_') : 'in_transit';
  const style = result ? (statusStyles[normalizedStatus] ?? statusStyles.in_transit) : null;

  return (
    <section id="track" className="py-24 bg-white" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* رأس القسم */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-200 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-500" />
            <span className="text-brand-700 font-cairo text-sm font-semibold">
              {t('track.badge', 'تتبع فوري')}
            </span>
          </div>
          <h2 className="font-cairo font-black text-neutral-900 text-4xl mb-4">
            {t('track.title', 'تتبع شحنتك')}
          </h2>
          <p className="text-neutral-600 font-cairo text-lg">
            {t('track.subtitle', 'أدخل رقم التتبع لمعرفة حالة شحنتك في الوقت الفعلي')}
          </p>
        </div>

        {/* نموذج البحث التفاعلي */}
        <form onSubmit={handleTrack} className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search size={18} className={`absolute ${isArabic ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-neutral-400`} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('track.placeholder', 'أدخل رقم التتبع (مثال: ARK-2024-001)')}
              className={`w-full ${isArabic ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-neutral-50 border border-neutral-200 rounded-2xl font-cairo text-neutral-900 placeholder-neutral-400 text-base focus:outline-none focus:border-brand-400 focus:bg-white transition-all`}
              dir="ltr"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-8 py-4 bg-brand-gradient text-white font-cairo font-bold text-base rounded-2xl shadow-brand hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              t('track.button', 'تتبع')
            )}
          </button>
        </form>

        {/* أرقام الشحن التجريبية */}
        <p className="text-center text-neutral-400 font-cairo text-sm mb-8">
          {t('track.demo_hint', 'جرب:')}{' '}
          <button type="button" onClick={() => setQuery('ARK-2024-001')} className="text-brand-500 hover:underline font-mono">ARK-2024-001</button>
          {' '}{t('track.or', 'أو')}{' '}
          <button type="button" onClick={() => setQuery('ARK-2024-002')} className="text-brand-500 hover:underline font-mono">ARK-2024-002</button>
        </p>

        {/* رسائل الخطأ */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl mb-6">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
            <p className="text-red-600 font-cairo text-sm">{error}</p>
          </div>
        )}

        {/* حالة عدم العثور على الشحنة */}
        {notFound && (
          <div className="text-center py-12 bg-neutral-50 rounded-3xl border border-neutral-200">
            <Package size={48} className="text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-600 font-cairo font-semibold text-lg">
              {t('track.not_found_title', 'لم يتم العثور على الشحنة')}
            </p>
            <p className="text-neutral-400 font-cairo text-sm mt-2">
              {t('track.not_found_desc', 'تأكد من رقم التتبع وحاول مرة أخرى')}
            </p>
          </div>
        )}

        {/* كارت نتائج التتبع الفورية */}
        {result && style && (
          <div className="bg-white border border-neutral-200 rounded-3xl shadow-card overflow-hidden animate-fade-up">
            
            {/* شريط الحالة العلوي المستقر */}
            <div className={`${style.bg} px-8 py-5 flex items-center justify-between`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${style.dot} animate-pulse`} />
                  <span className={`font-cairo font-bold text-lg ${style.text}`}>{style.label}</span>
                </div>
                <span className="text-neutral-500 font-inter text-sm font-mono">{result.tracking_number}</span>
              </div>
<div className={`px-4 py-2 rounded-xl border ${style.text} border-current font-cairo font-bold text-sm`}>
  {(() => {
    // 1. التحقق أولاً من أن القيمة موجودة وليست null أو undefined لتجنب أخطاء TypeScript
    const rawService = result?.service_type;
    
    if (!rawService) return '—';

    // 2. معالجة النص بأمان بعد ضمان وجوده
    const safeKey = `services.items.${rawService.toLowerCase().replace(/ /g, '_')}.title`;

    // 3. التحقق من وجود المفتاح في ملفات الترجمة، وإلا طباعة النص الخام
    return i18n.exists(safeKey) ? t(safeKey) : rawService;
  })()}
</div>
            </div>

            {/* تفاصيل المنشأ، الوجهة والموقع الحالي للشحنة */}
            <div className="p-8 grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={16} className="text-brand-600" />
                </div>
                <div>
                  <p className="text-neutral-400 font-cairo text-xs mb-1">{t('track.details.origin', 'المنشأ')}</p>
                  <p className="text-neutral-900 font-cairo font-semibold text-sm">{result.origin}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-neutral-400 font-cairo text-xs mb-1">{t('track.details.destination', 'الوجهة')}</p>
                  <p className="text-neutral-900 font-cairo font-semibold text-sm">{result.destination}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-gold-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Truck size={16} className="text-gold-600" />
                </div>
                <div>
                  <p className="text-neutral-400 font-cairo text-xs mb-1">{t('track.details.current_loc', 'الموقع الحالي')}</p>
                  <p className="text-neutral-900 font-cairo font-semibold text-sm">{result.current_location || '—'}</p>
                </div>
              </div>
              
              {result.estimated_delivery && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar size={16} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-neutral-400 font-cairo text-xs mb-1">{t('track.details.estimated_date', 'التسليم المتوقع')}</p>
                    <p className="text-neutral-900 font-cairo font-semibold text-sm">
                      {new Date(result.estimated_delivery).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* الخط الزمني المتسلسل للأحداث الجارية (Timeline) */}
            {result.events && result.events.length > 0 && (
              <div className="border-t border-neutral-100 px-8 py-6">
                <h4 className="font-cairo font-bold text-neutral-900 text-base mb-5">
                  {t('track.timeline_title', 'مراحل الشحنة')}
                </h4>
                <div className="space-y-4">
                  {[...result.events].reverse().map((event, i) => {
                    const eventIconKey = event.icon ? event.icon.toLowerCase() : 'package';
                    const Icon = iconMap[eventIconKey] ?? Package;
                    return (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${i === 0 ? 'bg-brand-gradient shadow-brand' : 'bg-neutral-100'}`}>
                            <Icon size={16} className={i === 0 ? 'text-white' : 'text-neutral-500'} />
                          </div>
                          {i < result.events!.length - 1 && <div className="w-px flex-1 bg-neutral-200 mt-2" />}
                        </div>
                        <div className="pb-4 flex-1">
                          <p className={`font-cairo font-semibold text-sm ${i === 0 ? 'text-neutral-900' : 'text-neutral-600'}`}>
                            {i18n.exists(`track.events.${event.status.toLowerCase().replace(/ /g, '_')}`)
                              ? t(`track.events.${event.status.toLowerCase().replace(/ /g, '_')}`)
                              : event.status}
                          </p>
                          <p className="text-neutral-400 font-cairo text-xs mt-0.5">{event.location}</p>
                          <p className="text-neutral-300 font-inter text-xs mt-1" dir="ltr">
                            {new Date(event.timestamp).toLocaleString(isArabic ? 'ar-SA' : 'en-US')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}