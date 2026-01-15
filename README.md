# autodate 📅

A tiny (~2KB), zero-dependency TypeScript library that automatically updates copyright years in website footers.

[![npm version](https://img.shields.io/npm/v/autodate.svg)](https://www.npmjs.com/package/autodate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Core functionality**: Automatically updates HTML elements when the year changes.
- **Zero dependencies**: TypeScript native, light as a feather.
- **Smart year detection**: Default 1-hour checks, switching to 1-minute checks around New Year's (Dec 31 23:00 to Jan 1 01:00).
- **Smooth animations**: Built-in fade effect when values update.
- **Multiple formats**: Supports `year` (2024), `range` (2020-2024), and `full` (© 2020-2024).
- **Framework agnostic**: Works everywhere (React, Vue, Svelte, vanilla JS, etc.).
- **SSR compatible**: Safe for Next.js, Nuxt, and other server-side environments.

## Installation

### npm / yarn / pnpm
```bash
npm install autodate
# or
yarn add autodate
# or
pnpm add autodate
```

### CDN (Browser)
```html
<script src="https://unpkg.com/autodate/dist/index.global.js"></script>
```

## Quick Start

### Vanilla JS
```html
<footer>
  &copy; <span id="copyright-year"></span> My Awesome App.
</footer>

<script>
  import { autoDate } from 'autodate';
  
  autoDate('#copyright-year', {
    format: 'range',
    startYear: 2022
  });
</script>
```

## API Reference

### `autoDate(elementOrSelector, options)`
Initializes the observer and returns a controller object.

#### Options
| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `format` | `'year' \| 'range' \| 'full'` | `'year'` | Formatting style |
| `startYear` | `number` | `current` | Start year for range formats |
| `interval` | `number` | `3600000` | Normal check interval (ms) |
| `animation` | `boolean` | `true` | Enable fade transition |
| `onUpdate` | `(year: number) => void` | `undefined` | Callback on year change |
| `debug` | `boolean` | `false` | Enable console logging |

#### Controller
```typescript
{
  stop: () => void; // Stops the interval observer
}
```

## Framework Integration

- [React Guide](./docs/REACT.md)
- [Vue Guide](./docs/VUE.md)
- [Svelte Guide](./docs/SVELTE.md)
- [Angular Guide](./docs/ANGULAR.md)
- [FAQ & Troubleshooting](./docs/FAQ.md)

## License
MIT
