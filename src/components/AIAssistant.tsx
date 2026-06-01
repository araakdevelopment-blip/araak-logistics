import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import emailjs from '@emailjs/browser'; 
import araakLogo from './araak-logo01.png'; 

emailjs.init('7B3V3FLjjra0Stcqt');

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface QuotationRequest {
  id: string;
  company_name: string;
  contact_email: string;
  contact_phone: string;
  shipping_type: string;
  origin_city: string;
  destination_city: string;
  estimated_weight: number;
  status: string;
  created_at: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'أهلاً بك، أنا "مساعد أراك الذكي"، الوكيل الافتراضي لشركة أراك لوجستيك. كيف يمكنني مساعدتك اليوم في خدمات الشحن أو طلب تسعير؟',
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showErrorAction, setShowErrorAction] = useState(false);
  const [isTrackingMode, setIsTrackingMode] = useState(false); 
  
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    shippingType: 'بري',
    origin: '',
    destination: '',
    weight: ''
  });

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);
  const [requests, setRequests] = useState<QuotationRequest[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const ARAAK_OFFICIAL_PHONE = "966551596477";

  // دالة صارمة لتطهير أرقام الهواتف من الأصفار الزائدة والرموز لمنع الكاش والتلاعب بالروابط
  const sanitizePhoneNumber = (phone: string) => {
    let cleaned = phone.replace(/[^0-9]/g, ''); 
    if (cleaned.startsWith('00')) {
      cleaned = cleaned.substring(2);
    }
    return cleaned;
  };

  const fetchRequests = async () => {
    setAdminLoading(true);
    try {
      const { data, error } = await supabase
        .from('quotation_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error('خطأ في جلب البيانات:', err);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminMode) {
      fetchRequests();
    }
  }, [isAdminMode]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('quotation_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
    } catch (err) {
      alert('فشل تحديث حالة الطلب');
    }
  };

  const handleDeleteRequest = async (id: string, company: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف طلب شركة (${company}) نهائياً؟`)) return;
    try {
      const { error } = await supabase
        .from('quotation_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRequests(prev => prev.filter(req => req.id !== id));
      if (expandedRowId === id) setExpandedRowId(null);
    } catch (err) {
      alert('فشل حذف الطلب من قاعدة البيانات');
    }
  };

  const handleHeaderClick = () => {
    if (isAdminMode) return;
    
    const clicks = secretClicks + 1;
    if (clicks >= 3) {
      setSecretClicks(0);
      const password = prompt("🔒 يرجى إدخل كلمة المرور الإدارية لشركة أراك لوجستيك:");
      
      if (password === "Araak2026") {
        setIsAdminMode(true);
      } else if (password !== null) {
        alert("❌ عذراً، كلمة المرور غير صحيحة!");
      }
    } else {
      setSecretClicks(clicks);
    }
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const exportToCSV = () => {
    if (requests.length === 0) return alert('لا توجد بيانات لتصديرها');
    
    const headers = ['اسم الشركة', 'البريد الإلكتروني', 'رقم الهاتف', 'نوع الشحن', 'مدينة القيام', 'مدينة الوصول', 'الوزن (طن)', 'الحالة', 'تاريخ الطلب'];
    const rows = requests.map(req => [
      req.company_name,
      req.contact_email,
      req.contact_phone || '',
      req.shipping_type,
      req.origin_city,
      req.destination_city,
      req.estimated_weight || '',
      req.status === 'pending' ? 'معلق' : 'تم الرد',
      new Date(req.created_at).toLocaleDateString('ar-SA')
    ]);

    const csvContent = [headers, ...rows].map(e => e.map(val => `"${val}"`).join(',')).join('\n');
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `طلبات_تسعير_أراك_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchAIResponse = async (userText: string): Promise<string> => {
    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 
      if (!API_KEY) return "ERROR_KEY";

      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
      const SYSTEM_INSTRUCTION = `أنت "مساعد أراك الذكي"، الوكيل الافتراضي لشركة "أراك لوجستيك" لخدمات الشحن وحلول سلاسل الإمداد . أجب باختصار واحترافية وبطابع لوجستي ترحيبي مميز ويعتمد على السرعة والدقة الفائقة.`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nسؤال المستخدم: ${userText}` }] }]
        })
      });

      if (!response.ok) return "ERROR_SERVER";
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "ERROR_SERVER";
    } catch {
      return "ERROR_SERVER";
    }
  };

  // دالة الاستعلام الحي والمباشر عن الشحنات من Supabase
  const handleTrackShipment = async (waybill: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('waybill_number', waybill.trim())
        .single();

      if (error || !data) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: `❌ عذراً، لم نتمكن من العثور على شحنة مسجلة برقم البوليصة (${waybill}).\nيرجى التأكد من صحة الرقم والمحاولة مرة أخرى، أو التواصل مع العمليات مباشرة لمساعدتك.`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        const deliveryDate = data.estimated_delivery ? new Date(data.estimated_delivery).toLocaleDateString('ar-SA') : 'قيد التحديث';
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: `📍 تفاصيل الشحنة الحية للبوليصة [${data.waybill_number}]:\n\n🏢 المنشأة: شركة ${data.company_name}\n📦 الوضع الحالي: ${data.status}\n🌍 خط السير: من ${data.origin_city} إلى ${data.destination_city}\n📍 الموقع الحالي للشاحنة: ${data.current_location || 'قيد المعالجة'}\n📅 الموعد المتوقع للوصول: ${deliveryDate}\n\nشرفنا بخدمتكم في شركة أراك لوجستيك!`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch {
      alert('خطأ في الاتصال بقاعدة البيانات أثناء التتبع');
    } finally {
      setIsLoading(false);
      setIsTrackingMode(false);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setShowErrorAction(false);

    const cleanText = textToSend.trim();

    if (isTrackingMode) {
      await handleTrackShipment(cleanText);
      return;
    }

    if (cleanText === 'طلب تسعير شحنة' || cleanText.includes('تسعير') || cleanText.includes('احسب') || cleanText.includes('حجز') || cleanText.includes('تكلفة')) {
      setShowForm(true);
      setIsLoading(false);
      return; 
    }

    if (cleanText === 'ما هي خدمات الشحن المتاحة لديكم؟') {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: '📦 خدمات الشحن المتاحة في أراك لوجستيك:\n\n1️⃣ الشحن البري 🚚: أسطول شاحنات حديث يغطي كافة مدن المملكة ودول الخليج العربي.\n2️⃣ الشحن البحري 🚢: حلول شحن الحاويات الكاملة (FCL) والجزئية (LCL) عبر الموانئ الرئيسية.\n3️⃣ الشحن الجوي ✈️: خدمات نقل سريعة وآمنة للبضائع والمواد الملحة والحساسة.\n\nيمكنك الآن إرسال (طلب تسعير) لتسجيل تفاصيل شحنتك والحصول على تسعيرة دقيقة!',
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsLoading(false);
      }, 500); 
      return;
    }

    if (cleanText === 'هل تقدمون خدمات التخليص الجمركي؟') {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: '🛃 نعم، بكل تأكيد! يقدم خبراؤنا اللوجستيون خدمات التخليص الجمركي المتكاملة، وإنهاء المستندات في المنافذ والموانئ البرية، البحرية، والجوية الرئيسية بالمملكة العربية السعودية لضمان انسيابية بضائعكم دون تأخير.',
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsLoading(false);
      }, 500);
      return;
    }

    if (cleanText === 'أريد تتبع شحنتي الحالية.') {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: '📍 نظام التتبع الذكي لشركة أراك لوجستيك.\nفضلاً قم بكتابة وإرسال "رقم بوليصة الشحن (Waybill)" الخاص بك الآن ليستعلم النظام عنها فوراً.',
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsTrackingMode(true);
        setIsLoading(false);
      }, 500);
      return;
    }

    const aiReply = await fetchAIResponse(cleanText);
    
    if (aiReply === "ERROR_SERVER" || aiReply === "ERROR_KEY") {
      setShowErrorAction(true);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: '⚠️ المساعد الذكي يمر بتحديث سريع ومؤقت الآن، يمكنك الضغط مباشرة على الزر بالأسفل لتعبئة بيانات التسعير وسيتولى فريق العمل مراجعتها فوراً.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } else {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: aiReply,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
    setIsLoading(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from('quotation_requests').insert([
        {
          company_name: formData.companyName,
          contact_email: formData.email,
          contact_phone: formData.phone,
          shipping_type: formData.shippingType,
          origin_city: formData.origin,
          destination_city: formData.destination,
          estimated_weight: parseFloat(formData.weight) || null,
          status: 'pending'
        }
      ]);

      if (error) throw error;

      const emailTemplateParams = {
        company_name: formData.companyName,
        contact_email: formData.email,
        contact_phone: formData.phone,
        shipping_type: formData.shippingType,
        origin_city: formData.origin,
        destination_city: formData.destination,
        estimated_weight: formData.weight || 'غير محدد'
      };

      await emailjs.send('service_r36zjpc', 'template_7jggxa9', emailTemplateParams, '7B3V3FLjjra0Stcqt');
      await emailjs.send('service_r36zjpc', 'template_0rm3bgi', emailTemplateParams, '7B3V3FLjjra0Stcqt');

      setShowForm(false);
      setShowErrorAction(false);
      
      if (isAdminMode) {
        fetchRequests();
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: `👍 تم استلام طلب التسعيرة الخاص بشركة (${formData.companyName}) بنجاح! تم تسجيل شحن ${formData.shippingType} من ${formData.origin} إلى ${formData.destination}. سيقوم فريق العمل بمراجعة الطلب والتواصل معكم قريباً.`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

    } catch (err: any) {
      console.error(err);
      alert('حدث خطأ أثناء إرسال الطلب، يرجى التحقق من الاتصال.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = req.company_name.toLowerCase().includes(search) || 
                          req.contact_email.toLowerCase().includes(search) ||
                          (req.contact_phone && req.contact_phone.includes(search));
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesType = typeFilter === 'all' || req.shipping_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;

  return (
    <>
      {/* 📦 أزرار الوصول السريع العائمة */}
      {!isOpen && !isAdminMode && (
        <div className="fixed bottom-6 left-6 flex flex-col gap-3 z-50 items-center">
          {/* 💬 زر الواتساب المطهر برمجياً وبشكل صارم */}
          <a 
            href={`https://wa.me/${sanitizePhoneNumber(ARAAK_OFFICIAL_PHONE)}?text=${encodeURIComponent('مرحباً شركة أراك لوجستيك، أود الاستفسار مباشرة عن خدمات الشحن وتوفير عرض أسعار لوجستي.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-emerald-400 text-xl"
            title="تواصل مباشرة عبر واتساب المبيعات"
          >
            💬
          </a>

          <button 
            onClick={() => setIsOpen(true)}
            className="bg-[#009695] hover:bg-[#F3CA40] text-white hover:text-[#4A4A4A] w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-6 0h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* 🌐 نافذة النظام الرئيسية */}
      {(isOpen || isAdminMode) && (
        <div 
          className={`fixed border border-gray-100 bg-white rounded-2xl shadow-2xl overflow-hidden font-sans transition-all duration-300 text-right z-50 backdrop-blur-md antialiased flex flex-col
            ${isAdminMode 
              ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[640px] w-[94%] max-w-[1000px]' 
              : 'bottom-6 left-6 h-[550px] w-[380px]'
            }`}
        >
          {/* الرأس */}
          <div 
            className="text-white p-4 flex justify-between items-center select-none cursor-pointer bg-[#4A4A4A] border-b border-white/5 shrink-0" 
            onClick={handleHeaderClick}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white p-1 flex items-center justify-center shadow-md overflow-hidden border border-white/20">
                <img 
                  src={araakLogo} 
                  alt="أراك لوجستيك" 
                  className="w-full h-full object-contain scale-110" 
                />
              </div>
              <div>
                <h3 className="font-bold text-sm font-cairo tracking-wide">{isAdminMode ? '🌐 مركز الإدارة والتحكم اللوجستي المتكامل' : 'مساعد أراك الذكي'}</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <p className="text-[11px] text-gray-300 font-normal font-cairo">{isAdminMode ? 'قاعدة بيانات سحابية ونظام فرز متقدم لـ Supabase' : 'متصل الآن ومستعد لخدمتك'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isAdminMode ? (
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsAdminMode(false); setIsOpen(false); }} 
                  className="bg-indigo-900/40 hover:bg-indigo-900/80 text-[11px] px-3 py-1 rounded-lg text-white border border-white/20 transition-all font-sans font-semibold"
                >
                  إغلاق لوحة التحكم
                </button>
              ) : (
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
                  className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* ================= لوحة التحكم الإدارية (Admin Mode) ================= */}
          {isAdminMode ? (
            <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden h-full" dir="rtl">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-3 border-b bg-white shrink-0">
                <div className="flex gap-4 flex-1">
                  <div className="bg-blue-50/60 px-4 py-2 rounded-xl border border-blue-100">
                    <span className="block text-[11px] text-gray-500 font-bold font-sans">إجمالي الطلبات</span>
                    <span className="text-lg font-bold text-blue-700 font-mono">{totalRequests}</span>
                  </div>
                  <div className="bg-amber-50/60 px-4 py-2 rounded-xl border border-amber-100">
                    <span className="block text-[11px] text-gray-500 font-bold font-sans">قيد الدراسة</span>
                    <span className="text-lg font-bold text-amber-700 font-mono">{pendingRequests}</span>
                  </div>
                </div>
                <button 
                  onClick={exportToCSV}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  📥 تصدير البيانات إلى Excel
                </button>
              </div>

              <div className="p-3 bg-white border-b grid grid-cols-1 sm:grid-cols-3 gap-2.5 shrink-0">
                <input 
                  type="text" 
                  placeholder="🔍 ابحث بالاسم، الإيميل، أو الجوال..." 
                  className="w-full p-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#009695] font-sans"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                  className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-white focus:border-[#009695] outline-none font-sans"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">📁 جميع الحالات</option>
                  <option value="pending">⏳ الطلبات المعلقة فقط</option>
                  <option value="responded">✅ طلبات تم الرد عليها</option>
                </select>
                <select 
                  className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-white focus:border-[#009695] outline-none font-sans"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">🌐 كل وسائل الشحن</option>
                  <option value="بري">🚚 الشحن البري</option>
                  <option value="بحري">🚢 الشحن البحري</option>
                  <option value="جوي">✈️ الشحن الجوي</option>
                </select>
              </div>

              <div className="flex-1 p-4 overflow-auto">
                {adminLoading ? (
                  <div className="text-center py-12 text-xs text-gray-400 animate-pulse font-sans">جاري التحديث من سحابة Supabase...</div>
                ) : filteredRequests.length === 0 ? (
                  <div className="text-center py-12 text-xs text-gray-400 font-sans">لا توجد طلبات مطابقة.</div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-right border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50/80 border-b text-gray-500 font-bold p-3">
                          <th className="p-3 w-8"></th>
                          <th className="p-3">الشركة وجهة الاتصال</th>
                          <th className="p-3">نوع الشحن</th>
                          <th className="p-3">المسار اللوجستي</th>
                          <th className="p-3">الحالة</th>
                          <th className="p-3 text-center">أدوات التحكم</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRequests.map((req) => (
                          <React.Fragment key={req.id}>
                            <tr 
                              onClick={() => toggleRowExpansion(req.id)}
                              className="border-b last:border-0 hover:bg-gray-50/70 transition-all cursor-pointer text-gray-700"
                            >
                              <td className="p-3 text-center text-gray-400">
                                {expandedRowId === req.id ? '🔼' : '🔽'}
                              </td>
                              <td className="p-3">
                                <div className="font-bold text-gray-900">{req.company_name}</div>
                                <div className="text-[10px] text-gray-400 font-mono">{req.contact_email} {req.contact_phone ? `| ${req.contact_phone}` : ''}</div>
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-1 rounded-md font-bold text-[10px] bg-blue-50 text-blue-700">
                                  {req.shipping_type}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="font-semibold">{req.origin_city} ➔ {req.destination_city}</span>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  req.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                                }`}>
                                  {req.status === 'pending' ? '⏳ قيد الانتظار' : '✅ تم الرد'}
                                </span>
                              </td>
                              <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                                <div className="flex gap-1.5 justify-center">
                                  <select 
                                    value={req.status} 
                                    onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                                    className="p-1 text-[11px] border border-gray-200 bg-white rounded-lg outline-none font-sans"
                                  >
                                    <option value="pending">معلق</option>
                                    <option value="responded">تم الرد</option>
                                  </select>
                                  <button 
                                    onClick={() => handleDeleteRequest(req.id, req.company_name)}
                                    className="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-[11px] font-bold border border-red-100"
                                  >
                                    حذف
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {expandedRowId === req.id && (
                              <tr className="bg-gray-50/50 border-b">
                                <td colSpan={6} className="p-4 text-gray-500 font-sans text-xs">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      📌 <strong>اسم الشركة:</strong> {req.company_name}
                                      <br />📧 <strong>الإيميل:</strong> {req.contact_email}
                                    </div>
                                    <div>
                                      📅 <strong>تاريخ الطلب:</strong> {new Date(req.created_at).toLocaleString('ar-SA')}
                                      <br />⚖️ <strong>الوزن:</strong> {req.estimated_weight ? `${req.estimated_weight} طن` : 'غير محدد'}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ================= وضع واجهة دردشة العميل (User Chat Mode) ================= */
            <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden h-full">
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 flex flex-col">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[82%] rounded-2xl p-3 shadow-sm text-xs leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user' 
                        ? 'bg-[#009695] text-white rounded-br-none self-start text-left' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none self-end text-right'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className={`text-[9px] mt-1.5 block font-mono ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="bg-white border border-gray-100 text-gray-400 p-3 rounded-2xl max-w-[60%] text-xs self-end shadow-sm animate-pulse">
                    جاري الاستعلام والمعالجة...
                  </div>
                )}

                {messages.length === 1 && !showForm && (
                  <div className="pt-2 flex flex-col gap-2 w-full" dir="rtl">
                    <button 
                      onClick={() => handleSendMessage('طلب تسعير شحنة')}
                      className="w-full text-right bg-white hover:bg-[#009695]/5 text-[#009695] border border-[#009695]/20 p-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      💰 طلب تسعير شحنة
                    </button>
                    <button 
                      onClick={() => handleSendMessage('ما هي خدمات الشحن المتاحة لديكم؟')}
                      className="w-full text-right bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 p-2.5 rounded-xl text-xs transition-all shadow-sm"
                    >
                      🚚 ما هي خدمات الشحن المتاحة لديكم؟
                    </button>
                    <button 
                      onClick={() => handleSendMessage('أريد تتبع شحنتي الحالية.')}
                      className="w-full text-right bg-white hover:bg-[#009695]/5 text-[#009695] border border-gray-200 p-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      📍 أريد تتبع وضع شحنتي الحالية.
                    </button>
                  </div>
                )}

                {/* نموذج التسعير */}
                {showForm && (
                  <form onSubmit={handleFormSubmit} className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 shadow-md w-full text-right" dir="rtl">
                    <div className="flex justify-between items-center border-b pb-2 mb-1">
                      <h4 className="font-bold text-xs text-gray-800">📋 نموذج طلب تسعير لوجستي</h4>
                      <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500 text-xs">إلغاء</button>
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-500 font-bold mb-1">اسم المنشأة / الشركة *</label>
                      <input 
                        type="text" required placeholder="مثال: شركة أراك للتجارة"
                        className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#009695]"
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-gray-500 font-bold mb-1">البريد الإلكتروني *</label>
                        <input 
                          type="email" required placeholder="name@company.com"
                          className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none text-left"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-500 font-bold mb-1">رقم الجوال *</label>
                        <input 
                          type="tel" required placeholder="055XXXXXXX"
                          className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none text-left"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-500 font-bold mb-1">نوع الشحن *</label>
                      <select 
                        className="w-full p-2 text-xs border border-gray-200 rounded-lg bg-white outline-none"
                        value={formData.shippingType}
                        onChange={(e) => setFormData({...formData, shippingType: e.target.value})}
                      >
                        <option value="بري">الشحن البري 🚚</option>
                        <option value="بحري">الشحن البحري 🚢</option>
                        <option value="جوي">الشحن الجوي ✈️</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-gray-500 font-bold mb-1">المصدر *</label>
                        <input 
                          type="text" required placeholder="مدينة القيام"
                          className="w-full p-2 text-xs border border-gray-200 rounded-lg"
                          value={formData.origin}
                          onChange={(e) => setFormData({...formData, origin: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-500 font-bold mb-1">الوجهة *</label>
                        <input 
                          type="text" required placeholder="مدينة الوصول"
                          className="w-full p-2 text-xs border border-gray-200 rounded-lg"
                          value={formData.destination}
                          onChange={(e) => setFormData({...formData, destination: e.target.value})}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" disabled={isLoading}
                      className="w-full bg-[#009695] text-white font-bold py-2 rounded-lg text-xs"
                    >
                      🚀 إرسال طلب التسعير اللوجستي
                    </button>
                  </form>
                )}
              </div>

              {!showForm && (
                <div className="p-3 border-t bg-white flex gap-2">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                    placeholder={isTrackingMode ? "اكتب رقم البوليصة واضغط إرسال..." : "اكتب استفسارك هنا..."} 
                    className="flex-1 p-2 text-xs border border-gray-200 rounded-xl outline-none font-sans"
                  />
                  <button 
                    onClick={() => handleSendMessage(inputText)}
                    className="bg-[#009695] text-white px-4 rounded-xl text-xs font-bold"
                  >
                    إرسال
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}