# Sky Portal Component Library

Librería de componentes React reutilizables basada en los componentes UI del proyecto Air Spain, Radix UI y Tailwind CSS v4.

## Requisitos

- Node.js compatible con Vite 8 (Node.js 20.19+ o 22.12+).
- npm.

## Desarrollo y compilación

```bash
npm install
npm run ladle
npm run typecheck
npm run build
```

`npm run ladle` abre Ladle en modo desarrollo. En la story **PuckEditor** puedes
componer páginas con componentes de la librería; los borradores se guardan en
`localStorage` del navegador. Usa **Export JSON** para descargar la configuración
o abre **SavedPuckPagePreview** para previsualizarla. Puck es una dependencia de
desarrollo y no forma parte del bundle publicado. El catálogo incluye bloques
editables para botones, cards, alerts, badges, avatar, controles de formulario,
tabs, acordeón, tablas y otros componentes UI. Los componentes que dependen de
proveedores o de composición avanzada se ofrecen como bloques completos cuando
se pueden previsualizar de forma independiente.

Al usar **Publish React component** se descarga `PublishedPage.tsx`, con los
componentes seleccionados y props callback tipadas para botones y controles.
Implementa solo las acciones que necesites:

```tsx
<PublishedPage
  onUiButtonClick={(componentId) => handleAction(componentId)}
  onUiSelectChange={(componentId, value) => updateSelection(componentId, value)}
/>
```

Los callbacks disponibles están declarados en el tipo `PublishedPageProps` del
archivo generado. El archivo importa componentes desde
`@cristian9751/sky-portal-component-library`.

El resultado se genera en `dist/`:

- `sky-portal-components.js`: bundle ESM.
- `sky-portal-components.cjs`: bundle CommonJS.
- `style.css`: estilos y tokens del sistema de diseño.
- `types/`: declaraciones TypeScript.

`npm run preview` sirve una compilación existente; ejecuta primero `npm run build`.

## Uso desde otra aplicación React

Instala el paquete una vez publicado:

```bash
npm install sky-portal-component-library
```

Importa los componentes y los estilos:

```tsx
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  PermissionSelector,
} from "sky-portal-component-library";
import "sky-portal-component-library/style.css";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hola, Sky Portal</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => alert("¡Funciona!")}>Continuar</Button>
      </CardContent>
    </Card>
  );
}
```

`PermissionSelector` lista los permisos de administración agrupados por área y
entrega los permisos seleccionados al confirmar:

```tsx
<PermissionSelector
  defaultSelectedPermissions={[]}
  onAssign={(permissions) => savePermissions(permissions)}
/>
```

React y React DOM son `peerDependencies`, por lo que la aplicación consumidora debe instalarlos. El CSS incluye los tokens de diseño del proyecto; revisa `src/styles.css` si deseas adaptar colores, tipografía o estilos globales antes de publicar.

## Exportaciones

El punto de entrada `src/index.ts` exporta los componentes de `src/components/ui`, el helper `cn` y el hook `useIsMobile`. Las rutas y páginas de la aplicación original no se incluyen en el bundle público.

## Publicar en npm

1. Cambia `name` en `package.json` si `sky-portal-component-library` no está disponible en npm.
2. Ejecuta `npm run typecheck && npm run build`.
3. Verifica el contenido con `npm pack --dry-run`.
4. Inicia sesión y publica:

```bash
npm login
npm publish
```

## Nota de estilos

Esta librería usa Tailwind CSS v4 para compilar los estilos. Si la aplicación consumidora necesita controlar su propio tema, ajusta las variables CSS de `src/styles.css` antes de publicar.
