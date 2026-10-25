/* ----- Global Variables ----- */
// Global var to store FAQs obtained from local file at load
var questions = [];

/* ----- Functions ----- */

// Executed when the FAQ remove button is pressed
function removeFaqInput() {
    $('#faqInput').val('');
    onInput();
}

// Executed when text is inputted into the FAQ box
function onInput() {
    alterAccordions($('#faqInput').val())
}

// Alters the accordions to the required search string provided
function alterAccordions(faqString) {
    $('.accordion-item').remove(); // Remove all accordion items

    var accordionsAdded = 0
    for (var i = 0; i < questions.length; i++) {
        const question = questions[i][0];
        const answer = questions[i][1];

        if (!question.toLowerCase().includes(faqString.toLowerCase()) && !answer.toLowerCase().includes(faqString.toLowerCase())) {
            continue;
        }

        var newObjHtml = '';
        newObjHtml = newObjHtml.concat(
            '<div class="accordion-item"><h2 class="accordion-header" id="heading',
            accordionsAdded,
            '"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse',
            accordionsAdded,
            '" aria-expanded="false" aria-controls="collapse',
            accordionsAdded,
            '">',
            question,
            '</button></h2><div id="collapse',
            accordionsAdded,
            '" class="accordion-collapse collapse" aria-labelledby="heading',
            accordionsAdded,
            '" data-bs-parent="#accordion"><div class="accordion-body">• ',
            answer,
            '</div></div></div>'
        ); // Make accordion obj

        // If no accordions yet added, add it differently
        if (accordionsAdded == 0) {
            $('#accordion').prepend(newObjHtml);
        } else {
            $('#' + 'collapse' + (accordionsAdded - 1)).parent().after(newObjHtml);
        }
        accordionsAdded++;
    }

    // If no accordions added, show the invalid search message
    if (accordionsAdded == 0) {
        $('.accordion').hide();
        $('.invalid-feedback').show();
    } else {
        $('.accordion').show();
        $('.invalid-feedback').hide();
    }
}

/* ----- jQuery ----- */

// Loads the FAQs from a local file
$(document).ready(function () {
    var text = $('#faqData').text();
    lines = text.split('||');
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].length > 0) {
            questions.push(lines[i].split('|'));
        }
    }
    alterAccordions(''); // Load accordions after loading file (must be inside the async block so that questions != [])
});