# Panel de casa · primera versión

Proyecto en HTML, CSS y JavaScript, sin dependencias ni compras.

## Abrir y editar

Abre `public/index.html` en un navegador. Mantén los tres archivos de public juntos. En el teléfono, copia esa carpeta completa y abre index.html con un navegador que admita archivos locales; si el gestor de archivos no lo permite, utiliza la versión web.

- `public/index.html`: textos, estructura y direcciones de los accesos rápidos.
- `public/styles.css`: colores, tamaños y distribución horizontal o vertical.
- `public/app.js`: reloj, ajustes, guardado y pantalla completa.

El reloj usa la hora y zona horaria del dispositivo. En Ajustes puedes introducir ciudad, temperatura y descripción del clima: son datos manuales, no un pronóstico real. Los ajustes se guardan en el navegador cuando está permitido. Calendario, Keep y YouTube abren sus páginas y requieren conexión; pueden pedir inicio de sesión. No se leen tus datos de esas cuentas.

La versión local permite usar reloj y clima manual sin conexión. La versión web requiere conexión para cargar. Pantalla completa depende del navegador y no impide por sí sola que Android apague la pantalla.

## Próximos pasos

1. Probar tamaño de reloj y botones en el Moto G34, en horizontal.
2. Elegir ciudad para conectar clima automático.
3. Personalizar los tres accesos rápidos.

No hay dependencias ni proceso de compilación: la carpeta public es el sitio terminado.
