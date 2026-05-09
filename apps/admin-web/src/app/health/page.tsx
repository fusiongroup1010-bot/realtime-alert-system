'use client';
import React, { useState } from 'react';
import { Activity, Cpu, HardDrive, Wifi, CheckCircle2, AlertTriangle, XCircle, RefreshCw, TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const uptimeData = [
  { t: '08:00', api: 99.9, worker: 100, db: 99.8 },
  { t: '09:00', api: 100, worker: 99.5, db: 100 },
  { t: '10:00', api: 98.5, worker: 100, db: 100 },
  { t: '11:00', api: 100, worker: 100, db: 99.9 },
  { t: '12:00', api: 100, worker: 99.8, db: 100 },
  { t: '13:00', api: 99.7, worker: 100, db: 100 },
  { t: '14:00', api: 100, worker: 100, db: 99.9 },
];

const latencyData = [
  { t: '08:00', p50: 45, p95: 120, p99: 280 },
  { t: '09:00', p50: 52, p95: 145, p99: 310 },
  { t: '10:00', p50: 38, p95: 98, p99: 220 },
  { t: '11:00', p50: 61, p95: 168, p99: 380 },
  { t: '12:00', p50: 44, p95: 112, p99: 250 },
  { t: '13:00', p50: 39, p95: 105, p99: 235 },
  { t: '14:00', p50: 42, p95: 118, p99: 260 },
];

const services = [
  { name: 'API Gateway', status: 'Healthy', uptime: '99.97%', latency: '42ms', cpu: '23%', memory: '1.2GB', icon: Wifi },
  { name: 'Alert Worker', status: 'Healthy', uptime: '100%', latency: '8ms', cpu: '12%', memory: '512MB', icon: Activity },
  { name: 'PostgreSQL DB', status: 'Healthy', uptime: '99.99%', latency: '3ms', cpu: '8%', memory: '2.1GB', icon: HardDrive },
  { name: 'Redis Cache', status: 'Healthy', uptime: '100%', latency: '1ms', cpu: '5%', memory: '256MB', icon: Cpu },
  { name: 'Notification SVC', status: 'Degraded', uptime: '97.2%', latency: '340ms', cpu: '45%', memory: '890MB', icon: Activity },
  { name: 'Webhook Relay', status: 'Healthy', uptime: '99.8%', latency: '65ms', cpu: '9%', memory: '320MB', icon: Wifi },
];

const statusIcon = { Healthy: CheckCircle2, Degraded: AlertTriangle, Down: XCircle };
const statusColor = { Healthy: 'text-green-400', Degraded: 'text-orange-400', Down: 'text-red-400' };
const statusBg = { Healthy: 'bg-green-500/10 border-green-500/20', Degraded: 'bg-orange-500/10 border-orange-500/20', Down: 'bg-red-500/10 border-red-500/20' };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-borderSubtle rounded-lg p-3 text-xs shadow-xl">
      <p className="text-textSecondary mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="text-white font-mono">{p.value}{p.unit || ''}</span>
        </div>
      ))}
    </div>
  );
};

export default function SystemHealthPage() {
  const [refreshing, setRefreshing] = useState(false);

  const healthyCount = services.filter(s => s.status === 'Healthy').length;
  const degradedCount = services.filter(s => s.status === 'Degraded').length;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Sức khỏe hệ thống / System Health</h2>
          <p className="text-sm text-textSecondary mt-1">Giám sát hạ tầng và tính khả dụng của dịch vụ theo thời gian thực / Real-time infrastructure monitoring and service availability</p>
        </div>
        <button onClick={handleRefresh}
          className="flex flex-col items-center px-3 py-2 text-xs font-medium bg-surface border border-borderSubtle rounded-lg text-textSecondary hover:text-white transition-colors w-fit leading-tight">
          <div className="flex items-center">
            <RefreshCw className={clsx("w-3.5 h-3.5 mr-1.5", refreshing && "animate-spin")} />
            Tải lại
          </div>
          <span className="text-[10px] opacity-60">Refresh</span>
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel rounded-xl p-4">
          <p className="text-[10px] text-textSecondary mb-1 uppercase">Dịch vụ đang chạy / Services Online</p>
          <p className="text-3xl font-bold text-green-400">{healthyCount}/{services.length}</p>
          <p className="text-xs text-textSecondary mt-1 italic">Mọi tiến trình quan trọng đang hoạt động / All critical paths operational</p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <p className="text-[10px] text-textSecondary mb-1 uppercase">Tỉ lệ Uptime TB (24h) / Avg Uptime (24h)</p>
          <p className="text-3xl font-bold text-white">99.8%</p>
          <p className="text-xs text-green-400 mt-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1" />+0.1% so với hôm qua / vs yesterday</p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <p className="text-[10px] text-textSecondary mb-1 uppercase">Dịch vụ gián đoạn / Degraded Services</p>
          <p className={clsx("text-3xl font-bold", degradedCount > 0 ? "text-orange-400" : "text-green-400")}>{degradedCount}</p>
          <p className="text-xs text-textSecondary mt-1">{degradedCount > 0 ? 'Cần chú ý / Requires attention' : 'Mọi hệ thống ổn định / All systems nominal'}</p>
        </div>
      </div>

      {/* Service Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map(svc => {
          const StatusIcon = statusIcon[svc.status as keyof typeof statusIcon];
          return (
            <div key={svc.name} className={clsx("glass-panel rounded-xl p-5 border", svc.status === 'Degraded' ? 'border-orange-500/20' : 'border-borderSubtle')}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-surface border border-borderSubtle flex items-center justify-center">
                    <svc.icon className="w-4 h-4 text-accentGlow" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{svc.name}</p>
                    <p className="text-xs text-textSecondary">Uptime: {svc.uptime}</p>
                  </div>
                </div>
                <span className={clsx("inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold border gap-1", statusBg[svc.status as keyof typeof statusBg], statusColor[svc.status as keyof typeof statusColor])}>
                  <StatusIcon className="w-3 h-3" />{svc.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-background/50 rounded-lg p-2">
                  <p className="text-[10px] text-textSecondary uppercase tracking-wider leading-tight">Độ trễ<br/>Latency</p>
                  <p className="text-sm font-bold text-white mt-0.5">{svc.latency}</p>
                </div>
                <div className="bg-background/50 rounded-lg p-2">
                  <p className="text-[10px] text-textSecondary uppercase tracking-wider leading-tight">CPU</p>
                  <p className={clsx("text-sm font-bold mt-0.5", parseInt(svc.cpu) > 40 ? 'text-orange-400' : 'text-white')}>{svc.cpu}</p>
                </div>
                <div className="bg-background/50 rounded-lg p-2">
                  <p className="text-[10px] text-textSecondary uppercase tracking-wider leading-tight">Bộ nhớ<br/>Memory</p>
                  <p className="text-sm font-bold text-white mt-0.5">{svc.memory}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Uptime % (Last 6h)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={uptimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="t" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[96, 100]} tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="api" stroke="#6366F1" strokeWidth={2} dot={false} name="API" />
              <Line type="monotone" dataKey="worker" stroke="#10B981" strokeWidth={2} dot={false} name="Worker" />
              <Line type="monotone" dataKey="db" stroke="#F59E0B" strokeWidth={2} dot={false} name="DB" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex space-x-4 mt-3">
            {[{ label: 'API', color: 'bg-indigo-500' }, { label: 'Worker', color: 'bg-green-500' }, { label: 'DB', color: 'bg-amber-500' }].map(l => (
              <div key={l.label} className="flex items-center space-x-1.5">
                <div className={clsx("w-2 h-2 rounded-full", l.color)} />
                <span className="text-xs text-textSecondary">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">API Latency Percentiles (ms)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="t" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="p50" stroke="#10B981" strokeWidth={2} dot={false} name="p50" />
              <Line type="monotone" dataKey="p95" stroke="#F59E0B" strokeWidth={2} dot={false} name="p95" strokeDasharray="4 2" />
              <Line type="monotone" dataKey="p99" stroke="#EF4444" strokeWidth={2} dot={false} name="p99" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex space-x-4 mt-3">
            {[{ label: 'p50', color: 'bg-green-500' }, { label: 'p95', color: 'bg-amber-500' }, { label: 'p99', color: 'bg-red-500' }].map(l => (
              <div key={l.label} className="flex items-center space-x-1.5">
                <div className={clsx("w-2 h-2 rounded-full", l.color)} />
                <span className="text-xs text-textSecondary">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
