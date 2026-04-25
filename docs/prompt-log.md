# Prompt Log

| Dátum | Použitý prompt / Zhrnutie | Čo prompt zmenil | Commit message |
|---|---|---|---|
| 2026-04-24 | Iniciačný prompt pre vytvorenie repozitára a základných súborov | Nastavenie Vite, React, TS, Tailwind a dokumentácie. Nastavenie pravidiel repozitára. | chore: initialize BA Workspace prototype repository |

| 2026-04-24 | Vytvor základ aplikácie | Návrh a implementácia layoutu, sidebar, dashboard s mock dátami a grafmi | feat: add base BA Workspace dashboard |
| 2026-04-24 | Doplň flow na vytvorenie projektu | Nahradenie hardcoded objektu za React Context, pridanie modálneho formulára pre tvorbu a editáciu projektov, prepojenie Topbaru a Dashboardu na aktívny stav. | feat: add project creation flow |
| 2026-04-24 | Vytvor modul Prepojené systémy | Pridaná vlastná mini-routing vrstva pre prechod do modulu Systémy. Pridanie CRUD funkcií do kontextu, grid zobrazenie kariet a modálne okná pre simulované dáta bez priamej integrácie (strict security). | feat: add linked systems module |
| 2026-04-25 | Vytvor modul Jira zdroje | Implementácia Jira modulu so zameraním na manuálny vstup (URL + text) bez API integrácie. Pridaná tabuľka s filtrami, dashboardové karty, Recharts grafy a detailný panel s AI akciami (AC generovanie, sumarizácia). | feat: add jira source module |
| 2026-04-24 | Implementuj modul Projekty | Odstránenie placeholderu a implementácia plnohodnotnej správy projektov (Card Grid, Detail View, Edit/Delete flow). Rozšírenie mock dát pre Driver App a pridanie metriík (Health Score, Progress). | feat: implement projects module |
| 2026-04-24 | Vytvor modul Confluence zdroje | Vytvorenie detailného view s rozdeleným UI na manuálny reader a interaktívny AI Panel. AI akcie ako extrakcia požiadaviek, rizík a rozhodnutí sú napojené na predpripravené mock dáta (Driver App) s umelým delayom (1.5s). | feat: add confluence source module |
| 2026-04-25 | Finalizácia modulov a bezpečnostný audit | Vytvorenie modulov "Acceptance Criteria & QA" a "BA Quality Check", vykonanie finálneho bezpečnostného auditu (no-API, no-DB) a aktualizácia dokumentácie. | feat: finalize modules and security audit |

## 2026-04-25 - Sidebar & Auth Routing Fixes
**User Prompt:**
"Oprav kritické bugy v aplikácii BA Workspace. Aktuálne nefunguje prihlásenie cez login obrazovku a linky na jednotlivé položky v sidebare. Nerob nové moduly. Teraz iba oprav auth flow, /api/login, routing, protected routes, sidebar navigation, active state sidebaru a project-aware linky..."

**AI Action:**
Verified existing Vercel `/api/login` and `.env` setup. Refactored `Sidebar.tsx` to use `NavLink` components to replace broken `button` clicks. Added `getProjectModulePath` to dynamically route sidebar links correctly whether a project is selected or not. Checked and confirmed all placeholder routes exist in `App.tsx` including adding `/settings`. Updated documentation to reflect the proper local startup process using `vercel dev` instead of plain `npm run dev`.
