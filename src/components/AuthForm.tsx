"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { auth, RecaptchaVerifier } from "@/lib/firebase";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { signInWithPhoneNumber } from "firebase/auth";
import confetti from 'canvas-confetti';

// Declare recaptchaVerifier on window for TypeScript
// @ts-ignore
if (typeof window !== 'undefined' && !('recaptchaVerifier' in window)) {
  (window as any).recaptchaVerifier = undefined;
}

interface AuthFormProps {
  isLogin: boolean;
  onToggle: () => void;
  onLoginSuccess?: () => void;
}

export function AuthForm({ isLogin, onToggle, onLoginSuccess }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        // LOGIN
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        toast.success("Welcome to Noamani Perfumes!", { icon: "🎉" });
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#374151', '#6b7280', '#9ca3af', '#111']
        });
        window.dispatchEvent(new Event("userLogin"));
        if (onLoginSuccess) onLoginSuccess();
        else window.location.reload();
      } else {
        // SIGNUP
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Signup failed");
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        window.dispatchEvent(new Event("userLogin"));
        if (onLoginSuccess) onLoginSuccess();
        else window.location.reload();
      }
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLoginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      if (!res?.user) {
        toast.error("Google authentication failed");
        return;
      }

      const { displayName, email, photoURL, providerId, uid } = res.user;

      // 🔄 Use correct Google login API
      const response = await axios.post("/api/auth/google", {
        name: displayName,
        email,
        photoURL,
        providerId,
        uid,
      });

      if (response.data?.user) {
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        // Dispatch event to update navbar
        window.dispatchEvent(new Event("userLogin"));
        toast.success("Welcome to Noamani Perfumes! 🎉");
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#374151', '#6b7280', '#9ca3af', '#111']
        });
        if (onLoginSuccess) onLoginSuccess();
        else window.location.reload();
      } else {
        toast.error("Google login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Something went wrong during Google login");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      {/* Toggle Buttons */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => !isLogin && onToggle()}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            isLogin
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => isLogin && onToggle()}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            !isLogin 
              ? "bg-white text-gray-900 shadow-sm" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Only show email/password fields */}
        <>
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-gray-500 focus:border-gray-500"
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-gray-500 focus:border-gray-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-gray-500 focus:border-gray-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>


          <Button
            type="submit"
            className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" /> Loading...
              </>
            ) : isLogin ? (
              "Login"
            ) : (
              "Sign Up"
            )}
          </Button>
        </>
      </form>

      {/* Divider and Google Login - Only show for Login */}
      {isLogin && (
        <>
      <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Social Login */}
      <div className="space-y-3">
        <Button
          variant="outline"
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border-gray-300"
          size="lg"
          onClick={handleLoginWithGoogle}
        >
          <Image src="/button_icon/google.png" alt="Google Logo" width={20} height={20} />
          <span className="text-gray-700">Continue with Google</span>
        </Button>
      </div>
        </>
      )}
    </motion.div>
  );
}