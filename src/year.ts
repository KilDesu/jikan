import { PARSE_ERROR_CODES } from './parser';

type InputYear = number | `${number}`;

/**
 * Check if the input is a valid year, i.e it's a positive integer.
 *
 * @param year The year to validate
 * @returns Wether the input is a valid year
 */
function validateYear(year: unknown): year is InputYear {
    const yearNbr = Number(year);

    return Number.isInteger(yearNbr) && yearNbr >= 0;
}

/**
 * Pads the year so it's in a 4-digits format.
 *
 * @param year Year to pad
 * @returns Padded year
 */
function padYear(year: string) {
    const toNbr = Number(year);

    if (year.length === 4) {
        return toNbr;
    }

    const thisYear = new Date().getFullYear();
    const thisYearPlus15 = thisYear + 15;
    const currentMillenia = Number(thisYear.toString().slice(0, 2));

    return Number(
        year.padStart(
            4,
            thisYearPlus15 >= toNbr + currentMillenia * 100
                ? currentMillenia.toString()
                : (currentMillenia - 1).toString()
        )
    );
}

/**
 * This function will try to parse the input year and throw if it fails.
 *
 * For 2-digits years (last 2 digits of the year), it compares the input with `currentYear + 15` and chooses the millenia according to the result.
 *
 * @example input = 53; currentYear = 2024 => currentYear + 15 = 2039 < 2053 => 1953 is chosen
 * @example input = 12; currentYear = 2024 => currentYear + 15 = 2039 > 2012 => 2012 is chosen
 *
 * @param year The year to convert to a valid year
 * @returns The year formatted as a 4-digits number if it's valid
 * @throws If the year is not valid, i.e is a float or is negative
 */
export function parseYear(year: unknown) {
    if (!validateYear(year)) {
        throw new Error(`L'année entrée "${year}" est invalide.`, {
            cause: PARSE_ERROR_CODES.YEAR,
        });
    }

    const yearStr = year.toString();

    return year.toString().length === 2 ? padYear(yearStr) : Number(year);
}
