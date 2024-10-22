export type DateObject = {
    day: string | number | undefined;
    month: string | number;
    year: string | number;
};

export type InputDate = string | number | Date | DateObject;
export type ObjectWithDate = Record<string, unknown> & {
    [key: string]: InputDate;
};
export type Input = InputDate | ObjectWithDate;

export interface UnitOptions {
    day?: number;
    month?: number;
    year?: number;
}

export interface DiffUnitOptions {
    days?: number;
    months?: number;
    years?: number;
}
