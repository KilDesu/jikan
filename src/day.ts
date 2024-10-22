import { PARSE_ERROR_CODES } from './parser';
import { numberOfDaysInMonth } from './utils';

function isValidDay(day: unknown, month: number, year: number) {
    const dayNbr = Number(day);

    return (
        Number.isInteger(dayNbr) &&
        dayNbr >= 1 &&
        dayNbr <= numberOfDaysInMonth(month, year)
    );
}

/**
 * Tries to parse the input day in the context of `month` and `year`
 *
 * @param day Day to parse
 * @param month Month which the day is part of
 * @param year Year which the day is part of
 * @returns The parsed day as a number if the input is valid
 * @throws If the input is not a valid day in the context of `month` and `year`
 */
export function parseDay(day: unknown, month: number, year: number) {
    if (day === undefined) {
        return;
    }

    if (!isValidDay(day, month, year)) {
        if (Number(day) === 29 && month === 2) {
            throw new Error(
                `Le jour entré "${day}" est invalide car l'année ${year} n'est pas bissextile.`,
                {
                    cause: PARSE_ERROR_CODES.DAY,
                }
            );
        }
        throw new Error(`Le jour entré "${day}" est invalide.`, {
            cause: PARSE_ERROR_CODES.DAY,
        });
    }

    return Number(day);
}
