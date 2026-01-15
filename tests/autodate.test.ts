import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DateFormatter } from '../src/core/Formatter';
import { YearObserver } from '../src/core/Observer';

describe('DateFormatter', () => {
    it('should format simple year', () => {
        expect(DateFormatter.format(2024, {})).toBe('2024');
    });

    it('should format range', () => {
        expect(DateFormatter.format(2024, { format: 'range', startYear: 2020 })).toBe('2020-2024');
    });

    it('should format full', () => {
        expect(DateFormatter.format(2024, { format: 'full', startYear: 2020 })).toBe('© 2020-2024');
    });

    it('should not show range if startYear is same as current', () => {
        expect(DateFormatter.format(2024, { format: 'range', startYear: 2024 })).toBe('2024');
    });
});

describe('YearObserver', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should detect year change', () => {
        const onUpdate = vi.fn();
        const observer = new YearObserver(onUpdate, { debug: false });

        // Mock current date to Dec 31
        const date = new Date(2024, 11, 31, 23, 59, 59);
        vi.setSystemTime(date);

        observer.start();

        // Advance time by 2 seconds to cross into 2025
        vi.setSystemTime(new Date(2025, 0, 1, 0, 0, 1));
        vi.advanceTimersByTime(60000); // Trigger the next check

        expect(onUpdate).toHaveBeenCalledWith(2025);
        observer.stop();
    });

    it('should use smart interval near New Year', () => {
        const observer = new (YearObserver as any)(() => { }, {});

        const normalDate = new Date(2024, 5, 1);
        expect(observer.calculateInterval(normalDate)).toBe(3600000);

        const nyeDate = new Date(2024, 11, 31, 23, 30);
        expect(observer.calculateInterval(nyeDate)).toBe(60000);

        const nydDate = new Date(2025, 0, 1, 0, 30);
        expect(observer.calculateInterval(nydDate)).toBe(60000);
    });
});
