'use client';
import React, { useState } from 'react';
import { ShieldAlert, Clock, MoreHorizontal, ChevronRight, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import IncidentDrawer from './IncidentDrawer';
import Toast from '@/components/ui/Toast';
import { useAppContext } from '@/context/AppContext';
import SlaTimer from '@/components/ui/SlaTimer';

import { exportToExcel } from '@/utils/export';

interface AlertTableProps {
  selectedDate?: string;
}

export default function AlertTable({ selectedDate }: AlertTableProps) {
  const { rules, incidents, showToast, currentUserRole } = useAppContext();
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  // Filter by date if provided
  const filteredIncidents = selectedDate
    ? incidents.filter(i => i.date === selectedDate)
    : incidents;

  // Choose assignee based on current role
  const getAssignee = (inc: any) =>
    currentUserRole === 'Manager' ? inc.assigneeManager : inc.assigneeExecutor;

  const getRuleInfo = (code: string) => {
    const rule = rules.find(r => r.code === code);
    return {
      name: rule ? rule.name : `${code}: Unknown Rule`,
      severity: rule ? rule.severity : 'P3'
    };
  };

  const handleExport = () => {
    showToast('Đang trích xuất dữ liệu cảnh báo...', 'Exporting alert data...', 'info');
    
    const headers = [
      { vi: 'ID Sự cố', en: 'Incident ID', key: 'id' },
      { vi: 'Quy tắc', en: 'Rule', key: 'rule' },
      { vi: 'Thời gian', en: 'Time', key: 'time' },
      { vi: 'Mức độ', en: 'Severity', key: 'severity' },
      { vi: 'Trạng thái', en: 'Status', key: 'status' },
      { vi: 'Nhóm', en: 'Team', key: 'team' },
      { vi: 'Người phụ trách', en: 'Assignee', key: 'assignee' },
    ];

    const dataToExport = incidents.map(a => ({
      ...a,
      rule: getRuleInfo(a.ruleCode).name,
      severity: getRuleInfo(a.ruleCode).severity
    }));

    setTimeout(() => {
      exportToExcel(dataToExport, headers, `Alerts_Summary_${new Date().toISOString().split('T')[0]}`);
      showToast('Đã tải xuống file alerts_summary.csv!', 'Downloaded alerts_summary.csv!', 'P3');
    }, 1500);
  };

  return (
    <>
      <div className="glass-panel rounded-2xl overflow-hidden mt-6">
        <div className="px-6 py-5 border-b border-borderSubtle flex justify-between items-center bg-surface/50">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-5 h-5 text-white" />
            <div className="flex flex-col">
              <h3 className="text-base font-semibold text-white tracking-wide">Bảng Sự Cố Trực Tiếp</h3>
              <span className="text-[10px] text-textSecondary uppercase font-medium">Live Incident Table</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 text-xs font-medium bg-surface border border-borderSubtle rounded-md text-textSecondary hover:text-white transition-colors flex flex-col items-center leading-tight">
              <span>Bộ lọc</span>
              <span className="opacity-60 text-[8px]">Filters</span>
            </button>
            <button 
              onClick={handleExport}
              className="px-3 py-1.5 text-xs font-medium bg-surface border border-borderSubtle rounded-md text-textSecondary hover:text-white transition-colors flex flex-col items-center leading-tight"
            >
              <span>Xuất</span>
              <span className="opacity-60 text-[8px]">Export</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background/50 border-b border-borderSubtle text-textSecondary font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 flex flex-col">
                  <span>ID Sự Cố</span>
                  <span className="opacity-60 lowercase font-normal">Incident ID</span>
                </th>
                <th className="px-6 py-4">
                  <div className="flex flex-col">
                    <span>Thời gian</span>
                    <span className="opacity-60 lowercase font-normal">Time (GMT+7)</span>
                  </div>
                </th>
                <th className="px-6 py-4">
                  <div className="flex flex-col">
                    <span>Quy tắc / Mô tả</span>
                    <span className="opacity-60 lowercase font-normal">Rule / Description</span>
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
              {filteredIncidents.map((alert) => {
                const ruleInfo = getRuleInfo(alert.ruleCode);
                return (
                  <tr 
                    key={alert.id} 
                    onClick={() => setSelectedAlert({ ...alert, ...ruleInfo })}
                    className={clsx(
                      "transition-colors group cursor-pointer hover:bg-surface",
                      ruleInfo.severity === 'P1' && alert.status === 'NEW' ? "bg-red-500/5 hover:bg-red-500/10" : ""
                    )}
                  >
                    <td className="px-6 py-4 font-mono text-xs text-white">
                      <span className="flex items-center">
                        {ruleInfo.severity === 'P1' && alert.status === 'NEW' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>
                        )}
                        {alert.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-textSecondary">{alert.time}</td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{ruleInfo.name}</p>
                      <p className="text-xs text-textSecondary mt-0.5">{alert.team}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-white">{getAssignee(alert)}</span>
                        <span className="text-[10px] text-textSecondary mt-0.5">
                          {currentUserRole === 'Manager' ? 'Quản lý / Manager' : 'Nhân viên / Staff'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase border",
                        ruleInfo.severity === 'P1' ? "bg-red-500/10 text-red-400 border-red-500/20" : 
                        ruleInfo.severity === 'P2' ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : 
                        "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      )}>
                        {ruleInfo.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "inline-flex items-center text-xs font-semibold",
                        alert.status === 'ESCALATED' ? "text-red-500 animate-pulse" :
                        alert.status === 'NEW' ? "text-red-400" : 
                        alert.status === 'PROCESSING' ? "text-blue-400" : 
                        alert.status === 'NOTIFY_CEO' ? "text-purple-400" :
                        "text-green-400"
                      )}>
                        {alert.status === 'RESOLVED' && <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />}
                        {alert.status === 'NEW' ? 'Mới / New' : 
                         alert.status === 'PROCESSING' ? 'Đang xử lý / Processing' : 
                         alert.status === 'RESOLVED' ? 'Xong / Resolved' : 
                         'Báo Quản lý / Notify to Manager'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {alert.slaDeadline ? (
                        <SlaTimer deadline={alert.slaDeadline} />
                      ) : (
                        <span className="text-textSecondary text-xs">--:--</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-textSecondary hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <IncidentDrawer 
        isOpen={!!selectedAlert} 
        onClose={() => setSelectedAlert(null)} 
        incident={selectedAlert} 
      />
    </>
  );
}
