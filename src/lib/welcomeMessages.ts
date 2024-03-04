import { CreatedCustomer, CreatedGroup } from "../types/groups";

export enum WelcomeMessageType {
  First = "E-Com Einzelprojekt",
  Second = "E-Com Content Abo",
  Third = "E-Com Rundumbetreuung",
  Fourth = "Keine Nachricht",
}

export function formatWelcomeMessage(
  messageType: WelcomeMessageType,
  group: CreatedGroup,
  customer: CreatedCustomer
) {
  let message = welcomeMessages[messageType];

  // A dirty way to format the message
  return message
    .replace("{name}", customer.name)
    .replace("{link1}", group.link1!)
    .replace("{link2}", group.link2!)
    .replace("{date1}", group.date1!)
    .replace("{date2}", group.date2!)
    .replace("{time}", group.time!)
    .replace("{props}", group.props!)
    .replace("{branchName}", group.brandName!)
    .replace("{title}", group.title!)
    .replace("{type}", group.customerType!);
}

export const welcomeMessages = {
  "E-Com Einzelprojekt": `Hi {name}, willkommen in deiner persönlichen WhatsApp Gruppe.

*Anleitungsvideo - Whatsapp auf PC oder Mac verwenden:* whatsapp.filmlagune.de
  
WhatsApp ist unser zentraler Kommunikationskanal. Bitte schicke uns *keine Infos oder Fragen per E-Mail.*
  
*Hier kommt nochmal die Übersicht zu den nächsten Schritten:*
  
*Schritt 1 - Die Tabelle mit den Produktinfos ausfüllen:*
Trage dort bitte alle relevanten Infos ein, auch wenn sie bereits in einem Meeting angesprochen wurden. Bitte fülle die Tabelle direkt online aus. Sie wird automatisch gespeichert, du brauchst sie also nicht herunterzuladen oder manuell zu speichern.
  
*Tabelle öffnen:* {link1}
  
*Schritt 2 - Grafiken hochladen:*
Wir benötigen folgende Dateien (falls vorhanden) von dir:
  • Logos 
  • Grafiken
  • freigestellte Fotos der Produkte im Format: png oder psd (wenn möglich mit transparentem Hintergrund)
  • Schriftarten
  • Design Guide / festgelegte Farbtöne etc.
  • Trust Grafiken (wie z.B. Award Logos & Zertifikate)
  
*Bitte hier hochladen:* {link2}
  
*Schritt 3 - Produkte & Requisiten versenden:*
  
Schicke uns bitte folgende Requisiten zu: {props}
  
Empfangsadresse: 
Filmlagune GmbH, Konsul-Smidt-Straße 8C, 28217 Bremen
  
*Wichtige Infos für den Versand:*
  - Schicke uns bitte, nachdem du die Produkte verschickt hast, die Trackingnummer hier in die Gruppe.
  - Versende das Paket (wenn möglich) bitte so, dass es nur zu Werktagen zugestellt wird.
  - Bitte sende uns, wenn möglich den Lieferschein und die Anzahl der einzelnen Pakete hier in die Gruppe, damit wir sicherstellen können, dass alles angekommen ist.
  - Schicke uns bitte die Rücksendelabels direkt mit zu (wenn möglich am besten digital hier in die Gruppe).
  
*Timeline:*
Schritt 1-3 erledigen bis: {date1}
Konzeptions-Meeting: {date2} um {time}
  
*Bei Fragen:* Einfach alles hier in die WhatsApp Gruppe, egal zu was :)`,

  "E-Com Content Abo": `Hi {name}, willkommen in deiner persönlichen WhatsApp Gruppe.

*Anleitungsvideo - Whatsapp auf PC oder Mac verwenden:* whatsapp.filmlagune.de
  
WhatsApp ist unser zentraler Kommunikationskanal. Bitte schicke uns *keine Infos oder Fragen per E-Mail.*
  
*Hier kommt nochmal die Übersicht zu den nächsten Schritten:*
  
*Schritt 1 - Die Tabelle mit den Produktinfos ausfüllen:*
Trage dort bitte alle relevanten Infos ein, auch wenn sie bereits in einem Meeting angesprochen wurden. Bitte fülle die Tabelle direkt online aus. Sie wird automatisch gespeichert, du brauchst sie also nicht herunterzuladen oder manuell zu speichern.
  
*Tabelle öffnen:* {link1}
  
*Schritt 2 - Grafiken hochladen:*
Wir benötigen folgende Dateien (falls vorhanden) von dir:
  • Logos 
  • Grafiken
  • freigestellte Fotos der Produkte im Format: png oder psd (wenn möglich mit transparentem Hintergrund)
  • Schriftarten
  • Design Guide / festgelegte Farbtöne etc.
  • Trust Grafiken (wie z.B. Award Logos & Zertifikate)
  
*Bitte hier hochladen:* {link2}
  
*Schritt 3 - Produkte & Requisiten versenden:*
  
Schicke uns bitte folgende Requisiten zu: {props}
  
Empfangsadresse: Filmlagune GmbH, Konsul-Smidt-Straße 8C, 28217 Bremen
  
*Wichtige Infos für den Versand:*
  - Schicke uns bitte, nachdem du die Produkte verschickt hast, die Trackingnummer hier in die Gruppe.
  - Versende das Paket (wenn möglich) bitte so, dass es nur zu Werktagen zugestellt wird.
  - Bitte sende uns, wenn möglich den Lieferschein und die Anzahl der einzelnen Pakete hier in die Gruppe, damit wir sicherstellen können, dass alles angekommen ist.
  - Schicke uns bitte die Rücksendelabels direkt mit zu (wenn möglich am besten digital hier in die Gruppe).
  
*Timeline:*
Schritt 1-3 erledigen bis: {date1}
Konzeptions-Meeting: {date2} um {time}
  
*Bei Fragen:* Einfach alles hier in die WhatsApp Gruppe, egal zu was :)`,

  "E-Com Rundumbetreuung": `Hi {name}, willkommen in deiner persönlichen WhatsApp Gruppe.

*Anleitungsvideo - Whatsapp auf PC oder Mac verwenden:* whatsapp.filmlagune.de
 
WhatsApp ist unser zentraler Kommunikationskanal. Bitte schicke uns *keine Infos oder Fragen per E-Mail.*
 
*Hier kommt nochmal die Übersicht zu den nächsten Schritten:*
 
*Schritt 1 - Die Tabelle mit den Produktinfos ausfüllen:*
Trage dort bitte alle relevanten Infos ein, auch wenn sie bereits in einem Meeting angesprochen wurden. Bitte fülle die Tabelle direkt online aus. Sie wird automatisch gespeichert, du brauchst sie also nicht herunterzuladen oder manuell zu speichern.
 
*Tabelle öffnen:* {link1}
 
*Schritt 2 - Grafiken hochladen:*
Wir benötigen folgende Dateien (falls vorhanden) von dir:
 • Logos 
 • Grafiken
 • freigestellte Fotos der Produkte im Format: png oder psd (wenn möglich mit transparentem Hintergrund)
 • Schriftarten
 • Design Guide / festgelegte Farbtöne etc.
 • Trust Grafiken (wie z.B. Award Logos & Zertifikate)
 
*Bitte hier hochladen:* {link2}
 
*Schritt 3 - Produkte & Requisiten versenden:*
 
Schicke uns bitte folgende Requisiten zu: {props}
 
Empfangsadresse: Filmlagune GmbH, Konsul-Smidt-Straße 8C, 28217 Bremen
 
*Wichtige Infos für den Versand:*
 - Schicke uns bitte, nachdem du die Produkte verschickt hast, die Trackingnummer hier in die Gruppe.
 - Versende das Paket (wenn möglich) bitte so, dass es nur zu Werktagen zugestellt wird.
 - Bitte sende uns, wenn möglich den Lieferschein und die Anzahl der einzelnen Pakete hier in die Gruppe, damit wir sicherstellen können, dass alles angekommen ist.
 - Schicke uns bitte die Rücksendelabels direkt mit zu (wenn möglich am besten digital hier in die Gruppe).
 
*Timeline:*
Schritt 1-3 erledigen bis: {date1}
Konzeptions-Meeting: {date2} um {time}
 
*Bei Fragen:* Einfach alles hier in die WhatsApp Gruppe, egal zu was :)`,

  "Keine Nachricht": ``,
};
