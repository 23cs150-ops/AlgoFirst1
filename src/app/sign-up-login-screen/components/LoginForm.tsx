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

// Demo credentials for the mock UI
const DEMO_CREDENTIALS = {
  email: 'dev@algofirst.io',
  password: 'Arena@2026',
};

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

  const handleCopy = async (field: 'email' | 'password') => {
    const value = field === 'email' ? DEMO_CREDENTIALS.email : DEMO_CREDENTIALS.password;
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleUseDemoCredentials = () => {
    setValue('email', DEMO_CREDENTIALS.email);
    setValue('password', DEMO_CREDENTIALS.password);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Backend integration: POST /api/auth/login with { email, password }
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (
        data.email === DEMO_CREDENTIALS.email &&
        data.password === DEMO_CREDENTIALS.password
      ) {
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.token';
        const mockUser = {
          id: 'user-001',
          username: 'devuser',
          email: data.email,
          createdAt: '2026-01-15T00:00:00Z',
        };
        login(mockToken, mockUser);
        toast.success('Welcome back! Redirecting to problems...');
        router.push('/problem-list');
      } else {
        setError('root', {
          message: 'Invalid credentials — use the demo accounts below to sign in',
        });
      }
    } catch {
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

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-zinc-950 px-3 text-zinc-600">demo credentials</span>
        </div>
      </div>

      {/* Demo Credentials Box */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Try the demo account
          </span>
          <button
            type="button"
            onClick={handleUseDemoCredentials}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Autofill
          </button>
        </div>
        <div className="space-y-2">
          {[
            { id: 'cred-email', label: 'Email', value: DEMO_CREDENTIALS.email, field: 'email' as const },
            { id: 'cred-pass', label: 'Password', value: DEMO_CREDENTIALS.password, field: 'password' as const },
          ].map((cred) => (
            <div key={cred.id} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-zinc-600 w-14 flex-shrink-0">{cred.label}</span>
                <span className="text-xs font-mono text-zinc-300 truncate">{cred.value}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(cred.field)}
                className="flex-shrink-0 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                aria-label={`Copy ${cred.label}`}
              >
                {copiedField === cred.field ? (
                  <Check size={13} className="text-green-400" />
                ) : (
                  <Copy size={13} />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

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