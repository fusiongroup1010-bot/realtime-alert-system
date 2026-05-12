'use client';
import React from 'react';
import KpiCard from '@/components/dashboard/KpiCard';
import ChartsSection from '@/components/dashboard/ChartsSection';
import AlertTable from '@/components/dashboard/AlertTable';
import { ShieldAlert, Clock, Target, CalendarDays } from 'lucide-react';
import clsx from 'clsx';
import { useAppContext } from '@/context/AppContext';

export default function DashboardPage() {
  const { incidents, rules, selectedDate } = useAppContext();

  const getRuleSeverity = (code: string) =>
    rules.find(r => r.code === code)?.severity || 'P3';

  // Filter incidents for the selected date
  const dayIncidents = incidents.filter(i => i.date === selectedDate);
  const allDatesWithData = Array.from(new Set(incidents.map(i => i.date))).sort().reverse();

  // ── KPI Calculations (scoped to selectedDate) ─────────────────────────────
  const totalAlerts    = dayIncidents.length;
  const p1Incidents    = dayIncidents.filter(i => getRuleSeverity(i.ruleCode) === 'P1');
  const resolved       = dayIncidents.filter(i => i.status === 'RESOLVED');
  const active         = dayIncidents.filter(i => i.status === 'NEW' || i.status === 'PROCESSING');
  const slaHitRate     = totalAlerts > 0 ? Math.round((resolved.length / totalAlerts) * 100) : 100;
  const totalTriggers  = rules.reduce((s, r) => s + r.triggers, 0);
  const mttrMin        = resolved.length > 0 ? (12 + resolved.length * 2).toFixed(1) : null;

  // ── Chart Data (scoped to selectedDate) ───────────────────────────────────
  const timeSlots = ['08','09','10','11','12','13','14','15','16','17'];
  const trendData = timeSlots.map(h => ({
    time: `${h}:00`,
    P1: dayIncidents.filter(i => i.time.startsWith(h) && getRuleSeverity(i.ruleCode) === 'P1').length,
    P2: dayIncidents.filter(i => i.time.startsWith(h) && getRuleSeverity(i.ruleCode) === 'P2').length,
    P3: dayIncidents.filter(i => i.time.startsWith(h) && getRuleSeverity(i.ruleCode) === 'P3').length,
  }));

  const depts = ['Online', 'Logistics', 'CS', 'Offline'];
  const deptData = depts.map(dept => ({
    name: dept,
    P1: dayIncidents.filter(i => i.dept === dept && getRuleSeverity(i.ruleCode) === 'P1').length,
    P2: dayIncidents.filter(i => i.dept === dept && getRuleSeverity(i.ruleCode) === 'P2').length,
  }));

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 pb-20">

      {/* Date context banner */}
      <div className={clsx(
        'flex items-center gap-3 px-4 py-3 rounded-xl border text-sm',
        isToday
          ? 'bg-green-500/5 border-green-500/20 text-green-400'
          : 'bg-blue-500/5 border-blue-500/20 text-blue-300'
      )}>
        <CalendarDays className="w-4 h-4 shrink-0" />
        <span>
          {isToday ? 'Đang xem dữ liệu hôm nay / Viewing today\'s data' : `Đang xem dữ liệu ngày ${selectedDate} / Viewing historical data for ${selectedDate}`}
          {!isToday && totalAlerts === 0 && (
            <span className="ml-2 text-textSecondary text-xs">
              — Không có sự cố ngày này / No incidents on this date
            </span>
          )}
        </span>
        {allDatesWithData.length > 1 && (
          <span className="ml-auto text-[10px] text-textSecondary whitespace-nowrap">
            Có dữ liệu: {allDatesWithData.slice(0, 5).join(' · ')}
          </span>
        )}
      </div>

      {/* KPI Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title={<div className="flex flex-col"><span>Tổng cảnh báo</span><span className="text-[10px] uppercase opacity-60">Total Alerts</span></div>}
          value={String(totalAlerts)}
          icon={ShieldAlert}
          colorType="neutral"
          trend={
            <div className="flex flex-col">
              <span>{active.length} đang xử lý · {resolved.length} đã xong</span>
              <span className="opacity-70">Active · Resolved</span>
            </div>
          }
        />
        <KpiCard
          title={<div className="flex flex-col"><span>Sự cố nghiêm trọng (P1)</span><span className="text-[10px] uppercase opacity-60">Critical Incidents</span></div>}
          value={String(p1Incidents.length)}
          icon={ShieldAlert}
          colorType={p1Incidents.length > 0 ? 'danger' : 'success'}
          trend={
            <div className="flex flex-col">
              <span>{p1Incidents.filter(i => i.status === 'NEW').length} chờ · {p1Incidents.filter(i => i.status === 'RESOLVED').length} đã xong</span>
              <span className="opacity-70">Pending · Resolved</span>
            </div>
          }
        />
        <KpiCard
          title={<div className="flex flex-col"><span>Thời gian xử lý TB</span><span className="text-[10px] uppercase opacity-60">Avg MTTR</span></div>}
          value={mttrMin ? `${mttrMin}m` : '—'}
          icon={Clock}
          colorType="warning"
          trend={
            <div className="flex flex-col">
              <span>{resolved.length} sự cố đã giải quyết</span>
              <span className="opacity-70">{resolved.length} incidents resolved</span>
            </div>
          }
        />
        <KpiCard
          title={<div className="flex flex-col"><span>Tỉ lệ đạt SLA</span><span className="text-[10px] uppercase opacity-60">SLA Hit Rate</span></div>}
          value={`${slaHitRate}%`}
          icon={Target}
          colorType={slaHitRate >= 90 ? 'success' : slaHitRate >= 70 ? 'warning' : 'danger'}
          trend={
            <div className="flex flex-col">
              <span>{resolved.length}/{totalAlerts} xử lý đúng hạn</span>
              <span className="opacity-70">On-time resolution</span>
            </div>
          }
        />
      </div>

      {/* Charts */}
      <ChartsSection trendData={trendData} deptData={deptData} />

      {/* Live Incident Table — filtered by selectedDate */}
      <AlertTable selectedDate={selectedDate} />
    </div>
  );
}
