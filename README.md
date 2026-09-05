# Panel de casa

Dashboard doméstico en HTML, CSS y JavaScript para usar un Moto G34 como pantalla de casa. No requiere dependencias ni compras.

## Abrir y editar

Abre `public/index.html` en un navegador y mantén juntos los tres archivos de esa carpeta.

- `public/index.html`: textos, estructura y direcciones de los accesos rápidos.
- `public/styles.css`: colores, tamaños y distribución horizontal o vertical.
- `public/app.js`: reloj, clima, actualización y pantalla completa.

El reloj usa la hora y zona horaria del dispositivo e incluye segundos. El clima se actualiza automáticamente para Santiago de Chile mediante Open-Meteo y también puede refrescarse con el botón del encabezado. Calendario, Keep, YouTube y Spotify abren sus páginas y requieren conexión; pueden pedir inicio de sesión. No se leen datos de esas cuentas.

La versión local permite usar el reloj sin conexión; el clima automático requiere conexión. Pantalla completa depende del navegador y no impide por sí sola que Android apague la pantalla.

## Próximos pasos

1. Probar el tamaño del reloj y los botones en el Moto G34, en horizontal.
2. Comprobar que el clima automático carga en el navegador del teléfono.
3. Personalizar los cuatro accesos rápidos.
