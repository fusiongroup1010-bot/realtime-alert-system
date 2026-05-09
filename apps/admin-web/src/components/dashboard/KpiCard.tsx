'use client';
import { motion } from 'framer-motion';

interface KpiCardProps {
  title: React.ReactNode;
  value: string;
  icon: any;
  trend: React.ReactNode;
  colorType: 'neutral' | 'danger' | 'warning' | 'success';
}

export default function KpiCard({ title, value, icon: Icon, colorType, trend }: KpiCardProps) {
  const styles = {
    neutral: { border: 'border-blue-500/30', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]', text: 'text-blue-400' },
    danger: { border: 'border-red-500/30', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]', text: 'text-red-400' },
    warning: { border: 'border-orange-500/30', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', text: 'text-orange-400' },
    success: { border: 'border-green-500/30', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', text: 'text-green-400' },
  };

  const style = styles[colorType];

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`glass-panel p-6 rounded-2xl flex flex-col relative overflow-hidden group hover:${style.border} hover:${style.glow} transition-all duration-300`}
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <p className="text-sm text-textSecondary font-medium tracking-wide">{title}</p>
        <div className={`p-2 rounded-xl bg-surface border border-borderSubtle`}>
          <Icon className={`w-5 h-5 ${style.text}`} />
        </div>
      </div>
      <div className="mt-auto relative z-10">
        <p className="text-4xl font-bold text-white tracking-tight">{value}</p>
        <p className={`text-xs mt-2 font-medium ${colorType === 'danger' ? 'text-red-400' : 'text-textSecondary'}`}>
          {trend}
        </p>
      </div>
      
      {/* Background Gradient Effect */}
      <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-[50px] opacity-20 ${
        colorType === 'danger' ? 'bg-red-500' : 
        colorType === 'warning' ? 'bg-orange-500' : 
        colorType === 'success' ? 'bg-green-500' : 'bg-blue-500'
      }`}></div>
    </motion.div>
  );
}
