# Using autodate with React

```tsx
import { useEffect, useRef } from 'react';
import { autoDate } from 'autodate';

const Footer = () => {
  const yearRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (yearRef.current) {
      const controller = autoDate(yearRef.current, {
        format: 'range',
        startYear: 2020
      });
      
      return () => controller.stop();
    }
  }, []);

  return (
    <footer>
      <span ref={yearRef}></span> My Company
    </footer>
  );
};
```
