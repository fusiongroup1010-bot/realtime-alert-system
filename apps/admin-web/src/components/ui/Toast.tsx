'use client';
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, X } from 'lucide-react';

interface ToastProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
  enMessage?: string;
  type?: 'P1' | 'P2' | 'P3' | 'info';
}

export default function Toast({ isVisible, onClose, message, enMessage, type = 'info' }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className={`fixed bottom-10 right-10 z-[200] flex items-center space-x-3 px-5 py-3 rounded-xl border shadow-[0_10px_30px_rgba(0,0,0,0.5)] min-w-[300px] backdrop-blur-md ${
            type === 'P1' ? 'bg-red-950/80 border-red-500/50' : 
            type === 'P2' ? 'bg-orange-950/80 border-orange-500/50' :
            type === 'P3' ? 'bg-green-950/80 border-green-500/50' :
            'bg-[#12182B]/90 border-borderSubtle'
          }`}
        >
          <div className={`p-1.5 rounded-lg ${
            type === 'P3' ? 'bg-green-500/20 text-green-400' : 
            type === 'P2' ? 'bg-orange-500/20 text-orange-400' :
            type === 'P1' ? 'bg-red-500/20 text-red-400' :
            'bg-blue-500/20 text-blue-400'
          }`}>
            {type === 'P3' ? <CheckCircle className="w-5 h-5" /> : 
             type === 'P1' ? <X className="w-5 h-5" /> :
             <Info className="w-5 h-5" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">{message}</p>
            {enMessage && <p className="text-[10px] text-textSecondary uppercase font-medium">{enMessage}</p>}
          </div>
          <button onClick={onClose} className="p-1 text-textSecondary hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
