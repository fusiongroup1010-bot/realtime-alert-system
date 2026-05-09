'use client';
import React from 'react';
import KpiCard from '@/components/dashboard/KpiCard';
import ChartsSection from '@/components/dashboard/ChartsSection';
import AlertTable from '@/components/dashboard/AlertTable';
import { ShieldAlert, Clock, Target } from 'lucide-react';
import clsx from 'clsx';
import { useAppContext } from '@/context/AppContext';

export default function DashboardPage() {
  const { selectedDate } = useAppContext();
  const [loading, setLoading] = React.useState(false);

  // Simulate data changing when date changes
  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [selectedDate]);

  // Mock varied data based on date
  const isWeekend = (date: string) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  };

  return (
    <div className={clsx("space-y-6 pb-20 transition-opacity duration-500", loading ? "opacity-30 pointer-events-none" : "opacity-100")}>
      {/* KPI Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title={<div className="flex flex-col"><span>Tổng cảnh báo ngày {selectedDate}</span><span className="text-[10px] uppercase opacity-60">Total Alerts on {selectedDate}</span></div>} 
          value={isWeekend(selectedDate) ? "12" : "28"} 
          icon={ShieldAlert} 
          colorType="neutral" 
          trend={<div className="flex flex-col"><span>Dữ liệu cho ngày đã chọn</span><span>Data for selected date</span></div>} 
        />
        <KpiCard 
          title={<div className="flex flex-col"><span>Sự cố nghiêm trọng</span><span className="text-[10px] uppercase opacity-60">Critical Incidents</span></div>} 
          value={isWeekend(selectedDate) ? "2" : "6"} 
          icon={ShieldAlert} 
          colorType="danger" 
          trend={<div className="flex flex-col"><span>P1 Alerts</span><span>Priority 1</span></div>} 
        />
        <KpiCard 
          title={<div className="flex flex-col"><span>Thời gian xử lý TB (MTTR)</span><span className="text-[10px] uppercase opacity-60">Avg MTTR</span></div>} 
          value={isWeekend(selectedDate) ? "18.2m" : "14.5m"} 
          icon={Clock} 
          colorType="warning" 
          trend={<div className="flex flex-col"><span>MTTR Response</span><span>Response time</span></div>} 
        />
        <KpiCard 
          title={<div className="flex flex-col"><span>Tỉ lệ đạt SLA</span><span className="text-[10px] uppercase opacity-60">SLA Hit Rate</span></div>} 
          value={isWeekend(selectedDate) ? "98%" : "92%"} 
          icon={Target} 
          colorType="success" 
          trend={<div className="flex flex-col"><span>SLA compliance</span><span>Accuracy</span></div>} 
        />
      </div>

      {/* Analytics Row */}
      <ChartsSection />

      {/* Live Incident Table */}
      <AlertTable />
    </div>
  );
}
