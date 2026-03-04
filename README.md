# 📅 Google Calendar → Telegram Bot

Automatische Telegram-Benachrichtigungen für neue Google Kalender-Termine. Ideal für Teams, Lerngruppen oder Vereine, die einen gemeinsamen Kalender nutzen und über Telegram kommunizieren.

![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?logo=google&logoColor=white)
![Telegram Bot API](https://img.shields.io/badge/Telegram%20Bot%20API-26A5E4?logo=telegram&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

## Features

- 🔄 Automatische Überwachung des Google Kalenders (alle X Minuten)
- 📨 Sofortige Telegram-Benachrichtigung bei neuen Terminen
- 👤 Zeigt an, wer den Termin erstellt hat (ideal bei geteilten Kalendern)
- 🏷️ Optionaler Hashtag-Filter (z.B. nur `#umschulung` Termine)
- 🚫 Duplikat-Erkennung — jeder Termin wird nur einmal gesendet
- 📍 Zeigt Titel, Datum, Uhrzeit, Ort und Beschreibung

## So sieht's aus

```
📅 Neuer Termin im Monat

📝 Titel: Prüfungsvorbereitung AP1
🕒 Datum: 15.03.2026 14:00 - 16:30
📍 Ort: Raum 204
👤 Erstellt von: max.mustermann@gmail.com

ℹ️ Beschreibung:
Gemeinsames Lernen für die IHK-Prüfung
```

## Voraussetzungen

- Google-Konto mit Google Kalender
- Telegram-Konto
- Telegram-Gruppe (der Bot muss Mitglied sein)

## Setup-Anleitung

### 1. Telegram Bot erstellen

1. Öffne [@BotFather](https://t.me/BotFather) in Telegram
2. Sende `/newbot` und folge den Anweisungen
3. Kopiere den **Bot Token** (sieht aus wie `123456789:ABCdefGhIjKlMnOpQrStUvWxYz`)
4. Füge den Bot zu deiner Telegram-Gruppe hinzu

### 2. Chat-ID herausfinden

1. Füge den Bot [@getmyid_bot](https://t.me/getmyid_bot) zu deiner Gruppe hinzu
2. Er zeigt dir die **Chat-ID** an (Gruppen haben negative IDs, z.B. `-4898103395`)
3. Du kannst den Hilfs-Bot danach wieder aus der Gruppe entfernen

### 3. Google Apps Script einrichten

1. Gehe zu [script.google.com](https://script.google.com) → Neues Projekt
2. Ersetze den Inhalt von `Code.gs` mit dem Code aus [`src/Code.js`](src/Code.js)
3. Passe `CHAT_ID` an (Zeile 15)
4. Optional: Passe `FILTER_HASHTAG` an oder setze ihn auf `""` (Zeile 22)

### 4. Bot Token sicher speichern

1. Im Script-Editor: **Projekteinstellungen** (Zahnrad-Symbol)
2. Scrolle zu **Skripteigenschaften**
3. Füge hinzu:
   - Eigenschaft: `TELEGRAM_TOKEN`
   - Wert: Dein Bot Token aus Schritt 1

### 5. Verbindung testen

1. Im Script-Editor: Wähle Funktion `testConnection` aus dem Dropdown
2. Klicke **Ausführen**
3. Beim ersten Mal: Google fragt nach Berechtigungen → erlauben
4. In deiner Telegram-Gruppe sollte jetzt eine Testnachricht erscheinen

### 6. Automatischen Trigger einrichten

1. Klicke auf das **Uhr-Symbol** (Trigger) in der linken Seitenleiste
2. **Trigger hinzufügen**:
   - Funktion: `checkCurrentMonth`
   - Ereignisquelle: Zeitgesteuert
   - Typ: Minuten-Timer
   - Intervall: Alle 5 oder 15 Minuten (nach Bedarf)

Fertig! Der Bot überwacht jetzt automatisch deinen Kalender.

## Kalender mit anderen teilen

Damit andere Personen Termine in den Kalender eintragen können:

1. Google Kalender öffnen → Einstellungen des Kalenders
2. **Für bestimmte Personen freigeben**
3. E-Mail-Adresse eintragen
4. Berechtigung auf **"Termine ändern"** setzen

Neue Termine von anderen Personen werden automatisch erkannt und an die Telegram-Gruppe gesendet — inklusive der E-Mail des Erstellers.

## Hilfsfunktionen

| Funktion | Beschreibung |
|---|---|
| `testConnection()` | Sendet eine Testnachricht an die Gruppe |
| `resetSentEvents()` | Setzt das Tracking zurück — alle Termine des Monats werden erneut gesendet |

Beide können manuell im Script-Editor über **Ausführen** gestartet werden.

## Konfiguration

| Variable | Beschreibung | Beispiel |
|---|---|---|
| `CHAT_ID` | Telegram Chat-ID der Zielgruppe | `"-4898103395"` |
| `FILTER_HASHTAG` | Nur Events mit diesem Hashtag senden. Leer = alle | `"#umschulung"` oder `""` |
| `TELEGRAM_TOKEN` | Bot Token (in Script Properties, nicht im Code!) | — |

## Projektstruktur

```
calendar-telegram-bot/
├── src/
│   └── Code.js          # Hauptskript für Google Apps Script
├── docs/
│   └── TROUBLESHOOTING.md
├── LICENSE
└── README.md
```

## Technologie

- **Google Apps Script** — Serverless Laufzeitumgebung von Google
- **Google Calendar API** — Kalender-Zugriff über `CalendarApp`
- **Telegram Bot API** — Nachrichten über HTTP senden
- **Script Properties** — Sichere Speicherung von Secrets und State

## Lizenz

MIT — siehe [LICENSE](LICENSE)

## Autor

Erstellt als Automatisierungsprojekt während der Umschulung zum Fachinformatiker für Anwendungsentwicklung.
