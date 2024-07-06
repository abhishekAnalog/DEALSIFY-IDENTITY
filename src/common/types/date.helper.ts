export class DateHelpers {
    dateFormat(date) {
        const DateTodate = new Date(date);
        // subtract one day from current time
        DateTodate.setDate(DateTodate.getDate());
        const dateString =
            DateTodate.getFullYear() +
            '-' +
            (DateTodate.getMonth() + 1).toString().padStart(2, '0') +
            '-' +
            DateTodate.getDate().toString().padStart(2, '0') +
            'T00:00:00.000+00:00';
        return dateString;
    }
}