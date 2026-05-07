'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, Copy, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  onSwitchToRegister: () => void;
}


export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<'email' | 'password' | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    defaultValues: { rememberMe: true },
  });

  // Demo autofill removed. Use real credentials to sign in.

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError('root', {
          message: result.message || 'Login failed. Please check your credentials.',
        });
        toast.error(result.message || 'Login failed');
        return;
      }

      login(result.token, result.user);
      toast.success('Welcome back! Redirecting to problems...');
      router.push('/problem-list');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      setError('root', {
        message: errorMessage,
      });
      toast.error('Connection failed. Check your network and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Sign in to AlgoFirst</h2>
        <p className="text-zinc-500 text-sm mt-1">Continue your DSA practice journey</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Root error */}
        {errors.root && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2.5 text-sm text-red-400">
            {errors.root.message}
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="block text-sm font-medium text-zinc-300">
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
            className={`
              w-full bg-zinc-900 border rounded-md px-3 py-2.5 text-sm text-zinc-100
              placeholder:text-zinc-600 outline-none transition-all duration-150
              focus:ring-1 focus:ring-blue-500
              ${errors.email ? 'border-red-500/60 focus:ring-red-500' : 'border-zinc-700 hover:border-zinc-600'}
            `}
          />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="block text-sm font-medium text-zinc-300">
              Password
            </label>
            <button
              type="button"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              className={`
                w-full bg-zinc-900 border rounded-md px-3 py-2.5 pr-10 text-sm text-zinc-100
                placeholder:text-zinc-600 outline-none transition-all duration-150
                focus:ring-1 focus:ring-blue-500
                ${errors.password ? 'border-red-500/60 focus:ring-red-500' : 'border-zinc-700 hover:border-zinc-600'}
              `}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2">
          <input
            id="remember-me"
            type="checkbox"
            {...register('rememberMe')}
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-blue-500 accent-blue-500"
          />
          <label htmlFor="remember-me" className="text-sm text-zinc-400">
            Stay signed in for 30 days
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md
            text-sm font-semibold text-white transition-all duration-150
            active:scale-[0.98]
            ${isLoading
              ? 'bg-blue-600/60 cursor-not-allowed' :'bg-blue-600 hover:bg-blue-500 active:bg-blue-700'
            }
          `}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Demo credentials removed — require real account for consistent user-specific stats */}

      {/* Switch to Register */}
      <p className="text-center text-sm text-zinc-500">
        New to AlgoFirst?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          Create a free account
        </button>
      </p>
    </div>
  );
}