# FAQ & Troubleshooting

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)
- IE11 (Requires `core-js` polyfills for `setTimeout` and `Date` if not present)

## Performance Considerations
AutoDate is extremely lightweight (~2KB). It uses a single timer per instance. For ultra-performance on sites with thousands of footers (unlikely), consider using one observer to update multiple elements via the `onUpdate` callback.

## Migration Guide (v0.x to v1.0)
- Changed: `AutoDate` class now requires a manual `.start()` call or use the `autoDate()` factory function which calls it automatically.
- Format names are now strictly lowercase: `'year'`, `'range'`, `'full'`.

## Troubleshooting
- **Element not found**: If using a selector, ensure the DOM is loaded before calling `autoDate()`. In frameworks, use the appropriate lifecycle hook (e.g., `useEffect`, `onMounted`).
- **Styles not applying**: Ensure `animation: true` (default) is set. AutoDate injects a small `<style>` tag to handle transitions.
