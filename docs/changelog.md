# Changelog

| Dátum | Modul | Popis zmeny | Súvisiaci commit |
|---|---|---|---|
| 2026-04-24 | Core | Inicializácia projektu, inštalácia závislostí a vytvorenie základnej dokumentácie. | chore: initialize BA Workspace prototype repository |

| 2026-04-24 | Dashboard | Vytvorenie základného rozloženia (Sidebar, Topbar) a Dashboardu pre mock projekt Driver App. | feat: add base BA Workspace dashboard |
| 2026-04-24 | Projects | Implementácia Project Contextu, globálneho stavu a formulára na vytváranie a úpravu projektov. | feat: add project creation flow |
| 2026-04-24 | Systems | Pridanie modulu Prepojené systémy (routing, zoznam systémov, modálne okná pre tvorbu a čítanie manuálneho textu). | feat: add linked systems module |
| 2026-04-25 | Jira zdroje | Implementácia modulu pre manuálnu správu Jira ticketov (tabuľka, filtre, štatistiky, grafy a AI simulácia). | feat: add jira source module |
| 2026-04-24 | Projects | Plnohodnotný modul pre správu projektov (zoznam, detail, CRUD, filtre, metriky). | feat: implement projects module |
| 2026-04-24 | Confluence | Pridanie modulu Confluence zdroje s AI extrakčným UI panelom pre prácu so simulovanými AI metadátami nad manuálne skopírovaným textom. | feat: add confluence source module |
| 2026-04-24 | Security | - Add: Acceptance Criteria & QA module (Given/When/Then tracking).<br>- Add: BA Quality Check (automated deficiency and security auditor).<br>- Audit: Final Security & Data Isolation Audit (verified no external API/DB connections).<br>- Update: SECURITY.md and docs/security-rules.md with explicit manual-only policies. | feat: finalize security audit and qa modules |
| 2026-04-25 | Projects | Implementácia akcií "Ukončiť projekt" (archivácia) a "Vymazať projekt" (hard delete). Úprava dashboardov, filtrov a projektového detailu. | feat: add project lifecycle actions |
| 2026-04-26 | Demo Data | Implementácia manažmentu demo dát s explicitným potvrdením a podporou clean režimu. | feat: add demo data management |

## [2.1.0] - 2026-04-26
### Added
- Nový komponent `LoadDemoModal` pre manuálne potvrdenie načítania demo dát.
- Podpora pre `baWorkspace.cleanMode` príznak v localStorage.
- Pridané empty states pre Dashboard a AIAgent pri nulovom počte projektov.

### Changed
- Trvalo vypnuté automatické seedovanie demo dát (Driver App, Delivery 2.0, atď.).
- Prechod na zjednotené `localStorage` kľúče s prefixom `baWorkspace.*`.
- Aktualizované empty state správy v AIAgent a Dashboarde.
- Vylepšená funkcia `clearAllData` pre úplné vyčistenie všetkých workspace kľúčov.

### Fixed
- Opravené opakované vracanie demo dát po refreshi alebo redeployi.
- Opravené chyby v zobrazení Dashboardu pri žiadnom aktívnom projekte.

## [1.1.0] - 2026-04-25
### Added
- Project Lifecycle Management: formal project closure (read-only mode) and destructive project deletion.
- Lifecycle Modals: `CloseProjectModal` (confirmation with reason) and `DeleteProjectModal` (name verification).
- Dashboard updates: separate KPIs for Active vs. Closed projects.
- Project Selector updates: grouped active and closed projects in Sidebar and Topbar.

### Fixed
- Authentication flow with `/api/login` serverless Vercel function integration.
- Sidebar routing fully migrated to use `react-router-dom` `NavLink` components.
- Correct project-aware mapping using `getProjectModulePath` helper for deep linking.
- Hardcoded fallback passwords removed and secured via `.env`.
- TypeScript build errors and Tailwind v4 compatibility issues resolved.
- Completely rewrote `Sidebar.tsx` to map 1:1 with specific module and route identifiers, utilizing active project paths or `/projects` fallbacks natively via `NavLink` logic without a localized state.
