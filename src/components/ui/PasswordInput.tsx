import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input, InputProps } from './Input';

export const PasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type' | 'icon' | 'rightAction'>>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Input
        {...props}
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        icon={<Lock className="w-4 h-4" />}
        rightAction={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-1 text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
