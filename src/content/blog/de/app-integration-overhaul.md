---
title: "Generalüberholung der App-Integration"
description: "Ausgelöst davon, Overleaf in den App Store zu holen: zwei Monate Umbau am App-Format von Portal, am App-Store-Backend, am Installationsablauf und an der Websocket-Unterstützung."
pubDate: 2023-09-16
lang: de
author: Max von Tettenborn
aiTranslated: true
---

Wenn man Software entwickelt, kommt man am stetigsten und nachhaltigsten voran, indem man in kleinen, in sich geschlossenen Schritten arbeitet. Jede Änderung sollte einen klaren Umfang haben, den man leicht überblicken, testen und bei Bedarf zurückrollen kann. Nebenwirkungen sollte man so gut es geht vermeiden. Beim letzten Update habe ich genau das Gegenteil gemacht.

# Der Auslöser

Ich wollte Overleaf in unseren App Store aufnehmen. Overleaf ist ein webbasierter LaTeX-Editor, der in Wissenschaft und Studium sehr beliebt ist und eine großartige Ergänzung wäre. Er ist besonders nützlich, weil das Schreiben mit LaTeX quälend technisch sein kann und Overleaf einem die meisten Details abnimmt.

Es stellte sich allerdings heraus, dass Overleaf ein paar Voraussetzungen mitbringt, nämlich weitere Container, die auf derselben Maschine laufen müssen: einen Redis-Server und eine MongoDB-Datenbank. Und genau das unterstützte Portal schlicht nicht. In der Vergangenheit bin ich so etwas manchmal umgangen, indem ich ein neues Image für die App gebaut habe, das alle nötigen Prozesse enthält und startet. Aber das ist heikel und fehleranfällig und widerspricht der Idee, dass ein Docker-Container immer nur eine Sache tut.

Es war also ein guter Zeitpunkt, eine Aufgabe anzugehen, die schon eine ganze Weile im Backlog lag: die Generalüberholung des App-Integrationssystems.

# Alles auseinandernehmen

![Mechanik-Arbeitsplatz mit zerlegter Maschine](../en/app-integration-overhaul/mechanic.jpg)

Apps zu verwalten ist eine der Hauptaufgaben von Portal, und deshalb ist das tief in viele Teile des Portal-Kerns eingewoben. Annahmen darüber, wie Apps funktionieren und sich verhalten, sind über die ganze Codebasis verstreut. Viele davon würden nach dem Umbau nicht mehr stimmen. Ich musste also eine Menge unterschiedlicher Module anfassen, sie auseinandernehmen und wieder zusammensetzen.

Der Rest dieses Posts geht die großen Änderungen durch – geplante, ungeplante und Gelegenheitsänderungen –, die ich unterwegs gemacht habe.

# Was ist eine App?

## Vorher

Vor dem Umbau war eine App im Wesentlichen dreierlei:

1. ein einzelnes Docker-Image (irgendwo gehostet) und
2. die Datei `app.json` mit Metadaten und Konfiguration und
3. eine Bilddatei als Icon der App.

Bei der Installation wurde eine große `docker-compose.yml` aktualisiert, die alle auf dem Portal installierten Apps enthielt, und die neue App wurde ergänzt. Die `app.json` enthielt die dafür nötigen Informationen.

Mit der Zeit stellte sich heraus, dass das Format der `app.json` dem Format einer `docker-compose.yml` immer ähnlicher wurde. Viele Werte, die in die `docker-compose.yml` gerendert werden mussten, mussten auch in der `app.json` stehen. Ich hatte das Rad neu erfunden, nur eingeschränkter – vor allem durch die Begrenzung auf einen Container pro App.

## Nachher

Es lag also nahe, einfach direkt `docker-compose.yml`-Dateien zu verwenden. Jede App hat jetzt ihre eigene `docker-compose.yml`, und Portal startet sie einfach. Damit war das Hauptziel sofort erreicht: Jede App kann aus mehreren Containern bestehen. Als Bonus lässt sich viel Konfiguration direkt in der `docker-compose.yml` in einem bekannten Format ausdrücken und aus der `app.json` herauswerfen.

Ganz loswerden konnte ich die `app.json` allerdings nicht. Ein Teil der Portal-spezifischen Konfiguration wurde weiterhin gebraucht, etwa Zugriffskontrolle oder Lifecycle-Regeln, und das lässt sich in einer `docker-compose.yml` nicht ausdrücken. Ich habe sie also behalten, in `app_meta.json` umbenannt (weil das klarer ist und die Gelegenheit perfekt war) und aufgeräumt.

Wenn ich schon dabei war, habe ich Apps auch gleich die Möglichkeit gegeben, die minimale Portal-Größe zu definieren, die sie zum Laufen brauchen. Overleaf war die erste App, die das nutzt, denn auf der kleinsten Portal-Größe reicht der Arbeitsspeicher nicht für alle nötigen Container.

Und als kleines Extra veröffentliche ich jetzt auch eine JSON-Schema-Datei für das `app_meta.json`-Schema (siehe [hier](https://docs.freeshard.net/developer_docs/app_meta_json/#schema)). Das macht das Schreiben dieser Datei deutlich einfacher, weil eine IDE das Schema für Validierung und Autovervollständigung nutzen kann.

Zurück zur `docker-compose.yml`: Es zeigte sich, dass es nicht reicht, wenn Apps eine statische Datei mitliefern. Manche Apps müssen während der Installation konfiguriert werden. Insbesondere werden viele App-Entwickelnde die Basis-URL eines Portals, die für jedes Portal anders ist, in die Umgebung ihrer App legen wollen. Statt der `docker-compose.yml` direkt liefert die App-Entwicklung jetzt also eine Datei `docker-compose.yml.template`, die Variablen in Jinja2-Syntax enthalten darf. Bei der Installation wird daraus die `docker-compose.yml` erzeugt.

Zusammengefasst besteht eine App jetzt aus diesen vier Artefakten:

1. allen benötigten Docker-Images (irgendwo gehostet) und
2. der `app_meta.json` mit Portal-spezifischen Metadaten und Konfiguration und
3. dem `docker-compose.yml.template` als Vorlage für die `docker-compose.yml` und
4. einer Bilddatei als Icon der App.

Alle Details zum neuen App-Format stehen [hier](https://docs.freeshard.net/developer_docs/overview/#the-apps-metadata) in der Doku.

Und nebenbei: Natürlich musste ich auch alle bestehenden Apps auf das neue Format migrieren – zumindest die, die tatsächlich genutzt wurden.

# App Store

## Vorher

Das geänderte App-Format war zugleich die Gelegenheit, das App-Store-Backend zu ändern. Vorher war der App Store ein GitLab-Repository mit den `app.json`-Dateien und Icons aller Apps. Portal hat über die GitLab-API den App Store abgefragt und die Dateien heruntergeladen. Das schien damals eine gute Idee, weil es leicht umzusetzen war.

Dieser Ansatz hatte allerdings ein paar Probleme. Erstens ist die GitLab-API nicht besonders schnell. Nach dem Öffnen des App Stores hing ein Portal ein paar Sekunden in Abfragen fest. Zweitens war die GitLab-API nie dafür gedacht, dass Hunderte oder Tausende Clients sie ständig abfragen – und genau darauf zielen wir ja ab. Ich hatte die Befürchtung, dass wir irgendwann in Rate Limits laufen.

## Nachher

Die naheliegende Lösung war, den App Store auf ein CDN umzuziehen. Der App Store ist am Ende nur eine Ansammlung statischer Dateien, und CDNs sind sehr gut darin, so etwas mit niedriger Latenz und hohem Durchsatz auszuliefern.

Jetzt gibt es also eine CI/CD-Pipeline, die aus dem App-Store-Repository ein paar Dateien baut und sie auf ein CDN in Azure schiebt. Die verschiedenen Branches des App-Store-Repositorys landen unter verschiedenen Pfaden auf dem CDN, sodass sich Änderungen oder Ergänzungen testen lassen, indem man in der Portal-UI den Branch wechselt. Die Pipeline erzeugt außerdem eine Übersichtsdatei mit allen Apps, die im App Store verfügbar sind, samt der Metadaten, die zur Anzeige in der UI gebraucht werden. (Du kannst sie dir [hier](https://storageaccountportab0da.blob.core.windows.net/app-store/feature-docker-compose/all_apps/store_metadata.json) ansehen.) So braucht es nur noch einen einzigen Request, um den Inhalt des App Stores initial zu laden (die Icons natürlich ausgenommen).

Mit wachsendem App Store hätte ich gern auch eine Suche nach Name, Beschreibung oder Schlagwort. Ob und wie das mit einem Backend funktionieren kann, das nur aus statischen Dateien besteht, weiß ich noch nicht. Wenn du Ideen hast, sag Bescheid!

# App-Installation

## Vorher

Oben beschreibe ich, wie installierte Apps vor dem Umbau in eine große `docker-compose.yml` mit allen Apps geschrieben wurden. Der Portal-Kern hat diese Datei gerendert, konnte sie aber, weil er selbst ein Docker-Container war, nicht direkt starten – dachte ich zumindest damals. Stattdessen lief auf dem Host ein systemd-Service, der die Datei auf Änderungen beobachtete und bei einer Änderung `docker-compose up` ausführte. Das funktionierte irgendwie, war aber seltsam, überraschend und nicht besonders robust. Vor allem führte es oft zu Fehlern, wenn man mehrere Apps kurz hintereinander installierte.

Mit dem neuen System gibt es jetzt eine `docker-compose.yml` pro App, ich musste das Starten von Apps also ohnehin neu bauen.

## Nachher

Was mir damals nicht klar war und mir viel Arbeit erspart hätte: Wenn man den Docker-Socket mountet, kann der Portal-Core-Container den Docker-Daemon direkt steuern. Es braucht kein systemd, um Docker-Kommandos aufzurufen. Damit kann der Portal-Core-Container jetzt selbst docker-compose-Kommandos absetzen, um Apps zu starten und zu stoppen, und alles andere Nötige erledigen.

Der Installationsablauf sieht jetzt so aus:

1. Portal Core lädt die Dateien der App aus dem App Store.
2. Portal Core aktualisiert seine interne Datenbank mit den Metadaten der App.
3. Portal Core rendert die `docker-compose.yml` aus dem Template.
4. Portal Core aktualisiert die Konfiguration für den Traefik Reverse Proxy.

Und wenn die App einen Request bekommt, startet Portal Core einfach die docker-compose-Datei der App.

Weil der Portal-Kern jetzt alles selbst macht, gibt es deutlich mehr Kontrolle und Einblick beim App-Management – und damit ein paar weitere nützliche Features.

* Wenn man mehrere Apps kurz hintereinander installiert, können wir die Installationen in eine Warteschlange stellen und nacheinander ausführen.
* Die UI kann einen Spinner auf dem App-Icon zeigen, solange die App noch installiert wird.
* Die UI kann anzeigen, dass eine App gerade läuft.
* Wenn eine Installation fehlschlägt, kann die UI eine Fehlermeldung zeigen, sodass man wenigstens über das Problem informiert ist.

Für die letzten drei Punkte braucht es natürlich irgendeinen Push-Mechanismus, um die UI zu aktualisieren. Und du ahnst wahrscheinlich schon, worauf das hinausläuft.

# Websockets

Dieser nächste Abschnitt ist so naheliegend, dass der KI-Copilot sogar die richtige Überschrift vorgeschlagen hat.

## Vorher

Bis jetzt gab es überhaupt keine Websocket-Integration. Ich hielt sie schlicht nicht für vordringlich, und in den ganz wenigen Fällen, in denen sie nötig war, reichte Polling. Mit den Änderungen am Installationsablauf wollte ich nun aber wirklich in Echtzeit zeigen, was gerade passiert.

## Nachher

Zum Glück bringt FastAPI das eingebaut mit und macht es wirklich leicht, Websockets zu ergänzen. Ich bin noch einen Schritt weitergegangen und habe Websockets mit der [Python-Bibliothek blinker](https://blinker.readthedocs.io/en/stable/#) verbunden, die ich schon eine Weile für interne Signale nutze. Jetzt gibt es also so etwas wie einen sehr leichtgewichtigen internen Event-Bus auf Basis von blinker, wobei eine Teilmenge der Events zusätzlich auf Websockets veröffentlicht wird.

Das Frontend, gebaut mit Vue.js, reagiert auf Websocket-Events, indem es sie auf einem globalen Event-Bus veröffentlicht und bei Bedarf den VueX-Store aktualisiert. So kann ich in der ganzen Anwendung dieselbe Liste von Event-Namen und Payload-Schemata verwenden.

# Verschiedenes

Das waren die großen Änderungen, aber es gab auch ein paar kleinere, die nötig waren oder sich einfach anboten.

* Ich habe den gemeinsam genutzten Postgres-Container entfernt, der auf jedem Portal lief und den Apps nutzen konnten. Ursprünglich war geplant, viele weitere solcher geteilten Dienste zu ergänzen, aber jetzt, wo jede App ihre eigenen Hilfscontainer hochfahren kann, braucht es das schlicht nicht mehr.
* Es gibt eine docker-compose-Datei, die die verpflichtenden Container konfiguriert, aus denen ein Portal besteht: den Portal-Kern, den Traefik Reverse Proxy und einen Container, der das Web-Frontend statisch ausliefert. In dieser Datei waren die Container mit dem Tag `:latest` definiert, was hieß, dass jeder Neustart sie auf die neueste Version aktualisieren konnte. Das war ein wenig unkontrollierbar, deshalb lege ich jetzt die exakte Version fest und schiebe bei einem Update eine neue `docker-compose.yml` vom Backend auf jedes Portal.
* Mit dem neuen App-Format können Apps im Prinzip jedes beliebige Host-Verzeichnis mounten. Ich verhindere das per Richtlinie, indem ich solche Apps nicht in den Store aufnehme. Es ist aber auch eine Chance, einzelnen privilegierten Apps mehr Zugriff auf den Host zu geben. Zum Beispiel der Filebrowser-App, die jetzt alle Dateien aller Apps sehen kann.
* Weil der Umbau so viele tiefgreifende Änderungen umfasste, ließen sich bestehende Portals mit den vorhandenen Mitteln nicht automatisch aktualisieren. Ich habe daher ein Migrationswerkzeug gebaut, das ein Portal auf das neue Format hebt. Hoffentlich kann ich es bei künftigen tiefgreifenden Änderungen als Vorlage nutzen.
* Die App-Entwicklung muss über das neue App-System und seine Nutzung informiert werden. Also habe ich alle Doku-Seiten überarbeitet, die von den Änderungen betroffen waren (also praktisch alle).

# Fazit

Die oben beschriebenen Aufgaben waren nur die, die einen Eintrag in der stetig wachsenden und sich stetig ändernden Todo-Liste für dieses Feature verdient hatten. Alles in allem war das ein großes Unterfangen, für das ich rund zwei Monate gebraucht habe. Die Änderungen verteilen sich auf 48 Commits, der erste vom 22.05.2023, der letzte vom 18.07.2023, und betreffen 103 Dateien.

Das ist natürlich nicht die beste Art, Dinge anzugehen, und ich habe es nur gemacht, weil es als einzelner Entwickler keinen Abstimmungsaufwand gibt. Der Vorteil der vollen Kontrolle, würde ich sagen.

Wie auch immer, ich hoffe, dir hat dieser kleine Einblick in die Entwicklung von Portal gefallen und du willst das neue App-System gleich ausprobieren. Reich gern deine eigenen Apps beim App Store ein ([so geht's](https://docs.freeshard.net/developer_docs/overview/)) und sag uns, was du davon hältst!
