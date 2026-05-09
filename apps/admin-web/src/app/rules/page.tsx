'use client';
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Settings, ToggleLeft, ToggleRight, Filter, Search, Zap, Clock, Bell, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import { useAppContext } from '@/context/AppContext';

const severityColors: Record<string, string> = {
  P1: 'bg-red-500/10 text-red-400 border-red-500/30',
  P2: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  P3: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
};

export default function RulesPage() {
  const { rules, addRule, updateRule, toggleRule: globalToggle, deleteRule: globalDelete, showToast } = useAppContext();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);

  const toggleRule = (id: string, name: string, currentStatus: string) => {
    globalToggle(id);
    showToast(
      currentStatus === 'Active' ? `Đã tạm dừng quy tắc ${name}` : `Đã kích hoạt quy tắc ${name}`,
      currentStatus === 'Active' ? `Paused rule ${name}` : `Activated rule ${name}`,
      'info'
    );
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa quy tắc ${name}? / Are you sure you want to delete ${name}?`)) {
      globalDelete(id);
      showToast(`Đã xóa quy tắc ${name}`, `Deleted rule ${name}`, 'P1');
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const ruleData = {
      code: formData.get('code') as string,
      name: formData.get('name') as string,
      metric: formData.get('metric') as string,
      condition: formData.get('condition') as string,
      severity: formData.get('severity') as string,
      target: formData.get('target') as string,
      cooldown: '15m',
      status: (editingRule?.status || 'Active') as 'Active' | 'Paused'
    };

    if (editingRule) {
      updateRule(editingRule.id, ruleData);
    } else {
      addRule(ruleData);
    }

    setShowModal(false);
    setEditingRule(null);
    showToast(
      editingRule ? 'Cập nhật quy tắc thành công!' : 'Tạo quy tắc mới thành công!',
      editingRule ? 'Rule updated successfully!' : 'New rule created successfully!',
      'P3'
    );
  };

  const filtered = rules.filter(r => {
    const matchStatus = statusFilter === 'ALL' || r.status.toUpperCase() === statusFilter;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.target.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const activeCount = rules.filter(r => r.status === 'Active').length;
  const totalTriggers = rules.reduce((a, r) => a + r.triggers, 0);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Bộ quy tắc / Rule Engine</h2>
          <p className="text-sm text-textSecondary mt-1">Cấu hình các ngưỡng phát hiện bất thường và mục tiêu leo thang / Configure anomaly detection thresholds and escalation targets</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex flex-col items-center bg-accentGlow text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(99,102,241,0.3)] w-fit leading-tight"
        >
          <div className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Tạo quy tắc
          </div>
          <span className="text-[10px] opacity-70">Create Rule</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Settings className="w-4 h-4 text-textSecondary" />
            <p className="text-[10px] text-textSecondary uppercase">Quy tắc đang chạy / Active Rules</p>
          </div>
          <p className="text-3xl font-bold text-green-400">{activeCount}/{rules.length}</p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Zap className="w-4 h-4 text-textSecondary" />
            <p className="text-[10px] text-textSecondary uppercase">Tổng lượt kích hoạt / Total Triggers</p>
          </div>
          <p className="text-3xl font-bold text-white">{totalTriggers}</p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-textSecondary" />
            <p className="text-[10px] text-textSecondary uppercase">Quy tắc P1 đang chạy / P1 Rules Active</p>
          </div>
          <p className="text-3xl font-bold text-red-400">{rules.filter(r => r.severity === 'P1' && r.status === 'Active').length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-borderSubtle flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex space-x-1 bg-background/50 rounded-lg p-1">
            {([
              { vi: 'Tất cả', en: 'ALL' },
              { vi: 'Đang chạy', en: 'ACTIVE' },
              { vi: 'Tạm dừng', en: 'PAUSED' }
            ] as const).map(s => (
              <button key={s.en} onClick={() => setStatusFilter(s.en)}
                className={clsx("px-3 py-1.5 rounded-md text-[10px] font-semibold transition-all flex flex-col items-center leading-tight",
                  statusFilter === s.en ? "bg-accentGlow text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]" : "text-textSecondary hover:text-white")}>
                <span>{s.vi}</span>
                <span className="opacity-70 text-[8px] uppercase">{s.en}</span>
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
            <input type="text" placeholder="Tìm kiếm quy tắc... / Search rules..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-surface border border-borderSubtle rounded-lg text-sm text-white placeholder-textSecondary focus:outline-none focus:ring-1 focus:ring-accentGlow w-64 transition-all italic" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background/50 border-b border-borderSubtle text-textSecondary font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4"><div className="flex flex-col"><span>Mã</span><span className="opacity-60 lowercase font-normal">Code</span></div></th>
                <th className="px-6 py-4"><div className="flex flex-col"><span>Tên quy tắc</span><span className="opacity-60 lowercase font-normal">Rule Name</span></div></th>
                <th className="px-6 py-4"><div className="flex flex-col"><span>Điều kiện</span><span className="opacity-60 lowercase font-normal">Condition</span></div></th>
                <th className="px-6 py-4"><div className="flex flex-col"><span>Mức độ</span><span className="opacity-60 lowercase font-normal">Severity</span></div></th>
                <th className="px-6 py-4"><div className="flex flex-col"><span>Kênh nhận</span><span className="opacity-60 lowercase font-normal">Target Channel</span></div></th>
                <th className="px-6 py-4"><div className="flex flex-col"><span>Thời gian chờ</span><span className="opacity-60 lowercase font-normal">Cooldown</span></div></th>
                <th className="px-6 py-4"><div className="flex flex-col"><span>Lượt kích hoạt</span><span className="opacity-60 lowercase font-normal">Triggers</span></div></th>
                <th className="px-6 py-4"><div className="flex flex-col"><span>Trạng thái</span><span className="opacity-60 lowercase font-normal">Status</span></div></th>
                <th className="px-6 py-4 text-right">Thao tác / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderSubtle">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-surface/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-accentGlow font-mono">{r.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{r.name}</p>
                    <p className="text-xs text-textSecondary">{r.metric}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-white bg-surface border border-borderSubtle px-2 py-1 rounded">{r.condition}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx("inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase border", severityColors[r.severity])}>
                      {r.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-textSecondary">{r.target}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1 text-xs text-textSecondary">
                      <Clock className="w-3 h-3" /><span>{r.cooldown}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Bell className="w-3 h-3 text-textSecondary" />
                      <span className="text-sm font-medium text-white">{r.triggers}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleRule(r.id, r.name, r.status)} className="flex items-center space-x-2 group/toggle">
                      {r.status === 'Active' ? (
                        <ToggleRight className="w-6 h-6 text-green-400 group-hover/toggle:text-green-300 transition-colors" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-textSecondary group-hover/toggle:text-white transition-colors" />
                      )}
                      <span className={clsx("text-xs font-medium", r.status === 'Active' ? 'text-green-400' : 'text-textSecondary')}>
                        {r.status === 'Active' ? 'Đang chạy' : 'Tạm dừng'}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingRule(r); setShowModal(true); }}
                        className="p-1.5 text-textSecondary hover:text-white bg-background border border-borderSubtle rounded transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(r.id, r.name)}
                        className="p-1.5 text-textSecondary hover:text-red-400 bg-background border border-borderSubtle rounded transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center text-textSecondary">
                    <Settings className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Không tìm thấy quy tắc nào / No rules found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal 
        isOpen={showModal} 
        onClose={() => { setShowModal(false); setEditingRule(null); }}
        title={editingRule ? 'Chỉnh sửa quy tắc' : 'Tạo quy tắc mới'}
        enTitle={editingRule ? 'Edit Rule' : 'Create New Rule'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-textSecondary uppercase font-bold">Mã / Code</label>
              <input name="code" type="text" defaultValue={editingRule?.code} placeholder="A1" className="w-full bg-background border border-borderSubtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs text-textSecondary uppercase font-bold">Tên quy tắc / Rule Name</label>
              <input name="name" type="text" defaultValue={editingRule?.name} required className="w-full bg-background border border-borderSubtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-textSecondary uppercase font-bold">Chỉ số theo dõi / Metric</label>
              <input name="metric" type="text" defaultValue={editingRule?.metric} required className="w-full bg-background border border-borderSubtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-textSecondary uppercase font-bold">Điều kiện / Condition</label>
              <input name="condition" type="text" defaultValue={editingRule?.condition} required placeholder="< 5.5" className="w-full bg-background border border-borderSubtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-textSecondary uppercase font-bold">Độ ưu tiên / Severity</label>
              <select name="severity" defaultValue={editingRule?.severity} className="w-full bg-background border border-borderSubtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow">
                <option>P1</option>
                <option>P2</option>
                <option>P3</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-textSecondary uppercase font-bold">Kênh thông báo / Target</label>
              <input name="target" type="text" defaultValue={editingRule?.target} placeholder="#online-ops" className="w-full bg-background border border-borderSubtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow" />
            </div>
          </div>
          <div className="pt-4 border-t border-borderSubtle flex justify-end space-x-3">
            <button type="button" onClick={() => { setShowModal(false); setEditingRule(null); }} className="px-4 py-2 text-sm font-medium text-textSecondary hover:text-white">Hủy / Cancel</button>
            <button type="submit" className="px-6 py-2 bg-accentGlow text-white rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:opacity-90">
              {editingRule ? 'Cập nhật / Update' : 'Lưu quy tắc / Save Rule'}
            </button>
          </div>
        </form>
      </Modal>


    </div>
  );
}
