import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ title, subtitle, children, className = '', hover = true }) {
  return (
    <motion.div 
      whileHover={hover ? { y: -2, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }} 
      className={`bg-white rounded-2xl border border-[#F2E6E0] p-6 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-ibarra font-bold text-[#D9433B]">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </motion.div>
  );
}
