# Memoria de mejoras de usabilidad y accesibilidad — Ctrl+Me v2.0

**Fecha:** 13 de noviembre de 2026

**Alcance:** ajustes incrementales de interacción y semántica; se conserva el diseño visual general.

> **Trazabilidad:** para esta memoria se toma como v1.0 el estado del código inspeccionado antes de esta intervención. No se encontró una etiqueta o compilación archivada de v1.0 que permita comparar cada pantalla completa; por tanto, se documentan únicamente las diferencias comprobables incorporadas ahora y se distingue lo que ya existía.

## Usabilidad

Se organizan las mejoras conforme a los tres ejes de ISO 9241-11 —eficacia, eficiencia y satisfacción— y se relacionan con los subprincipios de la lista, como visibilidad del estado, prevención y recuperación de errores, control del usuario, reconocimiento y consistencia. La intención no fue rediseñar el prototipo, sino reducir dudas y errores dentro de los flujos actuales.

### 1. Eficacia: completar la tarea correctamente

- **Visibilidad del estado del sistema (Nielsen: heurística 1; Shneiderman: retroalimentación):** responde a «¿qué está pasando?» y «¿ya terminó?». Cuando una tarea tiene varios pasos o tarda, no basta con que la aplicación cambie internamente: debe mostrar dónde está la persona, qué está ocurriendo y cuál fue el resultado. En Ctrl+Me, «Paso X de 3» indica la etapa; durante el análisis se comunica cuántas comprobaciones van y cuál está activa; al terminar, aparece «Análisis completado» y se habilita «Ver mis resultados». Los contadores de alertas y evaluación y los mensajes del asistente también anuncian sus cambios. **Elementos que lo garantizan:** contador «Paso X de 3», texto de progreso y nombre de la comprobación, confirmación final, botón «Ver mis resultados» y regiones `role="status"` / `aria-live="polite"`. **Impacto:** la persona no tiene que adivinar si su acción se registró, si el sistema sigue trabajando o si debe volver a pulsar; esto reduce la incertidumbre y las acciones repetidas. La información se expresa con texto, no solo con color o movimiento.
- **Prevenir el error y facilitar su corrección (Nielsen: heurísticas 5 y 9):** antes de enviar, las etiquetas y el texto de consentimiento explican qué se pide; al enviar, la validación detiene el avance si el correo no es válido o falta el consentimiento. Si hay un error, la interfaz lo nombra con palabras, marca el control con `aria-invalid`, asocia la explicación mediante `aria-describedby` y lleva el foco al primer campo que hay que corregir. **Elementos que lo garantizan:** etiqueta «Correo electrónico», mensaje de error con una indicación de formato, checkbox con etiqueta y texto de permiso, y acción «Enviar código». **Impacto:** la persona entiende tanto por qué no pudo avanzar como qué debe hacer para continuar; no necesita descubrir el problema por ensayo y error ni localizarlo visualmente.
> **Nota sobre «cierre de una tarea»:** la versión anterior usaba ese rótulo para una idea relacionada con la regla 4 de Shneiderman («diseñar los diálogos para que produzcan un cierre»), no con una heurística de Nielsen ni con un principio WAI. En este prototipo, la confirmación «Análisis completado» y la acción «Ver mis resultados» ya son ejemplos de **visibilidad del estado del sistema** (Nielsen, heurística 1); por eso las integro allí y retiro el apartado separado para no presentar el mismo efecto dos veces.

### 2. Eficiencia: reducir esfuerzo, recuerdo y pasos repetidos

- **Reconocer antes que recordar (Nielsen: heurística 6):** cada etapa conserva un título, instrucciones y posición dentro del flujo. Los cambios de etapa actualizan el título de documento y trasladan el foco al encabezado de la nueva etapa. **Elementos que lo garantizan:** encabezados `h1`, contador «Paso X de 3» y título del documento actualizado a partir del encabezado. **Impacto:** se conserva el contexto al avanzar, retroceder o cambiar de ruta, y se evita tener que deducir dónde se encuentra el usuario.
- **Control y libertad del usuario (Nielsen: heurística 3):** el botón «Volver» sigue disponible y el código de verificación permanece en memoria al regresar desde el paso de conexión. **Elementos que lo garantizan:** controles «Volver» y «Cambiar correo», y estado del código mantenido en el flujo padre. **Impacto:** se puede corregir o revisar una etapa sin volver a escribir el código ya introducido. No se guarda ese valor en almacenamiento persistente.
- **Tamaño y acceso a acciones frecuentes:** se elevan a 48 px los botones secundarios del tamaño `touch-sm`, las acciones «Volver» y los enlaces secundarios del resumen; la navegación móvil conserva objetivos de 56 px y la navegación lateral de 48 px. **Elementos que lo garantizan:** variantes de botón y enlaces con altura mínima explícita. **Impacto:** hay más área de activación con ratón, toque o movilidad limitada, con un cambio visual de pocos píxeles.
- **Reflujo en pantallas estrechas:** el onboarding y el resumen se comprobaron a 320 px CSS; no presentaron desbordamiento horizontal. **Elementos que lo garantizan:** composición móvil existente y controles de ancho fluido. **Impacto:** se mantiene el acceso al contenido sin tener que desplazarse lateralmente.

### 3. Satisfacción: confianza, claridad y previsibilidad

- **Consistencia y contexto (Nielsen: heurística 4):** cada ruta actualiza el título del documento y, tras una navegación interna, enfoca su `h1`. Los encabezados tienen `tabIndex={-1}` declarado en React; no se altera el DOM de forma imperativa durante la hidratación. **Elementos que lo garantizan:** `AppShell`, encabezados de página y la etiqueta de título «… · Ctrl+Me». **Impacto:** el usuario y las tecnologías de asistencia perciben que la pantalla cambió y cuál es su nuevo contexto.
- **Mensajes claros y lenguaje familiar (Nielsen: heurísticas 2 y 10):** se mantienen instrucciones breves en español, se marca qué datos son opcionales y se especifica cómo corregir un error. **Elementos que lo garantizan:** títulos de los pasos, texto de ayuda junto a cada campo y errores asociados al control. **Impacto:** reduce la carga de interpretación y evita mensajes técnicos o ambiguos.
- **Diseño visual contenido (Nielsen: heurística 8):** las modificaciones se limitaron a contraste de bordes de campos, legibilidad de placeholders y alturas táctiles; no se alteraron la estructura, la paleta principal ni los flujos de producto. **Impacto:** mejora la lectura y la precisión de interacción sin obligar al usuario a reaprender la interfaz.

## Accesibilidad

La organización sigue los cuatro principios de WAI/WCAG: **perceptible, operable, comprensible y robusto**. Los apoyos a discapacidad cognitiva se tratan junto con los sensoriales y motores; no se asume que una solución visual por sí sola cubra todas las necesidades.

### 1. Perceptible

- **Visión y contraste:** se oscureció el token de borde de los campos y se retiró la opacidad adicional de los placeholders. En una muestra del formulario, la combinación del borde neutro con la superficie alcanzó **3,64:1** y el placeholder con su fondo **7,15:1**. Esto apunta a los criterios WCAG 1.4.11 y 1.4.3, respectivamente. **Elementos que lo garantizan:** token `--input`, clase compartida de campo y placeholder `text-muted-foreground`. **Impacto:** límites y texto de ayuda resultan más distinguibles. Son mediciones de una muestra, no una certificación de todos los colores de la aplicación.
- **La información no depende solo del color:** los estados de error y finalización se expresan con texto; el análisis también nombra la comprobación en curso. **Elementos que lo garantizan:** mensajes de error, etiquetas y región de estado del análisis. **Impacto:** la información sigue disponible con percepción cromática reducida o lector de pantalla.
- **Reflujo:** se verificó el onboarding y el resumen a 320 px CSS sin scroll horizontal. **Elementos que lo garantizan:** diseño responsive existente y columnas que se adaptan al ancho. **Impacto:** el contenido principal permanece utilizable con ampliación o en pantallas pequeñas.
- **Movimiento y audio:** ya existía respeto por `prefers-reduced-motion`; se conserva. Las historias no empiezan la narración automáticamente y ofrecen controles explícitos de pausa y activación. **Impacto:** el movimiento y el audio quedan bajo control del usuario; el texto de cada historia permanece visible.

### 2. Operable

- **Teclado y foco:** se comprobó el enlace «Saltar al contenido» con teclado; ahora su destino `main` puede recibir foco. Los encabezados de ruta y de etapa son enfocables programáticamente mediante `tabIndex={-1}` declarado en el marcado. En errores, el foco llega al primer campo inválido. **Elementos que lo garantizan:** enlace de salto, `main#contenido`, `h1`, estilos globales `:focus-visible` y efecto de gestión de foco. **Impacto:** se puede omitir navegación repetida, orientarse tras un cambio de pantalla y corregir un formulario sin ratón. Relación con WCAG 2.1.1, 2.4.1 y 2.4.3.
- **Objetivos táctiles:** los controles frecuentes citados en Usabilidad alcanzan 48–56 px. WCAG 2.5.8 establece un mínimo menor en la mayoría de los casos; aquí se adoptó 48 px como objetivo práctico de comodidad, no como afirmación de que cada control de la aplicación tenga ese tamaño.
- **Movimiento del contenido:** el foco inicial no se fuerza al cargar la página; solo se mueve al cambiar de etapa o ruta. **Impacto:** se evita una parada inesperada en la primera visita y se conserva la orientación cuando sí cambia el contexto.

### 3. Comprensible

- **Etiquetas e instrucciones (WCAG 3.3.2):** los campos tienen etiquetas, los datos opcionales se identifican y el consentimiento explica qué autoriza. **Impacto:** el usuario puede prever el propósito de cada control antes de usarlo.
- **Identificación y sugerencia de errores (WCAG 3.3.1 y 3.3.3):** el correo inválido y la falta de consentimiento producen mensajes de texto asociados al control, y el foco se coloca en el campo que necesita atención. **Impacto:** el error no se comunica solo con un borde rojo y el usuario recibe una acción correctiva.
- **Orientación cognitiva:** contador, títulos por etapa, instrucciones cortas y estado de avance mantienen una secuencia previsible. El código introducido se conserva al volver. **Elementos que lo garantizan:** encabezados, indicador de paso, botón «Volver» y valores mantenidos en estado temporal. **Impacto:** menos carga de memoria de trabajo y menos repetición, en especial para quien tiene dificultades de atención o memoria.

### 4. Robusto

- **Estructura y nombres semánticos:** se conservan los landmarks `main` y `nav`, los enlaces y botones nativos, las etiquetas de formularios y los encabezados jerárquicos. La navegación marca la ruta actual con `aria-current="page"`. **Elementos que lo garantizan:** HTML semántico, nombres accesibles y estados ARIA explícitos. **Impacto:** navegadores y tecnologías de asistencia reciben una estructura coherente.
- **Estados y mensajes dinámicos (WCAG 4.1.3):** el paso actual, los resultados de evaluación, el checklist de alertas, el asistente guiado y el título de las diapositivas disponen de regiones de estado o anuncios corteses, con contenido estable al cambiar. **Impacto:** los cambios importantes pueden anunciarse sin exigir que la persona vuelva a recorrer la página.
- **Hidratación:** los `tabIndex` necesarios se renderizan declarativamente, en vez de mutar los encabezados antes de que Next.js complete la hidratación. **Impacto:** conserva el marcado inicial para React y evita discrepancias entre HTML inicial y cliente.

### Elementos de accesibilidad que ya existían en el estado base

- Enlace «Saltar al contenido», landmarks principales y navegación con nombres descriptivos.
- Etiquetas visibles en el onboarding, contenido de ayuda junto a los campos y estados de navegación actuales.
- Indicadores globales `:focus-visible` y soporte para movimiento reducido.
- Composición responsive y jerarquía de encabezados en las pantallas principales.

Se conservan porque ya aportaban soporte útil; no se presentan como trabajo nuevo de esta iteración.

## Validación y límites

- `pnpm exec tsc --noEmit` y `git diff --check`: correctos.
- Recorrido en Preview con teclado: enlace de salto, envío inválido y foco/descripción del error, envío válido, avance y retroceso del código, estado durante y al terminar el análisis, navegación a Alertas y cambio de diapositiva de una historia.
- Viewports observados: **1186 × 785** y **320 × 844**; sin desbordamiento horizontal en las dos pantallas probadas a 320 px.
- Se inspeccionó el árbol de accesibilidad del navegador; no se hizo una prueba con NVDA, VoiceOver u otro lector de pantalla real, ni un barrido exhaustivo automatizado de todas las rutas y combinaciones de color. Por ello, esta memoria **no declara conformidad WCAG**.
- Ctrl+Me sigue siendo un prototipo: la pantalla de análisis muestra datos de demostración y cualquier código de seis dígitos funciona. Los cambios mejoran la interacción y el anuncio de estados; no añaden una verificación real ni convierten los resultados simulados en datos reales.
