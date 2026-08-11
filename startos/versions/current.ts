import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.2.5:23',
  releaseNotes: {
    en_US: `Two fixes around the values Public Pool reads at startup.

The pool address shown in the web interface is written into the interface itself each time the service starts. That was done through a shell command that treated the address as part of the command rather than as text, so an address containing a slash — anything written as a URL, for instance — could corrupt the page it was being written into. It is now inserted as plain text.

The pool also honours a developer-fee address that this package never sets, and pays 1.5% of a found block to it once a miner reaches 50 TH/s. Left unset, as it has always been here, the miner receives everything — but the setting is read from a file on the service's data volume, so one arriving by another route, such as a restored backup, would have been used without ever being shown to you. It is now held empty, and reset on every start.`,
    es_ES: `Dos correcciones en los valores que Public Pool lee al iniciarse.

La dirección del pool que se muestra en la interfaz web se escribe en la propia interfaz cada vez que el servicio arranca. Eso se hacía mediante un comando de shell que trataba la dirección como parte del comando y no como texto, de modo que una dirección con una barra —por ejemplo, cualquier cosa escrita como URL— podía corromper la página en la que se estaba escribiendo. Ahora se inserta como texto sin más.

El pool también respeta una dirección de comisión para el desarrollador que este paquete nunca establece, y le paga el 1,5 % de un bloque encontrado cuando un minero alcanza los 50 TH/s. Sin establecer, como siempre ha estado aquí, el minero lo recibe todo; pero el ajuste se lee de un archivo del volumen de datos del servicio, así que uno que llegara por otra vía, como una copia de seguridad restaurada, se habría utilizado sin mostrárselo nunca. Ahora se mantiene vacío y se restablece en cada arranque.`,
    de_DE: `Zwei Korrekturen bei den Werten, die Public Pool beim Start liest.

Die in der Weboberfläche angezeigte Pool-Adresse wird bei jedem Start des Dienstes in die Oberfläche selbst geschrieben. Das geschah über einen Shell-Befehl, der die Adresse als Teil des Befehls statt als Text behandelte, sodass eine Adresse mit einem Schrägstrich — etwa alles, was wie eine URL geschrieben ist — die Seite beschädigen konnte, in die sie geschrieben wurde. Sie wird jetzt als reiner Text eingefügt.

Der Pool berücksichtigt außerdem eine Entwicklergebühr-Adresse, die dieses Paket nie setzt, und zahlt ihr 1,5 % eines gefundenen Blocks, sobald ein Miner 50 TH/s erreicht. Ist sie nicht gesetzt — wie hier seit jeher —, erhält der Miner alles; die Einstellung wird jedoch aus einer Datei auf dem Datenvolume des Dienstes gelesen, sodass ein auf anderem Weg dorthin gelangter Wert, etwa durch eine wiederhergestellte Sicherung, verwendet worden wäre, ohne Ihnen je angezeigt zu werden. Sie wird nun leer gehalten und bei jedem Start zurückgesetzt.`,
    pl_PL: `Dwie poprawki dotyczące wartości, które Public Pool odczytuje przy starcie.

Adres puli pokazywany w interfejsie webowym jest zapisywany w samym interfejsie przy każdym uruchomieniu usługi. Robiono to poleceniem powłoki, które traktowało adres jako część polecenia, a nie jako tekst, więc adres zawierający ukośnik — na przykład cokolwiek zapisanego jako URL — mógł uszkodzić stronę, do której był wpisywany. Teraz jest wstawiany jako zwykły tekst.

Pula honoruje też adres opłaty deweloperskiej, którego ten pakiet nigdy nie ustawia, i wypłaca na niego 1,5% znalezionego bloku, gdy koparka osiągnie 50 TH/s. Nieustawiony — jak zawsze tutaj było — oznacza, że koparka dostaje wszystko; ustawienie jest jednak odczytywane z pliku na wolumenie danych usługi, więc wartość, która trafiłaby tam inną drogą, na przykład przez przywróconą kopię zapasową, zostałaby użyta, nigdy Ci się nie pokazując. Teraz jest utrzymywany jako pusty i resetowany przy każdym starcie.`,
    fr_FR: `Deux corrections sur les valeurs que Public Pool lit au démarrage.

L'adresse du pool affichée dans l'interface web est écrite dans l'interface elle-même à chaque démarrage du service. Cela passait par une commande shell qui traitait l'adresse comme une partie de la commande plutôt que comme du texte : une adresse contenant une barre oblique — tout ce qui est écrit sous forme d'URL, par exemple — pouvait donc corrompre la page dans laquelle elle était écrite. Elle est désormais insérée comme du texte ordinaire.

Le pool honore par ailleurs une adresse de frais de développement que ce paquet ne définit jamais, et lui verse 1,5 % d'un bloc trouvé dès qu'un mineur atteint 50 TH/s. Non définie, comme cela a toujours été le cas ici, le mineur reçoit tout ; mais le réglage est lu dans un fichier du volume de données du service, si bien qu'une valeur arrivée par une autre voie, telle qu'une sauvegarde restaurée, aurait été utilisée sans jamais vous être montrée. Elle est maintenant maintenue vide et réinitialisée à chaque démarrage.`,
  },
  migrations: {},
})
