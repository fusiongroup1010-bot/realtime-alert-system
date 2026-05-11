'use client';
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';

interface TrendPoint { time: string; P1: number; P2: number; P3?: number; }
interface DeptPoint  { name: string; P1: number; P2: number; }

interface ChartsSectionProps {
  trendData: TrendPoint[];
  deptData: DeptPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-borderSubtle rounded-lg shadow-xl p-3 backdrop-blur-md text-sm">
        <p className="text-white font-medium mb-2 border-b border-borderSubtle pb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2 py-0.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-textSecondary">{entry.name}:</span>
            <span className="text-white font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ChartsSection({ trendData, deptData }: ChartsSectionProps) {
  // Filter out empty time slots for cleaner chart
  const filteredTrend = trendData.filter(d => d.P1 > 0 || d.P2 > 0 || (d.P3 ?? 0) > 0);
  const displayTrend = filteredTrend.length >= 2 ? filteredTrend : trendData;

  const filteredDept = deptData.filter(d => d.P1 > 0 || d.P2 > 0);
  const displayDept = filteredDept.length > 0 ? filteredDept : deptData;

  const hasIncidents = trendData.some(d => d.P1 > 0 || d.P2 > 0 || (d.P3 ?? 0) > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Area Chart – Alert volume by severity over time */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex flex-col mb-6">
          <h3 className="text-base font-semibold text-white tracking-wide">Số lượng cảnh báo theo mức độ</h3>
          <span className="text-[10px] text-textSecondary uppercase font-medium">Alert Volume by Severity</span>
        </div>

        {hasIncidents ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorP1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorP2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorP3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="P1" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorP1)" />
                <Area type="monotone" dataKey="P2" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorP2)" />
                <Area type="monotone" dataKey="P3" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorP3)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex flex-col items-center justify-center text-textSecondary">
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-3">
              <span className="text-green-400 text-xl">✓</span>
            </div>
            <p className="text-sm font-medium text-white">Không có cảnh báo nào</p>
            <p className="text-xs mt-1">No incidents to display — system is healthy</p>
            <p className="text-[10px] mt-3 text-accentGlow">Nạp dữ liệu tại mục Nạp Dữ Liệu để kiểm tra</p>
          </div>
        )}
      </div>

      {/* Bar Chart – Alerts by department */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex flex-col mb-6">
          <h3 className="text-base font-semibold text-white tracking-wide">Cảnh báo theo bộ phận</h3>
          <span className="text-[10px] text-textSecondary uppercase font-medium">Alerts by Department</span>
        </div>

        {displayDept.some(d => d.P1 > 0 || d.P2 > 0) ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayDept} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} width={80} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
                <Bar dataKey="P1" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} barSize={24} />
                <Bar dataKey="P2" stackId="a" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex flex-col items-center justify-center text-textSecondary">
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-3">
              <span className="text-green-400 text-xl">✓</span>
            </div>
            <p className="text-sm font-medium text-white">Tất cả bộ phận hoạt động bình thường</p>
            <p className="text-xs mt-1">All departments operating normally</p>
          </div>
        )}
      </div>
    </div>
  );
}
