"use client";
import React from "react";

export default function LazyLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      {/* Professional perfume bottle animation */}
      <div className="relative w-20 h-28 mb-6">
        {/* Bottle base with elegant gradient */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-20 bg-gradient-to-t from-slate-200 via-slate-50 to-white rounded-b-3xl shadow-xl border border-slate-300/50 animate-gentle-glow" />
        
        {/* Bottle neck */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-5 h-7 bg-gradient-to-t from-slate-300 to-slate-200 rounded-t-lg border border-slate-400/50" />
        
        {/* Elegant cap */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-4 bg-gradient-to-t from-slate-700 to-slate-600 rounded-t-xl border border-slate-800/30 shadow-md" />
        
        {/* Subtle liquid animation */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-16 bg-gradient-to-t from-amber-100/40 via-transparent to-transparent rounded-b-2xl animate-liquid-flow" />
        
        {/* Refined floating particles */}
        <div className="absolute left-1/2 top-10 -translate-x-1/2">
          <div className="w-1 h-1 bg-slate-400/60 rounded-full animate-float-1" />
        </div>
        <div className="absolute left-1/2 top-12 -translate-x-1/2 translate-x-2">
          <div className="w-1 h-1 bg-slate-400/40 rounded-full animate-float-2" />
        </div>
        <div className="absolute left-1/2 top-14 -translate-x-1/2 -translate-x-2">
          <div className="w-1 h-1 bg-slate-400/50 rounded-full animate-float-3" />
        </div>
      </div>
      
      <div className="text-base font-light text-slate-600 tracking-wider mt-4 animate-text-fade" style={{ fontFamily: 'Didot, serif' }}>
        Preparing your experience...
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes gentleGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(148, 163, 184, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(148, 163, 184, 0.2);
          }
        }
        
        .animate-gentle-glow {
          animation: gentleGlow 3s ease-in-out infinite;
        }
        
        @keyframes liquidFlow {
          0%, 100% {
            opacity: 0.3;
            transform: scaleY(1);
          }
          50% {
            opacity: 0.6;
            transform: scaleY(1.1);
          }
        }
        
        .animate-liquid-flow {
          animation: liquidFlow 2.5s ease-in-out infinite;
        }
        
        @keyframes float1 {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.6;
          }
          33% {
            transform: translateY(-8px) translateX(2px);
            opacity: 0.8;
          }
          66% {
            transform: translateY(-4px) translateX(-1px);
            opacity: 0.4;
          }
        }
        
        @keyframes float2 {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-12px) translateX(-3px);
            opacity: 0.7;
          }
        }
        
        @keyframes float3 {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.5;
          }
          40% {
            transform: translateY(-6px) translateX(1px);
            opacity: 0.8;
          }
          80% {
            transform: translateY(-10px) translateX(-2px);
            opacity: 0.3;
          }
        }
        
        .animate-float-1 {
          animation: float1 4s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float2 3.5s ease-in-out infinite 0.5s;
        }
        
        .animate-float-3 {
          animation: float3 4.2s ease-in-out infinite 1s;
        }
        
        @keyframes textFade {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }
        
        .animate-text-fade {
          animation: textFade 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
