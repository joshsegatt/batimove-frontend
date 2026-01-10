import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

// --- Button ---
interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-batimove-red text-white hover:bg-red-700 focus:ring-batimove-red shadow-lg shadow-red-500/30",
    secondary: "bg-batimove-blue text-white hover:bg-blue-800 focus:ring-batimove-blue shadow-lg shadow-blue-500/30",
    outline: "border-2 border-slate-200 text-slate-700 hover:border-batimove-blue hover:text-batimove-blue bg-transparent",
    ghost: "text-slate-600 hover:text-batimove-blue hover:bg-slate-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : children}
    </motion.button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <input
        className={`px-4 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-batimove-blue focus:border-batimove-blue outline-none transition-all ${
          error ? 'border-red-500 focus:ring-red-200' : 'border-slate-300'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

// --- Card ---
interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden ${noPadding ? '' : 'p-6'} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode; variant?: 'blue' | 'red' | 'green' }> = ({ children, variant = 'blue' }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    red: "bg-red-50 text-red-700 border-red-100",
    green: "bg-green-50 text-green-700 border-green-100"
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[variant]}`}>
      {children}
    </span>
  );
};

// --- Official Logo ---
export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Blue House (Left) */}
    <path d="M256 60 L40 190 V460 H256 V60 Z" fill="#0052A3"/>
    
    {/* Chimney */}
    <path d="M70 140 V80 H110 V115" fill="#0052A3"/>
    
    {/* House Window */}
    <rect x="90" y="240" width="80" height="80" rx="4" fill="white"/>
    <path d="M130 240 V320 M90 280 H170" stroke="#0052A3" strokeWidth="8"/>
    
    {/* House Door Cutout */}
    <path d="M180 460 V360 H230 V460" fill="white"/>
    
    {/* Red Box (Right) - Perspective */}
    <path d="M256 60 L460 140 V420 L256 460 V60 Z" fill="#E10600"/>
    
    {/* Box Top Flap Detail (Subtle) */}
    <path d="M256 60 L460 140" stroke="white" strokeWidth="4" strokeOpacity="0.2"/>
    
    {/* Swiss Cross on Box */}
    <path d="M358 280 H328 V240 H358 V210 H398 V240 H428 V280 H398 V310 H358 V280 Z" fill="white"/>
  </svg>
);