# Prompt Log

| Dátum | Použitý prompt / Zhrnutie | Čo prompt zmenil | Commit message |
|---|---|---|---|
| 2026-04-24 | Iniciačný prompt pre vytvorenie repozitára a základných súborov | Nastavenie Vite, React, TS, Tailwind a dokumentácie. Nastavenie pravidiel repozitára. | chore: initialize BA Workspace prototype repository |

| 2026-04-24 | Vytvor základ aplikácie | Návrh a implementácia layoutu, sidebar, dashboard s mock dátami a grafmi | feat: add base BA Workspace dashboard |
| 2026-04-24 | Doplň flow na vytvorenie projektu | Nahradenie hardcoded objektu za React Context, pridanie modálneho formulára pre tvorbu a editáciu projektov, prepojenie Topbaru a Dashboardu na aktívny stav. | feat: add project creation flow |
| 2026-04-24 | Vytvor modul Prepojené systémy | Pridaná vlastná mini-routing vrstva pre prechod do modulu Systémy. Pridanie CRUD funkcií do kontextu, grid zobrazenie kariet a modálne okná pre simulované dáta bez priamej integrácie (strict security). | feat: add linked systems module |
| 2026-04-24 | Vytvor modul Confluence zdroje | Vytvorenie detailného view s rozdeleným UI na manuálny reader a interaktívny AI Panel. AI akcie ako extrakcia požiadaviek, rizík a rozhodnutí sú napojené na predpripravené mock dáta (Driver App) s umelým delayom (1.5s). | feat: add confluence source module |
