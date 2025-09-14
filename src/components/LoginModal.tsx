"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthForm } from "@/components/AuthForm";
import { AdminLogin } from "@/components/AdminLogin";
import { Button } from "@/components/ui/button";
import { Lock, X } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { addToCart } = useCart();

  const handleLoginSuccess = async () => {
    if (onLoginSuccess) {
      onLoginSuccess();
    }

    // Check for pending cart item in localStorage
    const pendingItem = localStorage.getItem("pendingCartItem");
    if (pendingItem) {
      try {
        const item = JSON.parse(pendingItem);
        await addToCart(item);
        localStorage.removeItem("pendingCartItem");
      } catch (error) {
        console.error("Error adding pending item to cart:", error);
      }
    }

    onClose();
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
      style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="grid grid-cols-1 gap-0">
          {/* Left Side - Brand */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100"
          >
            <div className="relative flex justify-center mb-4">
              <div className="border-2 border-gray-300 rounded-full p-2">
                <Image
                  src="/Brand_logo/nlogo.jpg"
                  alt="Noamani Perfumes Logo"
                  width={40}
                  height={40}
                  className="rounded-full w-12 h-12 object-cover"
                />
              </div>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              Noamani Perfumes
            </h1>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6"
          >
            <AuthForm
              isLogin={isLogin}
              onToggle={toggleAuthMode}
              onLoginSuccess={handleLoginSuccess}
            />
            
            <div className="mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdminLogin(true)}
                className="w-full flex items-center justify-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                <Lock className="w-4 h-4" />
                Admin Access
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Admin Login Modal */}
        <AnimatePresence>
          {showAdminLogin && (
            <AdminLogin onClose={() => setShowAdminLogin(false)} />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}