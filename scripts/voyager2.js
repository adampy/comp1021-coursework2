/* ----- Functions ----- */

// Set $('#voyager2-met').text() to the time string for the MET of Voyager 2
function setVoyager2MET() {
    const MS_IN_A_SECOND = 1000;
    const MS_IN_A_MINUTE = MS_IN_A_SECOND * 60;
    const MS_IN_A_HOUR = MS_IN_A_MINUTE * 60;
    const MS_IN_A_DAY = MS_IN_A_HOUR * 24;
    const MS_IN_A_YEAR = MS_IN_A_DAY * 365.25; // To account for leap years

    const voyager2 = new Date(Date.UTC(77, 7, 20, 14, 29));
    const now = Date.now();
    const difference = now - voyager2;
    var msAccountedFor = 0; // Keeps track of how much of difference has been accounted for

    const differenceYears = Math.floor(difference / MS_IN_A_YEAR);
    msAccountedFor += differenceYears * MS_IN_A_YEAR;

    const differenceDays = Math.floor((difference - msAccountedFor) / MS_IN_A_DAY);
    msAccountedFor += differenceDays * MS_IN_A_DAY;

    const differenceHours = Math.floor((difference - msAccountedFor) / MS_IN_A_HOUR);
    msAccountedFor += differenceHours * MS_IN_A_HOUR;

    const differenceMinutes = Math.floor((difference - msAccountedFor) / MS_IN_A_MINUTE);
    msAccountedFor += differenceMinutes * MS_IN_A_MINUTE;

    const differenceSeconds = Math.floor((difference - msAccountedFor) / MS_IN_A_SECOND);
    msAccountedFor += differenceSeconds * MS_IN_A_SECOND;

    var output = '';
    output = output.concat(differenceYears, ' year(s), ', differenceDays, ' day(s), ', differenceHours, ' hour(s), ', differenceMinutes, ' minute(s), ', differenceSeconds, ' second(s).');
    $('#voyager2-met').text(output);
}

/* ----- jQuery ----- */

$(document).ready(function() {
    setVoyager2MET();
    setInterval(setVoyager2MET, 500);
});