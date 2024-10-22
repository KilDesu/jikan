import { describe, it, expect } from 'bun:test';
import Jikan from '../src';

describe('Date Mutation', () => {
    const date = new Jikan('31/12/1999');

    it('Add', () => {
        date.add({
            day: 1,
            month: 1,
            year: 1,
        });

        expect(date.string).toBe('01/02/2001');
    });

    it('Set', () => {
        date.set({
            day: 1,
            month: 1,
            year: 2000,
        });

        expect(date.string).toBe('01/01/2000');
    });

    it('Subtract', () => {
        date.sub({
            day: 1,
            month: 1,
            year: 1,
        });

        expect(date.string).toBe('30/11/1998');
    });

    it('Reset', () => {
        date.reset();

        expect(date.string).toBe('31/12/1999');
    });
});
