import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Loader2, Send } from 'lucide-react';

interface ChatQuotationFormProps {
  onSuccess: (companyName: string, shippingType: string, origin: string, destination: string) => void;
  onCancel: () => void;
}

export default function ChatQuotationForm({ onSuccess, onCancel }: ChatQuotationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    email: '',
    originCity: '',
    destinationCity: '',
    shippingType: 'شحن بري',
    weight: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // دمج رقم الهاتف والمسؤول بذكاء في حقل اسم الشركة ليتوافق مع قاعدة بياناتك الحالية
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
            estimated_weight: formData.weight ? parseFloat(formData.weight) : null,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      // إعلام المساعد الذكي بالنجاح لطباعة الرد التلقائي للعميل
      onSuccess(formData.companyName, formData.shippingType, formData.originCity, formData.destinationCity);
    } catch (err) {
      console.error('Error in Chat Quote Submit:', err);
      alert('حدث خطأ أثناء إرسال الطلب، يرجى التحقق من الاتصال والمحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-2.5 shadow-md text-right max-w-[96%] self-center animate-fadeIn font-sans" dir="rtl">
      <div className="flex justify-between items-center border-b pb-1.5">
        <h4 className="font-bold text-gray-700 text-[11px]">📋 نموذج طلب عرض أسعار سريع</h4>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-[11px] font-medium">إلغاء</button>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-500 mb-0.5">اسم الشركة / المؤسسة *</label>
        <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#009695]" placeholder="أدخل اسم الشركة" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-0.5">رقم الهاتف / واتساب *</label>
          <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#009695]" placeholder="05XXXXXXXX" dir="ltr" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-0.5">البريد الإلكتروني الرسمي *</label>
          <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#009695]" placeholder="name@company.com" dir="ltr" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-0.5">مدينة القيام *</label>
          <input type="text" name="originCity" required value={formData.originCity} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#009695]" placeholder="مثال: JED" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-0.5">مدينة الوصول *</label>
          <input type="text" name="destinationCity" required value={formData.destinationCity} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#009695]" placeholder="مثال: DAN" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-0.5">نوع الشحن *</label>
          <select name="shippingType" value={formData.shippingType} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-white outline-none focus:border-[#009695]">
            <option value="شحن بري">🚛 شحن بري</option>
            <option value="شحن بحري">🚢 شحن بحري</option>
            <option value="شحن جوي">✈️ شحن جوي</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-0.5">الوزن التقديري (طن)</label>
          <input type="number" name="weight" step="0.1" value={formData.weight} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#009695]" placeholder="0.0" />
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="w-full bg-[#009695] hover:bg-[#007a79] text-white font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Send className="w-3.5 h-3.5 rotate-180" />
            <span>إرسال طلب التسعير المباشر</span>
          </>
        )}
      </button>
    </form>
  );
}