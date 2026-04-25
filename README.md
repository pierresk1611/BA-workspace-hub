# BA Workspace – Project Intelligence Hub

## Účel aplikácie
### 🔐 Bezpečnosť a Izolácia Dát
**Tento prototyp je navrhnutý ako maximálne bezpečný a izolovaný systém:**
- **Žiadne API integrácie:** Aplikácia sa nepripája na Jira, Confluence, Teams ani iné externé systémy.
- **Manuálny vstup:** Všetky dáta, texty (emaily, prepisy meetingov) a Asana tasky (cez CSV/JSON/Text import) musia byť vložené manuálne používateľom.
- **Asana Import:** Podporuje manuálny import z CSV súborov, JSON dát a Plain Textu bez pripojenia na Asana API. Súbory sa spracovávajú lokálne v prehliadači.
- **Lokálne úložisko:** Všetky dáta sú uložené výhradne vo vašom prehliadači (LocalStorage). Aplikácia neposiela vaše projektové dáta na žiaden server.
- **Čistý Workspace:** Pri prvom prihlásení je workspace prázdny. Používateľ si môže manuálne načítať Demo dáta pre otestovanie funkcií.
- **Správa dát:** V nastaveniach je možné kedykoľvek vymazať všetky lokálne uložené dáta alebo načítať demo projekty.

Podrobné pravidlá nájdete v [SECURITY.md](SECURITY.md) a [docs/security-rules.md](docs/security-rules.md).

## Štruktúra Projektu
Aplikácia je interný pracovný dashboard pre Business Analysta. Slúži na správu projektov, linkov, manuálne vložených textov, požiadaviek, rozhodnutí, otvorených otázok, rizík, závislostí, taskov, kalendára, deadlineov, meeting transcriptov, SQL dotazov, AI sumarizácie a exportov.

### Projektový Lifecycle
Systém umožňuje plnohodnotnú správu životného cyklu projektu:
- **Aktívne projekty:** Bežná práca na analýze a dodávke.
- **Ukončenie projektu:** Formálne uzavretie projektu (archivácia). Projekt ostáva v systéme ako historický záznam s dokumentáciou dôvodov uzavretia, ale je v read-only móde.
- **Vymazanie projektu:** Úplné odstránenie projektu a všetkých jeho lokálne naviazaných dát z prototypu.

## Tech stack
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts pre grafy
- Lokálne mock dáta

## Ako spustiť lokálne
1. Nainštalujte závislosti: `npm install`
2. Vytvorte kópiu environment súboru: `cp .env.example .env.local` a vyplňte prihlasovacie údaje.
3. **Lokálne testovanie prihlásenia:** Keďže aplikácia využíva Vercel Serverless Functions (`/api/login`), na plnohodnotné lokálne testovanie auth flowu spustite:
   `vercel dev`
4. Ak používate iba Vite dev server (`npm run dev`), API endpoint nebude dostupný, preto sa odporúča vývoj cez Vercel CLI.
5. Vytvorené testovacie údaje pre tento prototyp sú:
   - Username: `peter`
   - Password: `2703_Viera`

## Bezpečnostné obmedzenia a fungovanie
- **UPOZORNENIE:** Prototyp pracuje **výhradne iba s manuálne vloženým linkom a textom** a mock dátami.
- **Žiadne priame integrácie:** Neexistujú a nesmú sa implementovať žiadne priame integrácie na Confluence, Jira, Asana, Teams, Kafka, email ani databázu.
- Všetky externé zdroje sú prístupné iba formou odkazov (URL) a texty z nich je potrebné do aplikácie vložiť manuálne.
