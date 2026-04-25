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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden p-4">
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.04) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Logo & Brand */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/30">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">BA Workspace</h1>
          <p className="text-slate-400 font-medium tracking-widest text-sm uppercase">Project Intelligence Hub</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          
          <h2 className="text-xl font-black text-white mb-2">Prihlásiť sa</h2>
          <p className="text-slate-500 text-sm font-medium mb-10">Zadaj prihlasovacie údaje pre prístup do workspace.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Username */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">
                Používateľské meno
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="username"
                className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white placeholder-slate-600 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">
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
                  className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white placeholder-slate-600 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl animate-in fade-in duration-300">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <p className="text-sm font-bold text-rose-400">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Overujem...
                </>
              ) : (
                'Prihlásiť sa'
              )}
            </button>
          </form>

          {/* Security notice */}
          <div className="mt-10 pt-6 border-t border-slate-800 flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0" />
            <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
              Toto je prototypový login. Prihlasovacie údaje sú overené server-side cez Vercel API funkciu.
              Heslo nie je uložené vo frontend kóde.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
