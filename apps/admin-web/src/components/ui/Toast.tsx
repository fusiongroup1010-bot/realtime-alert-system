'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, X } from 'lucide-react';

export type SeverityType = 'P1' | 'P2' | 'P3' | 'info';

export interface ToastData {
  id: string;
  message: string;
  enMessage?: string;
  type?: SeverityType;
}

interface ToastContainerProps {
  toasts: ToastData[];
  onClose: (id: string) => void;
}

export default function Toast({ toasts = [], onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-10 right-10 z-[200] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, x: 0, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, x: 100, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => onClose(toast.id)}
            className={`pointer-events-auto cursor-pointer flex items-center space-x-3 px-5 py-3 rounded-xl border shadow-[0_10px_30px_rgba(0,0,0,0.5)] min-w-[300px] max-w-[400px] backdrop-blur-md ${
              toast.type === 'P1' ? 'bg-red-950/90 border-red-500/50' : 
              toast.type === 'P2' ? 'bg-orange-950/90 border-orange-500/50' :
              toast.type === 'P3' ? 'bg-green-950/90 border-green-500/50' :
              'bg-[#12182B]/95 border-borderSubtle'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${
              toast.type === 'P3' ? 'bg-green-500/20 text-green-400' : 
              toast.type === 'P2' ? 'bg-orange-500/20 text-orange-400' :
              toast.type === 'P1' ? 'bg-red-500/20 text-red-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {toast.type === 'P3' ? <CheckCircle className="w-5 h-5" /> : 
               toast.type === 'P1' ? <X className="w-5 h-5" /> :
               <Info className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{toast.message}</p>
              {toast.enMessage && <p className="text-[10px] text-textSecondary uppercase font-medium truncate">{toast.enMessage}</p>}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClose(toast.id);
              }} 
              className="p-1 text-textSecondary hover:text-white transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
