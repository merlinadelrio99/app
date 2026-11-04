# Bioferia · La medida justa

Esta es una app móvil de demostración para la propuesta **“Lo que te sobra puede ser justo lo que alguien necesita”**. Su pantalla principal y sus cuatro secciones están centradas en una tarea dentro del festival: registrar plástico, hallar una medida, intercambiar material y ver una posible pieza. La web de campaña puede seguir presentando el evento; esta app muestra cómo participaría alguien.

## Recorrido

- **Inicio:** explica la tarea, muestra el fondo común y abre el intercambio.
- **Mi aporte:** registra tapitas, botellas y envases; compara el peso con una medida; transfiere el excedente al fondo o toma lo que falta; muestra la transformación y deja elegir uno de seis personajes.
- **Fondo:** muestra cuánto material queda en la simulación, los movimientos locales y los BioPoints de prueba.
- **Mi pieza:** guarda el último personaje elegido y presenta los seis personajes con sus subconceptos.

Las pantallas están implementadas en `index.html`, `app.css` y `app.js`. Las imágenes de los personajes están en `hc/serie-*.png`. Los demás archivos heredados del repositorio ya no se cargan en esta versión de la app.

## Alcance de la demo

El PDF no especifica una cantidad de gramos por pieza ni una conversión de gramos a BioPoints. Para poder probar la lógica, esta demo usa **120 g por pieza**, **5 BP por gramo compartido** y un fondo inicial de **600 g**; todos aparecen como valores de prueba. La información queda solo en el almacenamiento del navegador. No existe cámara con IA conectada, balanza física, fondo sincronizado entre visitantes, impresora 3D conectada ni puntos reales. Los textos de las pantallas indican esos límites.

## Publicación

Serví esta carpeta completa desde un servidor estático o subí su contenido a la raíz de la rama publicada en GitHub Pages. Abrí `index.html`; conservá `app.css`, `app.js`, `manifest.webmanifest`, `icon.svg`, `fonts/`, `assets/bioferia-logo.png`, `pz/poster-oculto.webp` y `hc/serie-*.png`.
