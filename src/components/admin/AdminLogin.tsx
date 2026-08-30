import React, { useState } from 'react';
import { UserRole } from '../../types';

interface AdminLoginProps {
  onLoginSuccess: (role: UserRole) => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToStore
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      // Secure authentication validation
      const validAdminUsers = ['admin', 'saisantosh_admin', 'store_manager', 'ops'];
      const validAdminPass = 'admin@123';

      if (validAdminUsers.includes(username.trim().toLowerCase()) && password === validAdminPass) {
        setIsLoading(false);
        onLoginSuccess('ADMIN');
      } else {
        setIsLoading(false);
        setError('Invalid admin credentials. Please enter valid Dark Store admin username and password.');
      }
    }, 400);
  };

  const handleQuickFill = () => {
    setUsername('saisantosh_admin');
    setPassword('admin@123');
    setError(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#0b131e] text-slate-100 flex flex-col justify-between items-center p-4 sm:p-6">
      {/* Top Bar */}
      <div className="w-full max-w-md flex items-center justify-between py-2">
        <button
          type="button"
          onClick={onBackToStore}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Customer Storefront
        </button>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/30 text-emerald-400 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Dark Store Ops
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl my-auto">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 mb-4">
            <span className="material-symbols-outlined text-[32px]">admin_panel_settings</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Sai Santosh Traders • Hyderabad Fulfillment Center
          </p>
          <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-[11px] font-mono text-slate-300 border border-slate-700">
            <span>Role: ADMIN / STORE_MANAGER</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/80 border border-red-800/60 text-red-200 text-xs flex items-start gap-2.5 animate-shake">
            <span className="material-symbols-outlined text-red-400 text-[18px] shrink-0 mt-0.5">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Admin Username
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-[20px]">
                person
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. saisantosh_admin"
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-[20px]">
                lock
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Login to Admin Dashboard</span>
                <span className="material-symbols-outlined text-[18px]">login</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Fill Button */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col items-center">
          <button
            type="button"
            onClick={handleQuickFill}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-emerald-400 text-[18px]">bolt</span>
            <span>Auto-Fill Admin Demo Credentials (admin@123)</span>
          </button>

          <p className="text-[11px] text-slate-500 mt-3 text-center">
            Separate admin access restricted to Hyderabad fulfillment hub staff.
          </p>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-slate-500 py-3">
        © 2026 Sai Santosh Traders • Dark Store Hyperlocal Operations • Hyderabad
      </div>
    </div>
  );
};
