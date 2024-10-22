import { PARSE_ERROR_CODES } from './parser';
import { isNumeric } from './utils';

const MonthMap = {
    1: ['jan', 'janv', 'janvier', 'january'],
    2: ['fev', 'feb', 'fevrier', 'février', 'february'],
    3: ['mar', 'mars', 'march'],
    4: ['avr', 'apr', 'avril', "d'avril", 'april'],
    5: ['mai', 'may'],
    6: ['jun', 'juin', 'june'],
    7: ['jul', 'juillet', 'july'],
    8: ['aug', 'aout', 'août', "d'aout", "d'août", 'august'],
    9: ['sep', 'sept', 'septembre', 'september'],
    10: ['oct', 'octobre', 'october'],
    11: ['nov', 'novembre', 'november'],
    12: ['dec', 'decembre', 'décembre', 'december'],
};

function validateMonth(month: unknown): month is string | number {
    if (isNumeric(month)) {
        const monthNbr = Number(month);

        return Number.isInteger(monthNbr) && monthNbr >= 1 && monthNbr <= 12;
    }

    if (typeof month !== 'string') {
        return false;
    }

    const monthNormalized = month.toLowerCase().replaceAll(/[^A-Za-z]/g, '');

    for (const monthNames of Object.values(MonthMap)) {
        if (monthNames.includes(monthNormalized)) {
            return true;
        }
    }

    return false;
}

function getMonthNumberFromName(month: string | number) {
    if (typeof month === 'number') {
        return month;
    }

    month = month.toLowerCase().replaceAll(/[^A-Za-z]/g, '');

    for (const monthNbrAsStr in MonthMap) {
        const monthNbr = Number(monthNbrAsStr) as keyof typeof MonthMap;
        const keywords = MonthMap[monthNbr];

        if (keywords.includes(month)) {
            return monthNbr;
        }
    }

    return;
}

/**
 * Will try to parse the input month and throw if it fails.
 *
 * @param month Month to parse
 * @returns The month as a number if it's valid
 * @throws If the month is not valid, i.e not a number between 1 and 12 or not a french/english month name (short or long)
 */
export function parseMonth(month: unknown) {
    if (!validateMonth(month)) {
        throw new Error(`Le mois entré "${month}" est invalide.`, {
            cause: PARSE_ERROR_CODES.MONTH,
        });
    }

    return getMonthNumberFromName(month) || Number(month);
}
