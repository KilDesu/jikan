import { parseDay } from './day';
import { parseMonth } from './month';
import { parseYear } from './year';

type DateObj<T extends 'in' | 'out'> = T extends 'in'
    ? { day: unknown; month: unknown; year: unknown }
    : { day: number | undefined; month: number; year: number };

function parse(dateObj: DateObj<'in'>) {
    const year = parseYear(dateObj.year);
    const month = parseMonth(dateObj.month);
    const day = parseDay(dateObj.day, month, year);

    return {
        day,
        month,
        year,
    };
}

export enum PARSE_ERROR_CODES {
    DAY,
    MONTH,
    YEAR,
}

export function tryParse(
    dateObj: DateObj<'in'>
):
    | { value: DateObj<'out'>; error: null }
    | { value: null; error: { message: string; code: PARSE_ERROR_CODES } } {
    try {
        return { value: parse(dateObj), error: null };
    } catch (err) {
        if (!(err instanceof Error)) {
            throw new Error('Cette erreur ne devrait pas être possible');
        }

        return {
            value: null,
            error: {
                message: err.message,
                code: err.cause as PARSE_ERROR_CODES,
            },
        };
    }
}
