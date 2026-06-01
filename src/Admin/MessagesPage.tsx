import { useEffect, useState } from 'react';
import {
  Search, Filter, ChevronLeft, ChevronRight, Eye,
  MessageCircle, Mail, CheckCircle, X,
} from 'lucide-react';
import { supabase, type ContactMessage } from '../lib/supabase';

const STATUS_OPTIONS = [
  { value: 'all', label: 'الكل' },
  { value: 'unread', label: 'جديد' },
  { value: 'read', label: 'مقروءة' },
  { value: 'replied', label: 'تم الرد' },
  { value: 'closed', label: 'مغلقة' },
];

const statusStyle: Record<string, string> = {
  unread: 'bg-warning-50 text-warning-600 border-warning-200',
  read: 'bg-brand-50 text-brand-600 border-brand-200',
  replied: 'bg-success-50 text-success-600 border-success-200',
  closed: 'bg-neutral-100 text-neutral-500 border-neutral-200',
};

const statusLabel: Record<string, string> = {
  unread: 'جديد', read: 'مقروءة', replied: 'تم الرد', closed: 'مغلقة',
};

const ITEMS_PER_PAGE = 10;

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => { loadMessages(); }, [page, statusFilter, search]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      let query = supabase.from('contact_messages').select('*', { count: 'exact' });

      if (statusFilter !== 'all') query = query.eq('status', statusFilter);
      if (search.trim()) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`);
      }

      query = query.order('created_at', { ascending: false });
      query = query.range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      const { data, count, error } = await query;
      if (error) throw error;
      setMessages(data ?? []);
      setTotalCount(count ?? 0);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('contact_messages').update({ status }).eq('id', id);
    loadMessages();
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const markAsRead = async (msg: ContactMessage) => {
    if (msg.status === 'unread') {
      await updateStatus(msg.id!, 'read');
    }
    setSelected(msg);
    setDetailOpen(true);
  };

  const openWhatsApp = (phone: string) => {
    const cleaned = phone.replace(/\s/g, '').replace(/^0/, '+966');
    window.open(`https://wa.me/${cleaned.replace('+', '')}`, '_blank');
    if (selected) {
      supabase.from('contact_messages').update({ whatsapp_sent: true }).eq('id', selected.id);
      setSelected(prev => prev ? { ...prev, whatsapp_sent: true } : null);
    }
  };

  const openEmail = (email: string, subject: string) => {
    window.open(`mailto:${email}?subject=Re: ${subject}`, '_blank');
    if (selected) {
      supabase.from('contact_messages').update({ email_sent: true }).eq('id', selected.id);
      setSelected(prev => prev ? { ...prev, email_sent: true } : null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-cairo font-black text-neutral-900 text-3xl">رسائل التواصل</h1>
          <p className="text-neutral-500 font-cairo text-sm mt-1">إدارة رسائل العملاء والاستفسارات</p>
        </div>
        <span className="px-4 py-2 bg-brand-50 text-brand-600 font-cairo font-semibold text-sm rounded-xl border border-brand-200">
          {totalCount} رسالة
        </span>
      </div>

      {/* Filters */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="بحث بالاسم، البريد، الموضوع..."
            className="w-full pr-10 pl-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-cairo text-sm placeholder-neutral-400 focus:outline-none focus:border-brand-400 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-neutral-400" />
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map(o => (
              <button
                key={o.value}
                onClick={() => { setStatusFilter(o.value); setPage(1); }}
                className={`px-3 py-2 rounded-xl font-cairo text-xs font-semibold transition-all ${
                  statusFilter === o.value
                    ? 'bg-brand-gradient text-white shadow-brand'
                    : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:border-brand-300'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-neutral-200 border-t-brand-600 rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <p className="py-16 text-center text-neutral-400 font-cairo">لا توجد رسائل تطابق البحث</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="text-right px-5 py-3 font-cairo font-bold text-neutral-600 text-xs">المرسل</th>
                  <th className="text-right px-5 py-3 font-cairo font-bold text-neutral-600 text-xs">الموضوع</th>
                  <th className="text-right px-5 py-3 font-cairo font-bold text-neutral-600 text-xs">الحالة</th>
                  <th className="text-right px-5 py-3 font-cairo font-bold text-neutral-600 text-xs">التاريخ</th>
                  <th className="text-center px-5 py-3 font-cairo font-bold text-neutral-600 text-xs">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {messages.map(m => (
                  <tr key={m.id} className={`hover:bg-neutral-50/50 transition-colors ${m.status === 'unread' ? 'bg-warning-50/30' : ''}`}>
                    <td className="px-5 py-4">
                      <p className="font-cairo font-semibold text-neutral-900">{m.name}</p>
                      <p className="text-neutral-400 font-cairo text-xs" dir="ltr">{m.email}</p>
                    </td>
                    <td className="px-5 py-4 font-cairo text-neutral-700 max-w-[200px] truncate">{m.subject}</td>
                    <td className="px-5 py-4">
                      <select
                        value={m.status}
                        onChange={e => updateStatus(m.id!, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl font-cairo text-xs font-semibold border cursor-pointer ${statusStyle[m.status ?? 'unread']}`}
                      >
                        {STATUS_OPTIONS.filter(o => o.value !== 'all').map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 font-cairo text-neutral-500 text-xs">
                      {new Date(m.created_at!).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => markAsRead(m)} className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center hover:bg-brand-50 hover:border-brand-200 transition-all" title="عرض">
                          <Eye size={14} className="text-neutral-500" />
                        </button>
                        {m.phone && (
                          <button onClick={() => openWhatsApp(m.phone!)} className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center hover:bg-success-50 hover:border-success-200 transition-all" title="واتساب">
                            <MessageCircle size={14} className="text-success-600" />
                          </button>
                        )}
                        <button onClick={() => openEmail(m.email, m.subject)} className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center hover:bg-brand-50 hover:border-brand-200 transition-all" title="بريد">
                          <Mail size={14} className="text-brand-600" />
                        </button>
                        {m.status !== 'closed' && (
                          <button onClick={() => updateStatus(m.id!, 'closed')} className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center hover:bg-neutral-200 transition-all" title="إغلاق">
                            <CheckCircle size={14} className="text-neutral-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-neutral-100 flex items-center justify-between">
            <p className="text-neutral-400 font-cairo text-xs">صفحة {page} من {totalPages} — {totalCount} رسالة</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center disabled:opacity-40 hover:bg-brand-50 transition-all">
                <ChevronRight size={14} />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center disabled:opacity-40 hover:bg-brand-50 transition-all">
                <ChevronLeft size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailOpen && selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setDetailOpen(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="font-cairo font-bold text-neutral-900 text-lg">تفاصيل الرسالة</h3>
              <button onClick={() => setDetailOpen(false)} className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-neutral-400 text-xs mb-1">الاسم</p>
                  <p className="font-cairo font-semibold text-sm">{selected.name}</p>
                </div>
                <div>
                  <p className="text-neutral-400 text-xs mb-1">البريد</p>
                  <p className="font-cairo text-sm" dir="ltr">{selected.email}</p>
                </div>
                <div>
                  <p className="text-neutral-400 text-xs mb-1">الجوال</p>
                  <p className="font-cairo text-sm" dir="ltr">{selected.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-neutral-400 text-xs mb-1">الحالة</p>
                  <span className={`px-3 py-1 rounded-full font-cairo text-xs font-semibold ${statusStyle[selected.status ?? 'unread']}`}>
                    {statusLabel[selected.status ?? 'unread']}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-neutral-400 text-xs mb-1">الموضوع</p>
                <p className="font-cairo font-semibold text-sm">{selected.subject}</p>
              </div>

              <div>
                <p className="text-neutral-400 text-xs mb-1">الرسالة</p>
                <p className="font-cairo text-sm bg-neutral-50 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              {/* Reply indicators */}
              <div className="flex gap-3">
                {selected.whatsapp_sent && (
                  <span className="flex items-center gap-1 text-success-600 font-cairo text-xs">
                    <MessageCircle size={12} /> تم الرد عبر واتساب
                  </span>
                )}
                {selected.email_sent && (
                  <span className="flex items-center gap-1 text-brand-600 font-cairo text-xs">
                    <Mail size={12} /> تم الرد عبر البريد
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-neutral-100 flex items-center justify-end gap-3">
              {selected.status !== 'closed' && (
                <button
                  onClick={() => { updateStatus(selected.id!, 'closed'); setDetailOpen(false); }}
                  className="px-4 py-2.5 bg-neutral-100 text-neutral-600 font-cairo font-semibold text-sm rounded-xl hover:bg-neutral-200 transition-all"
                >
                  إغلاق الرسالة
                </button>
              )}
              {selected.phone && (
                <button
                  onClick={() => openWhatsApp(selected.phone!)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-success-500 text-white font-cairo font-bold text-sm rounded-xl hover:bg-success-600 transition-all"
                >
                  <MessageCircle size={14} />
                  رد واتساب
                </button>
              )}
              <button
                onClick={() => openEmail(selected.email, selected.subject)}
                className="flex items-center gap-2 px-4 py-2.5 bg-brand-gradient text-white font-cairo font-bold text-sm rounded-xl shadow-brand hover:shadow-lg transition-all"
              >
                <Mail size={14} />
                رد بريد إلكتروني
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
