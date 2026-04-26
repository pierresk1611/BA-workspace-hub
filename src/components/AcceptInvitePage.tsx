import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Bot, ShieldCheck, User, Mail, Lock, 
  Eye, EyeOff, AlertCircle, CheckCircle2,
  Briefcase, Users, BadgeCheck, Save, Loader2
} from 'lucide-react';
import { inviteService } from '../services/inviteService';
import { userService } from '../services/userService';
import { hashString } from '../utils/crypto';
import { cn } from '../lib/utils';
import type { Invite, User as UserType } from '../types';

export function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invite, setInvite] = useState<Invite | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    functionTitle: '',
    team: '',
    password: '',
    confirmPassword: '',
    avatarInitials: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function verify() {
      if (!token) {
        setError("Chýba pozývací token.");
        setIsLoading(false);
        return;
      }

      const foundInvite = await inviteService.verifyToken(token);
      if (!foundInvite) {
        setError("Pozývací link je neplatný, expirovaný alebo už bol použitý.");
        setIsLoading(false);
        return;
      }

      const foundUser = userService.getUserByUsername(foundInvite.username);
      if (!foundUser) {
        setError("Používateľ k tejto pozvánke nebol nájdený.");
        setIsLoading(false);
        return;
      }

      setInvite(foundInvite);
      setUser(foundUser);
      setFormData(prev => ({ 
        ...prev, 
        displayName: foundUser.displayName || '',
        email: foundInvite.email || foundUser.email || '' 
      }));
      setIsLoading(false);
    }
    verify();
  }, [token]);

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 10;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validatePassword(formData.password)) {
      setError("Heslo nespĺňa bezpečnostné požiadavky (min. 10 znakov, veľké/malé písmeno, číslo a špeciálny znak).");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Heslá sa nezhodujú.");
      return;
    }

    setIsSubmitting(true);
    try {
      const passwordHash = await hashString(formData.password);
      
      // Update user
      if (user) {
        userService.updateUser(user.id, {
          displayName: formData.displayName,
          email: formData.email,
          functionTitle: formData.functionTitle,
          team: formData.team,
          avatarInitials: formData.avatarInitials || user.username.slice(0,2).toUpperCase(),
          passwordHash,
          status: 'active',
          profileCompletedAt: new Date().toISOString()
        });
      }

      // Mark invite as used
      if (invite) {
        inviteService.updateStatus(invite.id, 'used');
      }

      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError("Chyba pri ukladaní údajov.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Overujem pozvánku...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto text-rose-500">
            <AlertCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Chyba aktivácie</h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">{error}</p>
          </div>
          <Link to="/login" className="block w-full py-4 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all">
            Späť na prihlásenie
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto text-emerald-500">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Účet aktivovaný!</h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">Váš profil bol úspešne dokončený. Presmerúvam vás na prihlásenie...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden p-4 sm:p-6 lg:p-12">
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Dokončenie účtu</h1>
          <p className="text-slate-500 font-bold tracking-widest text-[10px] uppercase mt-2">BA Hub Onboarding</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
          
          <div className="flex items-center gap-4 mb-10 pb-8 border-b border-slate-800">
             <div className="w-14 h-14 bg-indigo-600/10 text-indigo-500 rounded-2xl flex items-center justify-center text-xl font-black">
               {user?.username.slice(0,2).toUpperCase()}
             </div>
             <div>
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Prihlasovacie meno</p>
               <p className="text-xl font-black text-white">@{user?.username}</p>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Data */}
              <div className="space-y-6 md:col-span-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-500" /> Profilové údaje
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Celé meno</label>
                    <input 
                      required
                      type="text" 
                      value={formData.displayName}
                      onChange={e => setFormData({...formData, displayName: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Email</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Funkcia</label>
                    <input 
                      required
                      type="text" 
                      value={formData.functionTitle}
                      onChange={e => setFormData({...formData, functionTitle: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="napr. Senior Analyst"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Tím</label>
                    <input 
                      required
                      type="text" 
                      value={formData.team}
                      onChange={e => setFormData({...formData, team: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-6 md:col-span-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-rose-500" /> Bezpečnosť
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Nové Heslo</label>
                    <div className="relative">
                      <input 
                        required
                        type={showPassword ? "text" : "password"} 
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full px-5 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500 pr-12"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Potvrdiť Heslo</label>
                    <input 
                      required
                      type={showPassword ? "text" : "password"} 
                      value={formData.confirmPassword}
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                {/* Password Requirements */}
                <div className="p-5 bg-slate-800/40 rounded-2xl border border-slate-800 space-y-3">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Heslo musí obsahovať:</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {[
                      { label: "Min. 10 znakov", ok: formData.password.length >= 10 },
                      { label: "Veľké písmeno", ok: /[A-Z]/.test(formData.password) },
                      { label: "Malé písmeno", ok: /[a-z]/.test(formData.password) },
                      { label: "Číslica", ok: /[0-9]/.test(formData.password) },
                      { label: "Špeciálny znak", ok: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) }
                    ].map((req, i) => (
                      <div key={i} className={cn("flex items-center gap-2 text-[10px] font-bold transition-colors", req.ok ? "text-emerald-400" : "text-slate-600")}>
                        <div className={cn("w-1 h-1 rounded-full", req.ok ? "bg-emerald-400" : "bg-slate-700")} />
                        {req.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-500 text-xs font-bold animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Dokončiť aktiváciu účtu
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-slate-600" />
            <p className="text-[10px] text-slate-600 font-medium">Tento proces je jednorazový. Po aktivácii sa budete môcť prihlasovať so svojím heslom.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
