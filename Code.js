/**
 * Google Calendar → Telegram Notification Bot
 *
 * Überwacht einen (geteilten) Google Kalender und sendet neue Termine
 * automatisch als formatierte Nachricht in eine Telegram-Gruppe.
 *
 * Voraussetzungen:
 *   - Google Apps Script Projekt
 *   - Telegram Bot Token (via @BotFather)
 *   - Telegram Chat-ID der Zielgruppe
 *
 * Setup: siehe README.md
 */

// ─── Konfiguration ──────────────────────────────────────────────────────────

/** Telegram Chat-ID der Zielgruppe (negative Zahl für Gruppen) */
const CHAT_ID = "-4898103395";

/**
 * Optionaler Hashtag-Filter.
 * Wenn gesetzt, werden nur Events mit diesem Hashtag im Titel gesendet.
 * Leer lassen ("") um alle Events zu senden.
 */
const FILTER_HASHTAG = "#umschulung";

// ─── Telegram API ───────────────────────────────────────────────────────────

/**
 * Liest den Telegram Bot Token aus den Script Properties.
 * @returns {string} Bot Token
 */
function getToken() {
  return PropertiesService.getScriptProperties().getProperty("TELEGRAM_TOKEN");
}

/**
 * Sendet eine Nachricht über die Telegram Bot API.
 * Unterstützt Markdown-Formatierung.
 *
 * @param {string} text - Nachrichtentext (Markdown)
 * @returns {void}
 */
function sendTelegram(text) {
  const TELEGRAM_TOKEN = getToken();
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  const payload = {
    chat_id: CHAT_ID,
    text: text,
    parse_mode: "Markdown",
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();

  if (responseCode !== 200) {
    console.error(
      `Telegram API Fehler (${responseCode}): ${response.getContentText()}`
    );
  }
}

// ─── Kalender-Überwachung ───────────────────────────────────────────────────

/**
 * Prüft den aktuellen Monat auf neue Kalender-Events und sendet
 * diese als Telegram-Nachricht. Bereits gesendete Events werden
 * über Script Properties getrackt und nicht erneut gesendet.
 *
 * Diese Funktion sollte als zeitgesteuerter Trigger laufen
 * (z.B. alle 5-15 Minuten).
 *
 * @returns {void}
 */
function checkCurrentMonth() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  const calendar = CalendarApp.getDefaultCalendar();
  const events = calendar.getEvents(startOfMonth, endOfMonth);

  const scriptProperties = PropertiesService.getScriptProperties();
  const sentEventsRaw = scriptProperties.getProperty("sentEvents");
  const sentEvents = sentEventsRaw ? JSON.parse(sentEventsRaw) : {};

  let newEventsCount = 0;

  events.forEach((event) => {
    const eventId = event.getId();

    // Bereits gesendete Events überspringen
    if (sentEvents[eventId]) return;

    // Optionaler Hashtag-Filter
    if (FILTER_HASHTAG && !event.getTitle().includes(FILTER_HASHTAG)) return;

    const message = formatEventMessage(event);
    sendTelegram(message);

    sentEvents[eventId] = true;
    newEventsCount++;
  });

  scriptProperties.setProperty("sentEvents", JSON.stringify(sentEvents));

  if (newEventsCount > 0) {
    console.log(`${newEventsCount} neue Termine gesendet.`);
  }
}

/**
 * Formatiert ein Kalender-Event als Telegram-Nachricht mit Markdown.
 *
 * @param {GoogleAppsScript.Calendar.CalendarEvent} event
 * @returns {string} Formatierte Nachricht
 */
function formatEventMessage(event) {
  const start = event.getStartTime();
  const end = event.getEndTime();
  const timezone = Session.getScriptTimeZone();

  const formattedStart = Utilities.formatDate(
    start,
    timezone,
    "dd.MM.yyyy HH:mm"
  );
  const formattedEnd = Utilities.formatDate(end, timezone, "HH:mm");

  const location = event.getLocation() || "Kein Ort angegeben";
  const description = event.getDescription() || "Keine Beschreibung";

  const creators = event.getCreators();
  const creator = creators.length > 0 ? creators[0] : "Unbekannt";

  return (
    `📅 *Neuer Termin im Monat*\n\n` +
    `📝 *Titel:* ${event.getTitle()}\n` +
    `🕒 *Datum:* ${formattedStart} - ${formattedEnd}\n` +
    `📍 *Ort:* ${location}\n` +
    `👤 *Erstellt von:* ${creator}\n\n` +
    `ℹ️ *Beschreibung:*\n${description}`
  );
}

// ─── Hilfsfunktionen ────────────────────────────────────────────────────────

/**
 * Setzt den Tracking-Speicher zurück.
 * Nützlich wenn man alle Events des Monats erneut senden will.
 *
 * Manuell ausführen über: Ausführen → resetSentEvents
 */
function resetSentEvents() {
  PropertiesService.getScriptProperties().deleteProperty("sentEvents");
  console.log("Sent-Events zurückgesetzt. Nächster Lauf sendet alle Events.");
}

/**
 * Testet die Telegram-Verbindung mit einer Testnachricht.
 *
 * Manuell ausführen über: Ausführen → testConnection
 */
function testConnection() {
  sendTelegram("✅ *Verbindung erfolgreich!*\nDer Bot ist korrekt eingerichtet.");
  console.log("Testnachricht gesendet.");
}
