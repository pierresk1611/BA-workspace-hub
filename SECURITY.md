# Bezpečnostné pravidlá projektu (Security Rules)

Tento projekt je prísny frontendový prototyp a dodržiava nasledujúce bezpečnostné pravidlá:

- **Zákaz ukladania reálnych interných dát:** Všetky dáta v repozitári musia byť anonymizované mock dáta.
- **Zákaz API tokenov v repozitári:** Žiadne secret kľúče, tokeny ani heslá nesmú byť súčasťou kódu.
- **Zákaz connection stringov:** Je zakázané pripájať sa priamo na akékoľvek databázy a uchovávať connection stringy.
- **Zákaz priameho čítania interných systémov:** Aplikácia sa nesmie nijako pripájať ani čítať systémy ako Confluence, Jira, Asana, Teams, Kafka, e-mail atď.
- **Pravidlo link + manuálne vložený text:** Prepojenia na externé systémy sú realizované výhradne formou odkazov na dané systémy. Ak je nutné pracovať s obsahom týchto systémov (napríklad pre AI sumarizáciu), text sa vkladá manuálne (copy-paste).
- **Pravidlo používania mock dát:** Celý beh aplikácie sa spolieha na lokálne, bezpečné mock dáta.
- **Pravidlo anonymizácie dát:** Pri testovaní a ukážkach dbajte na to, aby texty alebo požiadavky neobsahovali žiadne skutočné produkčné dáta, osobné údaje alebo citlivé firemné informácie.
