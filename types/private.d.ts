import type { DateTime } from 'luxon';

export type MaybeArr<T> = T | T[];

export interface ParseResult {
    day: Day | undefined;
    month: Month;
    year: Year;
}

export interface ScoredDate {
    date: DateTime<boolean>;
    score: number;
}
