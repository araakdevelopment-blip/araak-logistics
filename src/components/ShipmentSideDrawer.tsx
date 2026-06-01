import React from 'react';
import { X, Truck, User, MapPin, Shield } from 'lucide-react';

type DrawerProps = {
  shipment: any;
  onClose: () => void;
};

export default function ShipmentSideDrawer({ shipment, onClose }: DrawerProps) {
  if (!shipment) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 flex justify-end backdrop-blur-sm transition-all" onClick={onClose}>
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between" 
        onClick={e => e.stopPropagation()}
      >
        <div>
          {/* الرأس */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-[#071a38]">ملف الشحنة الموحد</h2>
              <p className="text-xs text-[#2f7dff] font-bold mt-0.5">{shipment.shipment_number}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all">
              <X size={18} />
            </button>
          </div>

          {/* الأصل 1: الشاحنة وصورتها */}
          <div className="border border-slate-100 rounded-2xl p-4 bg-[#f8fafc] mb-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-[#2f7dff]">
              <Truck size={18} />
              <h3 className="font-bold text-sm">بيانات وتواجد المركبة</h3>
            </div>
            {shipment.vehicles?.photo_url ? (
              <img src={shipment.vehicles.photo_url} alt="الشاحنة" className="w-full h-44 object-cover rounded-xl mb-3 shadow-sm border border-slate-200" />
            ) : (
              <div className="w-full h-28 bg-slate-200/60 rounded-xl flex items-center justify-center text-xs text-slate-400 font-bold mb-3 border border-dashed border-slate-300">لم يتم رفع صورة الشاحنة للنظام</div>
            )}
            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-600">
              <p className="bg-white p-2 rounded-lg border border-slate-100">نوع المركبة: <span className="text-[#071a38]">{shipment.vehicles?.type || 'تريلا نقل ثقيل'}</span></p>
              <p className="bg-white p-2 rounded-lg border border-slate-100">رقم اللوحة: <span className="text-[#071a38]">{shipment.vehicles?.plate_number || 'أ ر ك 123'}</span></p>
            </div>
          </div>

          {/* الأصل 2: السائق وصورته */}
          <div className="border border-slate-100 rounded-2xl p-4 bg-[#f8fafc] mb-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-green-600">
              <User size={18} />
              <h3 className="font-bold text-sm">السائق المسؤول</h3>
            </div>
            <div className="flex items-center gap-4">
              {shipment.drivers?.photo_url ? (
                <img src={shipment.drivers.photo_url} alt="السائق" className="w-14 h-14 rounded-full object-cover shadow-md border border-white ring-2 ring-green-500/20" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[#071a38] text-xs">كابتن</div>
              )}
              <div className="flex flex-col text-right">
                <strong className="text-sm font-bold text-[#071a38]">{shipment.drivers?.name || 'جاري التعيين...'}</strong>
                <span className="text-xs text-slate-400 mt-0.5">{shipment.drivers?.phone || '+966 50000000'}</span>
              </div>
            </div>
          </div>

          {/* التواجد الحالي */}
          <div className="border border-slate-100 rounded-2xl p-4 bg-[#f8fafc] shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-[#ff9f1a]">
              <Shield size={18} />
              <h3 className="font-bold text-sm">المسار ونقطة التسليم</h3>
            </div>
            <p className="text-xs font-bold text-slate-600">المسار التشغيلي المعتمد:</p>
            <p className="text-sm font-black text-[#071a38] mt-1">{shipment.origin_city || 'جده'} ➔ {shipment.destination_city || 'الرياض'}</p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 mt-4">
          <button className="w-full bg-[#071a38] text-white p-3.5 rounded-xl font-bold text-sm hover:bg-[#0c2650] transition-all">
            تحديث بيانات الرحلة أو تعديل الحالة
          </button>
        </div>
      </div>
    </div>
  );
}