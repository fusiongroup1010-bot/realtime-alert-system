'use client';
import React, { useState } from 'react';
import { ScrollText, Download, Search, User, Settings, Bell, Shield, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import clsx from 'clsx';
import { useAppContext } from '@/context/AppContext';
import Toast from '@/components/ui/Toast';
import { exportToExcel } from '@/utils/export';

const auditLogs = [
  { id: 'LOG-001', time: '14:05:23', user: 'ceo_fusion', action: 'ESCALATE', target: 'ALT-101', detail: 'Manually escalated ROAS alert to P1', type: 'incident', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  { id: 'LOG-002', time: '13:55:10', user: 'leader_online', action: 'ACK', target: 'ALT-102', detail: 'Acknowledged stock cover alert', type: 'incident', icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'LOG-003', time: '13:42:01', user: 'system', action: 'TRIGGER', target: 'Rule A3', detail: 'Auto-triggered: Stock Cover dropped to 1.2x', type: 'system', icon: Bell, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { id: 'LOG-004', time: '13:30:00', user: 'admin', action: 'UPDATE_RULE', target: 'Rule A1', detail: 'Changed ROAS threshold from 5.0 to 5.5', type: 'config', icon: Settings, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'LOG-005', time: '13:10:44', user: 'executor_cs_1', action: 'RESOLVE', target: 'ALT-103', detail: 'Resolved CS first response alert — SLA met', type: 'incident', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
  { id: 'LOG-006', time: '12:58:12', user: 'system', action: 'TRIGGER', target: 'Rule A2', detail: 'Auto-triggered: CS response time exceeded 5m', type: 'system', icon: Bell, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { id: 'LOG-007', time: '12:15:33', user: 'admin', action: 'CREATE_RULE', target: 'Rule A6', detail: 'New rule: Delivery SLA Breach detection', type: 'config', icon: Shield, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { id: 'LOG-008', time: '11:30:55', user: 'leader_offline', action: 'ESCALATE', target: 'ALT-104', detail: 'Escalated offline popup performance issue', type: 'incident', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  { id: 'LOG-009', time: '11:00:00', user: 'system', action: 'HEALTH_CHECK', target: 'System', detail: 'Scheduled health check passed. All services nominal.', type: 'system', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
  { id: 'LOG-010', time: '10:15:22', user: 'leader_online', action: 'RESOLVE', target: 'ALT-105', detail: 'Resolved ROAS drop alert — metric recovered', type: 'incident', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
];

const typeColors: Record<string, string> = {
  incident: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  system: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  config: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
};



export default function AuditHistoryPage() {
  const { selectedDate } = useAppContext();
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ visible: boolean; msg: string; en: string }>({ visible: false, msg: '', en: '' });

  const handleExport = () => {
    setToast({ visible: true, msg: 'Đang chuẩn bị file CSV...', en: 'Preparing CSV file...' });
    
    const headers = [
      { vi: 'Mã nhật ký', en: 'Log ID', key: 'id' },
      { vi: 'Thời gian', en: 'Time', key: 'time' },
      { vi: 'Người dùng', en: 'User', key: 'user' },
      { vi: 'Hành động', en: 'Action', key: 'action' },
      { vi: 'Đối tượng', en: 'Target', key: 'target' },
      { vi: 'Chi tiết', en: 'Detail', key: 'detail' },
      { vi: 'Phân loại', en: 'Type', key: 'type' },
    ];

    setTimeout(() => {
      exportToExcel(auditLogs, headers, `Audit_Logs_${selectedDate}`);
      setToast({ visible: true, msg: 'Đã tải xuống file nhật ký thành công!', en: 'Audit log downloaded successfully!' });
    }, 1500);
  };

  const filtered = auditLogs.filter(log => {
    const matchType = typeFilter === 'ALL' || log.type.toUpperCase() === typeFilter;
    const matchSearch = log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.detail.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Nhật ký ngày {selectedDate} / Audit History</h2>
          <p className="text-sm text-textSecondary mt-1">Lịch sử hoạt động ghi nhận trong ngày đã chọn / Activity log for the selected date</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex flex-col items-center px-3 py-2 text-xs font-medium bg-surface border border-borderSubtle rounded-lg text-textSecondary hover:text-white transition-colors w-fit leading-tight"
        >
          <div className="flex items-center">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Xuất file CSV
          </div>
          <span className="text-[10px] opacity-60">Export CSV</span>
        </button>
      </div>

      <Toast 
        isVisible={toast.visible} 
        onClose={() => setToast({ ...toast, visible: false })}
        message={toast.msg}
        enMessage={toast.en}
      />

      <div className="grid grid-cols-3 gap-4">
        {[
          { vi: 'Sự cố', en: 'Incident Events', count: auditLogs.filter(l => l.type === 'incident').length, color: 'text-orange-400', icon: AlertTriangle },
          { vi: 'Hệ thống', en: 'System Events', count: auditLogs.filter(l => l.type === 'system').length, color: 'text-blue-400', icon: Bell },
          { vi: 'Cấu hình', en: 'Config Changes', count: auditLogs.filter(l => l.type === 'config').length, color: 'text-purple-400', icon: Settings },
        ].map(card => (
          <div key={card.en} className="glass-panel rounded-xl p-4 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-borderSubtle">
              <card.icon className={clsx("w-5 h-5", card.color)} />
            </div>
            <div>
              <p className={clsx("text-2xl font-bold", card.color)}>{card.count}</p>
              <p className="text-[10px] text-textSecondary leading-tight">
                <span>{card.vi}</span><br/>
                <span className="opacity-60">{card.en}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-borderSubtle flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex space-x-1 bg-background/50 rounded-lg p-1">
            {([
              { vi: 'Tất cả', en: 'ALL' },
              { vi: 'Sự cố', en: 'INCIDENT' },
              { vi: 'Hệ thống', en: 'SYSTEM' },
              { vi: 'Cấu hình', en: 'CONFIG' }
            ] as const).map(t => (
              <button key={t.en} onClick={() => setTypeFilter(t.en)}
                className={clsx("px-3 py-1.5 rounded-md text-[10px] font-semibold transition-all flex flex-col items-center leading-tight",
                  typeFilter === t.en ? "bg-accentGlow text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]" : "text-textSecondary hover:text-white")}>
                <span>{t.vi}</span>
                <span className="opacity-70 text-[8px] uppercase">{t.en}</span>
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
            <input type="text" placeholder="Tìm kiếm nhật ký... / Search logs..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-surface border border-borderSubtle rounded-lg text-sm text-white placeholder-textSecondary focus:outline-none focus:ring-1 focus:ring-accentGlow w-64 transition-all italic" />
          </div>
        </div>

        <div className="divide-y divide-borderSubtle">
          {filtered.map(log => (
            <div key={log.id} className="px-6 py-4 hover:bg-surface/50 transition-colors flex items-start gap-4">
              <div className={clsx("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border border-white/5", log.bg)}>
                <log.icon className={clsx("w-4 h-4", log.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={clsx("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border", typeColors[log.type])}>
                    {log.type}
                  </span>
                  <span className="text-xs font-bold text-white bg-surface border border-borderSubtle px-2 py-0.5 rounded font-mono">{log.action}</span>
                  <span className="text-xs text-textSecondary">→</span>
                  <span className="text-xs font-medium text-accentGlow">{log.target}</span>
                </div>
                <p className="text-sm text-white/80">{log.detail}</p>
                <div className="flex items-center space-x-3 mt-1.5">
                  <div className="flex items-center space-x-1 text-xs text-textSecondary">
                    <User className="w-3 h-3" /><span className="font-mono">{log.user}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-textSecondary">
                    <Clock className="w-3 h-3" /><span>{log.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-6 py-16 text-center text-textSecondary">
              <ScrollText className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Không tìm thấy nhật ký nào / No logs found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
