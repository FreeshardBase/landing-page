---
title: "Registrierungs- und Login-Ansichten loswerden"
description: "Self-hosted Apps bringen oft eigene Registrierungs- und Login-Screens mit, die auf einem Single-User-Portal nur verwirren. So überspringen wir sie mit Proxy-Auth-Headern in der app.json."
pubDate: 2022-03-02
lang: de
author: Max von Tettenborn
aiTranslated: true
---

Wir arbeiten laufend daran, mehr Apps in unseren App Store zu bringen. Da wir dabei aber Apps verwenden, die ursprünglich fürs Self-Hosting gebaut wurden, müssen wir oft ein paar Anpassungen vornehmen. Vor allem soll sich eine App nach der Installation direkt öffnen lassen, ohne dass man erst ein Registrierungs- oder Login-Formular durchlaufen muss. Jedes Portal ist im Wesentlichen eine Single-User-Plattform, das wäre also ziemlich verwirrend.

Manche Apps bringen ein Proxy-Auth-Feature von Haus aus mit. Es lässt sich oft über eine Umgebungsvariable aktivieren und sorgt dafür, dass die App die angemeldete Person aus einem HTTP-Header liest. Das funktioniert hervorragend, wenn die App hinter einem Reverse Proxy läuft, der die Authentifizierung übernimmt und den Header setzt – genau die Situation, die wir auf dem Portal haben, und deshalb unser bevorzugter Weg, verwirrende Login-Screens loszuwerden.

Der Einfachheit halber wollen wir die nötige Konfiguration möglichst vollständig über Einstellungen in der app.json vornehmen können. Umgebungsvariablen zu setzen ist schon lange möglich. HTTP-Header zu konfigurieren, die an alle an die App weitergeleiteten Requests angehängt werden, war es dagegen nicht. Das hat sich jetzt geändert: Du kannst diese HTTP-Header nun in der app.json angeben. Mehr dazu steht in der aktualisierten Dokumentation.

Tatsächlich mussten wir dafür noch ein weiteres Feature nachziehen: Format-Versionen für die app.json. Bisher gab es immer nur genau ein gültiges Format für das app.json-Dokument. Mit dem HTTP-Header-Feature wollten wir aber grundlegend ändern, wie URL-Pfade konfiguriert werden. Damit das reibungslos läuft, haben wir Version 1.0 des app.json-Formats eingeführt. Portal versteht aber weiterhin Version 0.0 und konvertiert diese älteren Dokumente transparent nach 1.0.

Wir sind überzeugt, dass diese Änderung es einfacher macht, Apps für den Portal App Store anzupassen – und vor allem, die Nutzung angenehmer zu machen, indem Registrierungs- und Login-Ansichten wegfallen.
