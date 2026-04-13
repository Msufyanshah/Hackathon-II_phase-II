'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`glass-input ${icon ? 'pl-10' : ''} ${
              error ? 'border-accent-rose focus:border-accent-rose' : ''
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-accent-rose animate-shake">{error}</p>
        )}
      </div>
    )
  }
)

GlassInput.displayName = 'GlassInput'

export default GlassInput
