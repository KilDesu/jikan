import Jikan from '../src';

const baseInputDates = [
    {
        day: '31',
        month: '12',
        year: '1985',
        monthNameShort: {
            en: 'dec',
            fr: 'déc',
        },
        monthNameLong: {
            en: 'december',
            fr: 'décembre',
        },
        isValid: true,
    },
    {
        day: '29',
        month: '02',
        year: '1999',
        monthNameShort: {
            en: 'feb',
            fr: 'fév',
        },
        monthNameLong: {
            en: 'february',
            fr: 'février',
        },
        isValid: false,
    },
    {
        day: '29',
        month: '02',
        year: '2000',
        monthNameShort: {
            en: 'feb',
            fr: 'fév',
        },
        monthNameLong: {
            en: 'february',
            fr: 'février',
        },
        isValid: true,
    },
    {
        day: '01',
        month: '01',
        year: '2024',
        monthNameShort: {
            en: 'jan',
            fr: 'janv',
        },
        monthNameLong: {
            en: 'january',
            fr: 'janvier',
        },
        isValid: true,
    },
    {
        day: '26',
        month: '08',
        year: '2030',
        monthNameShort: {
            en: 'aug',
            fr: 'août',
        },
        monthNameLong: {
            en: 'august',
            fr: 'août',
        },
        isValid: true,
    },
];

export const datesInputsForTests = baseInputDates.map(
    ({ day, month, year, monthNameShort, monthNameLong, isValid }) => ({
        inputs: {
            noSep: `${day}${month}${year}`,
            noSepYearFirst: `${year}${month}${day}`,

            sepSlashShort: `${day}/${month}/${year.slice(-2)}`,
            sepSlashLong: `${day}/${month}/${year}`,
            sepSlashShortYearFirst: `${year.slice(-2)}/${day}/${month}`,
            sepSlashLongYearFirst: `${year}/${day}/${month}`,

            sepHyphenShort: `${day}-${month}-${year.slice(-2)}`,
            sepHyphenLong: `${day}-${month}-${year}`,
            sepHyphenShortYearFirst: `${year.slice(-2)}-${day}-${month}`,
            sepHyphenLongYearFirst: `${year}-${day}-${month}`,

            sepSpaceMonthNameShortEn: `${day} ${monthNameShort.en} ${year}`,
            sepSpaceMonthNameShortFr: `${day} ${monthNameShort.fr} ${year}`,
            sepSpaceMonthNameLongEn: `${day} ${monthNameLong.en} ${year}`,
            sepSpaceMonthNameLongFr: `${day} ${monthNameLong.fr} ${year}`,

            sepSpaceMonthNameShortEnNoDay: `${monthNameShort.en} ${year}`,
            sepSpaceMonthNameShortFrNoDay: `${monthNameShort.fr} ${year}`,
            sepSpaceMonthNameLongEnNoDay: `${monthNameLong.en} ${year}`,
            sepSpaceMonthNameLongFrNoDay: `${monthNameLong.fr} ${year}`,

            milliseconds: new Date(`${year}-${month}-${day}`).getTime(),
            date: new Date(`${year}-${month}-${day}`),
            jsDate: new Jikan(`${day}/${month}/${year}`),
            noInput: undefined,
            dateObject: {
                day: Number(day),
                month: Number(month),
                year: Number(year),
            },
            objectWithDate: {
                dateKey: `${day}/${month}/${year}`,
                otherKey: "My other key I don't care about",
            },
        },

        expectedResultString: isValid
            ? `${day}/${month}/${year}`
            : 'Date invalide',
        expectedValidity: isValid,
    })
);
