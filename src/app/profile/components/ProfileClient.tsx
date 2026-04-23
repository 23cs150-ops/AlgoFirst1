'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MOCK_PROBLEMS } from '@/lib/mockData';
import { useSubmissionStore } from '@/context/SubmissionContext';
import { useRouter } from 'next/navigation';
import VerdictBadge from '@/components/ui/VerdictBadge';
import DifficultyBadge from '@/components/ui/DifficultyBadge';
import {
  User,
  Lock,
  Settings,
  BarChart3,
  CheckCircle2,
  TrendingUp,
  Code2,
  Eye,
  EyeOff,
  Save,
  Calendar,
  Shield,
  Bell,
  Monitor,
  ChevronRight,
  LogOut,
} from 'lucide-react';

type Tab = 'account' | 'security' | 'preferences' | 'stats';

const LANGUAGE_LABELS: Record<string, string> = {
  cpp: 'C++',
  python3: 'Python 3',
  java: 'Java',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  go: 'Go',
  rust: 'Rust',
  c: 'C',
};

function formatRelativeTime(isoString: string): string {
  const now = new Date('2026-04-18T15:29:32Z');
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function ProfileClient() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { submissions: allSubmissions } = useSubmissionStore();
  const [activeTab, setActiveTab] = useState<Tab>('account');

  // Account form state
  const [username, setUsername] = useState(user?.username ?? 'dev_user');
  const [email, setEmail] = useState(user?.email ?? 'dev@algofirst.io');
  const [accountSaved, setAccountSaved] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  // Preferences state
  const [defaultLanguage, setDefaultLanguage] = useState('python3');
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState('14');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showDifficulty, setShowDifficulty] = useState(true);
  const [prefSaved, setPrefSaved] = useState(false);

  // Stats computation
  const solvedProblemIds = [...new Set(allSubmissions.filter((s) => s.status === 'Accepted').map((s) => s.problemId))];
  const totalProblems = MOCK_PROBLEMS.length;
  const solvedCount = solvedProblemIds.length;
  const easyProblems = MOCK_PROBLEMS.filter((p) => p.difficulty === 'Easy');
  const mediumProblems = MOCK_PROBLEMS.filter((p) => p.difficulty === 'Medium');
  const hardProblems = MOCK_PROBLEMS.filter((p) => p.difficulty === 'Hard');
  const solvedEasy = easyProblems.filter((p) => solvedProblemIds.includes(p.id)).length;
  const solvedMedium = mediumProblems.filter((p) => solvedProblemIds.includes(p.id)).length;
  const solvedHard = hardProblems.filter((p) => solvedProblemIds.includes(p.id)).length;
  const totalSubmissions = allSubmissions.length;
  const acceptedSubmissions = allSubmissions.filter((s) => s.status === 'Accepted').length;
  const acceptanceRate = totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0;

  const recentSubmissions = [...allSubmissions]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  const getProblemById = (id: string) => MOCK_PROBLEMS.find((p) => p.id === id);

  const handleAccountSave = () => {
    setAccountSaved(true);
    setTimeout(() => setAccountSaved(false), 2000);
  };

  const handlePasswordSave = () => {
    setPasswordError('');
    if (!currentPassword) { setPasswordError('Current password is required.'); return; }
    if (newPassword.length < 8) { setPasswordError('New password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match.'); return; }
    setPasswordSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSaved(false), 2000);
  };

  const handlePrefSave = () => {
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    router.push('/sign-up-login-screen');
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'account', label: 'Account', icon: <User size={15} /> },
    { id: 'security', label: 'Security', icon: <Lock size={15} /> },
    { id: 'preferences', label: 'Preferences', icon: <Settings size={15} /> },
    { id: 'stats', label: 'Submission Stats', icon: <BarChart3 size={15} /> },
  ];

  const inputClass =
    'w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors';
  const labelClass = 'block text-xs font-medium text-zinc-400 mb-1.5';

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-zinc-800 px-6 py-4 bg-zinc-900">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-violet-500/30 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-blue-300">
              {(user?.username ?? 'U')[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-100">{user?.username ?? 'dev_user'}</h1>
            <p className="text-sm text-zinc-500 flex items-center gap-1.5 mt-0.5">
              <Calendar size={12} />
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'April 2026'}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>
            <div className="text-center">
              <div className="text-lg font-bold text-zinc-100 tabular-nums">{solvedCount}</div>
              <div className="text-xs text-zinc-500">Solved</div>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="text-center">
              <div className="text-lg font-bold text-zinc-100 tabular-nums">{acceptanceRate}%</div>
              <div className="text-xs text-zinc-500">Acceptance</div>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="text-center">
              <div className="text-lg font-bold text-zinc-100 tabular-nums">{totalSubmissions}</div>
              <div className="text-xs text-zinc-500">Submissions</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        <div className="max-w-4xl mx-auto flex gap-6">
          {/* Sidebar Tabs */}
          <div className="w-48 flex-shrink-0">
            <nav className="space-y-0.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                    activeTab === tab.id
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 border border-transparent'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-blue-400' : 'text-zinc-500'}>{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.id && <ChevronRight size={12} className="ml-auto text-blue-400" />}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Panel */}
          <div className="flex-1 min-w-0">

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <User size={16} className="text-blue-400" />
                  <h2 className="text-base font-semibold text-zinc-100">Account Information</h2>
                </div>
                <p className="text-xs text-zinc-500 -mt-3">Update your display name and email address.</p>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={inputClass}
                      placeholder="Your username"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>User ID</label>
                    <div className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-sm text-zinc-500 font-mono select-all">
                      {user?.id ?? 'usr_demo_001'}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={handleAccountSave}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Save size={14} />
                    Save Changes
                  </button>
                  {accountSaved && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Saved successfully
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={16} className="text-blue-400" />
                  <h2 className="text-base font-semibold text-zinc-100">Change Password</h2>
                </div>
                <p className="text-xs text-zinc-500 -mt-3">Use a strong password with at least 8 characters.</p>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={`${inputClass} pr-10`}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>New Password</label>
                    <div className="relative">
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`${inputClass} pr-10`}
                        placeholder="Min. 8 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {newPassword.length > 0 && (
                      <div className="mt-2 flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 h-1 rounded-full transition-colors ${
                              newPassword.length >= (i + 1) * 3
                                ? newPassword.length >= 12 ? 'bg-emerald-500' : newPassword.length >= 8 ? 'bg-amber-500' : 'bg-red-500' :'bg-zinc-700'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`${inputClass} pr-10`}
                        placeholder="Repeat new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </div>

                {passwordError && (
                  <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {passwordError}
                  </div>
                )}

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={handlePasswordSave}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Lock size={14} />
                    Update Password
                  </button>
                  {passwordSaved && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Password updated
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <Settings size={16} className="text-blue-400" />
                  <h2 className="text-base font-semibold text-zinc-100">Preferences</h2>
                </div>
                <p className="text-xs text-zinc-500 -mt-3">Customize your editor and notification settings.</p>

                <div className="space-y-5">
                  {/* Editor Settings */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Monitor size={13} className="text-zinc-500" />
                      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Editor</span>
                    </div>
                    <div className="space-y-3 pl-1">
                      <div>
                        <label className={labelClass}>Default Language</label>
                        <select
                          value={defaultLanguage}
                          onChange={(e) => setDefaultLanguage(e.target.value)}
                          className={`${inputClass} cursor-pointer`}
                        >
                          {Object.entries(LANGUAGE_LABELS).map(([id, label]) => (
                            <option key={id} value={id}>{label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Editor Theme</label>
                        <select
                          value={editorTheme}
                          onChange={(e) => setEditorTheme(e.target.value)}
                          className={`${inputClass} cursor-pointer`}
                        >
                          <option value="vs-dark">Dark (VS Dark)</option>
                          <option value="hc-black">High Contrast Black</option>
                          <option value="vs">Light (VS)</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Font Size</label>
                        <select
                          value={fontSize}
                          onChange={(e) => setFontSize(e.target.value)}
                          className={`${inputClass} cursor-pointer`}
                        >
                          {['12', '13', '14', '15', '16', '18'].map((s) => (
                            <option key={s} value={s}>{s}px</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="border-t border-zinc-800 pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Bell size={13} className="text-zinc-500" />
                      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Notifications</span>
                    </div>
                    <div className="space-y-3 pl-1">
                      <label className="flex items-center justify-between cursor-pointer group">
                        <div>
                          <div className="text-sm text-zinc-200 group-hover:text-zinc-100 transition-colors">Email Notifications</div>
                          <div className="text-xs text-zinc-500">Receive submission result emails</div>
                        </div>
                        <div
                          onClick={() => setEmailNotifications(!emailNotifications)}
                          className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${emailNotifications ? 'bg-blue-600' : 'bg-zinc-700'}`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${emailNotifications ? 'left-5' : 'left-0.5'}`} />
                        </div>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer group">
                        <div>
                          <div className="text-sm text-zinc-200 group-hover:text-zinc-100 transition-colors">Show Difficulty Labels</div>
                          <div className="text-xs text-zinc-500">Display difficulty badges on problem list</div>
                        </div>
                        <div
                          onClick={() => setShowDifficulty(!showDifficulty)}
                          className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${showDifficulty ? 'bg-blue-600' : 'bg-zinc-700'}`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${showDifficulty ? 'left-5' : 'left-0.5'}`} />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={handlePrefSave}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Save size={14} />
                    Save Preferences
                  </button>
                  {prefSaved && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Preferences saved
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-zinc-500 uppercase tracking-wider">Solved</span>
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    </div>
                    <div className="text-2xl font-bold text-zinc-100 tabular-nums">{solvedCount}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">of {totalProblems} problems</div>
                    <div className="w-full bg-zinc-800 rounded-full h-1 mt-2">
                      <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${(solvedCount / totalProblems) * 100}%` }} />
                    </div>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-zinc-500 uppercase tracking-wider">Acceptance</span>
                      <TrendingUp size={14} className="text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-zinc-100 tabular-nums">{acceptanceRate}%</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{acceptedSubmissions} accepted</div>
                    <div className="w-full bg-zinc-800 rounded-full h-1 mt-2">
                      <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${acceptanceRate}%` }} />
                    </div>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-zinc-500 uppercase tracking-wider">Submissions</span>
                      <Code2 size={14} className="text-violet-400" />
                    </div>
                    <div className="text-2xl font-bold text-zinc-100 tabular-nums">{totalSubmissions}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{totalSubmissions - acceptedSubmissions} failed</div>
                    <div className="flex gap-1 mt-2">
                      <div className="h-1 rounded-full bg-emerald-500" style={{ width: `${(acceptedSubmissions / totalSubmissions) * 100}%` }} />
                      <div className="h-1 rounded-full bg-red-500 flex-1" />
                    </div>
                  </div>
                </div>

                {/* Difficulty Breakdown */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-zinc-300 mb-4">Difficulty Breakdown</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Easy', solved: solvedEasy, total: easyProblems.length, color: 'text-emerald-400', bar: 'bg-emerald-500' },
                      { label: 'Medium', solved: solvedMedium, total: mediumProblems.length, color: 'text-amber-400', bar: 'bg-amber-500' },
                      { label: 'Hard', solved: solvedHard, total: hardProblems.length, color: 'text-red-400', bar: 'bg-red-500' },
                    ].map(({ label, solved, total, color, bar }) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className={`text-xs font-semibold w-14 ${color}`}>{label}</span>
                        <div className="flex-1 bg-zinc-800 rounded-full h-2">
                          <div className={`${bar} h-2 rounded-full transition-all`} style={{ width: total > 0 ? `${(solved / total) * 100}%` : '0%' }} />
                        </div>
                        <span className="text-xs text-zinc-500 tabular-nums w-12 text-right">{solved}/{total}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Submissions */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-zinc-300 mb-4">Recent Submissions</h3>
                  <div className="space-y-2">
                    {recentSubmissions.map((sub) => {
                      const problem = getProblemById(sub.problemId);
                      return (
                        <div
                          key={sub.id}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-zinc-200 truncate">
                                {problem ? `${problem.number}. ${problem.title}` : sub.problemId}
                              </span>
                              {problem && <DifficultyBadge difficulty={problem.difficulty} />}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500">
                              <span className="font-mono">{LANGUAGE_LABELS[sub.language] ?? sub.language}</span>
                              {sub.runtime !== 'N/A' && (
                                <>
                                  <span className="text-zinc-700">·</span>
                                  <span>{sub.runtime}</span>
                                </>
                              )}
                              <span className="text-zinc-700">·</span>
                              <span>{formatRelativeTime(sub.submittedAt)}</span>
                            </div>
                          </div>
                          <VerdictBadge status={sub.status} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
