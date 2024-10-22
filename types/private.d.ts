import type { DateTime } from 'luxon';
import type Day from '../src/day';
import type Month from '../src/month';
import type Year from '../src/year';

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
