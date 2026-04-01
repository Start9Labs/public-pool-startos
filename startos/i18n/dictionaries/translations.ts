import { LangDict } from './default'

export default {
  es_ES: {
    // main.ts
    1: 'El servidor Stratum está listo',
    2: 'El servidor Stratum no está listo',
    3: 'La interfaz web está lista',
    4: 'La interfaz web no está lista',
    5: 'Interfaz web',

    // interfaces.ts
    100: 'Interfaz web',
    101: 'Interfaz web personal para Public Pool',
    102: 'Servidor Stratum',
    103: 'Tu servidor Stratum',

    // actions/config.ts
    200: 'Identificador del pool',
    201: 'El identificador del pool a incluir en las transacciones Coinbase',
    202: 'URL de visualización del servidor',
    203: 'La dirección IP o nombre de host a mostrar en tu página principal de Public Pool',
    204: 'Configurar',
    205: 'Personaliza tu instancia de Public Pool',

    // manifest/index.ts
    400: 'Se usa para suscribirse a nuevos eventos de bloques',
  },
  de_DE: {
    // main.ts
    1: 'Stratum-Server ist bereit',
    2: 'Stratum-Server ist nicht bereit',
    3: 'Die Weboberfläche ist bereit',
    4: 'Die Weboberfläche ist nicht bereit',
    5: 'Weboberfläche',

    // interfaces.ts
    100: 'Weboberfläche',
    101: 'Persönliche Weboberfläche für Public Pool',
    102: 'Stratum-Server',
    103: 'Ihr Stratum-Server',

    // actions/config.ts
    200: 'Pool-Identifikator',
    201: 'Der Pool-Identifikator, der in den Coinbase-Transaktionen enthalten sein soll',
    202: 'Server-Anzeige-URL',
    203: 'Die IP-Adresse oder der Hostname, die auf Ihrer Public Pool-Homepage angezeigt werden sollen',
    204: 'Konfigurieren',
    205: 'Passen Sie Ihre Public Pool-Instanz an',

    // manifest/index.ts
    400: 'Wird verwendet, um neue Block-Ereignisse zu abonnieren',
  },
  pl_PL: {
    // main.ts
    1: 'Serwer Stratum jest gotowy',
    2: 'Serwer Stratum nie jest gotowy',
    3: 'Interfejs webowy jest gotowy',
    4: 'Interfejs webowy nie jest gotowy',
    5: 'Interfejs webowy',

    // interfaces.ts
    100: 'Interfejs webowy',
    101: 'Osobisty interfejs webowy dla Public Pool',
    102: 'Serwer Stratum',
    103: 'Twój serwer Stratum',

    // actions/config.ts
    200: 'Identyfikator puli',
    201: 'Identyfikator puli do uwzględnienia w transakcjach Coinbase',
    202: 'URL wyświetlania serwera',
    203: 'Adres IP lub nazwa hosta do wyświetlenia na stronie głównej twojego Public Pool',
    204: 'Konfiguruj',
    205: 'Dostosuj swoją instancję Public Pool',

    // manifest/index.ts
    400: 'Używany do subskrypcji nowych zdarzeń bloków',
  },
  fr_FR: {
    // main.ts
    1: 'Le serveur Stratum est prêt',
    2: "Le serveur Stratum n'est pas prêt",
    3: "L'interface web est prête",
    4: "L'interface web n'est pas prête",
    5: 'Interface web',

    // interfaces.ts
    100: 'Interface web',
    101: 'Interface web personnelle pour Public Pool',
    102: 'Serveur Stratum',
    103: 'Votre serveur Stratum',

    // actions/config.ts
    200: 'Identifiant du pool',
    201: 'L\'identifiant du pool à inclure dans les transactions Coinbase',
    202: 'URL d\'affichage du serveur',
    203: 'L\'adresse IP ou le nom d\'hôte à afficher sur votre page d\'accueil Public Pool',
    204: 'Configurer',
    205: 'Personnalisez votre instance Public Pool',

    // manifest/index.ts
    400: 'Utilisé pour s\'abonner aux nouveaux événements de blocs',
  },
} satisfies Record<string, LangDict>
