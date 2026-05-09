'use client';
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, X } from 'lucide-react';

interface ToastProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
  enMessage?: string;
  type?: 'success' | 'info';
}

export default function Toast({ isVisible, onClose, message, enMessage, type = 'success' }: ToastProps) {
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
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex items-center space-x-3 px-5 py-3 rounded-xl bg-[#12182B] border border-borderSubtle shadow-[0_10px_30px_rgba(0,0,0,0.5)] min-w-[300px]"
        >
          <div className={`p-1.5 rounded-lg ${type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
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
