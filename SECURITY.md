# Security Policy - BA Workspace Prototype

## Bezpečnostný prísľub
Tento prototyp je navrhnutý ako **izolované a bezpečné prostredie** pre Business Analystov. Aplikácia nepracuje so žiadnymi reálnymi produkčnými dátami a nepripája sa k žiadnym externým podnikovým systémom.

## Kľúčové bezpečnostné pravidlá
1. **Žiadna API integrácia:** Aplikácia neobsahuje kód pre pripojenie k Jira, Confluence, Teams, Asana, Outlook ani iným API. Všetky dáta sú vkladané manuálne používateľom (vrátane manuálneho importu Asana taskov cez CSV/JSON/Text).
2. **Lokálny import (Asana):** Importy z Asany sú spracované lokálne v prehliadači pomocou JavaScript parserov. Žiadne dáta zo súborov sa neposielajú na externé servery. Súbory sa neukladajú, spracováva sa iba ich textový obsah do lokálneho stavu aplikácie.
3. **🔐 Project Data Isolation
Všetky projektové dáta sú izolované v lokálnom úložisku vášho prehliadača. Aplikácia neobsahuje žiaden backend a neodosiela dáta na externé servery.

### 🚫 Automatic Seeding
Od verzie 2.1.0 je automatické seedovanie demo dát trvalo zakázané. Workspace pri prvom spustení alebo po vymazaní dát ostáva prázdny.

### 🧪 Demo Data Policy
Demo dáta (Driver App, Delivery 2.0, atď.) slúžia výhradne na testovacie účely a ich načítanie je možné len manuálnym potvrdením v Nastaveniach. Tieto dáta sú uložené v statických súboroch, ktoré sa neimportujú do runtime aplikácie, pokiaľ nie sú výslovne vyžiadané používateľom.
4. **Linky vs Integrácia:** Externé linky (Jira, Confluence, Teams) slúžia výhradne ako statické odkazy, ktoré sa otvárajú v novom tabe prehliadača. Aplikácia tieto linky nečíta ani nesťahuje ich obsah.
5. **Autentifikácia:** Aplikácia obsahuje bezpečný serverless prihlasovací flow (`/api/login`), kde sa heslo posiela šifrovane z klienta a porovnáva s bezpečným `.env` prostredím na strane servera.
   - Vo frontendovom kóde sa nesmú nachádzať žiadne hardcoded heslá ani mená.
   - Environment variables (`.env.local`) nie sú commitované do repozitára.
6. **Ochrana pred únikom:** Aplikácia využíva `sessionStorage` pre uchovanie session tokenu, ktorý sa automaticky zmaže po zatvorení prehliadača.
7. **Odstránenie dát:** Funkcia "Vymazať projekt" odstráni konkrétny projekt. Globálna funkcia "Vymazať všetky lokálne dáta" v nastaveniach (vyžadujúca potvrdenie textom VYMAZAŤ) úplne prečistí `localStorage` od všetkých projektových dát.

## Zákaz produkčných údajov
Používateľom sa dôrazne odporúča nevkladať do prototypu:
- Reálne heslá a tokeny.
- Citlivé osobné údaje (GDPR).
- Reálne produkčné connection stringy.
- Obchodné tajomstvo v nekódovanej podobe.

## Monitoring a Audit
Aplikácia obsahuje modul **BA Quality Check**, ktorý proaktívne upozorňuje na prítomnosť podozrivých textov (napr. texty pripomínajúce credentials) v SQL dotazoch alebo poznámkach.

---
*Posledná aktualizácia: 2026-04-25*
