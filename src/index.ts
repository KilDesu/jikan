import { DateTime, Settings } from 'luxon';
import { tryParse } from './parser';
import { objAbs } from './utils';
import type {
    ScoredDate,
    UnitOptions,
    DateObject,
    MaybeArr,
    Input,
    ObjectWithDate,
} from '../types/index';

const DATE_REGEXP = {
    REGEXP_PATTERN_DATE_MONTHNAME:
        '(?<day>\\d{2}|\\d{1})[\\/ .:-](?<month>\\D{3,9})[\\/ .:-](?<year>\\d{4}|\\d{2})',
    REGEXP_PATTERN_DATE_NODAY_MONTHNAME:
        "(?<!\\d{2}|\\d{1} )(d'|)(?<month>[^0-9 ]{3,9})[\\/ .:-](?<year>\\d{4}|\\d{2})",

    REGEXP_PATTERN_DATE_SEP:
        '(?<day>\\d{2}|\\d{1})[\\/ .:-](?<month>\\d{2}|\\d{1})[\\/ .:-](?<year>\\d{4}|\\d{2})',
    REGEXP_PATTERN_DATE_SEP_YEARFIRST:
        '(?<year>\\d{4}|\\d{2})[\\/ .:-](?<month>\\d{2}|\\d{1})[\\/ .:-](?<day>\\d{2}|\\d{1})',

    REGEXP_PATTERN_DATE_NOSEP_YY:
        '(?<day>\\d{2})(?<month>\\d{2}|\\d{1})(?<year>\\d{2})',
    REGEXP_PATTERN_DATE_NOSEP_YYYY:
        '(?<day>\\d{2})(?<month>\\d{2}|\\d{1})(?<year>\\d{4})',
    REGEXP_PATTERN_DATE_NOSEP_YEARFIRST_YY:
        '(?<year>\\d{2})(?<month>\\d{2}|\\d{1})(?<day>\\d{2})',
    REGEXP_PATTERN_DATE_NOSEP_YEARFIRST_YYYY:
        '(?<year>\\d{4})(?<month>\\d{2}|\\d{1})(?<day>\\d{2})',
};

const DATE_INVALIDE = 'Date invalide';

/**
 * A utility class to manipulate dates without worrying about units of time shorter than days. All date-related words are in French (i.e weekdays and months).
 *
 * This class uses [Luxon](https://github.com/moment/luxon/) under the hood.
 *
 * @param input - The input to parsed as a date. If `undefined`, the current day will be used.
 */
export default class Jikan<T extends Input | undefined = undefined> {
    #input: T | undefined;
    #intialValue: DateTime<boolean>;
    #value: DateTime<boolean>;

    /**
     * Allows to map all the values inside the given array to a Jikan
     *
     * @param arr Array of dates to be mapped to Jikans
     * @returns An array of Jikans
     */
    public static fromArray<T extends Input>(arr: T[]) {
        return arr.map((val) => new Jikan(val));
    }

    /**
     * Extracts the earlier dates inside an array of Jikans.
     *
     * If the input is not an array but rather a standalone Jikan, it will simply be returned as is.
     *
     * @param arr The array of dates to get the minimal date from
     * @returns The earlier date
     */
    public static min<T extends Input>(arr: MaybeArr<Jikan<T>>): Jikan<T> {
        if (!Array.isArray(arr)) {
            return arr;
        }

        return new Jikan(
            DateTime.min(
                ...arr.map((d) => d.luxonDateTime)
            ).toLocaleString() as T
        );
    }

    /**
     * Extracts the laterer dates inside an array of Jikans.
     *
     * If the input is not an array but rather a standalone Jikan, it will simply be returned as is.
     *
     * @param arr The array of dates to get the maximal date from
     * @returns The laterer date
     */
    public static max<T extends Input>(arr: MaybeArr<Jikan<T>>): Jikan<T> {
        if (!Array.isArray(arr)) {
            return arr;
        }

        return new Jikan(
            DateTime.max(
                ...arr.map((d) => d.luxonDateTime)
            ).toLocaleString() as T
        );
    }

    /**
     * Extracts all the dates from the given string and returns them as Jikans.
     *
     * @param str The string to extract the dates from
     * @returns An array of Jikans extracted from the given string
     */
    public static extractDates(str: string) {
        const extracted: Jikan<DateObject>[] = [];

        let regexName: keyof typeof DATE_REGEXP;
        for (regexName in DATE_REGEXP) {
            const regex = new RegExp(DATE_REGEXP[regexName], 'g');

            let execRes;
            while ((execRes = regex.exec(str)) !== null) {
                if (!execRes.groups) {
                    continue;
                }

                type Group = {
                    day: string | undefined;
                    month: string;
                    year: string;
                };

                const { value } = tryParse(execRes.groups as Group);

                if (value) {
                    extracted.push(new Jikan(value));
                }
            }
        }

        return extracted;
    }

    constructor(input?: T, key?: keyof T) {
        Settings.defaultLocale = 'fr';
        Settings.defaultZone = 'utc';

        this.#input = input;

        const adaptedInput = this.#adaptInput(input, key);
        const allDatesFound = this.#parse(adaptedInput);

        this.#intialValue = this.#value = this.#getHigherScored(allDatesFound);
    }

    #adaptInput(input?: T, key?: keyof T): string {
        return !input
            ? new Date().toLocaleDateString('fr-FR')
            : input instanceof Date
            ? input.toLocaleDateString('fr-FR')
            : typeof input === 'object' && 'month' in input && 'year' in input
            ? `${'day' in input ? input.day : '01'}/${input.month}/${
                  input.year
              }`
            : typeof input === 'object' && key && key in input
            ? this.#adaptInput(input[key as keyof ObjectWithDate] as T)
            : typeof input === 'number' && !isNaN(input)
            ? new Date(input).toLocaleDateString('fr-FR')
            : input.toString();
    }

    #parse(adaptedInput: string): ScoredDate[] {
        let regexName: keyof typeof DATE_REGEXP;
        const res: ScoredDate[] = [];

        for (regexName in DATE_REGEXP) {
            const regex = new RegExp(`^${DATE_REGEXP[regexName]}$`);
            const execResult = regex.exec(adaptedInput);

            if (execResult && execResult.groups) {
                const { day, month, year } = execResult.groups;

                const { value, error } = tryParse({
                    day,
                    month,
                    year,
                });

                if (error || !value) {
                    res.push({
                        date: DateTime.invalid(
                            `La date entrée "${adaptedInput}" n'a pas pu être parsée`,
                            error.message
                        ),
                        score: 0,
                    });
                } else {
                    let score = 0;

                    if (value.day) {
                        score += 1;
                    }

                    const thisYear = new Date().getFullYear();
                    if (
                        thisYear - 100 <= value.year &&
                        thisYear + 100 >= value.year
                    ) {
                        score += 1;
                    }

                    res.push({ date: DateTime.fromObject(value), score });
                }
            }
        }

        return res;
    }

    #getHigherScored(allDates: ScoredDate[]): DateTime<boolean> {
        // Get max score first
        allDates.sort((a, b) => (a.score > b.score ? -1 : 1));

        return allDates[0].date;
    }

    /**
     * Returns a string if the date is invalid, or calls the given callback in case it's valid.
     *
     * @param cb What to do with the date in case it's valid
     * @returns Whatever is returned from the callback
     */
    #ifValid<T>(cb: (date: DateTime<true>) => T) {
        return this.isValid ? cb(this.#value) : DATE_INVALIDE;
    }

    /**
     * Returns a readonly reference to the input given to the instance of Jikan.
     *
     * @readonly
     * @memberof Jikan
     */
    get input() {
        return this.#input;
    }

    /**
     * Returns a readonly reference to the parsed date as a Luxon [DateTime](https://moment.github.io/luxon/api-docs/index.html#datetime).
     *
     * @readonly
     * @memberof Jikan
     */
    get luxonDateTime() {
        return this.#value;
    }

    /**
     * If the date parsed by the current instance is invalid, will return an object containing an error message and a hint to why the date is invalid.
     *
     * @readonly
     * @memberof Jikan
     */
    get error() {
        return this.isValid
            ? null
            : {
                  message: this.#value.invalidReason,
                  hint: this.#value.invalidExplanation,
              };
    }

    /**
     * Returns wether the current Jikan instance is valid or not.
     *
     * @readonly
     * @memberof Jikan
     */
    get isValid() {
        return this.#value.isValid;
    }

    /**
     * If the date parsed by the current instance is valid, will return the day of the date as a number.
     *
     * @readonly
     * @memberof Jikan
     */
    get day() {
        return this.#value.day;
    }

    /**
     * If the date parsed by the current instance is valid, will return the month of the date as a number (from 1 to 12).
     *
     * @readonly
     * @memberof Jikan
     */
    get month() {
        return this.#value.month;
    }

    /**
     * If the date parsed by the current instance is valid, will return the number of days in the month of the date.
     *
     * @readonly
     * @memberof Jikan
     */
    get daysInMonth() {
        return this.#value.daysInMonth;
    }

    /**
     * If the date parsed by the current instance is valid, will return the year of the date as a number.
     *
     * @readonly
     * @memberof Jikan
     */
    get year() {
        return this.#value.year;
    }

    /**
     * If the date parsed by the current instance is valid, will return the number of days in the year of the date as a number.
     *
     * @readonly
     * @memberof Jikan
     */
    get daysInYear() {
        return this.#value.daysInYear;
    }

    /**
     * If the date parsed by the current instance is valid, will return which half of the year the date is in.
     *
     * @readonly
     * @memberof Jikan
     */
    get half() {
        return this.#value.quarter <= 2 ? 1 : 2;
    }

    /**
     * If the date parsed by the current instance is valid, will return which quarter of the year the date is in.
     *
     * @readonly
     * @memberof Jikan
     */
    get quarter() {
        return this.#value.quarter;
    }

    /**
     * If the date parsed by the current instance is valid, will return wether the date is a weekend day or not.
     *
     * @readonly
     * @memberof Jikan
     */
    get isWeekend() {
        return this.#value.isWeekend;
    }

    /**
     * If the date parsed by the current instance is valid, will return wether the year the date is in is a leap year or not.
     *
     * @readonly
     * @memberof Jikan
     */
    get isInLeapYear() {
        return this.#value.isInLeapYear;
    }

    /**
     * If the date parsed by the current instance is valid, will return the date formatted as a standard French date (DD/MM/YYYY).
     *
     * @readonly
     * @memberof Jikan
     */
    get string() {
        return this.#ifValid((date) => date.toLocaleString());
    }

    /**
     * If the date parsed by the current instance is valid, will return the date formatted as an object { day: number, month: number: year: number }.
     *
     * @readonly
     * @memberof Jikan
     */
    get object() {
        return this.#ifValid((date) => date.toObject());
    }

    /**
     * If the date parsed by the current instance is valid, will return the day of the date formatted as the given format.
     *
     * - numeric: day padded to 2 digits (e.g 01 or 31)
     * - short: short version of the day of the week (e.g lun. or dim.)
     * - long: long version of the day of the week (e.g lundi or dimanche)
     *
     * @param format Format of the output day
     * @memberof Jikan
     */
    public dayString(format: 'numeric' | 'short' | 'long') {
        return this.#ifValid((date) =>
            format === 'numeric'
                ? date.day.toString().padStart(2, '0')
                : format === 'short'
                ? date.weekdayShort
                : date.weekdayLong
        );
    }

    /**
     * If the date parsed by the current instance is valid, will return the month of the date formatted as the given format.
     *
     * - numeric: month padded to 2 digits (e.g. 01 or 12)
     * - short: short version of the month (e.g. janv. or déc.)
     * - long: long version of the month (e.g. janvier or décembre)
     *
     * @param format Format of the output month
     * @memberof Jikan
     */
    public monthString(format: 'numeric' | 'short' | 'long') {
        return this.#ifValid((date) =>
            format === 'numeric'
                ? date.month.toString().padStart(2, '0')
                : format === 'short'
                ? date.monthShort!
                : date.monthLong!
        );
    }

    /**
     * Returns the date formatted following the given pattern.
     *
     * - d: non-padded day
     * - dd: padded day
     * - ddd: short version of the day of the week
     * - dddd: long version of the day of the week
     * - m: non-padded month
     * - mm: padded month
     * - mmm: short version of the month name
     * - mmmm: long version of the month name
     * - yy: two last digits of the year
     * - yyyy: full year
     *
     * @example
     * ```js
     * const date = new Jikan("01012000");
     * date.format("yyyy-mm-dd"); // 2000-01-01
     * date.format("mmmm yy"); // janvier 00
     * date.format("Le dddd der mm yyyy"); // Le samedi 1er janvier 2000
     * ```
     *
     * @param pattern Pattern to format the date from
     * @returns
     */
    public format(pattern: string) {
        return this.#ifValid((date) =>
            date.toFormat(
                pattern
                    .replaceAll('m', 'L')
                    .replaceAll('dddd', 'cccc')
                    .replaceAll('ddd', 'ccc')
            )
        );
    }

    /**
     * Assigns new values to the given units.
     * This method mutates the instance's internal value.
     *
     * @param opts Object containing the units to set the date with
     */
    public set(opts: UnitOptions) {
        this.#value = this.#value.set(opts);
    }

    /**
     * Returns a new Jikan with the given unites assigned to new values. The method doesn't mutate the instance's internal value.

     * @param opts Object containing the units to set the date with
     * @returns The date with the given units reassigned.
     */
    public withSet(opts: UnitOptions) {
        return new Jikan(this.#value.set(opts));
    }

    /**
     * Adds days, months and/or years to the date.
     * This method mutates the instance's internal value.
     *
     * @param opts Object containing the units to add to the date
     */
    public add(opts: UnitOptions) {
        this.#value = this.#value.plus(opts);
    }

    /**
     * Returns the date with days, months and/or years added to it.
     * This method doesn't mutate the instance's internal value.
     *
     * @param opts Object containing the units to add to the date
     */
    public withAdded(opts: UnitOptions) {
        return new Jikan(this.#value.plus(opts));
    }

    /**
     * Subtract days, months and/or years from the date.
     * This method mutates the instance's internal value.
     *
     * @param opts Object containing the units to subtract from the date
     */
    public sub(opts: UnitOptions) {
        this.#value = this.#value.minus(opts);
    }

    /**
     * Returns the date with days, months and/or years subtracted from it.
     * This method doesn't mutate the instance's internal value.
     *
     * @param opts Object containing the units to subtract from the date
     */
    public withSubbed(opts: UnitOptions) {
        return new Jikan(this.#value.minus(opts));
    }

    /**
     * Resets the internal value to the original input date.
     * This method mutates this instance's internal value.
     */
    public reset() {
        this.#value = this.#intialValue;
    }

    /**
     * Computes the absolute difference between two dates, so the order of the dates doesn't matter.
     *
     * @param otherDate Other date to calculate the difference with
     * @param units Units to format the output difference with
     * @returns The time difference between the two dates formatted as the given `units`
     */
    public diff<T extends Input>(
        otherDate: T,
        units: MaybeArr<keyof DateObject> = 'day'
    ) {
        const otherDateRef =
            otherDate instanceof Jikan ? otherDate : new Jikan(otherDate);

        if (!this.isValid || !otherDateRef.isValid) {
            return null;
        }

        return objAbs(
            this.#value
                .diff(otherDateRef.luxonDateTime, units, {
                    conversionAccuracy: 'longterm',
                })
                .toObject()
        );
    }

    /**
     * Computes the absolute difference between the instance's date and the current date.
     *
     * @param units Units to format the output difference with
     * @returns The time difference between the date and today formatted as the given `units`
     */
    public diffNow(units: MaybeArr<keyof DateObject> = 'day') {
        const today = new Jikan();

        return objAbs(
            this.#value
                .diff(today.luxonDateTime, units, {
                    conversionAccuracy: 'longterm',
                })
                .toObject()
        );
    }

    /**
     * Checks for equality between the given date and the instance's date
     *
     * @param otherDate Date to check the equality for
     * @returns Wether the given date is equal to the instance's date
     */
    public equal<T extends Input>(otherDate: T) {
        const ref =
            otherDate instanceof Jikan ? otherDate : new Jikan(otherDate);

        return this.#value.equals(ref.luxonDateTime);
    }
}
