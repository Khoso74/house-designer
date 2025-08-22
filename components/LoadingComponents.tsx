'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Home } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  text?: string;
  className?: string;
}

/**
 * Loading Spinner Component
 * Provides different loading animations and states
 */
export function LoadingSpinner({ 
  size = 'md', 
  variant = 'spinner', 
  text, 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  if (variant === 'dots') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary-600 rounded-full"
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
        {text && <span className="text-sm text-gray-600">{text}</span>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} bg-primary-600 rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity
          }}
        />
        {text && <span className="text-sm text-gray-600">{text}</span>}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-600`} />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
}

/**
 * Full Page Loading Component
 */
export function FullPageLoading({ 
  title = 'Loading...', 
  subtitle 
}: { 
  title?: string; 
  subtitle?: string; 
}) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="mb-4"
        >
          <Home className="w-16 h-16 text-primary-600 mx-auto" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        {subtitle && (
          <p className="text-gray-600">{subtitle}</p>
        )}
        
        <div className="mt-4">
          <LoadingSpinner variant="dots" />
        </div>
      </div>
    </div>
  );
}

/**
 * Loading Overlay Component
 */
export function LoadingOverlay({ 
  isLoading, 
  text = 'Loading...', 
  children 
}: { 
  isLoading: boolean; 
  text?: string; 
  children: React.ReactNode; 
}) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <LoadingSpinner text={text} />
        </div>
      )}
    </div>
  );
}

/**
 * Skeleton Loading Component
 */
export function SkeletonLoader({ 
  width = '100%', 
  height = '20px', 
  className = '' 
}: { 
  width?: string; 
  height?: string; 
  className?: string; 
}) {
  return (
    <motion.div
      className={`bg-gray-200 rounded ${className}`}
      style={{ width, height }}
      animate={{
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity
      }}
    />
  );
}

/**
 * Card Skeleton Component
 */
export function CardSkeleton() {
  return (
    <div className="card space-y-4">
      <SkeletonLoader height="24px" width="60%" />
      <SkeletonLoader height="16px" width="80%" />
      <SkeletonLoader height="16px" width="70%" />
      <div className="grid grid-cols-3 gap-4">
        <SkeletonLoader height="40px" />
        <SkeletonLoader height="40px" />
        <SkeletonLoader height="40px" />
      </div>
      <SkeletonLoader height="48px" width="100%" />
    </div>
  );
}