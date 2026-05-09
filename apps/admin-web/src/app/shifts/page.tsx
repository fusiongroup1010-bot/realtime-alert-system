'use client';
import React, { useState } from 'react';
import { Users, Plus, Phone, Mail, Shield, Clock, Calendar, ChevronDown, Edit2, Trash2 } from 'lucide-react';
import clsx from 'clsx';

const shifts = [
  { id: 'S-001', name: 'Morning Shift', start: '08:00', end: '17:00', days: 'Mon–Fri', color: 'border-l-blue-500' },
  { id: 'S-004', name: 'Weekend Cover', start: '08:00', end: '17:00', days: 'Sat', color: 'border-l-green-500' },
];

const initialMembers = [
  { id: 'M-001', name: 'Nguyen Van An', role: 'SOC Lead', dept: 'Online Sales', shift: 'Morning Shift', phone: '+84 901 234 567', email: 'an.nguyen@hifusion.vn', level: 'L1', status: 'On Duty' },
  { id: 'M-002', name: 'Tran Thi Bich', role: 'Alert Executor', dept: 'Logistics', shift: 'Morning Shift', phone: '+84 902 345 678', email: 'bich.tran@hifusion.vn', level: 'L2', status: 'On Duty' },
  { id: 'M-003', name: 'Le Van Cuong', role: 'CS Manager', dept: 'Customer Service', shift: 'Morning Shift', phone: '+84 903 456 789', email: 'cuong.le@hifusion.vn', level: 'L2', status: 'Off Duty' },
  { id: 'M-004', name: 'Pham Thi Dung', role: 'Field Supervisor', dept: 'Offline Sales', shift: 'Morning Shift', phone: '+84 904 567 890', email: 'dung.pham@hifusion.vn', level: 'L3', status: 'On Duty' },
  { id: 'M-005', name: 'Hoang Van Em', role: 'SOC Analyst', dept: 'Online Sales', shift: 'Weekend Cover', phone: '+84 905 678 901', email: 'em.hoang@hifusion.vn', level: 'L1', status: 'Off Duty' },
  { id: 'M-006', name: 'Vu Thi Phuong', role: 'Logistics Monitor', dept: 'Logistics', shift: 'Morning Shift', phone: '+84 906 789 012', email: 'phuong.vu@hifusion.vn', level: 'L2', status: 'On Duty' },
];

import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import { useAppContext } from '@/context/AppContext';

const levelColors: Record<string, string> = {
  L1: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  L2: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  L3: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

export default function ShiftRosterPage() {
  const { showToast } = useAppContext();
  const [staffMembers, setStaffMembers] = useState(initialMembers);
  const [activeShift, setActiveShift] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  const filtered = staffMembers.filter(m => activeShift === 'ALL' || m.shift === activeShift);
  const onDuty = staffMembers.filter(m => m.status === 'On Duty').length;

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const memberData = {
      id: formData.get('id') as string || (editingMember?.id || `M-${Math.floor(Math.random() * 1000)}`),
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      dept: formData.get('dept') as string,
      shift: formData.get('shift') as string,
      level: formData.get('level') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      status: editingMember?.status || 'Off Duty'
    };

    if (editingMember) {
      setStaffMembers(prev => prev.map(m => m.id === editingMember.id ? memberData : m));
    } else {
      setStaffMembers(prev => [memberData, ...prev]);
    }

    setShowModal(false);
    setEditingMember(null);
    showToast(
      editingMember ? 'Cập nhật nhân sự thành công!' : 'Thêm nhân sự mới thành công!',
      editingMember ? 'Member updated successfully!' : 'New member added successfully!',
      'P3'
    );
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa ${name}? / Are you sure you want to delete ${name}?`)) {
      setStaffMembers(prev => prev.filter(m => m.id !== id));
      showToast(`Đã xóa nhân sự ${name}`, `Deleted member ${name}`, 'P1');
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Lịch trực / Shift Roster</h2>
          <p className="text-sm text-textSecondary mt-1">Quản lý lịch trực và danh sách liên hệ leo thang / Manage on-call schedules and escalation contacts</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex flex-col items-center px-4 py-2 text-sm font-medium bg-accentGlow text-white rounded-lg hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(99,102,241,0.3)] w-fit leading-tight">
          <div className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />Thêm nhân sự
          </div>
          <span className="text-[10px] opacity-70">Add Member</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-4">
          <p className="text-[10px] text-textSecondary uppercase">Tổng nhân sự / Total Staff</p>
          <p className="text-3xl font-bold text-white mt-1">{staffMembers.length}</p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <p className="text-[10px] text-textSecondary uppercase">Đang trực / On Duty Now</p>
          <p className="text-3xl font-bold text-green-400 mt-1">{onDuty}</p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <p className="text-[10px] text-textSecondary uppercase">Ca làm việc / Active Shifts</p>
          <p className="text-3xl font-bold text-white mt-1">{shifts.length}</p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <p className="text-[10px] text-textSecondary uppercase">Phạm vi / Coverage</p>
          <p className="text-3xl font-bold text-indigo-400 mt-1">24/7</p>
        </div>
      </div>

      {/* Shift Definitions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {shifts.map(s => (
          <button key={s.id}
            onClick={() => setActiveShift(activeShift === s.name ? 'ALL' : s.name)}
            className={clsx(
              "glass-panel rounded-xl p-4 text-left border-l-4 transition-all",
              s.color,
              activeShift === s.name ? 'bg-white/5 scale-[1.02]' : 'hover:bg-surface/50'
            )}>
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-textSecondary" />
              <span className="text-xs text-textSecondary font-medium">{s.days}</span>
            </div>
            <p className="text-sm font-semibold text-white">{s.name}</p>
            <div className="flex items-center space-x-1 mt-1 text-textSecondary">
              <Clock className="w-3 h-3" />
              <span className="text-xs">{s.start} – {s.end}</span>
            </div>
            <p className="text-xs text-textSecondary mt-2">
              {staffMembers.filter(m => m.shift === s.name).length} members
            </p>
          </button>
        ))}
      </div>

      {/* Member Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-borderSubtle flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-textSecondary" />
            <h3 className="text-sm font-semibold text-white">
              {activeShift === 'ALL' ? 'Tất cả nhân sự / All Members' : activeShift}
              <span className="ml-2 text-xs text-textSecondary font-normal">({filtered.length})</span>
            </h3>
          </div>
          {activeShift !== 'ALL' && (
            <button onClick={() => setActiveShift('ALL')} className="text-xs text-textSecondary hover:text-white transition-colors">
              Bỏ lọc / Clear filter ×
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-background/50 border-b border-borderSubtle text-textSecondary font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4"><div className="flex flex-col"><span>Thành viên</span><span className="opacity-60 lowercase font-normal">Member</span></div></th>
                <th className="px-6 py-4"><div className="flex flex-col"><span>Vai trò / Bộ phận</span><span className="opacity-60 lowercase font-normal">Role / Dept</span></div></th>
                <th className="px-6 py-4"><div className="flex flex-col"><span>Ca trực</span><span className="opacity-60 lowercase font-normal">Shift</span></div></th>
                <th className="px-6 py-4"><div className="flex flex-col"><span>Cấp độ</span><span className="opacity-60 lowercase font-normal">Level</span></div></th>
                <th className="px-6 py-4"><div className="flex flex-col"><span>Trạng thái</span><span className="opacity-60 lowercase font-normal">Status</span></div></th>
                <th className="px-6 py-4"><div className="flex flex-col"><span>Liên hệ</span><span className="opacity-60 lowercase font-normal">Contact</span></div></th>
                <th className="px-6 py-4 text-right">Thao tác / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderSubtle">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-surface/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">
                        {m.name.split(' ').map(n => n[0]).slice(-2).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{m.name}</p>
                        <p className="text-xs text-textSecondary font-mono">{m.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white text-sm">{m.role}</p>
                    <p className="text-xs text-textSecondary">{m.dept}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-textSecondary bg-surface border border-borderSubtle px-2 py-1 rounded">{m.shift}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx("inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border", levelColors[m.level])}>
                      <Shield className="w-3 h-3 mr-1" />{m.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className={clsx("w-2 h-2 rounded-full", m.status === 'On Duty' ? 'bg-green-500' : 'bg-slate-500')} />
                      <span className={clsx("text-xs font-medium", m.status === 'On Duty' ? 'text-green-400' : 'text-textSecondary')}>{m.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-1 text-xs text-textSecondary">
                        <Phone className="w-3 h-3" /><span>{m.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-textSecondary">
                        <Mail className="w-3 h-3" /><span>{m.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingMember(m); setShowModal(true); }}
                        className="p-1.5 text-textSecondary hover:text-white bg-background border border-borderSubtle rounded transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(m.id, m.name)}
                        className="p-1.5 text-textSecondary hover:text-red-400 bg-background border border-borderSubtle rounded transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => { setShowModal(false); setEditingMember(null); }}
        title={editingMember ? 'Chỉnh sửa nhân sự' : 'Thêm nhân sự mới'}
        enTitle={editingMember ? 'Edit Member' : 'Add New Member'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-textSecondary uppercase font-bold">Họ và tên / Full Name</label>
              <input name="name" type="text" defaultValue={editingMember?.name} required className="w-full bg-background border border-borderSubtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-textSecondary uppercase font-bold">Mã nhân viên / ID</label>
              <input name="id" type="text" defaultValue={editingMember?.id} placeholder="M-XXX" className="w-full bg-background border border-borderSubtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-textSecondary uppercase font-bold">Vai trò / Role</label>
              <input name="role" type="text" defaultValue={editingMember?.role} required className="w-full bg-background border border-borderSubtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-textSecondary uppercase font-bold">Bộ phận / Dept</label>
              <select name="dept" defaultValue={editingMember?.dept} className="w-full bg-background border border-borderSubtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow">
                <option>Online Sales</option>
                <option>Logistics</option>
                <option>Customer Service</option>
                <option>Offline Sales</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-textSecondary uppercase font-bold">Ca trực / Shift</label>
              <select name="shift" defaultValue={editingMember?.shift} className="w-full bg-background border border-borderSubtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow">
                {shifts.map(s => <option key={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-textSecondary uppercase font-bold">Cấp độ / Level</label>
              <select name="level" defaultValue={editingMember?.level} className="w-full bg-background border border-borderSubtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow">
                <option>L1</option>
                <option>L2</option>
                <option>L3</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-textSecondary uppercase font-bold">Số điện thoại / Phone</label>
              <input name="phone" type="text" defaultValue={editingMember?.phone} className="w-full bg-background border border-borderSubtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow" placeholder="+84 ..." />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-textSecondary uppercase font-bold">Email</label>
              <input name="email" type="email" defaultValue={editingMember?.email} className="w-full bg-background border border-borderSubtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow" placeholder="example@hifusion.vn" />
            </div>
          </div>

          <div className="pt-4 border-t border-borderSubtle flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={() => { setShowModal(false); setEditingMember(null); }}
              className="px-4 py-2 text-sm font-medium text-textSecondary hover:text-white transition-colors"
            >
              Hủy / Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-accentGlow text-white rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:opacity-90 transition-opacity"
            >
              {editingMember ? 'Cập nhật / Update' : 'Lưu nhân sự / Save Member'}
            </button>
          </div>
        </form>
      </Modal>


    </div>
  );
}

