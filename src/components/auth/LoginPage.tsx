import React, { useState } from 'react';
import { 
  Train, 
  Shield, 
  Lock, 
  Mail, 
  User, 
  Radio, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Compass,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { AuthUser, UserRole } from '../../types';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  defaultRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onLoginSuccess,
  defaultRole = 'OPERATOR' 
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  
  // Operator Form State
  const [operatorEmail, setOperatorEmail] = useState('');
  const [operatorPassword, setOperatorPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [operatorError, setOperatorError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Passenger Form State
  const [passengerEmail, setPassengerEmail] = useState('');
  const [passengerPassword, setPassengerPassword] = useState('');
  const [showPassengerPassword, setShowPassengerPassword] = useState(false);
  const [passengerError, setPassengerError] = useState<string | null>(null);

  // Handle Operator Login
  const handleOperatorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setOperatorError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const cleanEmail = operatorEmail.trim().toLowerCase();
      const cleanPassword = operatorPassword.trim();

      if (cleanEmail === 'trainetaoperator@gmail.com' && cleanPassword === '12345678') {
        const user: AuthUser = {
          email: 'trainetaoperator@gmail.com',
          role: 'OPERATOR',
          name: 'Chief Train Controller',
          department: 'Control Office - Western Railway (BCT Division)',
          badgeId: 'IR-WR-OP-8492',
          loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        onLoginSuccess(user);
      } else {
        setOperatorError('Invalid credentials. Required: trainetaoperator@gmail.com / 12345678');
        setIsSubmitting(false);
      }
    }, 350);
  };

  // Auto-fill operator demo credentials
  const fillOperatorDemo = () => {
    setOperatorEmail('trainetaoperator@gmail.com');
    setOperatorPassword('12345678');
    setOperatorError(null);
  };

  // Auto-fill passenger demo credentials
  const fillPassengerDemo = () => {
    setPassengerEmail('passenger@smarteta.in');
    setPassengerPassword('passenger123');
    setPassengerError(null);
  };

  // Handle Passenger Login
  const handlePassengerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPassengerError(null);

    const cleanEmail = passengerEmail.trim().toLowerCase();
    const cleanPassword = passengerPassword.trim();

    if (!cleanEmail) {
      setPassengerError('Please enter your email ID');
      return;
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      setPassengerError('Please enter your password (minimum 4 characters)');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const derivedName = cleanEmail.includes('@')
        ? cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        : 'Commuter Traveler';

      const user: AuthUser = {
        email: cleanEmail,
        role: 'PASSENGER',
        name: derivedName || 'Commuter Traveler',
        department: 'Commuter / Passenger Live Portal',
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setIsSubmitting(false);
      onLoginSuccess(user);
    }, 250);
  };

  return (
    <div className="min-h-screen w-full bg-[#070D18] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-x-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 border border-blue-400/30">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-lg tracking-tight">SMART ETA</span>
              <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                DYNAMIC ML
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Indian Railways Dynamic Train ETA & Delay Intelligence
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            TELEMETRY NODE LIVE
          </span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 z-10">
        <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative">
          
          {/* Portal Switcher Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('OPERATOR');
                setOperatorError(null);
              }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-black transition-all ${
                selectedRole === 'OPERATOR'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Operator Portal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('PASSENGER');
                setOperatorError(null);
              }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-black transition-all ${
                selectedRole === 'PASSENGER'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Passenger Portal</span>
            </button>
          </div>

          {/* OPERATOR LOGIN FORM */}
          {selectedRole === 'OPERATOR' && (
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Railway Operations Control Login
                  </h2>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    Sign in with your Western Railway Section Controller / CRIS credentials.
                  </p>
                </div>
              </div>

              {/* Demo Credentials Quick-Fill Alert Banner */}
              <div className="bg-blue-950/50 border border-blue-700/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-blue-300">
                    <KeyRound className="w-4 h-4 text-blue-400" />
                    <span>Operator Authorized Credentials:</span>
                  </div>
                  <div className="font-mono text-slate-300 text-[11px]">
                    Email: <span className="text-amber-300 font-bold">trainetaoperator@gmail.com</span> • Pass: <span className="text-amber-300 font-bold">12345678</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={fillOperatorDemo}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shrink-0 transition-colors shadow-xs"
                >
                  Auto-Fill
                </button>
              </div>

              {/* Error Message if invalid */}
              {operatorError && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs font-bold flex items-center gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{operatorError}</span>
                </div>
              )}

              <form onSubmit={handleOperatorLogin} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Operator Email ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={operatorEmail}
                      onChange={(e) => setOperatorEmail(e.target.value)}
                      placeholder="trainetaoperator@gmail.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/90 border border-slate-700/80 rounded-xl text-xs sm:text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Security Password
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">Min 8 digits</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={operatorPassword}
                      onChange={(e) => setOperatorPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-slate-950/90 border border-slate-700/80 rounded-xl text-xs sm:text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Verifying Security Keys...</span>
                    ) : (
                      <>
                        <span>Access Rail Control Room</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Operator Capabilities Summary */}
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real-Time Fleet Telemetry</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>XAI Delay Attribution</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>What-If Dispatch Simulator</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cascading Propagation</span>
                </div>
              </div>
            </div>
          )}

          {/* PASSENGER LOGIN FORM */}
          {selectedRole === 'PASSENGER' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-400" />
                  Passenger & Commuter Live Portal
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Sign in to access real-time ML-predicted arrival times, station countdowns, and live GPS tracking.
                </p>
              </div>

              {/* Passenger Quick-Fill Banner */}
              <div className="bg-emerald-950/40 border border-emerald-700/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                    <KeyRound className="w-4 h-4 text-emerald-400" />
                    <span>Passenger Access:</span>
                  </div>
                  <div className="font-mono text-slate-300 text-[11px]">
                    Email: <span className="text-emerald-300 font-bold">passenger@smarteta.in</span> • Pass: <span className="text-emerald-300 font-bold">passenger123</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={fillPassengerDemo}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shrink-0 transition-colors shadow-xs"
                >
                  Auto-Fill
                </button>
              </div>

              {/* Error Alert if any */}
              {passengerError && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs font-bold flex items-center gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{passengerError}</span>
                </div>
              )}

              <form onSubmit={handlePassengerLogin} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Email ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={passengerEmail}
                      onChange={(e) => setPassengerEmail(e.target.value)}
                      placeholder="e.g. passenger@smarteta.in or your email"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/90 border border-slate-700/80 rounded-xl text-xs sm:text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Password
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">Min 4 characters</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassengerPassword ? 'text' : 'password'}
                      required
                      value={passengerPassword}
                      onChange={(e) => setPassengerPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-slate-950/90 border border-slate-700/80 rounded-xl text-xs sm:text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassengerPassword(!showPassengerPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassengerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Signing in...</span>
                    ) : (
                      <>
                        <span>Enter Live Commuter Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Passenger Features Grid */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Commuter AI Features:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Station Arrival Advisory (18 min)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-blue-400" />
                    <span>90% Confidence Interval Window</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Train className="w-3.5 h-3.5 text-blue-400" />
                    <span>Live GPS Tracking Map</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Platform No. Assignment</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer System Telemetry Status */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 z-10">
        <div className="flex items-center gap-4">
          <span>Western Railway Mumbai Division (MMCT - BRC Corridor)</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">CRIS Telemetry Stream v3.8</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span>SECURE PROTOCOL • ENCRYPTED CONTROLLER CHANNEL</span>
        </div>
      </footer>
    </div>
  );
};
