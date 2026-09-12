---
title: "Apps schlafen legen – und in unter zwei Sekunden wecken"
description: "Selbstgehostete Apps fressen Arbeitsspeicher, auch wenn sie niemand nutzt. Sie mit dem cgroup-Freezer einzufrieren und per memory.reclaim auszulagern, gibt den Speicher zurück – und weckt sie trotzdem in unter zwei Sekunden."
pubDate: 2026-07-25
cover: ../en/putting-apps-to-sleep-and-waking-them-in-under-two-seconds/cover.png
coverAlt: "Illustration von Apps, die auf einem Shard schlafen"
lang: de
author: Max von Tettenborn
aiTranslated: true
---

Ein Shard ist ein kleiner Server. Oft ein sehr kleiner, ein VPS mit 1 oder 2 GB RAM, und der ganze Sinn der Sache ist, dass du einen Stapel Apps darauf installieren und sie als deine eigenen behandeln kannst: Fotos, Dokumente, Notizen, eine Rezeptsammlung. Das Problem ist, dass selbstgehostete Apps beim Speicher nicht zimperlich sind. Allein Immich nimmt sich mit seinen Machine-Learning-Workern bereitwillig ein großes Stück einer 2-GB-Kiste, bevor du auch nur ein einziges Foto hochgeladen hast. Installiere drei oder vier solcher Apps, und die Kiste ist voll.


## Das Problem mit einer persönlichen Cloud

Der naheliegende Fix ist, die Apps zu stoppen, die du gerade nicht nutzt, und sie bei Bedarf wieder zu starten. Das haben wir schon gemacht. Aber einen Container-Stack kalt zu starten ist langsam, oft 30 Sekunden oder mehr, und genau in dieser halben Minute fällt das Erlebnis auseinander. Eine Person mit eigenem Shard hat es klar gesagt: Das mit Abstand größte tägliche Ärgernis war das Warten darauf, dass eine App aufwacht. Bei Immich wird es noch schlimmer, weil die Android-App den Server so selten abfragt, dass es bis zu zehn Minuten dauern kann, bis sie überhaupt merkt, dass die Instanz wieder da ist. Das können wir nicht direkt reparieren, die App gehört uns nicht. Der einzige Hebel, den wir haben, liegt auf dem Server: schneller aufwachen.

Das Ziel war damit ein vertrautes in einem ungewohnten Umfeld. **Scale-to-zero, also das, was man sonst nur von Serverless in der großen Cloud bekommt, aber auf einem billigen Shard mit strikter Isolation pro App.** Ungenutzte Apps sollen ihren Speicher zurückgeben, und eine App zu wecken soll sich sofort anfühlen und nicht wie ein Rechnerneustart.

## Die Antworten, die nicht funktioniert haben

Der erste Reflex ist Checkpoint/Restore: einen laufenden Prozess samt seinem gesamten Speicher auf die Platte einfrieren und ihn später genau dort wiederherstellen, wo er war. Unter Linux heißt das [CRIU](https://criu.org/), oder `docker checkpoint`, das CRIU umhüllt. Eine schöne Idee, und sie ist seit Jahren „experimentell“. Es gibt keine echte docker-compose-Unterstützung, und unsere Apps sind Compose-Stacks, keine einzelnen Container. Fällt raus.

Der nächste Gedanke ist, die gesamte Runtime auf Podman umzustellen, das für manches davon freundlichere Primitive mitbringt. Aber unser kompletter App-Katalog ist gegen docker-compose gebaut und getestet, und die Runtime zu migrieren ist ein Ökosystem-Preis, für den wir genau ein Feature bekommen. Lohnt sich nicht.

Dann gibt es noch [Sablier](https://sablierapp.dev/), eine nette Middleware, die Container hinter einem Proxy bei Bedarf startet und stoppt. Wir haben uns das genau angesehen. Das Problem ist, dass es nur startet und stoppt – und Stoppen ist genau der langsame Kaltpfad, den wir vermeiden wollen. Außerdem will Sablier die Weck-Entscheidung besitzen, was mit dem Control Loop kollidieren würde, den wir schon betreiben, um bei Speicherdruck zu entscheiden, was herabgestuft wird. Zwei Scheduler, die sich um dieselben Container streiten, sind ein Bug, der nur auf seinen Auftritt wartet.

Was tatsächlich funktioniert hat, ist auf eine gute Art langweilig.

## Einfrieren, dann auslagern

Zwei Linux-Primitive erledigen die ganze Arbeit.

Das erste ist der **[cgroup-Freezer](https://docs.kernel.org/admin-guide/cgroup-v2.html)**, den du über `docker compose pause` erreichst. Einen Container zu pausieren stoppt ihn nicht. Es friert jeden Prozess darin an Ort und Stelle ein, sofort und ohne CPU-Verbrauch. Der Haken: Eine eingefrorene App hält weiterhin ihren gesamten Speicher, für sich genommen spart Pause also nur CPU, kein RAM.

Das zweite Primitiv behebt das. [cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html#memory-interface-files) bietet `memory.reclaim`, womit man dem Kernel sagt, die anonymen Pages einer cgroup in den Swap zu schieben. Die Reihenfolge ist also: App einfrieren, dann proaktiv ihren Speicher in den Swap auslagern. Das RAM steht allem anderen wieder zur Verfügung, und die eingefrorene App sitzt da und kostet nichts außer etwas Plattenplatz.

Anonyme Pages sind der Speicher, den eine App für ihren eigenen Arbeitszustand belegt – deine Daten in Bewegung –, im Gegensatz zu file-backed Pages, die nur gecachte Kopien von Dingen sind, die ohnehin schon auf der Platte liegen. Es sind die Pages, die sonst verloren gingen, wenn du die App stoppst, und bei den Apps, um die es uns geht, machen sie den Großteil des Fußabdrucks aus. Unser Zielwert: auf diesem Weg etwa drei Viertel des RAMs einer laufenden App zurückgeben.

Das Aufwecken ist der Lohn dafür. Kein Kaltstart, kein erneutes Ziehen von Images, kein Warten darauf, dass eine Datenbank hochkommt. Es ist ein einziges `docker compose unpause`, und die App ist genau so zurück, wie sie war, in **unter zwei Sekunden**. Diese Zahl ist keine Wunschvorstellung, sie wird von einem Integrationstest zugesichert, der einen echten Container-Stack pausiert und auslagert und dann das Unpause misst. Zum Vergleich: über 30 Sekunden bei einem vollen Kaltstart.

Darunter durchlaufen Apps drei Zustände statt zwei:

- **Running** – normal, nutzt RAM.
- **Paused + Paged** – eingefroren, Speicher größtenteils in den Swap geschoben, wacht in Millisekunden bis etwa 2 Sekunden auf.
- **Stopped** – kalt, Speicher vollständig freigegeben, das langsame Aufwachen mit 30 s und mehr.

Eine ungenutzte App fällt zuerst von Running auf Paused, den warmen Zustand, und rutscht nur dann auf Stopped, wenn sie lange genug ungenutzt bleibt oder die Kiste unter echten Druck gerät. Gesteuert wird die Herabstufung von [PSI](https://docs.kernel.org/accounting/psi.html), der Pressure-Stall-Information des Kernels, gelesen aus `/proc/pressure/memory`. Wird der Speicher knapp, werden die am längsten nicht genutzten Apps herabgestuft, und Pausieren wird immer dem Stoppen vorgezogen, weil Pausieren billig rückgängig zu machen ist und Stoppen nicht.

Kaltstarts verschwinden nicht komplett. Eine App, die lange genug ungenutzt bleibt, oder eine, die erwischt wird, wenn der Kiste wirklich der Speicher ausgeht, fällt weiterhin ganz bis Stopped durch und zahlt beim nächsten Zugriff die vollen 30 s und mehr. Und der allererste Start nach der Installation oder einem Update einer App ist immer kalt, es gibt ja noch nichts Eingefrorenes, zu dem man zurückkehren könnte. Der Schlafmodus macht den langsamen Pfad nur zur Ausnahme statt zur Regel bei jedem einzelnen Aufwachen.

## Wie ein billiger VPS den Swap übersteht

Sich auf Swap zu stützen hat ein offensichtliches Risiko: Swap ist langsam, und eine Kiste, die beim Aufwachen thrasht, ist schlimmer als eine, die von vornherein nur langsam war. Zwei Dinge verhindern das.

Erstens **zswap**. Bevor eine Page in die Swap-Datei auf der Platte geht, läuft sie durch einen komprimierten Cache im RAM (zstd-Kompression, dekomprimiert in Mikrosekunden). Auf einem kleinen VPS berührt der Großteil des ausgelagerten Speichers die Platte nie; er liegt komprimiert in einem Stück RAM und kommt fast umsonst zurück. Jeder Shard bekommt jetzt eine Swap-Datei in RAM-Größe plus zswap, denn die Auslagerungshälfte nützt nichts, wenn es nichts gibt, wohin ausgelagert werden kann.

Zweitens ist es hinter einem Kill-Switch ausgeliefert worden, mit Telemetrie: Zähler für Zustandswechsel, Latenz-Perzentile für Pause und Unpause, PSI-Schnappschüsse, Swap-Nutzung – alles wird gemeldet, damit wir das echte Verhalten beobachten können, statt dem Design-Dokument zu vertrauen. Wir haben allerdings gerade erst angefangen zu beobachten, deshalb kann ich dir noch keine Zahlen aus der Praxis geben; das ist das Nächste, worüber ich berichte.

## Was das für dich heißt

Wenn dir ein Shard gehört, gehen deine ungenutzten Apps jetzt aus dem Weg. Sie geben ihren Speicher an das zurück, was du gerade tatsächlich nutzt, und wenn du zu einer zurückkommst, ist sie meistens in etwa der Zeit da, die du brauchst, um deinen Klick zu bemerken. Eine 2-GB-Kiste kann mehr von deinem Kram halten und sich trotzdem flott anfühlen – und genau das ist das ganze Versprechen einer persönlichen Cloud, die sich wie ein Produkt verhält und nicht wie ein Haufen Server.

Das Interessante daran ist, zumindest für mich, dass die Antwort nicht die exotische war. Checkpoint/Restore ist die schillernde Idee, nach der alle greifen; was tatsächlich ausgeliefert wurde, sind ein Freezer, eine Swap-Datei und ein komprimierter Cache – Primitive, die seit Jahren im Kernel stecken. Manchmal gewinnen die langweiligen Werkzeuge.

Gibt es eine App bei dir, bei der dich die Weckzeit in den Wahnsinn treibt? [Schreib mir, welche](mailto:contact@freeshard.net) und wie du sie nutzt. Und wie immer: Wenn sich etwas nicht so verhält, wie es sollte, sag mir auch das. Die Heuristiken für den Leerlauf werden noch justiert, und echte Nutzung ist das, was sie justiert – so wie echte Bugreports das sind, was Bugs behebt.
