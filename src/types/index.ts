export type AutoDateFormat = 'year' | 'range' | 'full';

export interface AutoDateOptions {
    /**
     * Output format:
     * - 'year': 2024
     * - 'range': 2020-2024
     * - 'full': © 2020-2024
     * @default 'year'
     */
    format?: AutoDateFormat;

    /**
     * The start year for 'range' and 'full' formats.
     * If not provided, it defaults to the current year.
     */
    startYear?: number;

    /**
     * Check interval in milliseconds.
     * @default 3600000 (1 hour)
     */
    interval?: number;

    /**
     * Locale for date formatting (if needed).
     * @default 'en-US'
     */
    locale?: string;

    /**
     * Whether to use a fade animation when updating.
     * @default true
     */
    animation?: boolean;

    /**
     * Callback fired when the year updates.
     */
    onUpdate?: (newYear: number) => void;

    /**
     * Enable debug logging.
     * @default false
     */
    debug?: boolean;
}

export interface AutoDateController {
    /**
     * Stops the year observer and cleans up intervals.
     */
    stop: () => void;
}
