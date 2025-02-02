// src/app/components/AuthForms.js
"use client";
import { motion, AnimatePresence } from 'framer-motion';
import Login from '@/app/login/page';
import Signup from '@/app/signup/page';

export default function AuthForms({ showLogin, setShowLogin }) {
  return (
    <div className="relative overflow-hidden w-full">
      <AnimatePresence mode="wait">
        {showLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Login onToggle={() => setShowLogin(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Signup onToggle={() => setShowLogin(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}