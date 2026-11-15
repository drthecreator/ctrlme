# Memoria de mejoras de usabilidad y accesibilidad — Ctrl+Me v2.0

**Fecha:** 13 de noviembre de 2026

**Alcance:** ajustes incrementales de interacción y semántica; se conserva el diseño visual general.

> **Trazabilidad:** para esta memoria se toma como v1.0 el estado del código inspeccionado antes de esta intervención. No se encontró una etiqueta o compilación archivada de v1.0 que permita comparar cada pantalla completa; por tanto, se documentan únicamente las diferencias comprobables incorporadas ahora y se distingue lo que ya existía.

## Qué se añadió en la aplicación durante esta conversación

Esta lista identifica cambios concretos del sitio, no principios generales. Los textos de progreso y varios controles ya estaban visibles; cuando corresponde, se indica que lo nuevo fue su comportamiento accesible, no la creación del texto o de una pantalla.

### Cambios visibles

- **Inicio/resumen:** ahora hay un encabezado visible «Tu resumen» tanto en móvil como en escritorio. Antes, el encabezado accesible estaba oculto visualmente y en escritorio se mostraba un saludo «Hola».
- **Legibilidad:** los bordes neutros de los campos se oscurecieron y los placeholders dejaron de llevar opacidad adicional. En la navegación lateral, los rótulos de grupo pasaron de 45 % a 75 % de opacidad.
- **Área de activación:** «Volver», los botones `touch-sm` y el enlace secundario del resumen pasaron de 44 px a 48 px de alto. La navegación móvil (56 px) y la lateral (48 px) ya tenían esas dimensiones: se conservaron, no se añadieron ahora.

### Cambios de comportamiento y semántica

- **Onboarding:** el indicador «Paso X de 3» ya existía; ahora se anuncia cuando cambia y el foco pasa al encabezado de la nueva etapa. Si el formulario falla, el foco llega al primer campo que hay que corregir; se hicieron explícitos como obligatorios el correo y el consentimiento. El código de verificación se conserva al retroceder y su instrucción queda asociada al control. Antes, el código se reiniciaba al volver y el campo recibía foco automático al entrar.
- **Navegación entre páginas:** al cambiar de ruta, el título del documento se actualiza con el encabezado de la página y el foco pasa a ese encabezado. El enlace «Saltar al contenido» ya existía; ahora su destino `main` puede recibir foco de forma nativa.
- **Estados dinámicos:** los textos de progreso del análisis y los contadores/resultados ya eran visibles; ahora se marcan como estados anunciables y el análisis comunica también cuál comprobación está activa. Se añadieron anuncios estables para los cambios de diapositiva de las historias y para el asistente guiado.
- **Encabezados de página:** los `h1` que reciben foco durante la navegación se declaran con `tabIndex={-1}` en React; antes no estaban preparados para ese foco programático.

### Elementos que ya estaban y no se añadieron en esta conversación

- Etiquetas visibles e instrucciones básicas de los campos, mensajes de error en texto y navegación con `aria-current="page"`.
- Enlace «Saltar al contenido», landmarks `main` y `nav`, y estilos globales de foco `:focus-visible`.
- Compatibilidad con `prefers-reduced-motion`, composición responsive, navegación inferior/lateral y controles explícitos para activar la narración de historias.

En resumen: no se creó un flujo nuevo ni se rediseñó la interfaz. Se modificaron el encabezado del resumen, el contraste y tamaño de algunos controles, y el comportamiento de foco y anuncios de estados en flujos que ya existían.

## Usabilidad

Se organizan las mejoras conforme a los tres ejes de ISO 9241-11 —eficacia, eficiencia y satisfacción— y se relacionan con los subprincipios de la lista, como visibilidad del estado, prevención y recuperación de errores, control del usuario, reconocimiento y consistencia. La intención no fue rediseñar el prototipo, sino reducir dudas y errores dentro de los flujos actuales.

### 1. Eficacia: completar la tarea correctamente

- **Visibilidad del estado del sistema (Nielsen: heurística 1; Shneiderman: retroalimentación):** responde a «¿qué está pasando?» y «¿ya terminó?». Cuando una tarea tiene varios pasos o tarda, no basta con que la aplicación cambie internamente: debe mostrar dónde está la persona, qué está ocurriendo y cuál fue el resultado. En Ctrl+Me, «Paso X de 3» indica la etapa; durante el análisis se comunica cuántas comprobaciones van y cuál está activa; al terminar, aparece «Análisis completado» y se habilita «Ver mis resultados». Los contadores de alertas y evaluación y los mensajes del asistente también anuncian sus cambios. **Elementos que lo garantizan:** contador «Paso X de 3», texto de progreso y nombre de la comprobación, confirmación final, botón «Ver mis resultados» y regiones `role="status"` / `aria-live="polite"`. **Impacto:** la persona no tiene que adivinar si su acción se registró, si el sistema sigue trabajando o si debe volver a pulsar; esto reduce la incertidumbre y las acciones repetidas. La información se expresa con texto, no solo con color o movimiento.
- **Prevenir el error y facilitar su corrección (Nielsen: heurísticas 5 y 9):** antes de enviar, las etiquetas y el texto de consentimiento explican qué se pide; al enviar, la validación detiene el avance si el correo no es válido o falta el consentimiento. Si hay un error, la interfaz lo nombra con palabras, marca el control con `aria-invalid`, asocia la explicación mediante `aria-describedby` y lleva el foco al primer campo que hay que corregir. **Elementos que lo garantizan:** etiqueta «Correo electrónico», mensaje de error con una indicación de formato, checkbox con etiqueta y texto de permiso, y acción «Enviar código». **Impacto:** la persona entiende tanto por qué no pudo avanzar como qué debe hacer para continuar; no necesita descubrir el problema por ensayo y error ni localizarlo visualmente.
- **Cierre comprensible de una tarea (Shneiderman, regla 4: diseñar los diálogos para que produzcan un cierre):** la visibilidad del estado informa qué ocurre mientras se trabaja; el cierre deja claro que la tarea terminó y qué puede hacer la persona después. En Ctrl+Me, al concluir todas las comprobaciones, el mensaje cambia a «Análisis completado» y aparece la acción «Ver mis resultados». **Elementos que lo garantizan:** mensaje final distinto de los estados de progreso y botón que conduce al siguiente paso. **Impacto:** evita que el usuario confunda el fin del análisis con una pausa o un proceso aún activo, y le da una continuación clara.

### 2. Eficiencia: alcanzar el objetivo con menos tiempo y esfuerzo

En ISO 9241-11, la eficiencia relaciona el resultado conseguido con los recursos que la persona emplea: tiempo, acciones, esfuerzo físico y carga mental. No significa simplemente «menos clics»: la tarea debe seguir completándose correctamente. En esta conversación no se acortó el onboarding ni se añadieron atajos; por eso, las mejoras descritas se limitan a reducir desorientación, repetición y esfuerzo al activar controles.

- **Reducir el esfuerzo de orientación (Nielsen, heurística 6: reconocimiento antes que recuerdo):** antes ya estaban visibles el número y las instrucciones de cada paso; ahora, al cambiar de etapa, el foco y el anuncio accesible señalan el nuevo encabezado. **Elementos que lo garantizan:** indicador «Paso X de 3» y texto de cada etapa (ya existían); foco en el encabezado y anuncio del progreso (añadidos ahora). **Impacto:** la persona no necesita buscar dónde quedó ni recordar qué debía hacer.
- **Evitar repetir una parte de la tarea (Nielsen, heurísticas 3 y 6):** los controles «Volver» y «Cambiar correo» ya existían; ahora el código introducido se conserva al volver desde la conexión. **Elementos que lo garantizan:** botones de navegación existentes y valor del código mantenido en el estado del flujo (añadido ahora, sin guardarlo en almacenamiento persistente). **Impacto:** se puede revisar una etapa sin volver a teclear el código. El foco en el primer campo inválido también reduce el tiempo de localizar qué corregir; este beneficio es compartido con la prevención y recuperación de errores.
- **Reducir errores de activación y esfuerzo motor (mejora transversal con Accesibilidad):** se elevan de 44 a 48 px los botones `touch-sm`, las acciones «Volver» y los enlaces secundarios del resumen. **Elementos que lo garantizan:** variantes de botón y enlaces con altura mínima explícita. **Impacto:** hay más área para activar acciones frecuentes con toque o ratón; los objetivos grandes ayudan a reducir activaciones fallidas. La navegación móvil de 56 px y la lateral de 48 px ya tenían ese tamaño y no se modificaron.

**Qué no se añadió:** no se redujo el número de etapas, no se incorporaron autocompletado nuevo ni atajos y no se midió el tiempo de completar la tarea. Por tanto, no se afirma que todo el flujo sea más rápido. El reflujo a 320 px se documenta en Accesibilidad, porque demuestra adaptación de la presentación, no una reducción del esfuerzo para completar una tarea.

### 3. Satisfacción: confianza, comodidad y previsibilidad

La satisfacción describe cómo se siente la experiencia para la persona: si le resulta clara, confiable y cómoda, además de si consigue completar la tarea. En esta iteración se priorizaron ajustes consistentes y pequeños, sin cambiar los flujos ni exigir que se aprenda una interfaz nueva.

- **Consistencia y estándares (Nielsen: heurística 4):** los controles que cumplen la misma función deben comportarse y presentarse de forma parecida. Antes ya había navegación lateral e inferior con indicación de la ruta actual (`aria-current="page"`), etiquetas y estilos globales de foco; esos patrones se conservaron. En esta conversación se unificó el comportamiento al cambiar de ruta: el título del documento se deriva del `h1` y el foco llega a ese encabezado. También se elevó a 48 px la altura de los botones `touch-sm` y de las acciones «Volver» en los lugares modificados, y el borde de los campos se ajusta desde un mismo token semántico (`--input`). **Elementos que lo garantizan:** `AppShell`, encabezados de página, `aria-current`, la variante compartida `touch-sm`, acciones «Volver» y token `--input`. **Impacto:** se reducen las sorpresas entre pantallas y la persona no tiene que averiguar de nuevo cómo reconocer la página actual, dónde mirar tras navegar o cómo activar acciones semejantes.
- **Control y confianza (Nielsen: heurística 3, control y libertad del usuario):** la persona puede regresar a una etapa anterior y corregir sin perder lo que ya introdujo. Los controles «Volver» y «Cambiar correo» ya existían; ahora el código se conserva al volver desde el paso de conexión. Los mensajes de estado también dejan claro cuándo el análisis sigue activo y cuándo acabó. **Elementos que lo garantizan:** botones de retroceso, estado temporal del código y anuncio «Análisis completado» con la acción «Ver mis resultados». **Impacto:** se puede corregir con menos temor a perder el avance y con mayor confianza en que la acción terminó.
- **Mensajes claros y lenguaje familiar (Nielsen: heurísticas 2 y 10):** expresiones como «Paso X de 3», «Revisa tu correo» y «Ver mis resultados» describen la tarea con palabras conocidas. Las instrucciones y mensajes visibles ya formaban parte del prototipo; en esta conversación se añadió que el cambio de etapa y ciertos estados también se anuncien y reciban foco cuando corresponde. **Elementos que lo garantizan:** títulos e instrucciones de cada etapa, mensajes de error asociados al campo y regiones accesibles de estado. **Impacto:** se reduce la ambigüedad sin añadir terminología técnica ni texto nuevo innecesario.
- **Diseño visual contenido (Nielsen: heurística 8, estética y diseño minimalista):** los cambios visuales se limitaron a hacer más legibles los bordes y placeholders, ajustar algunos objetivos táctiles y presentar «Tu resumen» como encabezado visible. Se conservaron la paleta, la distribución principal y los recorridos. **Elementos que lo garantizan:** token de borde compartido, clases de campo, tamaños de acción modificados y encabezado del resumen. **Impacto:** aumenta la comodidad de lectura e interacción sin una renovación visual ni una curva de aprendizaje nueva.

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
