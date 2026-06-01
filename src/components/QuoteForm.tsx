import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient'; 
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function QuoteForm() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // الحالة مطابقة للـ 7 حقول بالتمام والكمال
  const [formData, setFormData] = useState({
    companyName: '',      // 1. اسم الشركة
    phone: '',            // 2. رقم الهاتف
    email: '',            // 3. البريد الإلكتروني
    originCity: '',       // 4. مدينة القيام
    destinationCity: '',  // 5. مدينة الوصول
    shippingType: 'شحن بري', // 6. نوع الشحن
    weight: ''            // 7. الوزن التقديري
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError(null);

    // دمج رقم الهاتف والمسؤول بذكاء في حقل اسم الشركة ليتوافق مع قاعدة البيانات الحالية
    const finalCompanyName = `${formData.companyName} (جوال: ${formData.phone})`;

    try {
      const { error } = await supabase
        .from('quotation_requests')
        .insert([
          {
            company_name: finalCompanyName,
            contact_email: formData.email,
            shipping_type: formData.shippingType,
            origin_city: formData.originCity,
            destination_city: formData.destinationCity,
            estimated_weight: formData.weight ? parseFloat(formData.weight) : null
          }
        ]);

      if (error) {
        console.error('Supabase Core Error:', error.message);
        throw error;
      }
      
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting quote:', err);
      setServerError(isRtl ? 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-16 px-4 max-w-xl mx-auto text-center" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-6 text-[#009695]">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {isRtl ? 'تم إرسال طلبك بنجاح!' : 'Your request has been submitted successfully!'}
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed text-sm max-w-sm mx-auto">
            {isRtl 
              ? 'سيتصل بك فريق أراك اللوجستية خلال 24 ساعة لمناقشة المتطلبات التشغيلية وتقديم العرض الأمثل لشحنتك.' 
              : 'The Araak Logistics team will contact you within 24 hours to discuss operational requirements and provide the optimal quote for your shipment.'}
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                companyName: '', phone: '', email: '', originCity: '', destinationCity: '', shippingType: 'شحن بري', weight: ''
              });
            }}
            className="px-8 py-3 bg-[#009695] hover:bg-[#007a79] text-white font-medium rounded-xl transition shadow-md text-sm"
          >
            {isRtl ? 'تقديم طلب جديد' : 'Submit a New Request'}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="quote-section" className="py-16 px-4 max-w-3xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 bg-teal-50 text-[#009695] rounded-full text-xs font-semibold mb-3">
          {isRtl ? 'طلب تسعير شحنة' : 'Cargo Quote Request'}
        </span>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {isRtl ? 'طلب تسعير شحنة' : 'Cargo Quote Request'}
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto text-sm">
          {isRtl ? 'أدخل تفاصيل شحنتك وسيقوم خبراؤنا اللوجستيون بتقديم العرض الأمثل' : 'Enter your shipment details and our logistics experts will provide the optimal offer'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-gray-100">
        
        {/* 1 و 2: اسم الشركة ورقم الهاتف */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              {isRtl ? 'اسم الشركة / المؤسسة *' : 'Company / Organization Name *'}
            </label>
            <input
              type="text"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleChange}
              placeholder={isRtl ? 'أدخل اسم الشركة' : 'Enter company name'}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500/20 focus:border-[#009695] transition outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              {isRtl ? 'رقم الهاتف / الواتساب *' : 'Phone / WhatsApp Number *'}
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="05XXXXXXXX"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500/20 focus:border-[#009695] transition outline-none text-sm"
            />
          </div>
        </div>

        {/* 3: البريد الإلكتروني */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-700 mb-2">
            {isRtl ? 'البريد الإلكتروني الرسمي *' : 'Official Email *'}
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500/20 focus:border-[#009695] transition outline-none text-sm"
          />
        </div>

        {/* 4 و 5: مدينة القيام ومدينة الوصول */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 border-t border-gray-100 pt-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              {isRtl ? 'مدينة القيام *' : 'Origin City *'}
            </label>
            <input
              type="text"
              name="originCity"
              required
              value={formData.originCity}
              onChange={handleChange}
              placeholder={isRtl ? 'مثال: JED' : 'e.g. JED'}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500/20 focus:border-[#009695] transition outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              {isRtl ? 'مدينة الوصول *' : 'Destination City *'}
            </label>
            <input
              type="text"
              name="destinationCity"
              required
              value={formData.destinationCity}
              onChange={handleChange}
              placeholder={isRtl ? 'مثال: DAN' : 'e.g. DAN'}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500/20 focus:border-[#009695] transition outline-none text-sm"
            />
          </div>
        </div>

        {/* 6 و 7: نوع الشحن والوزن */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              {isRtl ? 'نوع الشحن *' : 'Shipping Type *'}
            </label>
            <select
              name="shippingType"
              value={formData.shippingType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500/20 focus:border-[#009695] transition bg-white outline-none text-sm appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: isRtl ? 'left 1rem center' : 'right 1rem center', backgroundSize: '1em' }}
            >
              <option value="شحن بري">{isRtl ? '🚛 شحن بري' : '🚛 Land Freight'}</option>
              <option value="شحن بحري">{isRtl ? '🚢 شحن بحري' : '🚢 Sea Freight'}</option>
              <option value="شحن جوي">{isRtl ? '✈️ شحن جوي' : '✈️ Air Freight'}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              {isRtl ? 'الوزن التقديري (طن)' : 'Estimated Weight (Tons)'}
            </label>
            <input
              type="number"
              name="weight"
              step="0.1"
              value={formData.weight}
              onChange={handleChange}
              placeholder="0.0"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500/20 focus:border-[#009695] transition outline-none text-sm"
            />
          </div>
        </div>

        {serverError && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3 text-red-700 text-xs">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-[#009695] hover:bg-[#007a79] text-white font-bold rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg text-sm"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              <span>{isRtl ? 'إرسال طلب التسعير' : 'Send Quote Request'}</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
}