'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const PASSWORD_STRENGTH = (password: string) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password', '');
  const strengthScore = PASSWORD_STRENGTH(password);

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strengthScore];
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-400', 'bg-green-500'][strengthScore];

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // Backend integration: POST /api/auth/register with { username, email, password }
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new.user.token';
      const mockUser = {
        id: 'user-new-001',
        username: data.username,
        email: data.email,
        createdAt: new Date().toISOString(),
      };
      login(mockToken, mockUser);
      toast.success('Account created! Welcome to AlgoFirst.');
      router.push('/problem-list');
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Create your account</h2>
        <p className="text-zinc-500 text-sm mt-1">Start solving problems for free</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Username */}
        <div className="space-y-1.5">
          <label htmlFor="reg-username" className="block text-sm font-medium text-zinc-300">
            Username
          </label>
          <p className="text-xs text-zinc-600">This will be shown on your profile and submissions</p>
          <input
            id="reg-username"
            type="text"
            autoComplete="username"
            placeholder="e.g. algo_wizard"
            {...register('username', {
              required: 'Username is required',
              minLength: { value: 3, message: 'At least 3 characters' },
              maxLength: { value: 20, message: 'At most 20 characters' },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: 'Only letters, numbers, and underscores',
              },
            })}
            className={`
              w-full bg-zinc-900 border rounded-md px-3 py-2.5 text-sm text-zinc-100
              placeholder:text-zinc-600 outline-none transition-all duration-150
              focus:ring-1 focus:ring-blue-500
              ${errors.username ? 'border-red-500/60' : 'border-zinc-700 hover:border-zinc-600'}
            `}
          />
          {errors.username && (
            <p className="text-xs text-red-400">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="reg-email" className="block text-sm font-medium text-zinc-300">
            Email address
          </label>
          <input
            id="reg-email"
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
              ${errors.email ? 'border-red-500/60' : 'border-zinc-700 hover:border-zinc-600'}
            `}
          />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="reg-password" className="block text-sm font-medium text-zinc-300">
            Password
          </label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'At least 8 characters required' },
              })}
              className={`
                w-full bg-zinc-900 border rounded-md px-3 py-2.5 pr-10 text-sm text-zinc-100
                placeholder:text-zinc-600 outline-none transition-all duration-150
                focus:ring-1 focus:ring-blue-500
                ${errors.password ? 'border-red-500/60' : 'border-zinc-700 hover:border-zinc-600'}
              `}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {/* Strength bar */}
          {password && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={`strength-bar-${i}`}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i <= strengthScore ? strengthColor : 'bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs ${strengthScore <= 1 ? 'text-red-400' : strengthScore <= 2 ? 'text-yellow-400' : strengthScore === 3 ? 'text-blue-400' : 'text-green-400'}`}>
                {strengthLabel} password
              </p>
            </div>
          )}
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="reg-confirm" className="block text-sm font-medium text-zinc-300">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="reg-confirm"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              className={`
                w-full bg-zinc-900 border rounded-md px-3 py-2.5 pr-10 text-sm text-zinc-100
                placeholder:text-zinc-600 outline-none transition-all duration-150
                focus:ring-1 focus:ring-blue-500
                ${errors.confirmPassword ? 'border-red-500/60' : 'border-zinc-700 hover:border-zinc-600'}
              `}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms */}
        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <input
              id="agree-terms"
              type="checkbox"
              {...register('agreeToTerms', {
                required: 'You must accept the terms to continue',
              })}
              className="w-4 h-4 mt-0.5 rounded border-zinc-700 bg-zinc-900 accent-blue-500 flex-shrink-0"
            />
            <label htmlFor="agree-terms" className="text-sm text-zinc-400 leading-relaxed">
              I agree to the{' '}
              <button type="button" className="text-blue-400 hover:text-blue-300 transition-colors">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" className="text-blue-400 hover:text-blue-300 transition-colors">
                Privacy Policy
              </button>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-xs text-red-400">{errors.agreeToTerms.message}</p>
          )}
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
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <Check size={16} />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          Sign in instead
        </button>
      </p>
    </div>
  );
}