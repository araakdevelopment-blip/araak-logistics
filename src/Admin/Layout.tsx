import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Truck, MessageSquare,
  Menu, X, LogOut, Globe, ChevronLeft,
} from 'lucide-react';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'لوحة التحكم', end: true },
  { to: '/admin/quotes', icon: FileText, label: 'طلبات التسعير', end: false },
  { to: '/admin/shipments', icon: Truck, label: 'إدارة الشحنات', end: false },
  { to: '/admin/messages', icon: MessageSquare, label: 'رسائل التواصل', end: false },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-100 font-cairo" dir="rtl">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 right-0 left-0 z-40 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center">
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center">
            <span className="text-brand-900 font-cairo font-black text-sm">ل</span>
          </div>
          <span className="font-cairo font-bold text-neutral-900 text-sm">لاراك لوجستيك</span>
        </div>
        <div />
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/30" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 z-30 h-full bg-brand-900 transition-all duration-300 flex flex-col ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold">
                <span className="text-brand-900 font-cairo font-black text-lg">ل</span>
              </div>
              <div>
                <p className="text-white font-cairo font-bold text-sm">لاراك لوجستيك</p>
                <p className="text-white/40 font-inter text-xs">Admin Panel</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 items-center justify-center transition-colors"
          >
            <ChevronLeft size={16} className={`text-white transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-white/15 text-white shadow-lg'
                    : 'text-white/60 hover:bg-white/10 hover:text-white/90'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <item.icon size={20} />
              {!collapsed && <span className="font-cairo font-semibold text-sm">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-white/90 transition-all"
          >
            <Globe size={20} />
            {!collapsed && <span className="font-cairo font-semibold text-sm">الموقع الرئيسي</span>}
          </NavLink>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-error-400 hover:bg-white/5 transition-all w-full">
            <LogOut size={20} />
            {!collapsed && <span className="font-cairo font-semibold text-sm">تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          collapsed ? 'lg:mr-20' : 'lg:mr-64'
        } pt-16 lg:pt-0`}
      >
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
