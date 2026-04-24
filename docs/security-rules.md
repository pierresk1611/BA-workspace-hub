# Security Rules
*Tieto pravidlá dopĺňajú `SECURITY.md` v koreňovom priečinku.*

- Žiadne priame čítanie Confluence
- Žiadne priame čítanie Jira
- Žiadne priame čítanie Asana
- Žiadne priame čítanie Teams
- Žiadne priame čítanie emailov
- Žiadne priame čítanie Kafka dokumentácie
- Žiadne priame pripojenie na databázu
- Žiadne API tokeny
- Žiadne connection stringy
- Žiadne heslá
- Žiadne cookies
- Žiadne session údaje
- Žiadne produkčné URL, ak nie sú explicitne mock alebo bezpečné referenčné odkazy
- Všetky externé zdroje fungujú iba ako link + manuálne vložený text
- AI agent pracuje iba s lokálnymi mock dátami alebo manuálne vloženým textom
- SQL modul pracuje iba s mock schémou, mock dátami alebo manuálne vloženými výsledkami
