import { AutoDateOptions } from '../types';

export class DateFormatter {
    static format(year: number, options: AutoDateOptions): string {
        const { format = 'year', startYear } = options;

        switch (format) {
            case 'range':
                if (startYear && startYear < year) {
                    return `${startYear}-${year}`;
                }
                return `${year}`;

            case 'full':
                if (startYear && startYear < year) {
                    return `© ${startYear}-${year}`;
                }
                return `© ${year}`;

            case 'year':
            default:
                return `${year}`;
        }
    }
}
