Hooks.on("renderFormApplication", (app) => {
    
    if (!$(`div[data-appid="${app.appId}"]`).hasClass('macro-sheet')) {

        $(`div[data-appid="${app.appId}"]`).addClass('tui-form');
        formFieldOrganizer(app);

        // Resize the window to fit it's contents
        $(`div[data-appid="${app.appId}"]`).css('height', 'auto');

    }

});

Hooks.on("renderSceneConfig", (app) => {

    setTimeout(() => { // Make it not happen instantly, so that other modules can append their stuff before the code runs

        // Runs the sectioner
        form_sectioner(app);

        // Fixes the incorrect html structure of Small Time
        if ($('.st-scene-config').length > 0 && $('.st-scene-config').find('.form-group').length == 1) {

            $('.st-scene-config').find('label').each(function() {

                let formGroup = $('<div class="form-group"></div>').insertAfter($(this).parent());
                let formField = $('<div class="form-fields"></div>').insertAfter($(this));

                $(this).nextUntil('label').each(function() {
                    if($(this).hasClass('notes')) {
                        $(this).appendTo(formGroup);
                    } else {
                        $(this).appendTo(formField);
                    }
                });

                formField.prependTo(formGroup);
                $(this).prependTo(formGroup);
            });

            $('.st-scene-config').find('.form-group').eq(0).remove();

        }

        // Fixes Foundry's fucked up background image field note
        let floatingNote = $(`div[data-appid="${app.appId}"] .form-section-1`).find('.notes').eq(1);
        floatingNote.appendTo(floatingNote.next());

        // Fixes Foundry's fucked up foreground image field note
        let climberNote = floatingNote.parent().next().find('.notes');
        climberNote.appendTo(climberNote.parent());

        // Runs the form field organizer
        formFieldOrganizer(app);
    }, 10);

});

// These two variables need to be up here in the global scope
// to be used when the item sheet re-renders
let prevTab = 1;
let prevTop;

Hooks.on("renderItemSheet", (app) => {

    form_sectioner(app);
    formFieldOrganizer(app);

    // Wrap Spell components in .form-fields
    if ($(`div[data-appid="${app.appId}"]`).find('.spell-components').length > 0) {
        $(`div[data-appid="${app.appId}"]`).find('.spell-components').append('<div class="form-fields"></div>');
        $(`div[data-appid="${app.appId}"]`).find('.spell-components').children().each(function() {
            if ($(this).hasClass('checkbox')) {
                $(this).appendTo($(this).parent().find('.form-fields'));
            }
        });
    }

    // Wrap weapon properties in .form-fields
    if ($(`div[data-appid="${app.appId}"]`).find('.weapon-properties').length > 0) {
        $(`div[data-appid="${app.appId}"]`).find('.weapon-properties').append('<div class="form-fields"></div>');
        $(`div[data-appid="${app.appId}"]`).find('.weapon-properties').children().each(function() {
            if ($(this).hasClass('checkbox')) {
                $(this).appendTo($(this).parent().find('.form-fields'));
            }
        });
    }

    // When you click on one of the navigation tabs on the item sheet, it removes
    // the class .active from everything, including my form section tabs.
    // This click event makes it that everytime the user clicks on details,
    // it also triggers a click on the first tab, so that it get an .active
    $(`div[data-appid="${app.appId}"]`).on('click', 'a.item[data-tab="details"]', function() {
        $(`div[data-appid="${app.appId}"] .form-tab-${prevTab}`).trigger('click');
    });

});


/* ---------------------------- */
/* ------- FUNCTIONLAND ------- */
/* ---------------------------- */


function form_sectioner(app) {

    // if there's more than 1 form header
    if ($(`div[data-appid="${app.appId}"] .form-header`).length > 1) {

        // Adds a class to the window, so that it can be styled
        // without affecting all forms
        $(`div[data-appid="${app.appId}"]`).addClass('tui-form');

        // Adds an empty navbar to the top of the form. It will be populated later
        $(`div[data-appid="${app.appId}"] .form-header`).parent().prepend(`<nav class="sheet-tabs form-tabs tabs" id="form-nav${app.appId}"></nav>`);

        let i = 1; // A counter for the number of tabs

        $(`div[data-appid="${app.appId}"] .form-header`).each(function() {

            // For each header, add a form-tab. These are the wrappers for the form sections.
            // If there's a submit button (such as in the scene config window), it inserts
            // the tabs before the submit button
            if($(this).parent().find('button[name="submit"]').length > 0) {
                $(`<div class="tab form-tab form-section-${i}" data-tab="${$(this).text()}"></div>`).insertBefore($(this).parent().find('button[name="submit"]'));
            } else {
                $(this).parent().append(`<div class="tab form-tab form-section-${i}" data-tab="${$(this).text()}"></div>`);
            }

            // Grabs everything between this header and the next and yoinks it
            // into it's corresponding section. Unless it's the submit button,
            // in which case, we leave it alone
            $(this).nextUntil('.form-header').each(function() {
                if ($(this).attr('name') == 'submit') {
                    return;
                } else if (!$(this).hasClass('form-tab')) {
                    $(this).appendTo(`div[data-appid="${app.appId}"] .form-section-${i}`);
                }
            });

            // Moves the form-header to the navbar, and make it an a tag, instead
            // of an h3, so that it mimics the standard foundry tabs
            $(this).appendTo(`div[data-appid="${app.appId}"] #form-nav${app.appId}`);
            $(this).replaceWith($(`<a class="item form-item form-tab-${i}" data-tab="${$(this).text()}">${this.innerHTML}</a>`));

            i++; // Increase the tab counter
        });

        // If there is a form-section (that is, if the code worked)
        // activates the first tab (or the previous tab, in the case of an item sheet)
        if($(`div[data-appid="${app.appId}"] .form-section-1`).length > 0) {            

            // If the app window is an item sheet, activate the previous tab.
            // This is because everytime you change a value in the sheet
            // it re-renders it, and if you are on tab-3, it would send
            // you back to tab-1. This makes sure it always comes back
            // to the previouslu visited tab
            if($(`div[data-appid="${app.appId}"]`).hasClass('sheet')) {
                $(`div[data-appid="${app.appId}"] .form-section-${prevTab}`).addClass('active');
                $(`div[data-appid="${app.appId}"] .form-tab-${prevTab}`).addClass('active');
            } else {
                $(`div[data-appid="${app.appId}"] .form-section-1`).addClass('active');
                $(`div[data-appid="${app.appId}"] .form-tab-1`).addClass('active');
            }

        }

        // Resize the window to fit it's contents
        $(`div[data-appid="${app.appId}"]`).css('height', 'auto');

        // If it's an item sheet, resizes the window through CSS
        // and then updates the window position
        if($(`div[data-appid="${app.appId}"]`).hasClass('sheet') && $(`div[data-appid="${app.appId}"]`).hasClass('item') &&prevTop != null) {
            $(`div[data-appid="${app.appId}"]`).css('top', prevTop);
            app.position.top = prevTop;
        }

        // This is the tab handler. Upon clicking the tab, it removes the active class from
        // all other tabs, and adds it to the clicked tab. and resizes the window
        $(`div[data-appid="${app.appId}"]`).on('click', 'a.form-item', function() {
            let tabIndex = $(this).attr('class').match(/form-tab-\d/)[0].replace('form-tab-', '');

            $(`div[data-appid="${app.appId}"]`).find('.form-item.active').removeClass('active');
            $(`div[data-appid="${app.appId}"]`).find('.form-tab.active').removeClass('active');

            $(`div[data-appid="${app.appId}"]`).find(`.form-tab-${tabIndex}`).addClass('active');
            $(`div[data-appid="${app.appId}"]`).find(`.form-section-${tabIndex}`).addClass('active');

            // Resize the window to fit it's contents
            $(`div[data-appid="${app.appId}"]`).css('height', 'auto');

            if($(`div[data-appid="${app.appId}"]`).hasClass('sheet') && $(`div[data-appid="${app.appId}"]`).hasClass('item')) {

                prevTab = tabIndex;

                $(`div[data-appid="${app.appId}"]`).on('click', function() {
                    prevTop = $(`div[data-appid="${app.appId}"]`).css('top');
                    prevTop = parseInt(prevTop.replace('px', ''));
                })

            }
        });

    }

}






function formFieldOrganizer(app) {

    $(`div[data-appid="${app.appId}"] .form-group`).each(function() {

        // Remove the Stacked class if the table is running DnD 5e
        if ($(this).hasClass('stacked') && $('body').hasClass('system-dnd5e')) {
            $(this).removeClass('stacked');
        }

        let checkboxes = $(this).find('input[type="checkbox"]');
        let selects = $(this).find('select');

        if (checkboxes.length == 1 && checkboxes.parent().hasClass('form-group')) {

            // Only triggers when there's a lone input outside of a form-fields
            // so that it doesn't mess with more complicated input fields

            $('<div class="form-fields has-checkbox"></div>').insertAfter($(this).find('label'));
            checkboxes.appendTo($(this).find('.form-fields'));

            // Adds a class for styling
            $(this).find('label').addClass('for-checkbox');
            $(this).addClass('has-checkbox');

            // Toggles the checkbox's state when clicking the parent
            $(this).on('click', function() {
                checkboxes.attr('checked', !checkboxes.is(':checked'));
            });

        }

        // Same as above, but for lone selects. I tried to make it a function but
        // it didn't work

        if (selects.length == 1 && selects.parent().hasClass('form-group')) {
            $('<div class="form-fields"></div>').insertAfter($(this).find('label'));
            selects.appendTo($(this).find('.form-fields'));
        }

    });

}