import { describe, it, expect } from 'bun:test';
import Jikan from '../src';

describe('Formatting', () => {
    const date = new Jikan('01/01/2000');

    it('Day', () => {
        expect(date.day).toBe(1);
        expect(date.dayString('numeric')).toBe('01');
        expect(date.dayString('short')).toBe('sam.');
        expect(date.dayString('long')).toBe('samedi');
    });

    it('Month', () => {
        expect(date.month).toBe(1);
        expect(date.monthString('numeric')).toBe('01');
        expect(date.monthString('short')).toBe('janv.');
        expect(date.monthString('long')).toBe('janvier');
    });

    it('Year', () => {
        expect(date.year).toBe(2000);
    });

    it('Date', () => {
        expect(date.string).toBe('01/01/2000');
        expect(date.format('dd/mm/yy')).toBe('01/01/00');
        expect(date.format('yyyy-mm-dd')).toBe('2000-01-01');
        expect(date.format('dd mmm yyyy')).toBe('01 janv. 2000');
        expect(date.format('mmmm yyyy')).toBe('janvier 2000');
        expect(date.format('dddd der mmmm yyyy')).toBe(
            'samedi 1er janvier 2000'
        );
    });
});
