import React, { useState } from 'react';
import { 
  Train, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Radio, 
  Clock, 
  BellRing,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';

interface AuthScreenProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ currentLang, onLanguageChange }) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInAsGuest } = useAuth();
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'passenger' | 'irctc_agent' | 'railway_official'>('passenger');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const t = translations[currentLang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setErrorMessage('Password should be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name || 'Passenger', role);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      let msg = err.message || 'Authentication failed. Please check your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Check your details or create a new account.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Google sign in popup was closed before completing.';
      }
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setErrorMessage(err.message || 'Google Sign In failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuestSignIn = async () => {
    setErrorMessage(null);
    setSubmitting(true);
    try {
      await signInAsGuest();
    } catch (err: any) {
      setErrorMessage(err.message || 'Guest Sign In failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string, demoRole: 'passenger' | 'railway_official' = 'passenger') => {
    setEmail(demoEmail);
    setPassword(demoPass);
    if (mode === 'signup') {
      setName(demoRole === 'passenger' ? 'Aarav Sharma' : 'Chief Controller NWR');
      setRole(demoRole);
    }
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#111111] flex flex-col font-sans selection:bg-[#003399] selection:text-white">
      
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003399] flex items-center justify-center text-white font-black shadow-sm">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-[#111111] uppercase font-sans">
                  RAILETA
                </h1>
                <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-[#003399] border border-blue-200">
                  SIH 2026 PS 26028
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider hidden sm:block">
                Dynamic ETA & Platform Forecast • Ministry of Railways
              </p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase hidden md:inline">Language:</span>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              {(['en', 'hi', 'bn', 'ta', 'te', 'mr'] as LanguageCode[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    currentLang === lang
                      ? 'bg-[#003399] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-black'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Authentication Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Platform Value Props & Hackathon Details */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#003399] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Firebase Cloud-Synced Train Intelligence</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] uppercase tracking-tight leading-none">
                Dynamic ML <br />
                <span className="text-[#003399]">Train ETA Forecast</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-lg">
                Authenticate your account to access real-time block signalling analytics, Doppler weather speed corrections, live platform conflict resolution, and cloud-synced arrival wake-up alarms.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-2 text-[#003399] font-black text-xs uppercase">
                  <Radio className="w-4 h-4" />
                  <span>Real-Time GPS & COA</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Sub-3s telemetry refresh from 12,000+ Indian Railways coaching locomotives.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-2 text-green-700 font-black text-xs uppercase">
                  <Clock className="w-4 h-4" />
                  <span>Dynamic ML ETA</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Physics & gradient delay explainability replacing naive static delay additions.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-2 text-amber-700 font-black text-xs uppercase">
                  <BellRing className="w-4 h-4" />
                  <span>Cloud Wake-Up Alarms</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Persistent station proximity audio alarms & platform change SMS alerts.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-2 text-indigo-700 font-black text-xs uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>IRCTC & Staff Access</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Multi-role observability dashboard for sectional controllers and passengers.
                </p>
              </div>
            </div>

            {/* Quick Demo Credentials Bar */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                ⚡ Quick Demo Auto-Fill (1-Click Tester Access):
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('passenger@raileta.in', 'railway2026', 'passenger')}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#003399] text-slate-700 hover:text-[#003399] text-xs font-black uppercase tracking-wider transition-colors"
                >
                  Passenger Demo
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('controller@indianrailways.gov.in', 'railway2026', 'railway_official')}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#003399] text-slate-700 hover:text-[#003399] text-xs font-black uppercase tracking-wider transition-colors"
                >
                  Control Room Staff Demo
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Sign In / Sign Up Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div 
              id="auth-card" 
              className="w-full max-w-md bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
            >
              {/* Card Mode Tabs */}
              <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-black uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setErrorMessage(null); }}
                  className={`py-2.5 rounded-xl transition-all ${
                    mode === 'signin'
                      ? 'bg-white text-[#111111] shadow-xs'
                      : 'text-slate-500 hover:text-black'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMessage(null); }}
                  className={`py-2.5 rounded-xl transition-all ${
                    mode === 'signup'
                      ? 'bg-white text-[#111111] shadow-xs'
                      : 'text-slate-500 hover:text-black'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Title & Subtitle */}
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-black uppercase text-[#111111]">
                  {mode === 'signin' ? 'Welcome to RailETA' : 'Register New Account'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {mode === 'signin' 
                    ? 'Enter your credentials to search and track coaching trains.'
                    : 'Join the dynamic expected arrival forecasting network.'}
                </p>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#003399] focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#003399] focus:bg-white font-mono"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                      Password
                    </label>
                    {mode === 'signin' && (
                      <span className="text-[11px] text-[#003399] font-bold">
                        Min 6 characters
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#003399] focus:bg-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-black"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Role Selector in Signup Mode */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                      Account Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-[#111111] focus:outline-none focus:border-[#003399] focus:bg-white"
                    >
                      <option value="passenger">Passenger / Commuter</option>
                      <option value="irctc_agent">IRCTC Authorized Agent</option>
                      <option value="railway_official">Railway Station Official / Controller</option>
                    </select>
                  </div>
                )}

                {/* Submit Primary Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-full bg-[#111111] hover:bg-[#003399] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                >
                  <span>{submitting ? 'Authenticating...' : mode === 'signin' ? 'Sign In & Enter Dashboard' : 'Create RailETA Account'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-black uppercase tracking-wider text-slate-400 absolute">
                  OR
                </span>
              </div>

              {/* Google & Guest Auth Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#111111] font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleGuestSignIn}
                  disabled={submitting}
                  className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-dashed border-slate-300 text-slate-600 hover:text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Quick Guest Exploration (No Password Required)</span>
                </button>
              </div>

              {/* Privacy / Terms footer */}
              <p className="text-[10px] text-center text-slate-400 font-medium leading-relaxed">
                By accessing RailETA, you connect to the Ministry of Railways Dynamic Expected Arrival Engine. Protected by Firestore security rules.
              </p>

            </div>
          </div>

        </div>
      </main>

      {/* Footnote */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 font-bold uppercase tracking-wider">
        RAILETA • SMART INDIA HACKATHON 2026 (PS ID: 26028) • MINISTRY OF RAILWAYS
      </footer>

    </div>
  );
};
