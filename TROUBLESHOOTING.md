# Troubleshooting

## Bot sendet keine Nachrichten

**Token prüfen:**
- Projekteinstellungen → Skripteigenschaften → `TELEGRAM_TOKEN` vorhanden?
- `testConnection()` ausführen und Konsolenausgabe prüfen

**Chat-ID prüfen:**
- Gruppen-IDs sind negativ (z.B. `-4898109995`)
- Bot muss Mitglied der Gruppe sein
- Wenn die Gruppe zu einem Supergroup aufgestuft wurde, ändert sich die ID

**Berechtigungen:**
- Beim ersten Ausführen fragt Google nach Berechtigungen → erlauben
- Falls übersprungen: Ausführen → erneut autorisieren

## Termine werden doppelt gesendet

Das passiert normalerweise nicht, da Event-IDs getrackt werden. Falls doch:
- `resetSentEvents()` wurde versehentlich ausgeführt
- Script Properties wurden manuell gelöscht

## Termine von anderen Personen werden nicht erkannt

- Der Kalender muss korrekt geteilt sein (Berechtigung: "Termine ändern")
- Das Script nutzt `getDefaultCalendar()` — Termine müssen im Hauptkalender erscheinen
- Abonnierte Kalender (iCal) werden NICHT erkannt, nur direkt geteilte Kalender

## Trigger läuft nicht

- Uhr-Symbol → Trigger-Liste prüfen
- Fehlgeschlagene Ausführungen werden dort mit Fehlermeldung angezeigt
- Google hat ein Limit von ~90 Minuten Ausführungszeit pro Tag für kostenlose Konten

## Markdown-Fehler in Telegram

Telegram Markdown ist empfindlich bei Sonderzeichen. Folgende Zeichen in Titel, Ort oder Beschreibung können Probleme verursachen: `*`, `_`, `` ` ``, `[`

Lösung: Sonderzeichen in `formatEventMessage()` escapen oder `parse_mode` auf `"HTML"` umstellen.
