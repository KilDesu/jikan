import { describe, it, expect } from 'bun:test';
import JSDate from '../src';
import { datesInputsForTests } from '.';

describe('JSDate initialisation', () => {
    for (const date of datesInputsForTests) {
        let testName: keyof (typeof date)['inputs'];

        for (testName in date.inputs) {
            it(testName, () => {
                const input = date.inputs[testName];

                const jsDate =
                    input && typeof input === 'object' && 'dateKey' in input
                        ? new JSDate(input, 'dateKey')
                        : new JSDate(input);

                expect(jsDate.isValid).toBe(date.expectedValidity);
                expect(jsDate.string).toBe(date.expectedResultString);
            });
        }
    }
});
