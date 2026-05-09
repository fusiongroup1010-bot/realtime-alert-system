'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  enTitle?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, enTitle, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
            className="fixed left-1/2 top-1/2 w-full max-w-lg bg-[#12182B] border border-borderSubtle rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.7)] z-[101] overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-borderSubtle flex items-center justify-between bg-surface/50">
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
                {enTitle && <span className="text-[10px] text-textSecondary uppercase font-medium">{enTitle}</span>}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-textSecondary hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
