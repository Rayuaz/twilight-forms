Hooks.on("renderSettingsConfig", (app) => {

    const hasTidySettings = game.modules.get('tidy-ui_game-settings')?.active;

    if (!hasTidySettings) {
        setTimeout(() => {
            // Adds a class to the window, so that it can be styled
            // without affecting all forms
            $(`div[data-appid="${app.appId}"]`).addClass('tui-form');
    
            let i = 1;
    
            $(`div[data-appid="${app.appId}"] .tab[data-tab="core"] .settings-list`).children().each(function() {
                if($(this).find('input[type="checkbox"]').length > 0) {
                    $(this).addClass('has-checkbox');
                }
            })
    
            $(`div[data-appid="${app.appId}"]`).find('.module-header').each(function() {
    
                $(this).parent().append(`<div class="module-section" id="mod-section-${i}"></div>`);
                $(`#mod-section-${i}`).append(`<div class="module-inputs"></div>`);
    
                $(this).nextUntil('.module-header').each(function() {
                    if($(this).hasClass('module-section')) {
                        return;
                    } else {
                        if($(this).find('.form-fields input[type="checkbox"]').length > 0 ) {
                            $(this).addClass('has-checkbox');
                        }
                        $(this).appendTo(`#mod-section-${i} .module-inputs`);
                    }
                });
    
                $(this).prependTo(`#mod-section-${i}`);
    
                i++;
    
            });
    
            $(`div[data-appid="${app.appId}"]`).css('height', 'auto');
    
            $(`div[data-appid="${app.appId}"] .tab[data-tab="modules"]`).on('click', '.module-header', function() {
                $(this).parent().toggleClass('active');
                $(this).next().slideToggle(120);
            });
        
            $(`div[data-appid="${app.appId}"]`).on('click', '.has-checkbox', function() {
                $(this).find('input[type="checkbox"]').attr('checked', !$(this).find('input[type="checkbox"]').is(':checked'));
            });
    
        }, 1);
    }

});