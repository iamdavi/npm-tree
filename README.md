# Árbol de Categorías - Vanilla JS Module

Este módulo en JavaScript vanilla permite generar un **árbol interactivo de categorías** a partir de una lista. Diseñado para integrarse fácilmente en cualquier proyecto web, con enfoque en simplicidad, modularidad y estilo personalizable.

## 🚀 Instalación (cuando esté publicado)

```bash
npm install categoria-tree
````

> ⚠️ Por ahora el módulo está en desarrollo y no está publicado en npm.

## 🧩 Uso básico

```html
<div id="categoria-container"></div>

<script type="module">
  import createCategoryTree from './categoria-tree.js';

  const categorias = [
    { id: 1, nombre: 'Tecnología', padreId: null },
    { id: 2, nombre: 'Frontend', padreId: 1 },
    { id: 3, nombre: 'Backend', padreId: 1 }
  ];

  createCategoryTree(document.getElementById('categoria-container'), categorias);
</script>
```

## 🗂 Estructura del Proyecto

```
/categoria-tree/
├── index.html         # Ejemplo de uso
├── categoria-tree.js  # Lógica principal del módulo
└── styles.css         # Estilos asociados
```

## ✅ Checklist del Proyecto

### Funcionalidad

* [x] Recibir lista de categorías
* [x] Renderizar árbol de categorías jerárquico
* [ ] Soporte para eventos (click, seleccionar, expandir)
* [ ] Mejora de la interfaz visual

### Refactor y mejoras

* [ ] Reescribir en TypeScript
* [ ] Encapsular estilos usando Shadow DOM
* [ ] Hacer el componente accesible (a11y)

### Publicación

* [ ] Preparar `package.json` para npm
* [ ] Añadir documentación de uso
* [ ] Publicar en [npmjs.com](https://www.npmjs.com)

---

## 🔧 Parámetros

El módulo espera recibir dos argumentos:

* `container` — Elemento DOM donde se renderiza el árbol.
* `categorias` — Array de objetos con las propiedades:

```ts
interface Categoria {
  id: number;
  nombre: string;
  padreId: number | null;
}
```

## 💡 Pendientes / Futuras mejoras

* [ ] Permitir añadir categorías dinámicamente
* [ ] Soporte para arrastrar y soltar
* [ ] Integración opcional con bases de datos o APIs
* [ ] Posibilidad de estilos personalizados desde fuera del shadowRoot