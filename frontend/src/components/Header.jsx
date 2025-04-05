import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <motion.img 
        src="/JobLogo.png" 
        alt="Job Logo" 
        className="h-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      />
    </header>
  );
};

export default Header;