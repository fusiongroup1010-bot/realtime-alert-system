'use client';
import React, { useState } from 'react';
import { Puzzle, Plus, CheckCircle2, AlertTriangle, XCircle, RefreshCw, ExternalLink, Zap, Bell, MessageSquare, Database, Globe, Mail } from 'lucide-react';
import clsx from 'clsx';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';
import { useAppContext } from '@/context/AppContext';

const integrations = [
  {
    id: 'INT-001', name: 'Slack', category: 'Messaging', status: 'Connected', icon: MessageSquare,
    color: 'text-purple-400', bg: 'bg-purple-500/10',
    description: 'Real-time alert notifications to #online-ops, #cs-realtime channels',
    lastSync: '2 min ago', events: 1284, webhookUrl: 'https://hooks.slack.com/...abc123'
  },
  {
    id: 'INT-002', name: 'Telegram Bot', category: 'Messaging', status: 'Connected', icon: MessageSquare,
    color: 'text-blue-400', bg: 'bg-blue-500/10',
    description: 'Escalation alerts to management group chats',
    lastSync: '5 min ago', events: 432, webhookUrl: 'https://api.telegram.org/bot...'
  },
  {
    id: 'INT-003', name: 'Google Sheets', category: 'Data', status: 'Connected', icon: Database,
    color: 'text-green-400', bg: 'bg-green-500/10',
    description: 'Sync daily KPIs, ROAS data, and inventory levels',
    lastSync: '15 min ago', events: 87, webhookUrl: 'https://sheets.googleapis.com/...'
  },
  {
    id: 'INT-004', name: 'Email SMTP', category: 'Notification', status: 'Connected', icon: Mail,
    color: 'text-orange-400', bg: 'bg-orange-500/10',
    description: 'Daily digest and critical alert email notifications',
    lastSync: '1 hour ago', events: 56, webhookUrl: 'smtp://mail.hifusion.vn:587'
  },
  {
    id: 'INT-005', name: 'Grafana', category: 'Monitoring', status: 'Degraded', icon: Globe,
    color: 'text-orange-400', bg: 'bg-orange-500/10',
    description: 'System metrics dashboards and performance tracking',
    lastSync: '2 hours ago', events: 2100, webhookUrl: 'https://grafana.hifusion.internal'
  },
  {
    id: 'INT-006', name: 'PagerDuty', category: 'Alerting', status: 'Disconnected', icon: Bell,
    color: 'text-red-400', bg: 'bg-red-500/10',
    description: 'On-call escalation and incident management platform',
    lastSync: 'Never', events: 0, webhookUrl: ''
  },
  {
    id: 'INT-007', name: 'Zapier', category: 'Automation', status: 'Connected', icon: Zap,
    color: 'text-yellow-400', bg: 'bg-yellow-500/10',
    description: 'Workflow automation triggers from alert events',
    lastSync: '30 min ago', events: 143, webhookUrl: 'https://hooks.zapier.com/...'
  },
  {
    id: 'INT-008', name: 'REST Webhook', category: 'API', status: 'Connected', icon: Globe,
    color: 'text-indigo-400', bg: 'bg-indigo-500/10',
    description: 'Custom webhook endpoint for ERP system integration',
    lastSync: '8 min ago', events: 312, webhookUrl: 'https://erp.hifusion.vn/api/alerts'
  },
];



const statusIcon = { Connected: CheckCircle2, Degraded: AlertTriangle, Disconnected: XCircle };
const statusColor = { Connected: 'text-green-400 border-green-500/30 bg-green-500/10', Degraded: 'text-orange-400 border-orange-500/30 bg-orange-500/10', Disconnected: 'text-red-400 border-red-500/30 bg-red-500/10' };
const categories = ['All', 'Messaging', 'Data', 'Notification', 'Monitoring', 'Alerting', 'Automation', 'API'];

export default function IntegrationsPage() {
  const { showToast } = useAppContext();
  const [integrationList, setIntegrationList] = useState(integrations);
  const [catFilter, setCatFilter] = useState('All');
  const [refreshing, setRefreshing] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newIntegration, setNewIntegration] = useState({ name: '', category: 'Messaging', description: '', url: '' });

  const filtered = integrationList.filter(i => catFilter === 'All' || i.category === catFilter);
  const connectedCount = integrationList.filter(i => i.status === 'Connected').length;

  const handleRefresh = (id: string) => {
    setRefreshing(id);
    setTimeout(() => {
      setRefreshing(null);
      showToast('Đã đồng bộ lại dữ liệu!', 'Data re-synced successfully!', 'info');
    }, 1500);
  };

  const handleConnect = (id: string, name: string) => {
    showToast(`Đang kết nối tới ${name}...`, `Connecting to ${name}...`, 'info');
    setTimeout(() => {
      setIntegrationList(prev => prev.map(i => i.id === id ? { ...i, status: 'Connected', lastSync: 'Just now' } : i));
      showToast(`Kết nối ${name} thành công!`, `${name} connected successfully!`, 'P3');
    }, 2000);
  };

  const handleAddIntegration = () => {
    const id = `INT-00${integrationList.length + 1}`;
    const newItem = {
      id,
      name: newIntegration.name,
      category: newIntegration.category,
      status: newIntegration.url ? 'Connected' : 'Disconnected',
      icon: Globe,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      description: newIntegration.description,
      lastSync: newIntegration.url ? 'Just now' : 'Never',
      events: newIntegration.url ? Math.floor(Math.random() * 100) : 0,
      webhookUrl: newIntegration.url
    };

    setIntegrationList([newItem, ...integrationList]);
    setShowModal(false);
    setNewIntegration({ name: '', category: 'Messaging', description: '', url: '' });
    
    showToast(
      newIntegration.url ? `Đã kết nối và đồng bộ dữ liệu từ ${newIntegration.name}!` : `Đã thêm yêu cầu tích hợp ${newIntegration.name}!`, 
      newIntegration.url ? `Connected and synced data from ${newIntegration.name}!` : `Added integration request for ${newIntegration.name}!`,
      'P3'
    );
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Tích hợp / Integrations</h2>
          <p className="text-sm text-textSecondary mt-1">Kết nối các dịch vụ ngoài, webhooks và kênh thông báo / Connect external services, webhooks, and notification channels</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex flex-col items-center px-4 py-2 text-sm font-medium bg-accentGlow text-white rounded-lg hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(99,102,241,0.3)] w-fit leading-tight"
        >
          <div className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />Thêm tích hợp
          </div>
          <span className="text-[10px] opacity-70">Add Integration</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel rounded-xl p-4">
          <p className="text-[10px] text-textSecondary uppercase">Đã kết nối / Connected</p>
          <p className="text-3xl font-bold text-green-400 mt-1">{connectedCount}</p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <p className="text-[10px] text-textSecondary uppercase">Tổng lượt sự kiện / Total Events Today</p>
          <p className="text-3xl font-bold text-white mt-1">{integrationList.reduce((a, i) => a + i.events, 0).toLocaleString()}</p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <p className="text-[10px] text-textSecondary uppercase">Cần chú ý / Needs Attention</p>
          <p className="text-3xl font-bold text-orange-400 mt-1">{integrationList.filter(i => i.status !== 'Connected').length}</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setCatFilter(cat)}
            className={clsx("px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
              catFilter === cat
                ? "bg-accentGlow text-white border-accentGlow shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                : "bg-surface text-textSecondary border-borderSubtle hover:text-white hover:border-white/20")}>
            {cat}
          </button>
        ))}
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(intg => {
          const StatusIcon = statusIcon[intg.status as keyof typeof statusIcon];
          return (
            <div key={intg.id}
              className={clsx(
                "glass-panel rounded-xl p-5 transition-all hover:scale-[1.01] hover:bg-white/5",
                intg.status === 'Disconnected' ? 'opacity-70' : ''
              )}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center border border-white/5", intg.bg)}>
                    <intg.icon className={clsx("w-5 h-5", intg.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{intg.name}</p>
                    <span className="text-[10px] text-textSecondary bg-surface border border-borderSubtle px-2 py-0.5 rounded uppercase tracking-wider">{intg.category}</span>
                  </div>
                </div>
                <span className={clsx("inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold border gap-1", statusColor[intg.status as keyof typeof statusColor])}>
                  <StatusIcon className="w-3 h-3" />{intg.status}
                </span>
              </div>

              <p className="text-xs text-textSecondary leading-relaxed mb-4">{intg.description}</p>

              {intg.webhookUrl ? (
                <div className="bg-background/50 rounded-lg px-3 py-2 mb-4 flex items-center space-x-2 border border-borderSubtle group cursor-help">
                  <Globe className="w-3 h-3 text-textSecondary shrink-0" />
                  <span className="text-[11px] font-mono text-textSecondary truncate">{intg.webhookUrl}</span>
                </div>
              ) : (
                <div className="bg-red-500/5 rounded-lg px-3 py-2 mb-4 flex items-center space-x-2 border border-red-500/10 italic">
                  <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                  <span className="text-[10px] text-red-400/70">Chưa có link liên kết / No link provided</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs text-textSecondary">
                  <span>{intg.events.toLocaleString()} events</span>
                  <span>·</span>
                  <span>Synced {intg.lastSync}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {intg.status !== 'Disconnected' && (
                    <button onClick={() => handleRefresh(intg.id)}
                      className="p-1.5 text-textSecondary hover:text-white bg-surface border border-borderSubtle rounded transition-all">
                      <RefreshCw className={clsx("w-3.5 h-3.5", refreshing === intg.id && "animate-spin")} />
                    </button>
                  )}
                  {intg.status === 'Disconnected' ? (
                    <button 
                      onClick={() => handleConnect(intg.id, intg.name)}
                      className="flex items-center px-3 py-1 text-xs font-medium bg-accentGlow/80 text-white rounded-lg hover:bg-accentGlow transition-colors"
                    >
                      <Plus className="w-3 h-3 mr-1" />Connect
                    </button>
                  ) : (
                    <button className="p-1.5 text-textSecondary hover:text-white bg-surface border border-borderSubtle rounded transition-all">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="Thêm tích hợp mới"
        enTitle="Add New Integration"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-textSecondary uppercase font-bold">Tên tích hợp / Integration Name</label>
              <input 
                type="text" 
                placeholder="e.g. Discord" 
                value={newIntegration.name}
                onChange={e => setNewIntegration({ ...newIntegration, name: e.target.value })}
                className="w-full bg-background border border-borderSubtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-textSecondary uppercase font-bold">Loại / Category</label>
              <select 
                value={newIntegration.category}
                onChange={e => setNewIntegration({ ...newIntegration, category: e.target.value })}
                className="w-full bg-background border border-borderSubtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow"
              >
                {categories.slice(1).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-textSecondary uppercase font-bold">Mô tả / Description</label>
            <textarea 
              placeholder="Gửi thông báo tới..." 
              rows={2} 
              value={newIntegration.description}
              onChange={e => setNewIntegration({ ...newIntegration, description: e.target.value })}
              className="w-full bg-background border border-borderSubtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow resize-none" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-textSecondary uppercase font-bold">Webhook URL / API Endpoint</label>
            <input 
              type="text" 
              placeholder="https://..." 
              value={newIntegration.url}
              onChange={e => setNewIntegration({ ...newIntegration, url: e.target.value })}
              className="w-full bg-background border border-borderSubtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accentGlow font-mono" 
            />
            <p className="text-[10px] text-accentGlow italic">* Điền link để tự động kích hoạt kết nối dữ liệu / Provide link to auto-activate connection</p>
          </div>
          <div className="pt-4 border-t border-borderSubtle flex justify-end space-x-3">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-textSecondary hover:text-white transition-colors">Hủy / Cancel</button>
            <button 
              onClick={handleAddIntegration}
              disabled={!newIntegration.name}
              className="px-6 py-2 bg-accentGlow text-white rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Thêm / Add Integration
            </button>
          </div>
        </div>
      </Modal>


    </div>
  );
}

