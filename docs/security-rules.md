# Business Analyst Security Rules

Tento dokument definuje záväzné pravidlá pre prácu s prototypom BA Workspace z pohľadu bezpečnosti a izolácie dát.

## 1. Externá komunikácia
- **Pravidlo:** Žiadne automatizované volania externých API.
- **Implementácia:** Všetky polia pre "Zdrojový link" sú čisto textové. Tlačidlá "Analyzovať" pracujú iba s textom, ktorý používateľ manuálne skopíruje a vloží do textového poľa.
- **Zakázané:** `fetch()`, `axios` alebo iné knižnice volajúce domény tretích strán (okrem CDN pre štýly/ikony).

## 2. Spracovanie meetingov a prepisov
- **Pravidlo:** Žiadne sťahovanie nahrávok alebo automatický prepis z Teams.
- **Implementácia:** Používateľ vkladá odkaz na nahrávku pre vlastnú referenciu a manuálne vkladá textový prepis (transcript), z ktorého AI následne generuje summary.

## 3. SQL a Dáta
- **Pravidlo:** Žiadne reálne pripojenie k databáze (JDBC, ODBC, atď.).
- **Implementácia:** SQL Workspace je čisto frontendový simulátor. "Spustenie" dotazu vráti vopred definované mock dáta priradené k danému projektu.
- **Audit:** Modul Quality Check skenuje SQL texty na prítomnosť produkčných IP adries alebo connection stringov.

## 4. AI Agent (BA Project Intelligence)
- **Pravidlo:** Agent nesmie simulovať prístup k systémom, ktoré nie sú v jeho lokálnom kontexte.
- **Implementácia:** Agentova prompt logika je nastavená tak, aby vždy uvádzal, že pracuje s "lokálnymi manuálne vloženými dátami".

## 5. Prístupové údaje
- **Pravidlo:** Nulová tolerancia pre ukladanie credentials vo frontend kóde.
- **Implementácia:** Prihlásenie je riešené cez bezpečnú serverless funkciu a `.env` premenné. Prototypový User Management v Nastaveniach ukladá používateľské profily lokálne, ale bez hesiel v plaintext podobe.
- **Audit:** Modul Quality Check skenuje poznámky na prítomnosť podozrivých reťazcov pripomínajúcich prístupové údaje.

## 6. Mazanie a čistenie dát
- **Pravidlo:** Používateľ musí mať plnú kontrolu nad lokálnymi dátami.
- **Implementácia:** Funkcia "Vymazať projekt" vykoná hard delete objektu projektu a všetkých jeho vnorených polí (požiadavky, tasky...) z lokálneho stavu.
## 7. Clean Workspace Policy
- **Pravidlo:** Žiadne automatické seedovanie demo dát do produkčného prostredia.
- **Implementácia:** Aplikácia štartuje s `[]` projektmi. Demo dáta sú v izolovanom súbore a načítavajú sa výhradne cez dynamic import po manuálnom potvrdení používateľom.
- **Dôvod:** Zamedzenie náhodnému zobrazeniu testovacích/vzorových dát pri práci s reálnymi analýzami.

---
**Bezpečnostný status: ISOLATED PROTOTYPE**
