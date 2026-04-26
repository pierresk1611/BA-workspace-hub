# BA Workspace – Project Intelligence Hub (v2.1.2)

## Účel aplikácie
## 🔒 Súkromie a Dáta (Clean Workspace Policy)

BA HUB je postavený na princípe **Local-First & Private-First**:
- **Žiadne servery**: Vaše dáta nikdy neopúšťajú váš prehliadač.
- **Clean Start**: Aplikácia štartuje s prázdnym workspace. Žiadne demo dáta sa nenačítavajú automaticky.
- **Manuálne Demo**: Ak chcete preskúmať funkcie, demo dáta si môžete kedykoľvek manuálne načítať v Nastaveniach.
- **LocalStorage**: Všetko je uložené v šifrovanom alebo lokálnom úložisku vášho prehliadača.
- **AI Analýza**: Prebieha lokálne na báze kontextových okien bez trénovania modelov na vašich dátach.
- **Správa používateľov:** Prototypový User Management s rolami Admin/Member.
- **Správa dát:** V nastaveniach je možné exportovať/importovať dáta, vymazať úložisko alebo načítať demo projekty.

Podrobné pravidlá nájdete v [SECURITY.md](SECURITY.md) a [docs/security-rules.md](docs/security-rules.md).

## Štruktúra Projektu
Aplikácia je interný pracovný dashboard pre Business Analysta. Slúži na správu projektov, linkov, manuálne vložených textov, požiadaviek, rozhodnutí, otvorených otázok, rizík, závislostí, taskov, kalendára, deadlineov, meeting transcriptov, SQL dotazov, AI sumarizácie a exportov.

### Projektový Lifecycle
Systém umožňuje plnohodnotnú správu životného cyklu projektu:
- **Aktívne projekty:** Bežná práca na analýze a dodávke.
- **Ukončenie projektu:** Formálne uzavretie projektu (archivácia). Projekt ostáva v systéme ako historický záznam s dokumentáciou dôvodov uzavretia, ale je v read-only móde.
- **Vymazanie projektu:** Úplné odstránenie projektu a všetkých jeho lokálne naviazaných dát z prototypu.

## Tech stack
- React (Vite)
- TypeScript
- Tailwind CSS
- Lucide React (Ikony)
- Recharts (Grafy)
- **Vite PWA Plugin** (Offline podpora & Inštalácia)

## Mobilná verzia & PWA
Aplikácia je plne responzívna a optimalizovaná pre mobilné zariadenia a tablety. Využíva **Mobile-First Design** s prvkami natívnych aplikácií (napr. full-screen drawery namiesto modálov na mobile).

### 📱 Inštalácia (PWA)
BA HUB môžete používať ako nainštalovanú aplikáciu na vašom počítači alebo mobilnom telefóne:
1. Prihláste sa do aplikácie.
2. Prejdite do **Nastavenia**.
3. Kliknite na tlačidlo **Inštalovať Teraz** v sekcii Mobilná Aplikácia.
4. Aplikácia sa pridá na vašu plochu/home screen a bude dostupná bez adresného riadku prehliadača.

### 🌐 Offline Režim
Vďaka Service Workeru je aplikácia **Offline Ready**:
- Základné rozhranie sa načíta aj bez pripojenia na internet.
- Lokálne dáta (LocalStorage) sú prístupné offline.
- **Bezpečnosť:** Service worker nikdy neukladá citlivé údaje (prihlasovacie tokeny, heslá) do cache. API požiadavky na `/api/login` vyžadujú vždy sieťové pripojenie.

## Ako spustiť lokálne
1. Nainštalujte závislosti: `npm install`
2. Vytvorte kópiu environment súboru: `cp .env.example .env.local` a vyplňte prihlasovacie údaje.
3. **Lokálne testovanie prihlásenia:** Keďže aplikácia využíva Vercel Serverless Functions (`/api/login`), na plnohodnotné lokálne testovanie auth flowu spustite:
   `vercel dev`
4. Ak používate iba Vite dev server (`npm run dev`), API endpoint nebude dostupný.
5. Vytvorené testovacie údaje pre tento prototyp sú:
   - Username: `peter`
   - Password: `2703_Viera`

## Bezpečnostné obmedzenia a fungovanie
- **UPOZORNENIE:** Prototyp pracuje **výhradne iba s manuálne vloženým linkom, textom a lokálne vytvorenými dátami**.
- **Žiadne priame integrácie:** Neexistujú a nesmú sa implementovať žiadne priame integrácie na Confluence, Jira, Asana, Teams, Kafka, email ani databázu.
- Všetky externé zdroje sú prístupné iba formou odkazov (URL) a texty z nich je potrebné do aplikácie vložiť manuálne.
- PWA a Service Worker sú konfigurované tak, aby rešpektovali izoláciu dát a neukladali žiadne tajomstvá do systémovej cache.
