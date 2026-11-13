export type PillIcon =
  | 'cloud'
  | 'settings'
  | 'users'
  | 'shield'
  | 'help'
  | 'mail'
  | 'link'
  | 'alert'
  | 'key'
  | 'smartphone'
  | 'lock'
  | 'eye'
  | 'trash'
  | 'camera'
  | 'bell'
  | 'file'
  | 'face'
  | 'clock'
  | 'userx'
  | 'pin'
  | 'message'
  | 'bot'
  | 'fingerprint'
  | 'check'
  | 'calendar'
  | 'phone'
  | 'audio'
  | 'search'

export type PillCategory = 'cuentas' | 'ia-fraude' | 'privacidad'

export const pillCategories: { id: PillCategory; label: string }[] = [
  { id: 'cuentas', label: 'Cuentas y claves' },
  { id: 'ia-fraude', label: 'IA y fraude' },
  { id: 'privacidad', label: 'Privacidad' },
]

export type PillSlide = {
  heading: string
  body: string
  icon: PillIcon
  example?: { tone: 'bad' | 'good'; text: string }
}

export type Pill = {
  id: string
  title: string
  summary: string
  category: PillCategory
  icon: PillIcon
  seconds: number
  featured?: boolean
  slides: PillSlide[]
  next?: { label: string; href: string }
}

export function formatDuration(seconds: number) {
  return seconds >= 60 ? '1 min' : `${seconds} s`
}

export const pills: Pill[] = [
  {
    id: 'ia',
    title: 'Tus datos y fotos en la Inteligencia Artificial',
    summary: 'Qué pasa con lo que subes a un chat o generador de imágenes.',
    category: 'ia-fraude',
    icon: 'bot',
    seconds: 60,
    featured: true,
    slides: [
      {
        icon: 'cloud',
        heading: 'Lo que subes, se queda',
        body: 'Muchas herramientas de IA guardan tus fotos y textos para entrenar sus modelos.',
      },
      {
        icon: 'settings',
        heading: 'Revisa la configuración',
        body: 'Busca la opción “No usar mis datos para entrenar” y actívala en cada servicio.',
        example: { tone: 'good', text: 'Ajustes › Datos › Mejorar el modelo para todos: Desactivado' },
      },
      {
        icon: 'users',
        heading: 'Fotos de otras personas, no',
        body: 'Si subes la foto de alguien sin su permiso, su cara también acaba en la IA.',
      },
      {
        icon: 'file',
        heading: 'Documentos y salud, nunca',
        body: 'No pegues DNI, contratos ni informes médicos en un chat de IA.',
        example: { tone: 'bad', text: 'Resume este informe médico de mi madre: nombre, DNI, diagnóstico…' },
      },
      {
        icon: 'help',
        heading: 'Pregúntate antes de subir',
        body: '¿Me importaría que esto lo viera un desconocido? Si la respuesta es sí, no lo subas.',
      },
    ],
  },
  {
    id: 'phishing',
    title: 'Cómo detectar un mensaje fraudulento',
    summary: 'Cuatro señales para frenar el phishing por correo, SMS o WhatsApp.',
    category: 'ia-fraude',
    icon: 'mail',
    seconds: 60,
    featured: true,
    slides: [
      {
        icon: 'clock',
        heading: 'Urgencia sospechosa',
        body: 'Si un mensaje te mete prisa para actuar, desconfía. Quien estafa necesita que no pienses.',
        example: { tone: 'bad', text: 'URGENTE: tu cuenta será bloqueada en 24 h. Verifica ahora.' },
      },
      {
        icon: 'mail',
        heading: 'Mira el remitente',
        body: 'Comprueba la dirección completa, no solo el nombre visible.',
        example: { tone: 'bad', text: 'Soporte Banco <atencion@banc0-seguro.com>' },
      },
      {
        icon: 'link',
        heading: 'No pulses enlaces',
        body: 'Entra siempre desde la app oficial o escribiendo tú la dirección.',
        example: { tone: 'bad', text: 'Tu paquete está retenido: bit.ly/ver-paquete' },
      },
      {
        icon: 'lock',
        heading: 'Nadie serio pide códigos',
        body: 'Ningún banco ni servicio te pedirá contraseñas ni códigos por mensaje.',
        example: { tone: 'bad', text: 'Dime el código que te acaba de llegar por SMS.' },
      },
      {
        icon: 'phone',
        heading: 'Si dudas, comprueba',
        body: 'Llama al número oficial de la empresa. Después, reenvía el aviso y bloquea al remitente.',
      },
    ],
  },
  {
    id: '2fa',
    title: 'Verificación en dos pasos, explicada',
    summary: 'Una segunda llave que protege tus cuentas aunque se filtre la contraseña.',
    category: 'cuentas',
    icon: 'shield',
    seconds: 55,
    featured: true,
    slides: [
      {
        icon: 'key',
        heading: 'Una segunda llave',
        body: 'Además de tu contraseña, se pide un código que solo tú recibes.',
      },
      {
        icon: 'smartphone',
        heading: 'Mejor con una app',
        body: 'Las apps de autenticación son más seguras que los SMS, que pueden interceptarse.',
      },
      {
        icon: 'alert',
        heading: 'El código no se comparte',
        body: 'Si alguien te lo pide, es un intento de acceso a tu cuenta.',
        example: { tone: 'bad', text: 'Hola, te enviamos un código por error, ¿me lo puedes reenviar?' },
      },
      {
        icon: 'file',
        heading: 'Guarda los códigos de recuperación',
        body: 'Anótalos en un lugar seguro. Te salvarán si pierdes el teléfono.',
      },
      {
        icon: 'check',
        heading: 'Empieza por lo importante',
        body: 'Actívala primero en tu correo y en tu banco. Son la puerta de entrada al resto.',
      },
    ],
  },
  {
    id: 'deepfakes',
    title: 'Deepfakes: voces y vídeos falsos',
    summary: 'Cómo comprobar que quien te llama o te escribe es quien dice ser.',
    category: 'ia-fraude',
    icon: 'audio',
    seconds: 60,
    featured: true,
    slides: [
      {
        icon: 'audio',
        heading: 'Una voz se copia en segundos',
        body: 'Con unos pocos segundos de audio, la IA puede imitar la voz de cualquier persona.',
      },
      {
        icon: 'phone',
        heading: 'La llamada de un familiar',
        body: 'Una voz conocida, una emergencia y dinero urgente: es una estafa muy habitual.',
        example: { tone: 'bad', text: 'Mamá, he tenido un accidente. Necesito dinero ya. No se lo digas a nadie.' },
      },
      {
        icon: 'users',
        heading: 'Acordad una palabra clave',
        body: 'Elegid en familia una palabra secreta para confirmar identidades en una emergencia real.',
      },
      {
        icon: 'face',
        heading: 'Fíjate en los detalles',
        body: 'Parpadeo raro, labios que no encajan, voz demasiado plana o poca calidad de imagen.',
      },
      {
        icon: 'eye',
        heading: 'Verifica por otro canal',
        body: 'Cuelga y llama tú al número de siempre antes de enviar dinero o datos.',
      },
      {
        icon: 'lock',
        heading: 'Cuida tus audios y vídeos',
        body: 'Cuanto más público es tu contenido, más fácil es imitarte.',
      },
    ],
  },
  {
    id: 'cuentas-sin-uso',
    title: 'Cuentas y apps que ya no usas',
    summary: 'Cada cuenta olvidada es una puerta abierta. Aprende a cerrarlas.',
    category: 'cuentas',
    icon: 'userx',
    seconds: 55,
    slides: [
      {
        icon: 'userx',
        heading: 'Cuentas olvidadas, riesgo real',
        body: 'Si un servicio que ya no usas sufre una filtración, tus datos siguen ahí.',
      },
      {
        icon: 'search',
        heading: 'Haz un inventario',
        body: 'Busca en tu correo mensajes antiguos de bienvenida para recordar dónde te registraste.',
        example: { tone: 'good', text: 'Buscar: “Bienvenido”, “Confirma tu cuenta”, “Gracias por registrarte”' },
      },
      {
        icon: 'trash',
        heading: 'Elimina, no solo desinstales',
        body: 'Borrar la app no borra tu cuenta. Busca “Eliminar cuenta” en los ajustes del servicio.',
      },
      {
        icon: 'link',
        heading: 'Revisa los accesos con Google',
        body: 'Entra en los ajustes de seguridad de tu cuenta y retira las apps conectadas que ya no uses.',
      },
      {
        icon: 'calendar',
        heading: 'Repite cada seis meses',
        body: 'Una revisión corta cada medio año evita que el problema vuelva a crecer.',
      },
    ],
    next: { label: 'Ir a Limpieza', href: '/limpieza' },
  },
  {
    id: 'contrasenas',
    title: 'Contraseñas seguras: 5 reglas fundamentales',
    summary: 'Cinco hábitos que evitan la mayoría de accesos no autorizados.',
    category: 'cuentas',
    icon: 'key',
    seconds: 60,
    slides: [
      {
        icon: 'key',
        heading: 'Largas mejor que raras',
        body: 'Usa frases de cuatro o más palabras: son fáciles de recordar y difíciles de adivinar.',
        example: { tone: 'good', text: 'caracol-azul-bicicleta-nube' },
      },
      {
        icon: 'lock',
        heading: 'Una por cuenta',
        body: 'Nunca repitas contraseñas. Si una se filtra, el resto sigue a salvo.',
      },
      {
        icon: 'smartphone',
        heading: 'Usa un gestor',
        body: 'Un gestor de contraseñas las crea y las recuerda por ti.',
      },
      {
        icon: 'shield',
        heading: 'Activa la verificación',
        body: 'La verificación en dos pasos frena casi todos los accesos no autorizados.',
      },
      {
        icon: 'bell',
        heading: 'Cámbiala tras una filtración',
        body: 'Si recibes una alerta, cambia la clave de inmediato y las que se parezcan.',
      },
    ],
  },
  {
    id: 'filtraciones',
    title: 'Si tus datos aparecen en una filtración',
    summary: 'Qué hacer paso a paso cuando te llega una alerta de brecha de datos.',
    category: 'cuentas',
    icon: 'bell',
    seconds: 60,
    slides: [
      {
        icon: 'shield',
        heading: 'No es culpa tuya',
        body: 'Las filtraciones las sufren las empresas. Lo importante es reaccionar pronto.',
      },
      {
        icon: 'search',
        heading: 'Mira qué datos se filtraron',
        body: 'No es lo mismo un correo que una contraseña o un teléfono. Cada dato pide una medida.',
      },
      {
        icon: 'key',
        heading: 'Cambia las claves',
        body: 'Cambia la contraseña de ese servicio y de cualquier otro donde la repitieras.',
      },
      {
        icon: 'check',
        heading: 'Activa la verificación en dos pasos',
        body: 'Así, aunque alguien tenga tu clave, no podrá entrar.',
      },
      {
        icon: 'mail',
        heading: 'Cuidado en los próximos meses',
        body: 'Tras una filtración aumentan los mensajes fraudulentos que usan tus datos reales.',
        example: { tone: 'bad', text: 'Hola Lucía, detectamos un acceso a tu cuenta. Confirma tu identidad aquí.' },
      },
    ],
    next: { label: 'Ver mis alertas', href: '/alertas' },
  },
  {
    id: 'permisos',
    title: 'Permisos de apps y localización',
    summary: 'Decide qué ve cada app de tu cámara, micrófono y ubicación.',
    category: 'privacidad',
    icon: 'pin',
    seconds: 55,
    slides: [
      {
        icon: 'pin',
        heading: 'Solo mientras se usa',
        body: 'Concede la ubicación únicamente cuando la app esté abierta.',
      },
      {
        icon: 'calendar',
        heading: 'Revisa cada mes',
        body: 'En Ajustes › Privacidad verás qué apps acceden a tu cámara, micrófono y ubicación.',
      },
      {
        icon: 'eye',
        heading: 'Ubicación aproximada',
        body: 'Para el tiempo o las noticias no hace falta tu ubicación exacta.',
      },
      {
        icon: 'camera',
        heading: 'Cámara y micrófono, con motivo',
        body: 'Una linterna o un juego no necesitan tu micrófono. Si lo piden, deniégalo.',
        example: { tone: 'bad', text: 'Linterna LED quiere acceder a tus contactos y a tu micrófono.' },
      },
      {
        icon: 'trash',
        heading: 'Quita lo que no uses',
        body: 'Una app sin uso con permisos concedidos sigue recogiendo información.',
      },
    ],
    next: { label: 'Ir a Limpieza', href: '/limpieza' },
  },
  {
    id: 'politicas',
    title: 'Entender una política de privacidad',
    summary: 'Cómo leer las condiciones en un minuto y detectar lo importante.',
    category: 'privacidad',
    icon: 'file',
    seconds: 60,
    slides: [
      {
        icon: 'file',
        heading: 'Casi nadie las lee',
        body: 'Son largas y técnicas, y por eso aceptamos cosas sin saber a qué.',
      },
      {
        icon: 'search',
        heading: 'Busca cuatro palabras',
        body: 'Usa el buscador del texto: “terceros”, “publicidad”, “conservamos” y “compartimos”.',
      },
      {
        icon: 'users',
        heading: 'Quién más recibe tus datos',
        body: 'Si se comparten con terceros o socios publicitarios, tu información sale de la app.',
        example: { tone: 'bad', text: 'Podremos compartir tus datos con empresas colaboradoras con fines comerciales.' },
      },
      {
        icon: 'clock',
        heading: 'Cuánto tiempo los guardan',
        body: 'Busca si se borran al eliminar tu cuenta o si se conservan durante años.',
      },
      {
        icon: 'bot',
        heading: 'Pide que te lo expliquen',
        body: 'Pega el texto en el asistente y te lo resumirá con palabras sencillas.',
      },
    ],
    next: { label: 'Preguntar al asistente', href: '/asistente' },
  },
  {
    id: 'mensajeria',
    title: 'WhatsApp y Telegram: privacidad básica',
    summary: 'Quién puede ver tu foto, tu estado y añadirte a grupos.',
    category: 'privacidad',
    icon: 'message',
    seconds: 60,
    slides: [
      {
        icon: 'face',
        heading: 'Tu foto de perfil',
        body: 'Déjala visible solo para tus contactos. Cualquiera podría guardarla o usarla.',
      },
      {
        icon: 'users',
        heading: 'Quién puede añadirte a grupos',
        body: 'Limítalo a tus contactos para evitar grupos de estafas o spam.',
      },
      {
        icon: 'clock',
        heading: 'Hora de conexión y estado',
        body: 'Ocultar tu última conexión reduce lo que otros saben de tus rutinas.',
      },
      {
        icon: 'smartphone',
        heading: 'Dispositivos vinculados',
        body: 'Revisa en Ajustes qué ordenadores tienen abierta tu sesión y cierra los que no reconozcas.',
      },
      {
        icon: 'link',
        heading: 'Enlaces y códigos QR',
        body: 'No escanees códigos que te lleguen sin pedirlos: pueden vincular tu cuenta a otro dispositivo.',
      },
    ],
    next: { label: 'Revisar sesiones', href: '/limpieza' },
  },
  {
    id: 'huella-publica',
    title: 'Lo que publicas deja huella',
    summary: 'Fotos, comentarios y perfiles públicos: qué ve cualquiera de ti.',
    category: 'privacidad',
    icon: 'fingerprint',
    seconds: 55,
    slides: [
      {
        icon: 'fingerprint',
        heading: 'Casi nada se borra del todo',
        body: 'Lo que publicas puede copiarse o archivarse, incluso si luego lo eliminas.',
      },
      {
        icon: 'camera',
        heading: 'Las fotos cuentan más de lo que ves',
        body: 'Pueden mostrar tu casa, tu rutina o tu ubicación exacta.',
      },
      {
        icon: 'eye',
        heading: 'Perfil público o privado',
        body: 'Si no necesitas que te vea todo el mundo, pásalo a privado.',
      },
      {
        icon: 'search',
        heading: 'Búscate a ti mismo',
        body: 'Escribe tu nombre en un buscador y mira qué aparece: es lo que verá un desconocido.',
      },
      {
        icon: 'trash',
        heading: 'Limpia publicaciones antiguas',
        body: 'Elimina o archiva lo que ya no te represente.',
      },
    ],
    next: { label: 'Ver mi huella digital', href: '/huella' },
  },
]

export const featuredPills = pills.filter((pill) => pill.featured)
