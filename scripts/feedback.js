/* ----- jQuery ----- */

// Add a new event listener to form (those with .needs-validation) submissions
$(document).ready(function () {
    $('.needs-validation').submit(function (event) {
        if (!$(this)[0].checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        $(this).addClass('was-validated'); // If valid, do not prevent default behaviour
    });
});