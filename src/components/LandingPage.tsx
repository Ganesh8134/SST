import React, { useState } from 'react';
import { Category } from '../types';

interface LandingPageProps {
  categories: Category[];
  onCustomerLoginSuccess: (customerInfo: { name: string; phone: string }) => void;
  onOpenAdminLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  categories,
  onCustomerLoginSuccess,
  onOpenAdminLogin
}) => {
  // Auth Form State: 'login' | 'signup'
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Login Form
  const [mobileNumber, setMobileNumber] = useState('9845012345');
  const [password, setPassword] = useState('pass123');
  const [rememberMe, setRememberMe] = useState(true);

  // Signup Form
  const [signupName, setSignupName] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupLocality, setSignupLocality] = useState('Himayatnagar');

  // Feedback/Error
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanNumber = mobileNumber.replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Please enter your password (minimum 4 characters).');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Determine customer name based on number or default
      const name = cleanNumber.includes('98450') ? 'Sai Santosh' : 'Hyderabad Customer';
      onCustomerLoginSuccess({
        name,
        phone: `+91 ${cleanNumber.slice(-10)}`
      });
    }, 450);
  };

  const handleCustomerSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signupName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    const cleanNumber = signupMobile.replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!signupPassword || signupPassword.length < 4) {
      setErrorMessage('Please create a secure password (min 4 characters).');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onCustomerLoginSuccess({
        name: signupName.trim(),
        phone: `+91 ${cleanNumber.slice(-10)}`
      });
    }, 450);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onCustomerLoginSuccess({
        name: 'Sai Santosh',
        phone: '+91 98450 12345'
      });
    }, 400);
  };

  const handleQuickDemoLogin = (name: string, phone: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onCustomerLoginSuccess({ name, phone });
    }, 300);
  };

  const scrollToLogin = () => {
    const el = document.getElementById('customer-login-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#141b2b] flex flex-col selection:bg-[#caead6] selection:text-[#00422b]">
      {/* Top Professional Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e6ecf5] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Business Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#006c49] to-[#049669] flex items-center justify-center text-white shadow-md shadow-[#006c49]/20">
              <span className="material-symbols-outlined text-[26px]">storefront</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[18px] sm:text-[20px] font-black text-[#006c49] tracking-tight leading-none">
                  Sai Santosh Traders
                </span>
                <span className="hidden sm:inline-block text-[10px] font-extrabold bg-[#caead6] text-[#00422b] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Hyderabad
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#4a5850] uppercase tracking-wider block mt-0.5">
                Quality Groceries Delivered to Your Doorstep • HYDERABAD
              </span>
            </div>
          </div>

          {/* Top Actions: Login Jump & Clearly Separated Admin Access */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={scrollToLogin}
              className="px-3.5 py-2 rounded-xl bg-[#f1f8f4] hover:bg-[#caead6] text-[#006c49] text-xs font-extrabold border border-[#006c49]/20 transition-all cursor-pointer hidden sm:flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Customer Login</span>
            </button>

            {/* SEPARATE ADMIN ACCESS LINK / BUTTON */}
            <button
              type="button"
              onClick={onOpenAdminLogin}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-extrabold border border-slate-700 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              title="Restricted Staff & Admin Management Access"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-400">admin_panel_settings</span>
              <span>Admin Access</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* ======================================================== */}
        {/* 1. HERO SECTION */}
        {/* ======================================================== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#f1f8f4] via-[#f8fafc] to-white pt-10 pb-16 px-4 border-b border-[#e6ecf5]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Hyderabad Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#006c49]/20 shadow-xs text-[#006c49] text-xs font-extrabold">
                <span className="material-symbols-outlined text-[16px] text-[#006c49] animate-pulse">location_on</span>
                <span>Hyderabad's Trusted Grocery Destination</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]" />
                <span className="text-[#3c4a42] font-semibold">15–20 Mins Delivery</span>
              </div>

              {/* Large Headings */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl font-black text-[#141b2b] tracking-tight leading-[1.15]">
                  Sai Santosh Traders
                </h1>
                <p className="text-lg sm:text-xl font-bold text-[#006c49]">
                  Your trusted destination for everyday grocery essentials.
                </p>
                <p className="text-sm sm:text-base text-[#4a5850] leading-relaxed max-w-xl">
                  Shop quality dairy products, rice & flour, dals & pulses, oil & ghee, snacks and biscuits — delivered conveniently across Hyderabad.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={scrollToLogin}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#006c49] to-[#049669] hover:from-[#005236] hover:to-[#037d57] text-white font-extrabold text-sm shadow-lg shadow-[#006c49]/25 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Get Started & Shop Groceries</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenAdminLogin}
                  className="px-4 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-600">lock</span>
                  <span>Admin Portal</span>
                </button>
              </div>

              {/* Trust Metric Strip */}
              <div className="pt-4 border-t border-[#e6ecf5] grid grid-cols-3 gap-4 max-w-lg text-left">
                <div>
                  <span className="text-xl sm:text-2xl font-black text-[#006c49] block">15–20 Mins</span>
                  <span className="text-[11px] text-[#4a5850] font-semibold">Average Delivery Time</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-[#006c49] block">60+ SKUs</span>
                  <span className="text-[11px] text-[#4a5850] font-semibold">6 Essential Categories</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-[#006c49] block">10 Stores</span>
                  <span className="text-[11px] text-[#4a5850] font-semibold">Across Hyderabad</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-4/3 group">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
                  alt="Fresh Quality Groceries at Sai Santosh Traders Hyderabad"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#caead6] text-[#00422b] text-[11px] font-extrabold self-start mb-2">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    100% Genuine Quality Guaranteed
                  </div>
                  <h3 className="text-xl font-black leading-tight">
                    Fresh Farm Essentials & Trusted Household Brands
                  </h3>
                  <p className="text-xs text-slate-200 mt-1">
                    Directly sourced from trusted mills & dairies across Telangana
                  </p>
                </div>
              </div>

              {/* Floating Speed Card */}
              <div className="absolute -bottom-5 -left-5 bg-white p-3.5 rounded-2xl shadow-xl border border-[#e6ecf5] flex items-center gap-3 hidden sm:flex">
                <div className="w-10 h-10 rounded-xl bg-[#caead6] text-[#00422b] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">electric_bolt</span>
                </div>
                <div>
                  <span className="text-xs font-black text-[#141b2b] block">Hyperlocal Dispatch</span>
                  <span className="text-[11px] text-[#4a5850]">Himayatnagar • Banjara Hills • Jubilee Hills</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 2. BUSINESS HIGHLIGHTS (4 ATTRACTIVE CARDS) */}
        {/* ======================================================== */}
        <section className="py-14 px-4 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold text-[#006c49] uppercase tracking-wider bg-[#caead6]/60 px-3 py-1 rounded-full">
              Why Sai Santosh Traders
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#141b2b] mt-2">
              Everyday Grocery Standards You Can Trust
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Fast Delivery */}
            <div className="bg-white p-6 rounded-3xl border border-[#e6ecf5] shadow-xs hover:shadow-md hover:border-[#006c49]/40 transition-all flex flex-col items-start">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">bolt</span>
              </div>
              <h3 className="text-base font-extrabold text-[#141b2b] flex items-center gap-1.5">
                ⚡ Fast Delivery
              </h3>
              <p className="text-xs text-[#4a5850] mt-2 leading-relaxed">
                Quick delivery across Hyderabad in 15–20 minutes from nearest dark stores.
              </p>
            </div>

            {/* Card 2: Quality Products */}
            <div className="bg-white p-6 rounded-3xl border border-[#e6ecf5] shadow-xs hover:shadow-md hover:border-[#006c49]/40 transition-all flex flex-col items-start">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#006c49] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">verified</span>
              </div>
              <h3 className="text-base font-extrabold text-[#141b2b] flex items-center gap-1.5">
                ✓ Quality Products
              </h3>
              <p className="text-xs text-[#4a5850] mt-2 leading-relaxed">
                Carefully selected grocery essentials with hygienic packing and freshness checks.
              </p>
            </div>

            {/* Card 3: Great Prices */}
            <div className="bg-white p-6 rounded-3xl border border-[#e6ecf5] shadow-xs hover:shadow-md hover:border-[#006c49]/40 transition-all flex flex-col items-start">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">payments</span>
              </div>
              <h3 className="text-base font-extrabold text-[#141b2b] flex items-center gap-1.5">
                💰 Great Prices
              </h3>
              <p className="text-xs text-[#4a5850] mt-2 leading-relaxed">
                Competitive everyday pricing, special discount coupons and wholesale savings.
              </p>
            </div>

            {/* Card 4: Hyderabad */}
            <div className="bg-white p-6 rounded-3xl border border-[#e6ecf5] shadow-xs hover:shadow-md hover:border-[#006c49]/40 transition-all flex flex-col items-start">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">location_on</span>
              </div>
              <h3 className="text-base font-extrabold text-[#141b2b] flex items-center gap-1.5">
                📍 Hyderabad
              </h3>
              <p className="text-xs text-[#4a5850] mt-2 leading-relaxed">
                Serving customers across Hyderabad with dedicated neighborhood dispatch points.
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. OUR CATEGORIES (ONLY 6 CATEGORIES) */}
        {/* ======================================================== */}
        <section className="py-14 px-4 bg-[#f1f8f4]/60 border-y border-[#e6ecf5]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-extrabold text-[#006c49] uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-[#006c49]/20">
                  Curated Catalog
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#141b2b] mt-2">
                  Our Categories
                </h2>
                <p className="text-xs sm:text-sm text-[#4a5850] mt-1">
                  Explore fresh daily essentials across our 6 core staple categories.
                </p>
              </div>

              <button
                type="button"
                onClick={scrollToLogin}
                className="text-xs font-extrabold text-[#006c49] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                <span>Login to Browse 60+ Products</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* 6 Category Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {categories.slice(0, 6).map((cat) => (
                <div
                  key={cat.id}
                  onClick={scrollToLogin}
                  className="group bg-white rounded-2xl p-3 border border-[#e6ecf5] hover:border-[#006c49] hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center"
                >
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#f8fafc] mb-3 relative">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-white/90 text-[#006c49] font-black text-[9px] shadow-xs">
                      10 Items
                    </div>
                  </div>

                  <h3 className="font-extrabold text-sm text-[#141b2b] group-hover:text-[#006c49] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-[#4a5850] mt-1 line-clamp-1">
                    {cat.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. CUSTOMER LOGIN / SIGNUP & PORTAL GATEWAY */}
        {/* ======================================================== */}
        <section id="customer-login-section" className="py-16 px-4 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Side: Store Welcome & Trust Message */}
            <div className="lg:col-span-6 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#006c49] to-[#049669] text-white flex items-center justify-center shadow-lg shadow-[#006c49]/20">
                <span className="material-symbols-outlined text-[32px]">shopping_bag</span>
              </div>

              <div>
                <span className="text-xs font-extrabold text-[#006c49] uppercase tracking-wider">
                  Instant Account Access
                </span>
                <h2 className="text-3xl font-black text-[#141b2b] mt-1">
                  Welcome to Sai Santosh Traders
                </h2>
                <p className="text-sm text-[#4a5850] mt-2 leading-relaxed">
                  Sign in with your mobile number to start adding fresh dairy, rice, dals, cooking oils, snacks and biscuits to your cart with live delivery tracking across Hyderabad.
                </p>
              </div>

              {/* Fast Login Demo Pills */}
              <div className="bg-[#f1f8f4] p-4 rounded-2xl border border-[#006c49]/20 space-y-2.5">
                <div className="text-xs font-extrabold text-[#006c49] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">touch_app</span>
                  <span>Quick One-Click Customer Login (Demo):</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('Sai Santosh', '+91 98450 12345')}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#caead6] text-[#00422b] text-xs font-bold border border-[#006c49]/30 shadow-xs transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>👤 Login as Sai Santosh (Himayatnagar)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('Kavitha Reddy', '+91 98480 23456')}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#caead6] text-[#00422b] text-xs font-bold border border-[#006c49]/30 shadow-xs transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>👤 Login as Kavitha (Banjara Hills)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side: Customer Login / Signup Form Card */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e6ecf5] shadow-xl relative">
                {/* Form Mode Selector */}
                <div className="flex bg-[#f1f3ff] p-1 rounded-2xl mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMessage(null);
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      authMode === 'login'
                        ? 'bg-white text-[#006c49] shadow-xs'
                        : 'text-[#4a5850] hover:text-[#141b2b]'
                    }`}
                  >
                    Customer Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setErrorMessage(null);
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      authMode === 'signup'
                        ? 'bg-white text-[#006c49] shadow-xs'
                        : 'text-[#4a5850] hover:text-[#141b2b]'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* LOGIN FORM */}
                {authMode === 'login' ? (
                  <form onSubmit={handleCustomerLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#4a5850] mb-1.5">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          placeholder="98450 12345"
                          maxLength={10}
                          required
                          className="w-full bg-[#f8fafc] border border-[#e6ecf5] rounded-xl pl-12 pr-4 py-3 text-sm text-[#141b2b] font-medium focus:outline-none focus:border-[#006c49] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#4a5850]">
                          Password
                        </label>
                        <span className="text-[11px] text-[#006c49] font-bold">
                          Default: pass123
                        </span>
                      </div>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                          lock
                        </span>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full bg-[#f8fafc] border border-[#e6ecf5] rounded-xl pl-10 pr-4 py-3 text-sm text-[#141b2b] font-medium focus:outline-none focus:border-[#006c49] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-2 cursor-pointer text-[#4a5850]">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-[#e6ecf5] text-[#006c49] focus:ring-[#006c49]"
                        />
                        <span>Remember me</span>
                      </label>
                      <span className="text-[#006c49] font-semibold">Hyderabad Area</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#006c49] hover:bg-[#005236] text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md shadow-[#006c49]/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Logging in...</span>
                        </>
                      ) : (
                        <>
                          <span>LOGIN</span>
                          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* SIGNUP FORM */
                  <form onSubmit={handleCustomerSignup} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#4a5850] mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="e.g. Ramesh Varma"
                        required
                        className="w-full bg-[#f8fafc] border border-[#e6ecf5] rounded-xl px-3.5 py-2.5 text-sm text-[#141b2b] focus:outline-none focus:border-[#006c49] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#4a5850] mb-1">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={signupMobile}
                          onChange={(e) => setSignupMobile(e.target.value)}
                          placeholder="98765 43210"
                          maxLength={10}
                          required
                          className="w-full bg-[#f8fafc] border border-[#e6ecf5] rounded-xl pl-12 pr-3.5 py-2.5 text-sm text-[#141b2b] focus:outline-none focus:border-[#006c49] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#4a5850] mb-1">
                        Hyderabad Locality
                      </label>
                      <select
                        value={signupLocality}
                        onChange={(e) => setSignupLocality(e.target.value)}
                        className="w-full bg-[#f8fafc] border border-[#e6ecf5] rounded-xl px-3.5 py-2.5 text-sm text-[#141b2b] focus:outline-none focus:border-[#006c49] focus:bg-white cursor-pointer"
                      >
                        <option value="Himayatnagar">Himayatnagar, Hyderabad</option>
                        <option value="Banjara Hills">Banjara Hills, Hyderabad</option>
                        <option value="Jubilee Hills">Jubilee Hills, Hyderabad</option>
                        <option value="Begumpet">Begumpet, Hyderabad</option>
                        <option value="Ameerpet">Ameerpet, Hyderabad</option>
                        <option value="Madhapur">Madhapur, Hyderabad</option>
                        <option value="Kondapur">Kondapur, Hyderabad</option>
                        <option value="Kukatpally">Kukatpally, Hyderabad</option>
                        <option value="Dilsukhnagar">Dilsukhnagar, Hyderabad</option>
                        <option value="Secunderabad">Secunderabad, Hyderabad</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#4a5850] mb-1">
                        Create Password
                      </label>
                      <input
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-[#f8fafc] border border-[#e6ecf5] rounded-xl px-3.5 py-2.5 text-sm text-[#141b2b] focus:outline-none focus:border-[#006c49] focus:bg-white transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#006c49] hover:bg-[#005236] text-white font-extrabold py-3 px-4 rounded-xl shadow-md shadow-[#006c49]/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>CREATE ACCOUNT</span>
                          <span className="material-symbols-outlined text-[18px]">check</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Divider */}
                <div className="my-5 flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#e6ecf5]" />
                  <span className="text-[11px] font-bold text-[#4a5850] uppercase">or</span>
                  <div className="flex-1 h-px bg-[#e6ecf5]" />
                </div>

                {/* Continue with Google */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Toggle mode text */}
                <div className="mt-4 text-center text-xs text-[#4a5850]">
                  {authMode === 'login' ? (
                    <span>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('signup')}
                        className="text-[#006c49] font-extrabold hover:underline cursor-pointer"
                      >
                        CREATE ACCOUNT
                      </button>
                    </span>
                  ) : (
                    <span>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className="text-[#006c49] font-extrabold hover:underline cursor-pointer"
                      >
                        LOGIN
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. SEPARATE ADMIN ACCESS PORTAL PROMO */}
        {/* ======================================================== */}
        <section className="bg-slate-900 text-white py-10 px-4 border-t border-slate-800">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-950/80 p-6 sm:p-8 rounded-3xl border border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[32px]">admin_panel_settings</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  Sai Santosh Traders Admin Portal
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Restricted staff access for order fulfillment, real-time status dispatch, and Hyderabad stock management.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenAdminLogin}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <span>Admin Access & Dispatch Hub</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </section>
      </main>

      {/* Professional Footer */}
      <footer className="bg-white border-t border-[#e6ecf5] py-8 px-4 text-xs text-[#4a5850]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-extrabold text-[#006c49]">Sai Santosh Traders</span>
            <span className="mx-2">•</span>
            <span>12th Main Road, Himayatnagar, Hyderabad, Telangana 500029</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenAdminLogin}
              className="text-slate-600 hover:text-slate-900 font-bold underline cursor-pointer"
            >
              Admin Login
            </button>
            <span>•</span>
            <span>© 2026 Sai Santosh Traders. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
