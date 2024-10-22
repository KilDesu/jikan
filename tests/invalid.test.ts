import { describe, it, expect } from 'bun:test';
import Jikan from '../src';

describe('Invalid Dates', () => {
    it('Invalid Day', () => {
        const dateWithInvalidDay = new Jikan('31/11/2019');

        expect(dateWithInvalidDay.isValid).toBe(false);
        expect(dateWithInvalidDay.error).toMatchObject({
            hint: `Le jour entré "31" est invalide.`,
        });
    });

    it('Invalid Day Leap Year', () => {
        const dateWithInvalidDay = new Jikan('29/02/2019');

        expect(dateWithInvalidDay.isValid).toBe(false);
        expect(dateWithInvalidDay.error).toMatchObject({
            hint: `Le jour entré "29" est invalide car l'année 2019 n'est pas bissextile.`,
        });
    });

    it('Invalid Month', () => {
        const dateWithInvalidMonth = new Jikan('31/13/2019');

        expect(dateWithInvalidMonth.isValid).toBe(false);
        expect(dateWithInvalidMonth.error).toMatchObject({
            hint: `Le mois entré "13" est invalide.`,
        });
    });
});
