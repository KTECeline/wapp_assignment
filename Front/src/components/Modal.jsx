import React from 'react';
import { motion } from 'framer-motion';

export default function Modal({ open, title, children, onClose, actions }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.2, ease: 'easeOut' }} 
        className="relative bg-white rounded-2xl shadow-xl border border-[#F2E6E0] w-[95%] max-w-lg p-6"
      >
        {title && <h3 className="text-xl font-ibarra font-bold text-[#D9433B] mb-4">{title}</h3>}
        <div>{children}</div>
        {actions && <div className="mt-6 flex justify-end gap-3">{actions}</div>}
      </motion.div>
    </div>
  );
}
