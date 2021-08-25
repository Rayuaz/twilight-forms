Hooks.on('init', () => {
    game.settings.register("twilight-forms", "label-alignment", {
        name: 'Label Aligment',
        hint: 'Sets the alignment of the label on the form fields.',
        scope: "world",
        config: true,
        type: String,
        choices: {
            "tui-top": "Top",
            "tui-left": "Left",
            "tui-right": "Right"
        },
        default: "tui-right"
    });
});