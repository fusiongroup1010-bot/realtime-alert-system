'use client';
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';

const mockTrendData = [
  { time: '08:00', P1: 0, P2: 2, P3: 5 },
  { time: '09:00', P1: 1, P2: 3, P3: 6 },
  { time: '10:00', P1: 2, P2: 1, P3: 8 },
  { time: '11:00', P1: 0, P2: 4, P3: 3 },
  { time: '12:00', P1: 0, P2: 2, P3: 4 },
  { time: '13:00', P1: 3, P2: 5, P3: 7 },
  { time: '14:00', P1: 1, P2: 2, P3: 5 },
];

const mockDeptData = [
  { name: 'Online', P1: 2, P2: 8 },
  { name: 'Logistics', P1: 1, P2: 4 },
  { name: 'CS', P1: 3, P2: 5 },
  { name: 'Offline', P1: 0, P2: 5 },
];

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

export default function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h3 className="text-base font-semibold text-white tracking-wide">Số lượng cảnh báo theo mức độ</h3>
            <span className="text-[10px] text-textSecondary uppercase font-medium">Alert Volume by Severity</span>
          </div>
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20 h-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulseFast"></span>
            <span className="flex flex-col text-[10px] leading-tight">
              <span>Đồng bộ trực tiếp</span>
              <span className="opacity-70">Live Sync</span>
            </span>
          </span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTrendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorP1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorP2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="P1" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorP1)" />
              <Area type="monotone" dataKey="P2" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorP2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex flex-col mb-6">
          <h3 className="text-base font-semibold text-white tracking-wide">Cảnh báo theo bộ phận</h3>
          <span className="text-[10px] text-textSecondary uppercase font-medium">Alerts by Department</span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockDeptData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={80} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
              <Bar dataKey="P1" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} barSize={24} />
              <Bar dataKey="P2" stackId="a" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
