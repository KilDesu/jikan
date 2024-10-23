import type { DiffUnitOptions, MaybeArr } from '../types/index';

export function isNumeric(input: unknown) {
    return typeof input === 'number' || !isNaN(Number(input));
}

function isLeap(year: number) {
    return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}

export function numberOfDaysInMonth(
    month: number,
    year: number
): 28 | 29 | 30 | 31 {
    if (month < 1 || month > 12) {
        throw new Error(`The month "${month}" is invalid.`);
    }

    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
        return 31;
    }

    if ([4, 6, 9, 11].includes(month)) {
        return 30;
    }

    return isLeap(year) ? 29 : 28;
}

export function throwOnNestedArray<T, G>(array: T[], cb: (val: T) => G) {
    return array.map((val) => {
        if (Array.isArray(val)) {
            throw new Error(
                'Les tableaux imbriqués ne sont pas pris en charge'
            );
        }

        return cb(val) as G;
    });
}

export function isNestedArray<T>(arr: MaybeArr<T[]>): arr is T[][] {
    return Array.isArray(arr[0]);
}

export function objAbs(input: DiffUnitOptions) {
    let key: keyof DiffUnitOptions;
    for (key in input) {
        const val = input[key];
        if (!val) {
            continue;
        }

        input[key] = Math.abs(val);
    }

    return input;
}
