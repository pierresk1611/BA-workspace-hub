# BA Workspace – Project Intelligence Hub

## Účel aplikácie
Aplikácia je interný pracovný dashboard pre Business Analysta. Slúži na správu projektov, linkov, manuálne vložených textov, požiadaviek, rozhodnutí, otvorených otázok, rizík, závislostí, taskov, kalendára, deadlineov, meeting transcriptov, SQL dotazov, AI sumarizácie a exportov.

## Tech stack
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts pre grafy
- Lokálne mock dáta

## Ako spustiť lokálne
1. Nainštalujte závislosti: `npm install`
2. Spustite lokálny server: `npm run dev`
3. Aplikácia beží štandardne na adrese `http://localhost:5173`

## Bezpečnostné obmedzenia a fungovanie
- **UPOZORNENIE:** Prototyp pracuje **výhradne iba s manuálne vloženým linkom a textom** a mock dátami.
- **Žiadne priame integrácie:** Neexistujú a nesmú sa implementovať žiadne priame integrácie na Confluence, Jira, Asana, Teams, Kafka, email ani databázu.
- Všetky externé zdroje sú prístupné iba formou odkazov (URL) a texty z nich je potrebné do aplikácie vložiť manuálne.
