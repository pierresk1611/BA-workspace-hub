import React from 'react';
import { ShieldCheck, Lock, EyeOff, AlertTriangle, Key } from 'lucide-react';

export function SecurityTab() {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
      
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
        <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-600" /> Bezpečnostný Model
        </h3>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 h-fit">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Prototypová Izolácia</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Aplikácia je postavená ako <strong>standalone prototyp</strong>. Všetka biznis logika a dáta sú spracovávané na strane klienta (browsera). Neexistuje priama integrácia s podnikovými IAM systémami.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0 h-fit">
              <EyeOff className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">LocalStorage Limity</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                localStorage nie je bezpečné úložisko pre heslá ani citlivé API tokeny. Dáta sú v prehliadači uložené v čitateľnom (plaintext) JSON formáte.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0 h-fit">
              <Key className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Správa Identít</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Používateľský model v Settings slúži na simuláciu rolí a vlastníctva entít. Produkčne by bola táto časť nahradená bezpečným OAuth2/OIDC providerom.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4 shadow-xl">
           <div className="flex items-center gap-2 text-indigo-400">
             <AlertTriangle className="w-4 h-4" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pravidlá používania</span>
           </div>
           <ul className="space-y-3">
             {[
               "Nevkladajte reálne produkčné heslá.",
               "Nepripájajte citlivé firemné linky bez konzultácie.",
               "Pre zálohu používajte funkciu Export v záložke Dáta.",
               "Dáta čistite pomocou funkcie Vymazať pred zdieľaním zariadenia."
             ].map((rule, i) => (
               <li key={i} className="flex items-start gap-3 text-xs text-slate-300 font-medium leading-relaxed">
                 <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                 {rule}
               </li>
             ))}
           </ul>
        </div>
      </div>
    </div>
  );
}
