'use client';
import React, { useState } from 'react';
import { Lock, User, ShieldAlert, ChevronRight, AlertCircle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(userId, password);
    if (!success) {
      setError('ID hoặc mật khẩu không chính xác / Invalid ID or Password');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accentGlow/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-p1/5 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accentGlow/20 rounded-2xl border border-accentGlow/30 mb-6 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <ShieldAlert className="w-8 h-8 text-accentGlow" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Alert System</h1>
          <p className="text-textSecondary mt-2">Real-time Operations Control Center</p>
        </div>

        <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-textSecondary uppercase tracking-widest mb-2 ml-1">ID Người dùng / User ID</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" />
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="SaleOnlFS or SalOnlMGFS"
                  className="w-full bg-surface border border-borderSubtle rounded-xl py-3 pl-12 pr-4 text-white placeholder-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-accentGlow/50 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-textSecondary uppercase tracking-widest mb-2 ml-1">Mật khẩu / Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface border border-borderSubtle rounded-xl py-3 pl-12 pr-4 text-white placeholder-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-accentGlow/50 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start space-x-3 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-400 leading-tight">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-accentGlow hover:bg-accentGlow/80 text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center space-x-2 group active:scale-[0.98]"
            >
              <span>Đăng nhập / Sign In</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-[10px] text-textSecondary/60 text-center uppercase tracking-widest leading-relaxed">
              Dành cho nhân viên vận hành & quản lý trực ca<br/>
              Operations & Management Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
