import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { envFile } from '../file-models/env'

export const current = VersionInfo.of({
  version: '0.2.5:14',
  releaseNotes: {
    en_US: `Updated the Public Pool UI to the latest upstream and added a TLS stratum endpoint.

- Redesigned mining dashboard, worker, and connection screens.
- The connection screen now lists multiple stratum endpoints (V1, V1 + TLS, V2) with one-click copy.
- The Stratum interface now also serves TLS (stratum+tls) on port 4333, terminated by StartOS.
- The Configure action now lets you pick the display address for both the plain and TLS stratum endpoints; both default to the device's .local hostname.

Full changes: https://github.com/benjamin-wilson/public-pool-ui/compare/6542500...aaab760`,
    es_ES: `Se actualizó la interfaz de Public Pool a la última versión upstream y se añadió un punto de conexión stratum con TLS.

- Se rediseñaron las pantallas de panel de minería, trabajadores y conexión.
- La pantalla de conexión ahora muestra varios puntos de conexión stratum (V1, V1 + TLS, V2) con copia en un clic.
- La interfaz Stratum ahora también ofrece TLS (stratum+tls) en el puerto 4333, terminado por StartOS.
- La acción Configurar ahora permite elegir la dirección mostrada para los puntos de conexión stratum normal y TLS; ambos usan por defecto el nombre de host .local del dispositivo.

Cambios completos: https://github.com/benjamin-wilson/public-pool-ui/compare/6542500...aaab760`,
    de_DE: `Die Public-Pool-Oberfläche wurde auf den neuesten Upstream-Stand aktualisiert und ein TLS-Stratum-Endpunkt hinzugefügt.

- Mining-Dashboard, Worker- und Verbindungsbildschirme wurden neu gestaltet.
- Der Verbindungsbildschirm listet jetzt mehrere Stratum-Endpunkte (V1, V1 + TLS, V2) mit Kopieren per Klick auf.
- Die Stratum-Schnittstelle bietet jetzt zusätzlich TLS (stratum+tls) auf Port 4333, terminiert durch StartOS.
- Mit der Aktion „Konfigurieren" lässt sich nun die angezeigte Adresse für den normalen und den TLS-Stratum-Endpunkt wählen; beide verwenden standardmäßig den .local-Hostnamen des Geräts.

Vollständige Änderungen: https://github.com/benjamin-wilson/public-pool-ui/compare/6542500...aaab760`,
    pl_PL: `Zaktualizowano interfejs Public Pool do najnowszej wersji upstream i dodano punkt końcowy stratum z TLS.

- Przeprojektowano ekrany panelu kopania, pracowników i połączenia.
- Ekran połączenia pokazuje teraz wiele punktów końcowych stratum (V1, V1 + TLS, V2) z kopiowaniem jednym kliknięciem.
- Interfejs Stratum oferuje teraz także TLS (stratum+tls) na porcie 4333, z terminacją po stronie StartOS.
- Akcja Konfiguruj pozwala teraz wybrać wyświetlany adres dla zwykłego i TLS punktu końcowego stratum; oba domyślnie używają nazwy hosta .local urządzenia.

Pełne zmiany: https://github.com/benjamin-wilson/public-pool-ui/compare/6542500...aaab760`,
    fr_FR: `Mise à jour de l'interface de Public Pool vers la dernière version upstream et ajout d'un point de terminaison stratum TLS.

- Refonte des écrans du tableau de bord de minage, des workers et de la connexion.
- L'écran de connexion répertorie désormais plusieurs points de terminaison stratum (V1, V1 + TLS, V2) avec copie en un clic.
- L'interface Stratum sert désormais aussi TLS (stratum+tls) sur le port 4333, terminé par StartOS.
- L'action Configurer permet désormais de choisir l'adresse affichée pour les points de terminaison stratum simple et TLS ; les deux utilisent par défaut le nom d'hôte .local de l'appareil.

Modifications complètes : https://github.com/benjamin-wilson/public-pool-ui/compare/6542500...aaab760`,
  },
  migrations: {
    up: async ({ effects }) => {
      const configYaml:
        | {
            'pool-identifier': string
          }
        | undefined = await readFile(
        '/media/startos/volumes/main/start9/config.yaml',
        'utf-8',
      ).then(YAML.parse, () => undefined)

      if (configYaml) {
        const POOL_IDENTIFIER = configYaml['pool-identifier'] ?? 'Public-Pool'

        await envFile.merge(effects, { POOL_IDENTIFIER })

        // remove old start9 dir
        await rm('/media/startos/volumes/main/start9', {
          recursive: true,
        }).catch(console.error)
      }
    },
    down: IMPOSSIBLE,
  },
})
