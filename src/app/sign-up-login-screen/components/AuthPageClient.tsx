'use client';
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import BrandPanel from './BrandPanel';

export default function AuthPageClient() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Left: Brand Panel */}
      <BrandPanel />

      {/* Right: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 min-h-screen">
        <div className="w-full max-w-md">
          {/* Tab Switcher */}
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 mb-8">
            <button
              onClick={() => setActiveTab('login')}
              className={`
                flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200
                ${activeTab === 'login' ?'bg-zinc-800 text-zinc-100 shadow-sm' :'text-zinc-500 hover:text-zinc-300'
                }
              `}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`
                flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200
                ${activeTab === 'register' ?'bg-zinc-800 text-zinc-100 shadow-sm' :'text-zinc-500 hover:text-zinc-300'
                }
              `}
            >
              Create Account
            </button>
          </div>

          {/* Forms */}
          <div className="fade-in">
            {activeTab === 'login' ? (
              <LoginForm onSwitchToRegister={() => setActiveTab('register')} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setActiveTab('login')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}