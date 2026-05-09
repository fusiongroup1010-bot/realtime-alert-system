'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CheckCircle, PauseCircle, TrendingDown, ArrowRightLeft, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface IncidentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  incident: any;
}

export default function IncidentDrawer({ isOpen, onClose, incident }: IncidentDrawerProps) {
  if (!isOpen || !incident) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />
        
        {/* Drawer Panel */}
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-surface border-l border-borderSubtle h-full shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-borderSubtle flex justify-between items-start bg-card/50">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={clsx(
                  "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border",
                  incident.severity === 'P1' ? "bg-red-500/10 text-red-400 border-red-500/20" : 
                  "bg-orange-500/10 text-orange-400 border-orange-500/20"
                )}>
                  {incident.severity}
                </span>
                <span className="text-xs text-textSecondary font-mono">{incident.id}</span>
              </div>
              <h2 className="text-lg font-bold text-white">{incident.rule}</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-background border border-borderSubtle rounded-lg text-textSecondary hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            {/* Realtime Metrics */}
            <section>
              <h3 className="text-xs font-bold text-textSecondary uppercase tracking-widest mb-3">
                Thông số trực tiếp / Live Metrics
              </h3>
              <div className="bg-background rounded-xl p-4 border border-borderSubtle flex justify-between items-center relative overflow-hidden">
                <div>
                  <p className="text-sm text-textSecondary">ROAS Hiện tại / Current ROAS</p>
                  <div className="flex items-end space-x-2 mt-1">
                    <p className="text-3xl font-bold text-red-400">3.8</p>
                    <p className="text-xs text-red-500 mb-1 flex items-center"><TrendingDown className="w-3 h-3 mr-1"/>-30%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-textSecondary">Ngưỡng / Threshold</p>
                  <p className="text-lg font-medium text-white mt-1">5.5</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              </div>
            </section>

            {/* Root Cause Suggestion */}
            <section>
              <h3 className="text-xs font-bold text-textSecondary uppercase tracking-widest mb-3 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                Phân tích nguyên nhân AI / AI Root Cause Insight
              </h3>
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-200 leading-relaxed">
                  Campaign <strong>"Mid-Month Sale TikTok"</strong> is spending aggressively but conversion rate dropped by 45% in the last 30 minutes. Suggest pausing adset immediately.
                </p>
              </div>
            </section>

            {/* Action Buttons */}
            <section>
              <h3 className="text-xs font-bold text-textSecondary uppercase tracking-widest mb-3">Thao tác nhanh / Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                  <CheckCircle className="w-4 h-4" />
                  <span>Xác nhận sự cố / Acknowledge Incident</span>
                </button>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button className="flex items-center justify-center space-x-1.5 bg-surface border border-borderSubtle hover:bg-card text-white p-2.5 rounded-xl text-xs font-medium transition-colors">
                    <PauseCircle className="w-3.5 h-3.5 text-orange-400" />
                    <span>Tạm dừng QC / Pause Ads</span>
                    <Lock className="w-3 h-3 text-textSecondary ml-1 opacity-50" />
                  </button>
                  <button className="flex items-center justify-center space-x-1.5 bg-surface border border-borderSubtle hover:bg-card text-white p-2.5 rounded-xl text-xs font-medium transition-colors">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-green-400" />
                    <span>Điều chuyển kho / Transfer Stock</span>
                    <Lock className="w-3 h-3 text-textSecondary ml-1 opacity-50" />
                  </button>
                </div>
              </div>
            </section>

            {/* Timeline */}
            <section>
              <h3 className="text-xs font-bold text-textSecondary uppercase tracking-widest mb-4">Tiến trình leo thang / Escalation Timeline</h3>
              <div className="relative border-l border-borderSubtle ml-3 space-y-6">
                <div className="relative pl-6">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                  <p className="text-xs text-textSecondary">14:05 <span className="text-red-400 ml-1">Threshold Breached</span></p>
                  <p className="text-sm text-white mt-1">Alert triggered. P1 Severity assigned.</p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-surface border border-borderSubtle"></div>
                  <p className="text-xs text-textSecondary">14:05 <span className="text-blue-400 ml-1">System Action</span></p>
                  <p className="text-sm text-white mt-1">Pinged #online-ops in Slack. Tagged @executor_online_1.</p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-surface border-2 border-orange-500 animate-pulse"></div>
                  <p className="text-xs text-orange-400 font-medium">14:15 <span className="ml-1">Pending Escalation</span></p>
                  <p className="text-sm text-textSecondary mt-1">Will tag @leader_online if unacknowledged.</p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
