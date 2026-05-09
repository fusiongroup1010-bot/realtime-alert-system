'use client';
import React, { useState } from 'react';
import { ShieldAlert, Filter, Download, RefreshCw, Clock, CheckCircle2, ChevronDown, Search, Bell, MoreHorizontal, ChevronRight, Zap } from 'lucide-react';
import clsx from 'clsx';
import { useAppContext } from '@/context/AppContext';
import { exportToExcel } from '@/utils/export';
import Toast from '@/components/ui/Toast';
import SlaTimer from '@/components/ui/SlaTimer';

const severityConfig: Record<string, string> = {
  P1: 'bg-red-500/10 text-red-400 border-red-500/30',
  P2: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  P3: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
};

const statusConfig: Record<string, string> = {
  NEW: 'text-red-400',
  PROCESSING: 'text-blue-400',
  NOTIFY_CEO: 'text-purple-400',
  ESCALATED: 'text-red-500 animate-pulse',
  RESOLVED: 'text-green-400',
};

const statusBg: Record<string, string> = {
  NEW: 'bg-red-500/10 border-red-500/20 text-red-400',
  PROCESSING: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  NOTIFY_CEO: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  ESCALATED: 'bg-red-500/10 border-red-500/20 text-red-500 animate-pulse',
  RESOLVED: 'bg-green-500/10 border-green-500/20 text-green-400',
};

const statusLabel: Record<string, string> = {
  NEW: 'Mới / New',
  PROCESSING: 'Đang xử lý / Processing',
  NOTIFY_CEO: 'Báo Quản lý / Notify to Manager',
  ESCALATED: 'Báo Quản lý / Notify to Manager',
  RESOLVED: 'Xong / Resolved',
};


export default function LiveIncidentsPage() {
  const { selectedDate, rules, incidents, handleIncidentAction, showToast } = useAppContext();
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast('Đã cập nhật dữ liệu mới nhất!', 'Live data updated!', 'info');
    }, 1200);
  };

  const handleExport = () => {
    showToast('Đang trích xuất dữ liệu sự cố...', 'Extracting incident data...', 'info');
    
    const headers = [
      { vi: 'Mã sự cố', en: 'Incident ID', key: 'id' },
      { vi: 'Quy tắc', en: 'Rule', key: 'rule' },
      { vi: 'Thời gian', en: 'Time', key: 'time' },
      { vi: 'Mức độ', en: 'Severity', key: 'severity' },
      { vi: 'Trạng thái', en: 'Status', key: 'status' },
      { vi: 'Đội ngũ', en: 'Team', key: 'team' },
      { vi: 'Phòng ban', en: 'Dept', key: 'dept' },
      { vi: 'Người xử lý', en: 'Assignee', key: 'assignee' },
    ];

    setTimeout(() => {
      exportToExcel(incidents, headers, `Incidents_Report_${selectedDate}`);
      showToast('Đã tải xuống file báo cáo sự cố!', 'Incident report downloaded!', 'P3');
    }, 1500);
  };

  const handleAction = (id: string, actionType: 'ACK' | 'RESOLVE' | 'NOTIFY') => {
    handleIncidentAction(id, actionType);

    const actionNames: Record<string, { vi: string, en: string }> = {
      ACK: { vi: 'Xác nhận', en: 'Acknowledge' },
      RESOLVE: { vi: 'Xử lý xong', en: 'Resolved' },
      NOTIFY: { vi: 'Báo Quản lý', en: 'Notified Manager' }
    };

    showToast(
      `Sự cố ${id}: Đã thực hiện thao tác ${actionNames[actionType].vi}!`, 
      `Incident ${id}: Performed ${actionNames[actionType].en}!`,
      'info'
    );
  };

  const getRuleInfo = (code: string) => {
    const rule = rules.find(r => r.code === code);
    return {
      name: rule ? rule.name : `${code}: Unknown Rule`,
      severity: rule ? rule.severity : 'P3'
    };
  };

  const filtered = incidents.filter(i => {
    const ruleInfo = getRuleInfo(i.ruleCode);
    const matchFilter = filter === 'ALL' || i.status === filter;
    const matchSearch = i.id.toLowerCase().includes(search.toLowerCase()) ||
      ruleInfo.name.toLowerCase().includes(search.toLowerCase()) ||
      i.team.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    ALL: incidents.length,
    NEW: incidents.filter(i => i.status === 'NEW').length,
    PROCESSING: incidents.filter(i => i.status === 'PROCESSING').length,
    NOTIFY_CEO: incidents.filter(i => i.status === 'NOTIFY_CEO' || i.status === 'ESCALATED').length,
    RESOLVED: incidents.filter(i => i.status === 'RESOLVED').length,
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Sự cố ngày {selectedDate} / Live Incidents</h2>
          <p className="text-sm text-textSecondary mt-1">Theo dõi thời gian thực các cảnh báo trong ngày đã chọn / Monitoring alerts for the selected date</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="flex items-center px-3 py-2 text-xs font-medium bg-surface border border-borderSubtle rounded-lg text-textSecondary hover:text-white transition-colors flex flex-col items-center"
          >
            <div className="flex items-center">
              <RefreshCw className={clsx("w-3.5 h-3.5 mr-1.5", refreshing && "animate-spin")} />
              Tải lại
            </div>
            <span className="text-[8px] opacity-60">Refresh</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center px-3 py-2 text-xs font-medium bg-surface border border-borderSubtle rounded-lg text-textSecondary hover:text-white transition-colors flex flex-col items-center"
          >
            <div className="flex items-center">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Xuất dữ liệu
            </div>
            <span className="text-[8px] opacity-60">Export</span>
          </button>
        </div>
      </div>



      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { vi: 'Mới', en: 'New', count: counts.NEW, color: 'text-red-400', dot: 'bg-red-500', glow: 'shadow-[0_0_8px_rgba(239,68,68,0.6)]' },
          { vi: 'Đang xử lý', en: 'Processing', count: counts.PROCESSING, color: 'text-blue-400', dot: 'bg-blue-500', glow: '' },
          { vi: 'Báo Quản lý', en: 'Notify Manager', count: counts.NOTIFY_CEO, color: 'text-purple-400', dot: 'bg-purple-500', glow: '' },
          { vi: 'Đã xử lý hôm nay', en: 'Resolved Today', count: counts.RESOLVED, color: 'text-green-400', dot: 'bg-green-500', glow: '' },
        ].map(s => (
          <div key={s.en} className="glass-panel rounded-xl p-4 flex items-center space-x-3">
            <div className={clsx("w-2.5 h-2.5 rounded-full shrink-0", s.dot, s.glow)} />
            <div>
              <p className={clsx("text-2xl font-bold", s.color)}>{s.count}</p>
              <p className="text-[10px] text-textSecondary leading-tight">
                <span>{s.vi}</span><br/>
                <span className="opacity-60">{s.en}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-borderSubtle flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Tab filters */}
          <div className="flex space-x-1 bg-background/50 rounded-lg p-1">
            {([
              { vi: 'Tất cả', en: 'ALL' },
              { vi: 'Mới', en: 'NEW' },
              { vi: 'Đang xử lý', en: 'PROCESSING' },
              { vi: 'Báo Quản lý', en: 'NOTIFY_CEO' },
              { vi: 'Xong', en: 'RESOLVED' }
            ]).map(s => (
              <button
                key={s.en}
                onClick={() => setFilter(s.en)}
                className={clsx(
                  "px-3 py-1.5 rounded-md text-[10px] font-semibold transition-all flex flex-col items-center leading-tight",
                  filter === s.en
                    ? "bg-accentGlow text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                    : "text-textSecondary hover:text-white"
                )}
              >
                <span>{s.vi}</span>
                <span className="opacity-70 text-[8px] uppercase">{s.en} ({counts[s.en as keyof typeof counts]})</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
            <input
              type="text"
              placeholder="Tìm kiếm sự cố... / Search incidents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-surface border border-borderSubtle rounded-lg text-sm text-white placeholder-textSecondary focus:outline-none focus:ring-1 focus:ring-accentGlow w-64 transition-all italic"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background/50 border-b border-borderSubtle text-textSecondary font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">
                  <div className="flex flex-col">
                    <span>ID Sự Cố</span>
                    <span className="opacity-60 lowercase font-normal">Incident ID</span>
                  </div>
                </th>
                <th className="px-6 py-4">
                  <div className="flex flex-col">
                    <span>Thời gian</span>
                    <span className="opacity-60 lowercase font-normal">Time (GMT+7)</span>
                  </div>
                </th>
                <th className="px-6 py-4">
                  <div className="flex flex-col">
                    <span>Quy tắc / Nhóm</span>
                    <span className="opacity-60 lowercase font-normal">Rule / Team</span>
                  </div>
                </th>
                <th className="px-6 py-4">
                  <div className="flex flex-col">
                    <span>Mức độ</span>
                    <span className="opacity-60 lowercase font-normal">Severity</span>
                  </div>
                </th>
                <th className="px-6 py-4">
                  <div className="flex flex-col">
                    <span>Trạng thái</span>
                    <span className="opacity-60 lowercase font-normal">Status</span>
                  </div>
                </th>
                <th className="px-6 py-4">
                  <div className="flex flex-col">
                    <span>Người xử lý</span>
                    <span className="opacity-60 lowercase font-normal">Assignee</span>
                  </div>
                </th>
                <th className="px-6 py-4">
                  <div className="flex flex-col">
                    <span>Đồng hồ SLA</span>
                    <span className="opacity-60 lowercase font-normal">SLA Timer</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end">
                    <span>Thao tác</span>
                    <span className="opacity-60 lowercase font-normal">Actions</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderSubtle">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-textSecondary">
                    <ShieldAlert className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Không tìm thấy sự cố nào / No incidents found</p>
                  </td>
                </tr>
              ) : (
                filtered.map(incident => {
                  const ruleInfo = getRuleInfo(incident.ruleCode);
                  return (
                    <tr
                      key={incident.id}
                      className={clsx(
                        "transition-colors group cursor-pointer hover:bg-surface",
                        ruleInfo.severity === 'P1' && incident.status === 'NEW' ? "bg-red-500/5 hover:bg-red-500/10" : ""
                      )}
                    >
                      <td className="px-6 py-4 font-mono text-xs text-white">
                        <span className="flex items-center">
                          {ruleInfo.severity === 'P1' && incident.status === 'NEW' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
                          )}
                          {incident.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-textSecondary">{incident.time}</td>
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{ruleInfo.name}</p>
                        <p className="text-xs text-textSecondary mt-0.5">{incident.team}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase border",
                          severityConfig[ruleInfo.severity]
                        )}>
                          {ruleInfo.severity}
                        </span>
                      </td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold border",
                        statusBg[incident.status]
                      )}>
                        {incident.status === 'RESOLVED' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {incident.status === 'NEW' && <Zap className="w-3 h-3 mr-1" />}
                        {(incident.status === 'NOTIFY_CEO' || incident.status === 'ESCALATED') && <Bell className="w-3 h-3 mr-1" />}
                        {statusLabel[incident.status] || incident.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-textSecondary text-sm">{incident.assignee}</td>
                    <td className="px-6 py-4">
                      {incident.slaDeadline ? (
                        <SlaTimer deadline={incident.slaDeadline} />
                      ) : (
                        <span className="text-textSecondary text-xs">--:--</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {incident.status === 'NEW' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleAction(incident.id, 'ACK'); }}
                            className="px-3 py-1 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded hover:bg-blue-500/30 transition-all uppercase flex items-center"
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            Xác nhận / ACK
                          </button>
                        )}
                        {(incident.status === 'NEW' || incident.status === 'PROCESSING') && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleAction(incident.id, 'RESOLVE'); }}
                            className="px-3 py-1 text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 rounded hover:bg-green-500/30 transition-all uppercase flex items-center"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Xử lý / Resolve
                          </button>
                        )}
                        {incident.status !== 'RESOLVED' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleAction(incident.id, 'NOTIFY'); }}
                            className="px-3 py-1 text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded hover:bg-purple-500/30 transition-all uppercase flex items-center"
                          >
                            <Bell className="w-3 h-3 mr-1" />
                            Báo Quản lý / Notify
                          </button>
                        )}
                        <button className="p-1.5 text-textSecondary hover:text-white bg-background border border-borderSubtle rounded hover:border-white/20 transition-all">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
