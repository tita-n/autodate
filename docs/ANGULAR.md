# Using autodate with Angular

### 1. Installation
```bash
npm install autodate
```

### 2. Component Implementation
Use `ElementRef` and `AfterViewInit` to initialize the observer.

```typescript
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { autoDate, AutoDateController } from 'autodate';

@Component({
  selector: 'app-footer',
  template: `
    <footer>
      <span #copyrightYear></span> My Company
    </footer>
  `
})
export class FooterComponent implements AfterViewInit, OnDestroy {
  @ViewChild('copyrightYear') copyrightYear!: ElementRef;
  private controller?: AutoDateController;

  ngAfterViewInit() {
    this.controller = autoDate(this.copyrightYear.nativeElement, {
      format: 'range',
      startYear: 2021
    });
  }

  ngOnDestroy() {
    if (this.controller) {
      this.controller.stop();
    }
  }
}
```
