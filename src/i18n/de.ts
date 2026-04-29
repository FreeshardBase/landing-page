const BASE_URL = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');

export const de = {
  nav: {
    useCases: "Deine Cloud",
    features: "Vorteile",
    screenshots: "Einblicke",
    pricing: "Preise",
    motivation: "Mission",
    contact: "Kontakt"
  },
  footer: {
    copyright: "© 2026 Freeshard. Alle Rechte vorbehalten.",
    imprint: "Impressum",
    privacy: "Datenschutz",
    terms: "AGB",
    faq: "Häufige Fragen (FAQ)",
    trial: "Kostenlos testen",
    activate: "Mit Promo-Code aktivieren"
  },
  terms: {
    title: "AGB — Freeshard"
  },
  hero: {
    subtitle: "Deine persönliche souveräne Mini-Cloud",
    description: "Ein Shard ist deine persönliche Mini-Cloud von Freeshard. Ein Ort für Apps, Daten und Identität. Keine Passwörter, kein Sync, digitale Souveränität ohne Technikstress.",
    ctaPrimary: "24h kostenlos testen",
    ctaSecondary: "Auf dem Laufenden bleiben"
  },
  useCases: {
    sectionTitle: "Deine persönliche Cloud",
    sectionDescription: "Dein Shard ist deine Mini-Cloud. Wähle und installiere Apps aus unserem App Store – sicher, privat und nur für dich erreichbar.",
    toggleLabel: "Für Technik-Fans: Was steckt unter der Haube?",
    disclaimer: "Rechtlicher Hinweis: Freeshard ist ein unabhängiger Hosting-Anbieter. Wir stehen in keiner geschäftlichen Verbindung zu den Projekt-Teams von Immich, Paperless-ngx, Vaultwarden oder anderen hier genannten Anwendungen. Es besteht keine Partnerschaft, Unterstützung oder Sponsoring durch diese Projekte. Alle genannten Markennamen und Logos sind Eigentum der jeweiligen Rechteinhaber.",
    items: {
      photos: { 
        title: "Private Fotoverwaltung", 
        simpleDescription: "Alle deine Fotos und Videos an einem sicheren Ort. Automatisch vom Handy gesichert und einfach mit der Familie geteilt – ganz ohne Google oder Apple.",
        techDescription: "Leistungsstarke, lokale Bild-Indizierung und Gesichtserkennung direkt auf deinem Shard. Volle Kontrolle über deine Metadaten."
      },
      documents: { 
        title: "Digitales Dokumentenarchiv", 
        simpleDescription: "Nie wieder suchen. Scanne Dokumente einfach mit dem Handy. Die automatische Texterkennung findet jede Rechnung in Sekunden – perfekt für die Steuererklärung.",
        techDescription: "Professionelles Dokumentenmanagement mit OCR-Texterkennung. Durchsuchbare PDFs, automatische Tagging-Regeln und Workflow-Automatisierung."
      },
      passwords: {
        title: "Sicherer Passwort-Safe",
        simpleDescription: "Merke dir nie wieder ein Passwort. Alle deine Logins sind auf deinem Shard verschlüsselt und über alle Geräte synchronisiert. Generiere sichere, zufällige Passwörter mit einem Klick.",
        techDescription: "Ende-zu-Ende-verschlüsselte Passwortverwaltung. Starke Passwortgenerierung, biometrisches Entsperren, und deine Passwörter sind verschlüsselt, bevor sie dein Gerät verlassen."
      },
      recipes: {
        title: "Digitale Rezeptsammlung", 
        simpleDescription: "Nie wieder was vergessen. Die gemeinsame Einkaufsliste synchronisiert sich sofort. Importiere Rezepte von Chefkoch & Co. mit einem Klick.",
        techDescription: "Moderne Rezeptverwaltung mit nativen Apps für iOS und Android. Smarte Parsing-Engine für Importe und automatische Skalierung der Zutaten."
      },
      finances: {
        title: "Persönliches Finanz-Cockpit",
        simpleDescription: "Behalte die volle Kontrolle über deine Einnahmen und Ausgaben. Plane Budgets und verstehe, wohin dein Geld fließt.",
        techDescription: "Envelope-Budgeting-System für realistische Planung. Verwalte mehrere Konten, erstelle benutzerdefinierte Berichte und sehe dein Vermögen auf einen Blick."
      },
      notes: {
        title: "Schnelle Notizen & Ideen", 
        simpleDescription: "Halte Gedanken und Ideen schnell und einfach fest. Dein persönliches, digitales Notizbuch für alles, was dir wichtig ist.",
        techDescription: "Leichtgewichtiger Notiz-Service mit Markdown-Support. Perfekt für schnelle Gedanken, Code-Snippets und To-Do-Listen."
      },
      audiobooks: {
        title: "Eigene Hörbuch-Bibliothek", 
        simpleDescription: "Verwalte und höre deine Hörbücher und Podcasts auf all deinen Geräten. Dein persönlicher Hörbuch-Streamingdienst.",
        techDescription: "Self-hosted Hörbuch-Server mit App-Support. Merkt sich den Fortschritt über Geräte hinweg und unterstützt Podcasts."
      },
      files: {
        title: "Sicherer Datei-Austausch", 
        simpleDescription: "Deine persönliche Alternative zu Dropbox. Greife von überall auf deine Dateien zu und teile sie sicher mit Freunden und Familie.",
        techDescription: "Webbasierter Dateimanager. Erlaubt Uploads, Downloads und Sharing direkt über den Browser, ohne Client-Installation."
      },
      more: {
        title: "Und vieles mehr...", 
        simpleDescription: "Die Welt der selbst gehosteten Anwendungen ist riesig. Wir finden und installieren die passende Lösung für deine individuellen Bedürfnisse.",
        techDescription: "Dein Shard basiert auf Docker. Wir können fast jede containerisierte Anwendung für dich deployen und warten."
      }
    }
  },
  features: {
    sectionTitle: "Deine Vorteile",
    sectionDescription: "Weniger Reibung, mehr Kontrolle. Dein Shard ist dein digitales Zentrum.",
    items: {
      independence: { 
        icon: "🛡️",
        title: "Digitale Souveränität", 
        description: "Deine Daten, deine Regeln. Keine Plattform, die mitliest oder dich bindet." 
      },
      managed: { 
        icon: "🧭",
        title: "Eine Identität statt vieler", 
        description: "Dein Shard ist dein Zugang. Keine Passwortflut, keine Konto-Silos." 
      },
      privacy: { 
        icon: "⚡",
        title: "Keine Reibung", 
        description: "Backups, Updates und Sicherheit laufen automatisch im Hintergrund." 
      },
      central: { 
        icon: "💠",
        title: "Ein Ort, alle Geräte", 
        description: "Installiere Apps einmal, nutze sie überall. Kein Sync, kein Export." 
      },
      fair: { 
        icon: "🗂️",
        title: "Dateien gehören dir", 
        description: "Ein echtes Dateisystem statt App-Silos. Daten bleiben bei dir." 
      },
      support: { 
        icon: "🧩",
        title: "Apps ohne Aufpreis", 
        description: "Alle Apps sind kostenlos. Du zahlst nur für deinen Shard." 
      }
    }
  },
  screenshots: {
    sectionTitle: "So einfach ist dein Shard",
    sectionDescription: "Dein Shard ist deine persönliche Mini-Cloud. Ein Ort für Apps, Daten und Identität.",
    cards: {
      portal: {
        placeholder: "Screenshot: Dashboard",
        title: "Alles an einem Ort",
        description: "Deine Apps, Dateien und Kontakte in einer klaren Übersicht."
      },
      mobile: {
        placeholder: "Screenshot: Mobil",
        title: "Auf jedem Gerät",
        description: "Dein Shard läuft überall gleich. Kein Sync, keine App-Silos."
      },
      peace: {
        placeholder: "Screenshot: Sicherheit",
        title: "Souverän und automatisch",
        description: "Backups und Updates laufen im Hintergrund. Du musst nichts tun."
      }
    }
  },
  pricing: {
    pageTitle: "Preisrechner",
    info: {
      introText: "Abonnements sind bald verfügbar. Der Rechner unten gibt dir eine Vorstellung davon, was ein Shard kosten könnte.",
      trialCta: "Freeshard 24 Stunden kostenlos testen →"
    },
    presetsTitle: "Unsere Empfehlungen",
    presets: {
      starter: { name: "Basis", description: "Perfekt für den Einstieg. Ideal, um deine Fotos und Dokumente sicher zu verwalten." },
      collector: { name: "Standard", description: "Der Allrounder. Genug Leistung, damit deine Apps flüssig laufen und Spaß machen." },
      family: { name: "Profi", description: "Für Familien & Vielnutzer. Wenn mehrere Personen gleichzeitig auf den Shard zugreifen." },
      enthusiast: { name: "Experte", description: "Maximale Freiheit. Für große Mediensammlungen und intensive Nutzung ohne Kompromisse." }
    },
    toggleLabel: "Für Technik-Fans: Details anpassen",
    calculator: {
      vmLabel: "Leistung (vCPUs)",
      diskLabel: "Speicherplatz (GB)",
      vmCostLabel: "Kosten Leistung:",
      diskCostLabel: "Kosten Speicher:"
    },
    summary: {
      totalLabel: "Gesamtkosten pro Monat:",
      pricePlaceholder: "Bald verfügbar",
      ctaButton: "Benachrichtigung beim Start"
    },
    priceSuffix: "/Monat"
  },
  motivation: {
    sectionTitle: "Unsere Mission",
    sectionDescription: "Digitale Souveränität, klar und alltagstauglich.",
    story: {
      title: "Warum Freeshard",
      paragraphs: [
        "Wir wollten eine digitale Heimat, die nicht von Plattformen abhängt. Ein Shard gehört dir und bleibt dein Zentrum.",
        "Digitale Souveränität ist gerade ein Trend, für uns ist es die Grundlage. Wir machen sie praktisch: ohne Technikstress und ohne Datensilos.",
        `Transparenz gehört dazu. Unser Code ist <a href='${BASE_URL}/de/faq#fair-source'>Fair Source</a> und dein Shard bleibt portabel, wenn du ihn mitnehmen willst.`
      ]
    },
    values: {
      location: {
        value: "EU",
        label: "Server-Standort",
        link: "data-location",
        title: "Server-Standort",
        explanation: "Dein Shard läuft auf OVH-Servern in der EU (Frankreich). Verschlüsselte Backups werden separat, ebenfalls in EU-Rechenzentren, gespeichert. Alle Daten unterliegen den strengen europäischen Datenschutzgesetzen (DSGVO)."
      },
      code: {
        value: "Fair",
        label: "Fair Source Code",
        link: "fair-source",
        title: "Fair Source",
        explanation: "Unser Code ist veröffentlicht und überprüfbar für Sicherheit und Vertrauen. Wir nutzen Fair Source Lizenzierung, um zu verhindern, dass große Plattformen unsere Arbeit einfach kopieren, während wir transparent bleiben. Du kannst unseren gesamten Code einsehen und überprüfen."
      },
      data: {
        value: "Deins",
        label: "Voller Daten-Export",
        link: "export",
        title: "Datenportabilität",
        explanation: "Du kannst deinen gesamten Shard – einschließlich aller Daten und Einstellungen – exportieren und auf deinem eigenen Server oder bei einem anderen Anbieter betreiben. Deine Daten gehören wirklich dir."
      },
      privacy: {
        value: "Privat",
        label: "Kein Tracking",
        link: "privacy",
        title: "Deine Privatsphäre",
        explanation: "Wir scannen deine Fotos nicht, lesen deine Dokumente nicht und verkaufen Daten an niemanden. Wir tun nur das, wofür du uns beauftragt hast: Hosting. Dein Vertrauen ist unser wichtigstes Gut."
      }
    }
  },
  newsletter: {
    sectionTitle: "Auf dem Laufenden bleiben",
    sectionDescription: "Wenn dich digitale Souveränität interessiert, begleite uns. Wir teilen Fortschritte und neue Apps ohne Spam.",
    form: {
      placeholder: "Deine E-Mail-Adresse",
      button: "Anmelden",
      successMessage: "Vielen Dank für deine Anmeldung! Bitte prüfe dein Postfach.",
      errorMessage: "Es gab einen Fehler. Bitte versuche es später erneut.",
      captchaMessage: "Bitte führe die Sicherheitsprüfung durch.",
      sendingMessage: "Wird gesendet..."
    }
  },
  miniFaq: {
    title: "Mini-FAQ",
    description: "Kurz beantwortet. Alles Weitere findest du im FAQ.",
    linkText: "Zum vollständigen FAQ",
    items: [
      {
        question: "Ist das SaaS?",
        answer: "Nicht im klassischen Sinne – es ist eher IaaS. Deine Daten liegen auf einem dedizierten Rechner, der nur dir gehört, nicht auf gemeinsam genutzter Infrastruktur unter fremder Kontrolle."
      },
      {
        question: "Wer sieht meine Daten?",
        answer: "Niemand. Wir hosten deinen Shard, greifen aber nicht auf deine Daten zu."
      },
      {
        question: "Sind Apps wirklich kostenlos?",
        answer: "Ja. Alle Apps sind kostenlos, du zahlst nur für deinen Shard."
      },
      {
        question: "Kann ich später skalieren?",
        answer: "Ja. Skalierung ist auf der Roadmap."
      }
    ]
  },
  faq: {
    title: "Häufige Fragen (FAQ)",
    pageTitle: "Gut zu wissen",
    intro: "Hier beantworten wir Fragen zur Technik, Sicherheit und unserer Philosophie.",
    searchPlaceholder: "Fragen durchsuchen...",
    noResults: "Keine Fragen gefunden.",
    questions: [
      {
        id: "fair-source",
        question: "Was bedeutet 'Fair Source'?",
        answer: "Fair Source ist ein Weg, Transparenz und Nachhaltigkeit zu vereinen. Unser Code ist unter der 'Functional Source License, Version 1.1, ALv2 Future License' veröffentlicht. Das bedeutet: Du kannst den Code einsehen und prüfen – das schafft Sicherheit und Vertrauen. Wir würden gerne klassisches Open Source nutzen, müssen uns aber schützen: Wir wollen verhindern, dass große Hyperscaler (wie Amazon oder Google) unsere Arbeit einfach kopieren und als eigenes Produkt verkaufen. Das würde uns die Ressourcen entziehen, Freeshard für dich weiterzuentwickeln.",
        tags: ["quellcode", "lizenz", "transparenz", "open source"]
      },
      {
        question: "Wo finde ich euren Code?",
        answer: "Du findest unseren gesamten Quellcode auf GitHub: <a href='https://github.com/FreeshardBase/freeshard' target='_blank' rel='noopener noreferrer'>https://github.com/FreeshardBase/freeshard</a>. Schau gerne rein!",
        tags: ["quellcode", "transparenz"]
      },
      {
        question: "Verkauft ihr alles, wenn euch ein Investor Geld gibt?",
        answer: "Nein, das haben wir nicht vor. Wir haben Freeshard aus Überzeugung heraus gestartet und nutzen es täglich selbst für unsere eigenen Daten. Es zu verkaufen, würde bedeuten, nicht nur eure, sondern auch unsere eigenen privaten Daten aus der Hand zu geben. Wir bauen Freeshard, um unabhängig zu bleiben – nicht, um schnell Kasse zu machen.",
        tags: ["geschäftsmodell", "unabhängigkeit"]
      },
      {
        question: "Warum nehmt ihr Geld, wenn ich die Apps auch kostenlos nutzen kann?",
        answer: "Das ist richtig: Die Apps selbst sind oft kostenlos. Aber sie zuverlässig unter einem Dach zu betreiben, erfordert viel Arbeit im Hintergrund: Hosting-Kosten, Installation, Speicherverwaltung, Backups und komplexe Datenbank-Migrationen bei Updates. Wir übernehmen diese technische 'Orchestrierung' für dich, damit alles reibungslos läuft, und entwickeln Freeshard ständig weiter. Wenn du das technische Know-how hast und Zeit investieren möchtest, kannst du natürlich auch kostenlos profitieren, indem du deinen Shard selbst hostest oder die Anwendungen einzeln selbst betreibst.",
        tags: ["preise", "geschäftsmodell", "apps"]
      },
      {
        question: "Warum kann ich Freeshard nicht anonym nutzen?",
        answer: "Ganz ehrlich: Eine anonyme Nutzung wäre uns am liebsten. Leider ist das in der Realität kaum machbar. Es gibt Menschen, die anonyme Dienste missbrauchen, um illegale Inhalte zu verbreiten, die jenseits von allem sind, was wir uns vorstellen oder tolerieren wollen. Als Betreiber müssten wir uns ständig mit Missbrauchsmeldungen und rechtlichen Konsequenzen auseinandersetzen, was in keinem Verhältnis zum Nutzen stünde. Wenn du deinen Shard wirklich komplett anonym betreiben möchtest, empfehlen wir dir, einen spezialisierten Hoster zu suchen, der genau darauf ausgelegt ist.",
        tags: ["datenschutz", "recht", "anonymität"]
      },
      {
        question: "Brauche ich technisches Wissen?",
        answer: "Nein. Wir haben Freeshard so gebaut, dass es sich anfühlt wie die Apps, die du bereits kennst. Wir kümmern uns im Hintergrund um die Technik, Updates und Sicherheit.",
        tags: ["einstieg"]
      },
      {
        question: "Warum nur PayPal und kein Wero oder Lastschrift?",
        answer: "Das ist eine berechtigte Frage. Wir sind aktuell ein kleines, effizientes Team und müssen unsere Ressourcen bündeln. Mit PayPal erreichen wir die meisten Menschen einfach und sicher. Andere Zahlungsarten wie Wero oder Lastschrift stehen aber fest auf unserer Wunschliste für die Zukunft.",
        tags: ["zahlung", "preise"]
      },
      {
        question: "Wie sind meine geteilten Inhalte (z.B. Fotoalben) erreichbar?",
        answer: "Dein Shard bekommt bei der Einrichtung automatisch eine eigene Subdomain auf <code>freeshard.cloud</code>. Unter dieser Adresse kannst du Links zu deinen Fotoalben oder Dateien ganz einfach mit Freunden teilen. Eigene Wunsch-Domains erkunden wir für die Zukunft.",
        tags: ["teilen", "domain"]
      },
      {
        question: "Was passiert mit meiner Adresse, wenn ich Freeshard verlasse?",
        answer: "Die automatisch zugewiesene Subdomain ist an unsere Infrastruktur gebunden und kann leider nicht mitgenommen werden. Was du mitnehmen kannst: deinen gesamten Shard – alle Daten und Einstellungen – als Export, den du auf einem eigenen Server unter deiner eigenen Domain betreiben kannst.",
        tags: ["portabilität", "domain", "kündigung"]
      },
      {
        id: "export",
        question: "Kann ich meinen Shard wirklich mitnehmen?",
        answer: "Ja, absolut. Das ist Teil unserer Philosophie der Unabhängigkeit. Wenn du Freeshard nicht mehr nutzen möchtest, kannst du über unseren Support einen Export deines gesamten Systems anfordern – inklusive aller Daten und Einstellungen – und ihn auf einem eigenen Server zu Hause oder bei einem anderen Anbieter betreiben. Ein Self-Service-Export ist für die Zukunft geplant.",
        tags: ["portabilität", "export", "unabhängigkeit"]
      },
      {
        question: "Kann ich mit einem exportierten Shard wieder zu euch zurück?",
        answer: "Das ist technisch leider nicht möglich, da wir die Integrität unserer Systeme gewährleisten müssen. Unser Tipp: Du kannst dir deinen Shard herunterladen, um den Export zu testen, und deinen Vertrag bei uns einfach weiterlaufen lassen. So hast du beides.",
        tags: ["portabilität", "export"]
      },
      {
        id: "privacy",
        question: "Was macht ihr mit meinen Daten?",
        answer: "Nichts, außer sie für dich zu speichern und bereitzustellen. Wir scannen keine Fotos, lesen keine Dokumente und verkaufen absolut nichts an Werbefirmen. Wir tun nur das, womit du uns explizit beauftragt hast: Hosting.",
        tags: ["datenschutz", "datensicherheit"]
      },
      {
        question: "Sind meine Daten verschlüsselt?",
        answer: "Ja, die Festplatten unserer Server sind verschlüsselt. Das bedeutet: Wenn jemand physisch die Festplatte stehlen würde, könnte er nichts damit anfangen. Es gibt jedoch aktuell keine Ende-zu-Ende-Verschlüsselung, bei der nur du den Schlüssel hast. Das ist nicht nur eine Einschränkung unsererseits – es ist eine grundlegende technische Grenze: Weil dein Shard echte Anwendungen ausführt (und nicht nur passiv Daten speichert), muss der Server deine Daten lesen und verarbeiten können, um zu funktionieren. Wahre Ende-zu-Ende-Verschlüsselung, bei der nur du den Schlüssel hältst, ist mit dem aktuellen Stand der Technik grundsätzlich nicht vereinbar damit, Software in deinem Auftrag auszuführen.",
        tags: ["sicherheit", "verschlüsselung"]
      },
      {
        question: "Könnt ihr auf meine Daten zugreifen?",
        answer: "Technisch gesehen: Ja, da wir das System für dich warten. Aber: Wir tun es nicht. Erstens widerspricht es unserer Ethik. Zweitens verbieten wir es uns selbst in unseren AGB. Drittens wäre es ein schwerer Verstoß gegen die DSGVO. Und viertens – und das ist für uns am wichtigsten – wäre der damit verbundene Vertrauensverlust das sofortige Ende für uns. Dein Vertrauen ist unser wichtigstes Gut.",
        tags: ["datenschutz", "sicherheit", "vertrauen"]
      },
      {
        question: "Könnt ihr meine Passwörter sehen?",
        answer: "Nein, niemals. Dein Passwort-Manager (Vaultwarden) verschlüsselt alle deine Daten bereits auf deinem Gerät (Handy oder Computer), bevor sie überhaupt an unseren Server gesendet werden. Wir speichern nur den verschlüsselten Datensalat. Ohne dein Master-Passwort – das nur du kennst – sind diese Daten für uns (und jeden anderen) absolut unlesbar.",
        tags: ["sicherheit", "verschlüsselung", "passwörter"]
      },
      {
        question: "Ich möchte meinen Shard trotzdem selbst verschlüsseln. Geht das?",
        answer: "Aktuell noch nicht. Wir hören aber genau auf unsere Community: Wenn sich viele Nutzer dieses Feature wünschen, werden wir prüfen, wie wir das technisch benutzerfreundlich umsetzen können.",
        tags: ["sicherheit", "verschlüsselung"]
      },
      {
        question: "Was passiert, wenn Polizei oder Gericht meine Daten anfordern?",
        answer: "Wir halten uns an geltendes Recht. Wenn eine behördliche Anfrage kommt, prüfen wir diese juristisch sehr genau. Nur wenn sie absolut rechtmäßig und unumgänglich ist, müssen wir ihr Folge leisten.",
        tags: ["recht", "datenschutz"]
      },
      {
        question: "Würde eine Ende-zu-Ende-Verschlüsselung mich davor schützen?",
        answer: "Jein. Selbst wenn wir Ende-zu-Ende verschlüsseln würden, könnten Behörden versuchen, uns zu zwingen, die Software so anzupassen, dass Daten im Moment des Zugriffs (wenn sie entschlüsselt sind) ausgeleitet werden. Wenn das deine Sorge ist, ist das Selbst-Hosten auf eigener Hardware der einzig sichere Weg. Konsequenterweise müsstest du dann aber auch jedes einzelne Update prüfen, ob darin nicht eine Hintertür versteckt wurde, die die Verschlüsselung aufbricht. Das betrifft übrigens nicht nur uns, sondern ausnahmslos alle Anbieter solcher Lösungen.",
        tags: ["recht", "verschlüsselung", "sicherheit"]
      },
      {
        question: "Es gab ein Urteil, dass OVH Daten an Kanada herausgeben muss. Sind meine Daten sicher?",
        answer: "Das ist ein berechtigter Punkt und wir beobachten den Fall genau. Sollte es sich wirklich so entwickeln, dass OVH in Europa durch das kanadische Gerichtsurteil gezwungen werden kann, europäische Daten herauszugeben, werden wir die Situation neu betrachten müssen. Allerdings ist hierbei das letzte Wort noch lange nicht gesprochen, da dieses Thema sowohl in Kanada als auch in Frankreich jeweils auf der Ebene der Regierung angekommen ist. So oder so wird hier nichts überraschend kommen, sondern sich mit langem Vorlauf ankündigen und wir werden entsprechend reagieren.",
        tags: ["recht", "serverstandort"]
      },
      {
        question: "Warum bietet ihr keine E-Mail- oder Kalender-Funktionen an?",
        answer: "E-Mail und Kalender sind eigentlich Kernfunktionen, die wir sehr gerne anbieten würden – der Grund, warum wir es nicht tun, ist rein technischer Natur. E-Mail-Hosting ist notorisch schwierig: E-Mails zuverlässig zuzustellen, ohne von großen Anbietern als Spam gefiltert zu werden, erfordert Infrastruktur und Reputationsmanagement, das schwer zu meistern ist. Beim Kalender ist das Problem ein anderes: Es gibt schlicht noch keine selbst-gehostete Kalender-Lösung, die wir für gut genug halten – das ist eine echte Lücke im Ökosystem. Wir behalten beide Bereiche im Blick und werden sie ergänzen, sobald wir sicher sind, dass wir es wirklich gut umsetzen können.",
        tags: ["apps", "roadmap"]
      },
      {
        question: "Warum bietet ihr kein Nextcloud an?",
        answer: "Es gibt bereits sehr viele spezialisierte Nextcloud-Anbieter am Markt. Wir schließen es für die Zukunft nicht aus, wollen aber erst einmal Alternativen bieten, die oft schlanker und schneller sind.",
        tags: ["apps"]
      },
      {
        id: "data-location",
        question: "Wo liegen meine Daten?",
        answer: "Dein Shard läuft auf OVH-Servern in der EU (Frankreich). Verschlüsselte Backups werden separat, ebenfalls in EU-Rechenzentren, gespeichert. Alle Daten unterliegen den strengen europäischen Datenschutzgesetzen (DSGVO).",
        tags: ["serverstandort", "EU", "DSGVO", "datenschutz"]
      }
    ]
  },
  contact: {
    title: "Kontakt",
    pageTitle: "Kontaktiere uns",
    description: "Hast du Fragen oder Anregungen? Wir freuen uns auf deine Nachricht. Fülle einfach das Formular aus und wir melden uns so schnell wie möglich bei dir.",
    form: {
      name: "Dein Name",
      email: "Deine E-Mail-Adresse",
      message: "Deine Nachricht",
      button: "Nachricht senden",
      successMessage: "Vielen Dank! Deine Nachricht wurde erfolgreich versendet."
    }
  },
  imprint: {
    title: "Impressum",
    pageTitle: "Impressum",
    contactLabel: "Angaben gemäß § 5 TMG:",
    address: "Good For Business UG (haftungsbeschränkt)<br>Schwanthalerstr. 123<br>80339 München",
    ceoLabel: "Vertreten durch:",
    ceoName: "Max von Tettenborn",
    contactInfoLabel: "Kontakt:",
    contactInfo: "E-Mail: contact@freeshard.net",
    registerLabel: "Registereintrag:",
    registerInfo: "Registergericht: Amtsgericht München<br>Registernummer: HRB 285507",
    vatLabel: "Umsatzsteuer-ID",
    vatInfo: "Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br>DE363918779",
    responsibleLabel: "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV",
    responsibleInfo: "Max von Tettenborn<br>Good For Business UG (haftungsbeschränkt)<br>Schwanthalerstr. 123<br>80339 München"
  },
  realityCheck: {
    teaser: "Reality Check: Big Tech vs. dein Shard",
    close: "Schließen",
    items: [
      {
        title: "Deine Daten",
        bigTechLabel: "Big Tech",
        bigTechText: "Deine Fotos, Dokumente und Nachrichten werden gescannt, analysiert und genutzt, um dein Profil zu erstellen.",
        freeshardLabel: "Dein Shard",
        freeshardText: "Deine Daten werden nur für dich gespeichert. Niemand liest mit. Nicht wir, nicht Algorithmen."
      },
      {
        title: "Deine Identität",
        bigTechLabel: "Big Tech",
        bigTechText: "Dutzende Konten, dutzende Passwörter. Jede Plattform kennt eine andere Version von dir.",
        freeshardLabel: "Dein Shard",
        freeshardText: "Eine Identität, ein Zugang. Dein Shard ist dein digitales Zuhause für alle Apps."
      },
      {
        title: "Deine Kontrolle",
        bigTechLabel: "Big Tech",
        bigTechText: "Konten werden gesperrt, Dienste abgeschaltet und deine Daten können über Nacht verschwinden.",
        freeshardLabel: "Dein Shard",
        freeshardText: "Du besitzt deinen Shard. Exportiere ihn jederzeit und nimm ihn überall hin mit."
      }
    ]
  },
  privacy: {
    title: "Datenschutzerklärung",
    pageTitle: "Datenschutzerklärung",
    placeholder: {
      heading: "Wichtiger Hinweis",
      text: "Dies ist ein Platzhalter. Eine umfassende und rechtssichere Datenschutzerklärung ist essenziell. Bitte lassen Sie Ihre Datenschutzerklärung von einem spezialisierten Anwalt erstellen, um alle Anforderungen der DSGVO und anderer relevanter Gesetze zu erfüllen.",
      topics: [
        { title: "1. Datenschutz auf einen Blick", content: "Allgemeine Hinweise..." },
        { title: "2. Hosting", content: "Details zu unserem Hosting-Anbieter und den Server-Log-Dateien..." },
        { title: "3. Allgemeine Hinweise und Pflichtinformationen", content: "Verantwortliche Stelle, Widerruf Ihrer Einwilligung, etc...." },
        { title: "4. Datenerfassung auf dieser Website", content: "Cookies, Kontaktformular, etc...." }
      ]
    }
  },
  signup: {
    trialTitle: "Erstelle dein Test-Shard",
    trialSubtitle: "Dein Test-Shard wird nach 24 Stunden automatisch gelöscht.",
    activateTitle: "Erstelle dein Shard",
    codePlaceholder: "Code eingeben",
    codeChecking: "Prüfe Code...",
    codeValid: "Code ist gültig.",
    codeInvalid: "Code ist ungültig oder bereits verwendet.",
    codeNotFound: "Dieser Code existiert nicht.",
    codeInactive: "Dieser Code ist nicht aktiv.",
    codeExhausted: "Dieser Code wurde bereits vollständig eingelöst.",
    emailPlaceholder: "Deine E-Mail-Adresse",
    emailHint: "Wir senden dir den Zugang zum Shard und Status-Updates. Deine E-Mail wird nur so lange gespeichert, wie dein Shard existiert.",
    emailInvalid: "Bitte gib eine gültige E-Mail-Adresse ein.",
    submit: "Shard erstellen",
    submitting: "Erstelle...",
    shardReady: "Wir haben dieses Shard für dich erstellt:",
    pair: "Diesen Browser koppeln",
    manualPairingHint: "Falls die Weiterleitung nicht funktioniert, gib diesen Kopplungscode auf dem Kopplungsbildschirm deines Shards ein:",
    noStandby: "Aktuell sind keine neuen Shards verfügbar. Bitte versuche es in ein paar Minuten erneut.",
    reset: "Zurück",
    legalConsentLabel: `Ich akzeptiere die <a href="${BASE_URL}/de/agb/\" target=\"_blank\" rel=\"noopener\">AGB</a> und die <a href="${BASE_URL}/de/datenschutz/\" target=\"_blank\" rel=\"noopener\">Datenschutzerklärung</a>.`,
    legalConsentRequired: "Bitte akzeptiere die AGB und die Datenschutzerklärung.",
    earlyStartNotice: "Mit Klick auf „Shard erstellen\" verlange ich den sofortigen Leistungsbeginn und bestätige, dass mein Widerrufsrecht mit vollständiger Vertragsausführung erlischt."
  }
};
