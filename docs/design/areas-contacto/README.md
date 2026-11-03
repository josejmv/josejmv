# Referencias de diseño: Áreas y Contacto

Las capturas salen del prototipo navegable del lienzo y están en `screens/`. Usa las fuentes del sitio (Sora, Inter y JetBrains Mono), aunque en alguna captura no se hayan cargado.

| Captura | Qué muestra |
|---|---|
| `areas-desktop.png` | /areas al cargar, con Backend & Pagos seleccionado |
| `areas-nodo-seleccionado.png` | Después de elegir Compliance: conexiones iluminadas, etiquetas y panel actualizado |
| `areas-movil.png` | 420px de ancho. **Defecto conocido:** el nodo y la etiqueta de Compliance se salen del borde; la spec pide recolocarlos |
| `contacto-desktop.png` | /contacto en su estado inicial |
| `contacto-error-validacion.png` | Envío con campos vacíos: alerta de validación |
| `contacto-enviado.png` | Estado de éxito después de abrir el mailto |
| `contacto-movil.png` | 420px de ancho |

## Fuente (`source/`)

- `Areas.dc.html`, `Contact.dc.html`: las dos páginas nuevas.
- `Header.dc.html`, `Footer.dc.html`: la navegación actualizada y el footer con la prop `cta`.

Son el formato del lienzo, no React. Sirven de referencia de medidas, colores, copy y lógica. La lógica está en el bloque `class Component extends DCLogic`:

- en `Areas.dc.html`, el armado de nodos y conexiones y el cálculo del estado activo;
- en `Contact.dc.html`, la validación y el armado del mailto.

## Diferencias del prototipo frente a la spec

Manda la spec.

- **Escena 3D:** el prototipo usa CSS (anillos con perspectiva y nodos que flotan). La spec pide react-three-fiber, con ese mismo diseño como fallback 2D.
- **Envío del formulario:** el prototipo abre el mailto con `window.open`. La spec usa `window.location.href`, que funciona mejor en móvil y no lo bloquea el bloqueador de popups.
- **Validación:** en el prototipo es básica. La spec pide Zod, `aria-invalid` por campo y mover el foco al primer error.
- **Selección de área:** el prototipo no guarda la selección en la URL. La spec pide `?area=`.
