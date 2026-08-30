import React, { useState } from 'react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onCancel
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUser = username.trim().toLowerCase();
    const validUsers = ['admin', 'saisantosh_admin', 'store_manager', 'ops', 'saisantosh'];
    const validPasswords = ['admin123', 'admin@123', 'admin', 'pass123'];

    if (!cleanUser) {
      setErrorMessage('Please enter your admin username.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your admin password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (validUsers.includes(cleanUser) && validPasswords.includes(password)) {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setErrorMessage('Invalid username or password. Access restricted to authorized Sai Santosh Traders administrators.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#0b131e] text-slate-100 flex flex-col justify-between items-center p-4 sm:p-6">
      {/* Top Header / Back Link */}
      <div className="w-full max-w-md flex items-center justify-between py-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Landing Page</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/30 text-emerald-400 text-xs font-extrabold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Hyderabad Ops Hub</span>
        </div>
      </div>

      {/* Admin Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl my-auto">
        {/* Portal Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 mb-4">
            <span className="material-symbols-outlined text-[32px]">admin_panel_settings</span>
          </div>

          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 mb-1">
            Sai Santosh Traders
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            ADMIN PORTAL
          </h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Hyderabad Dark Store Operations & Live Dispatch
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/80 border border-red-800/60 text-red-200 text-xs flex items-start gap-2.5">
            <span className="material-symbols-outlined text-red-400 text-[18px] shrink-0 mt-0.5">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Username
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-[20px]">
                person
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
                autoFocus
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-[20px]">
                lock
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 tracking-wider uppercase text-xs"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Authenticating Admin...</span>
              </>
            ) : (
              <>
                <span>LOGIN</span>
                <span className="material-symbols-outlined text-[18px]">login</span>
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-slate-500 mt-6 text-center">
          Access is restricted to authorized fulfillment center administrators.
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 py-3">
        © 2026 Sai Santosh Traders • Hyderabad Hyperlocal Dispatch
      </div>
    </div>
  );
};
