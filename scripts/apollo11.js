/* ----- Functions ----- */

// Executed when the user pressed the "Show location" button
function showLocation() {
    function errorHandler(string) {
        $('#location-button').fadeOut();
        $('#location').text(string);
    }

    if (!navigator.geolocation) {
        errorHandler('We\'re sorry, but geolocation is not supported by this browser.');
        return;
    }

    var geolocationError = function () {
        errorHandler('There was an error getting your geolocation data, please\
                    refresh the webpage and try again. If it doesn\t work again,\
                    check your permissions.');
    }
    navigator.geolocation.watchPosition(parseLocation, geolocationError);
    navigator.geolocation.getCurrentPosition(displayDirections, geolocationError);
}

// Parse the user's location
function parseLocation(position) {
    // Signed decimal degrees of Cape Canaveral
    const capeLat = 28.3922;
    const capeLon = -80.6077;

    const r = 6371e3; // Radius of the Earth in metres
    const lat1 = capeLat * Math.PI / 180;
    const lat2 = position.coords.latitude * Math.PI / 180;
    const latDifference = (position.coords.latitude - capeLat) * Math.PI / 180;
    const longDifference = (position.coords.longitude - capeLon) * Math.PI / 180;

    // Haversine formula to calculate distance between points
    const a = Math.sin(latDifference / 2) * Math.sin(latDifference / 2) + // First sin^2 term
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(longDifference / 2) * Math.sin(longDifference / 2); // Second term

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = r * c / 1000; // Final distance in kilometres
    $('#location').text('Your distance to Cape Canaveral is: ');
    $('#location').append('<strong>' + distance.toPrecision(6) + 'km</strong>');
}

function displayDirections(position) {
    var frame = '<iframe width="600" height="450" style="border:0" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyD3oS9Fvo8Bw-usF_JXrvxcPqRFIlUvTp8&mode=flying&origin=';
    frame = frame.concat(position.latitude, ',', position.longitude, '&destination=Cape+Canaveral"></iframe>');

    // Add in the map ONLY ONCE
    if ($('iframe').length == 3) { // (there are 3 iframes on each modal, if there is more than 3 then the map has already loaded)
        $('#location').after(frame);
        $('#location-button').fadeOut();
    }
}

// When the window is changed above 576px, make the map from 300px -> 500px
function smallestMapSize(x) {
    if (x.matches) { // If media query matches
        $('iframe').attr('width', '300');
    } else {
        $('iframe').attr('width', '500');
    }
}
// When the window is changed above 992px, make the map from 500px -> 700px
function mediumMapSize(x) {
    if (x.matches) { // If media query matches
        $('iframe').attr('width', '500');
    } else {
        $('iframe').attr('width', '700');
    }
}

// Handle the weather data, and add it to the page
async function handleWeatherData(jsonData) {
    var today = jsonData['dataseries'][0];
    var wind = today['wind10m_max'];
    var temp = today['temp2m'];
    $('#weather').text('Live weather report of Cape Canaveral: ');
    var report = '<strong>' + "Lows of " + temp['min'] + '°C' + ', highs of: ' + temp['max'] + '°C, with ';

    switch (wind) {
        case 1:
            report += 'calm winds';
            break;
        case 2:
            report += 'light winds'
            break;
        case 3:
            report += 'moderate winds'
            break;
        case 4:
            report += 'fresh winds'
            break;
        case 5:
            report += 'strong winds'
            break;
        case 6:
            report += 'gale winds'
            break;
        case 7:
            report += 'storm like winds'
            break;
        case 8:
            report += 'hurricane like winds'
            break;
    };

    report += '</strong><sup>[<a aria-label="Reference 6" href="#References">6</a>]';
    $('#weather').append(report);
}

/* ----- jQuery ----- */

$(document).ready(function () {
    // When viewport changes to above 576px, call `smallestMapSize`
    var x = window.matchMedia('(max-width: 576px)');
    smallestMapSize(x);
    x.addEventListener('change', smallestMapSize);
});

$(document).ready(function () {
    // When viewport changes to above 992px, call `mediumMapSize`
    var x = window.matchMedia('(max-width: 992px)');
    mediumMapSize(x);
    x.addEventListener('change', mediumMapSize);
});

$(document).ready(function () {
    fetch('https://www.7timer.info/bin/api.pl?lon=-80.608&lat=28.392&product=civillight&output=json') // URL of weather data
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(json => handleWeatherData(json))
        .catch(err => $('#weather').text('There was a problem fetching the live weather report of Cape Canaveral'));
})