import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await login(username, password);

    if (result.ok) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Nesprávne prihlasovacie údaje.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden p-4 sm:p-6">
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.04) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Logo & Brand */}
        <div className="text-center mb-8 md:mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl md:rounded-[2rem] flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-2xl shadow-indigo-500/30">
            <Bot className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-1 md:mb-2">BA Workspace</h1>
          <p className="text-slate-400 font-medium tracking-widest text-[10px] md:text-sm uppercase">Project Intelligence Hub</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          
          <h2 className="text-lg md:text-xl font-black text-white mb-1 md:mb-2 text-center md:text-left">Prihlásiť sa</h2>
          <p className="text-slate-500 text-xs md:text-sm font-medium mb-8 md:mb-10 text-center md:text-left">Zadaj údaje pre prístup do workspace.</p>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            
            {/* Username */}
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">
                Používateľské meno
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="username"
                className="w-full px-4 md:px-5 py-3 md:py-4 bg-slate-800/50 border border-slate-700 rounded-xl md:rounded-2xl text-white placeholder-slate-600 font-bold text-xs md:text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">
                Heslo
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 md:px-5 py-3 md:py-4 bg-slate-800/50 border border-slate-700 rounded-xl md:rounded-2xl text-white placeholder-slate-600 font-bold text-xs md:text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all pr-12 md:pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl md:rounded-2xl">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-rose-400 shrink-0" />
                <p className="text-xs font-bold text-rose-400">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 md:py-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 text-white rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Overujem...
                </>
              ) : (
                'Prihlásiť sa'
              )}
            </button>
          </form>

          {/* Security notice */}
          <div className="mt-8 md:mt-10 pt-6 border-t border-slate-800 flex items-start md:items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0 mt-0.5 md:mt-0" />
            <p className="text-[9px] md:text-[10px] text-slate-600 font-medium leading-relaxed">
              Zabezpečený prístup. Dáta sú chránené. Heslá nie sú ukladané vo frontend kóde.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
