/* ----- Functions ----- */

// When the light mode selector is pressed, alter the body stylign and local storage value
function colourSelector() {
    var darkMode = $('#colour-selector').is(':checked');
    if (darkMode) {
        // Swap to darkmode
        $('body').removeClass('lightmode').addClass('darkmode');
        $('.navbar-header').removeClass('navbar-light').addClass('navbar-dark');
        $('.table').removeClass('table-light').addClass('table-dark');
    } else {
        // Otherwise, swap to lightmode
        $('body').removeClass('darkmode').addClass('lightmode');
        $('.navbar-header').removeClass('navbar-dark').addClass('navbar-light');
        $('.table').removeClass('table-dark').addClass('table-light');
    }

    // Edit localStorage value of the light mode
    if (typeof (Storage) !== 'undefined') {
        if (darkMode) {
            localStorage.setItem('mode', 'darkmode');
        } else {
            localStorage.setItem('mode', 'lightmode');
        }
    } // If local storage is not supported, it will simply not be stored and not raised to the user
}

// Set the light mode selector to the currently used light mode
function initColourSelector() {
    if (typeof (Storage) !== 'undefined') {
        type = localStorage.getItem('mode');
    } else {
        type = 'darkmode';
    }
    $('#colour-selector').prop('checked', type === 'darkmode'); // Set the colour picker to appropriate mode
}

// When the user clicks the toggler (only visible on mobile/tablet) to close it, remove "> " from the start of each page
function revertNavLinkText() {
    $('a.nav-link').each(function (i, obj) {
        $(obj).text($(obj).text().substring(2));
    });
}

// When the user clicks the toggler (only visible on mobile/tablet) then add "> " to the start of each page
function changeNavLinkText() {
    // If button toggler is now expanded, add bullets, otherwise remove them
    if ($('button.navbar-toggler').attr('aria-expanded') === 'true') {
        $('a.nav-link').each(function (i, obj) {
            $(obj).text('• ' + $(obj).text());
        });
    } else {
        setTimeout(revertNavLinkText, 1000);
    }
}

// When the user clicks on the scroll to top button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// Apply styling to the website when the body is loaded, dependent on local storage value
function loadLightMode() {
    var type = 'darkmode';
    if (typeof (Storage) !== 'undefined') {
        type = localStorage.getItem('mode');
        if (type === null) {
            type = 'darkmode';
            localStorage.setItem('mode', 'darkmode');
        }
        // Set the colour picker to appropriate mode
        if (type === 'darkmode') {
            $('#colour-selector').attr('checked', 'checked');
        } else {
            $('#colour-selector').removeAttr('checked');
        }
    }
    $('body').addClass(type); // If the storage is not supported, the fallback value of type is 'darkmode'

    // Fade into page
    if (!window.AnimationEvent) { return; }
    $('#fader').addClass('fade-out');
}
  
// Executed at the start of each page, and adds the headings into the contents section
function initContents() {
    var prevElementId = "";
    $('.content section > h1, .content section > h2, .content section > h3, .content-header-figure ~ h1').each(function (i, obj) {
        if (obj.hidden) {
            return 'continue'; // If the heading is hidden, dont add it (skip the iteration of .each() by returning a non-false value)
        }
        var newId = obj.innerHTML.replaceAll(' ', '-').replaceAll('?', '').replaceAll('!', '').replaceAll('<abbr>', '').replaceAll('</abbr>', '');
        obj.id = newId;
        var newObjHtml = '<a class="list-group-item list-group-item-action px-0 ps-2 ms-2 border-0" id="contents-' + newId + '" href="#' + newId + '">' + obj.innerHTML + '</a>';
        
        if (i == 0) {
            $('#table-of-contents').prepend(newObjHtml);
        } else {
            $('#' + prevElementId).after(newObjHtml);
        }
        prevElementId = 'contents-' + newId; // Set ID of last element added (so the next one can be added after it instead of inside it)
    });
}

// Sets the jump to top button visible or not depending on scroll
function scrollFunction() {
    // When the user scrolls down 20px from the top of the document, show the button
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        $('#jump-to-top-button').fadeIn();
    } else {
        $('#jump-to-top-button').fadeOut();
    }
}

/* ----- jQuery ----- */


$(document).ready(function() {
    $('button.navbar-toggler').click(function() {
        changeNavLinkText();
    });
    
    // Initialise the scroll to top button, and set an event listener
    scrollFunction();
    $(window).scroll(scrollFunction);

    // Initialise the colour selector with the currently saved value
    initColourSelector();

    // Initialise the table of contents if there is one
    initContents();

    // Initialise fade links if animation is supported
    if (!window.AnimationEvent) { return; }
    $('.navbar a, form input[type="submit"]').click(function (event) {
        // Only do fade from links on the same host
        if ($(this).prop('hostname') === window.location.hostname) {
            
            // If its a form, use the action instead of href
            var target;
            if ($(this).prop('tagName') == 'FORM') {
                target = $(this).parent().attr('action');
            } else {
                target = event.currentTarget.href;
            }

            var listener = function () {
                window.location = target;
                $('#fader').off('animationend', listener);
            };
            $('#fader').on('animationend', listener);
            event.preventDefault();
            $('#fader').addClass('fade-in');
        }
    })
});





function detectWrap() {
    var colorSelectorDiv = $('div #colour-selector');
    if (colorSelectorDiv.parent().offset().top >= 56) { // Wraps at 19 pixels
        colorSelectorDiv.parent().addClass("wrapped");
    } else {
        colorSelectorDiv.parent().removeClass("wrapped");
    }
}


$(document).ready(detectWrap)

$(window).on('resize', detectWrap);