import { AutoDateOptions, AutoDateController } from '../types';
import { DateFormatter } from './Formatter';
import { YearObserver } from './Observer';

export class AutoDate implements AutoDateController {
    private element: HTMLElement | null = null;
    private observer: YearObserver;
    private options: AutoDateOptions;
    private styleTag: HTMLStyleElement | null = null;

    constructor(elementOrSelector: string | HTMLElement, options: AutoDateOptions = {}) {
        this.options = {
            format: 'year',
            interval: 3600000,
            locale: 'en-US',
            animation: true,
            debug: false,
            ...options,
        };

        if (typeof window === 'undefined') {
            // SSR compatibility
            this.observer = new YearObserver(() => { }, this.options);
            return;
        }

        if (typeof elementOrSelector === 'string') {
            this.element = document.querySelector(elementOrSelector);
        } else {
            this.element = elementOrSelector;
        }

        if (!this.element && this.options.debug) {
            console.warn(`[autodate] Element not found: ${elementOrSelector}`);
        }

        if (this.options.animation) {
            this.injectStyles();
        }

        this.observer = new YearObserver((year) => this.update(year), this.options);
    }

    start() {
        const currentYear = new Date().getFullYear();
        this.update(currentYear);
        this.observer.start();
    }

    stop() {
        this.observer.stop();
    }

    destroy() {
        this.stop();
        if (this.styleTag && this.styleTag.parentNode) {
            this.styleTag.parentNode.removeChild(this.styleTag);
        }
        this.element = null;
    }

    private update(year: number) {
        if (!this.element) return;

        const formatted = DateFormatter.format(year, this.options);

        if (this.options.animation) {
            this.element.style.opacity = '0';
            setTimeout(() => {
                this.element!.textContent = formatted;
                this.element!.style.opacity = '1';
                if (this.options.onUpdate) {
                    this.options.onUpdate(year);
                }
            }, 300);
        } else {
            this.element.textContent = formatted;
            if (this.options.onUpdate) {
                this.options.onUpdate(year);
            }
        }
    }

    private injectStyles() {
        if (typeof document === 'undefined' || document.getElementById('autodate-styles')) return;

        this.styleTag = document.createElement('style');
        this.styleTag.id = 'autodate-styles';
        this.styleTag.textContent = `
      [data-autodate] {
        transition: opacity 0.3s ease-in-out;
      }
    `;
        document.head.appendChild(this.styleTag);

        if (this.element) {
            this.element.setAttribute('data-autodate', '');
        }
    }
}

/**
 * Convenience function to initialize autodate
 */
export function autoDate(
    elementOrSelector: string | HTMLElement,
    options?: AutoDateOptions
): AutoDateController {
    const instance = new AutoDate(elementOrSelector, options);
    instance.start();
    return {
        stop: () => instance.stop(),
    };
}
