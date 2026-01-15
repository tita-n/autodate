import { AutoDateOptions } from '../types';

export class YearObserver {
    private intervalId: any = null;
    private currentYear: number;
    private onYearChange: (year: number) => void;
    private options: AutoDateOptions;

    constructor(onYearChange: (year: number) => void, options: AutoDateOptions) {
        this.onYearChange = onYearChange;
        this.options = options;
        this.currentYear = new Date().getFullYear();
    }

    start() {
        this.check();
        this.scheduleNextCheck();
    }

    stop() {
        if (this.intervalId) {
            clearTimeout(this.intervalId);
            this.intervalId = null;
        }
    }

    private check() {
        const now = new Date();
        const year = now.getFullYear();

        if (year !== this.currentYear) {
            this.currentYear = year;
            this.onYearChange(year);
            if (this.options.debug) {
                console.log(`[autodate] Year updated to ${year}`);
            }
        }
    }

    private scheduleNextCheck() {
        const now = new Date();
        const interval = this.calculateInterval(now);

        this.intervalId = setTimeout(() => {
            this.check();
            this.scheduleNextCheck();
        }, interval);
    }

    private calculateInterval(date: Date): number {
        // Default interval: 1 hour (from options or 3600000ms)
        const defaultInterval = this.options.interval || 3600000;

        // Smart check around New Year's: 
        // From Dec 31 23:00 to Jan 1 01:00, check every minute (60000ms)
        const month = date.getMonth(); // 0-indexed, 11 is Dec
        const day = date.getDate();
        const hours = date.getHours();

        const isNewYearsEve = (month === 11 && day === 31 && hours >= 23);
        const isNewYearsDay = (month === 0 && day === 1 && hours < 1);

        if (isNewYearsEve || isNewYearsDay) {
            return 60000;
        }

        return defaultInterval;
    }
}
