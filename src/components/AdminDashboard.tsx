import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { X, Lock, Truck, Save, ClipboardList, CheckCircle2, Trash2, Send } from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'quotations' | 'shipments'>('quotations');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  
  const [shipments, setShipments] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [newShipment, setNewShipment] = useState({
    tracking_number: 'ARK-',
    customer_name: '',
    phone_number: '',
    weight: '',
    shipment_type: 'بري',
    status: 'in_transit',
    origin: '',
    destination: '',
    current_location: '',
    notes: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    const { data: sData } = await supabase.from('shipments').select('*').order('updated_at', { ascending: false });
    const { data: qData } = await supabase.from('quotation_requests').select('*');
    setShipments(sData || []);
    setQuotations(qData || []);
    setIsLoading(false);
  };

  useEffect(() => { if (isAuthenticated) fetchData(); }, [isAuthenticated]);

  const handleConvertToShipment = (quote: any) => {
    setNewShipment({
      ...newShipment,
      customer_name: quote.customer_name,
      phone_number: quote.phone_number || '',
      weight: quote.weight || '',
      origin: quote.origin_city || '',
      destination: quote.destination_city || '',
      notes: `تم التحويل من طلب تسعير رقم: ${quote.id}`
    });
    setActiveTab('shipments');
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.from('shipments').insert([{
      waybill_number: newShipment.tracking_number,
      company_name: newShipment.customer_name,
      phone_number: newShipment.phone_number,
      weight: newShipment.weight,
      shipment_type: newShipment.shipment_type,
      status: newShipment.status,
      origin_city: newShipment.origin,
      destination_city: newShipment.destination,
      current_location: newShipment.current_location,
      notes: newShipment.notes
    }]);

    if (!error) {
      alert('تم حفظ الشحنة بنجاح');
      fetchData();
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        <div className="bg-[#00172b] p-6 text-white flex justify-between items-center">
          <h2 className="font-bold text-lg flex items-center gap-2"><Truck className="text-amber-400" /> لوحة تحكم أراك</h2>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full"><X size={20} /></button>
        </div>

        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#00172b] to-[#004581]">
            <div className="w-full max-w-md backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 text-center">
              <Lock className="text-white mx-auto mb-4" size={40} />
              <h3 className="text-white text-2xl font-bold mb-6">بوابة الإدارة</h3>
              <input type="password" placeholder="أدخل رمز الدخول..." className="w-full p-4 rounded-2xl mb-4 text-center" onChange={(e) => setAdminCode(e.target.value)} />
              <button onClick={() => {if(adminCode === 'AraakAdmin2026') setIsAuthenticated(true); else setError('خطأ في الرمز')}} className="w-full bg-white text-[#00172b] font-bold py-3 rounded-2xl">فتح اللوحة</button>
              {error && <p className="text-red-300 mt-2 text-sm">{error}</p>}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex gap-4 p-4 border-b bg-gray-50">
              <button onClick={() => setActiveTab('quotations')} className={`font-bold px-6 py-2 rounded-xl ${activeTab === 'quotations' ? 'bg-white shadow text-[#004581]' : 'text-gray-500'}`}>طلبات التسعير ({quotations.length})</button>
              <button onClick={() => setActiveTab('shipments')} className={`font-bold px-6 py-2 rounded-xl ${activeTab === 'shipments' ? 'bg-white shadow text-[#004581]' : 'text-gray-500'}`}>إدارة الشحنات ({shipments.length})</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {activeTab === 'quotations' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quotations.map((q) => (
                    <div key={q.id} className="bg-white p-6 rounded-2xl border shadow-sm hover:border-[#004581] transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-lg">{q.customer_name}</h4>
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">{q.shipment_type || 'بري'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-3 text-sm mb-6">
                        <div><p className="text-gray-400 text-[10px]">الهاتف</p><p className="font-medium">{q.phone_number || 'غير متاح'}</p></div>
                        <div><p className="text-gray-400 text-[10px]">الوزن</p><p className="font-medium">{q.weight || '-'} كجم</p></div>
                        <div><p className="text-gray-400 text-[10px]">المصدر</p><p className="font-medium">{q.origin_city || '-'}</p></div>
                        <div><p className="text-gray-400 text-[10px]">الوجهة</p><p className="font-medium">{q.destination_city || '-'}</p></div>
                        <div className="col-span-2"><p className="text-gray-400 text-[10px]">ملاحظات</p><p className="text-xs">{q.cargo_details || 'لا توجد'}</p></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-t pt-4">
                        <button onClick={() => handleConvertToShipment(q)} className="bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors">تحويل لبوليصة</button>
                        <button className="bg-amber-500 text-white py-2 rounded-lg text-xs font-bold">اعتماد الطلب</button>
                        <button className="bg-gray-200 text-gray-700 py-2 rounded-lg text-xs font-bold">تمرير للإدارة</button>
                        <button className="bg-red-50 text-red-600 py-2 rounded-lg text-xs font-bold">إلغاء الطلب</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl h-fit border shadow-sm">
                    <h3 className="font-bold mb-4 text-sm">إضافة / تعديل شحنة</h3>
                    <form onSubmit={handleCreateShipment} className="space-y-3">
                      <input type="text" placeholder="رقم البوليصة" className="w-full p-2 border rounded-lg text-xs" value={newShipment.tracking_number} onChange={e => setNewShipment({...newShipment, tracking_number: e.target.value})} />
                      <input type="text" placeholder="اسم الشركة" className="w-full p-2 border rounded-lg text-xs" value={newShipment.customer_name} onChange={e => setNewShipment({...newShipment, customer_name: e.target.value})} />
                      <input type="text" placeholder="رقم الهاتف" className="w-full p-2 border rounded-lg text-xs" onChange={e => setNewShipment({...newShipment, phone_number: e.target.value})} />
                      <input type="text" placeholder="الوزن (كجم)" className="w-full p-2 border rounded-lg text-xs" onChange={e => setNewShipment({...newShipment, weight: e.target.value})} />
                      <button type="submit" className="w-full bg-[#00172b] text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 text-xs"><Save size={16} /> حفظ الشحنة</button>
                    </form>
                  </div>
                  <div className="lg:col-span-2 space-y-3">
                    {shipments.map((s) => (
                      <div key={s.id} className="p-5 border rounded-2xl bg-white shadow-sm border-r-4 border-r-emerald-500">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-sm">{s.waybill_number} - {s.company_name}</h4>
                          <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">{s.status}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                          <div><span className="text-gray-400">من:</span> {s.origin_city}</div>
                          <div><span className="text-gray-400">إلى:</span> {s.destination_city}</div>
                          <div><span className="text-gray-400">الوزن:</span> {s.weight || 0} كجم</div>
                          <div className="col-span-3 border-t pt-2 mt-2 italic text-gray-500">الملاحظات: {s.notes || 'لا يوجد'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}