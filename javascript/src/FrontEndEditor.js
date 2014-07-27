(function($) {
    //Title fix, detect html
    if ($("title").text().search("<") !== -1) {
        var originalTitle = $($("title").text());
        $("title").html(originalTitle.text());
    }
    $(function() {
        frontEndAdmin.tinymceDefaults = {
            plugins: [
                "save advlist autolink lists image charmap print preview hr anchor pagebreak",
                "searchreplace wordcount visualblocks visualchars code fullscreen",
                "insertdatetime media nonbreaking save table contextmenu directionality",
                "emoticons template paste textcolor  nonbreaking SSFEButtons"
            ],
            toolbar1: "save insertfile undo redo | styleselect | fontselect fontsizeselect | bold italic underline",
            toolbar2: "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ssfeLink ssfeimage | print media | table | forecolor backcolor emoticons",
            inline: true,
            image_advtab: true,
            remove_script_host: true,
            convert_urls: true,
            relative_urls: true,
            document_base_url: frontEndAdmin.baseHref,
            extended_valid_elements: "-p[style|class]",
//            content_css: frontEndAdmin.settings.cssFiles.join(),
//            font_formats: frontEndAdmin.settings.wysiswgFontFormats,
//            fontsize_formats: frontEndAdmin.settings.wysiswgFontSizes,
//            style_formats: frontEndAdmin.settings.wysiswgStyles,
//            formats: frontEndAdmin.settings.wysiswgFormats,
//            templates: frontEndAdmin.settings.linkBase + "tinymcetemplates.json",
            save_enablewhendirty: false,
            save_onsavecallback: function(editor) {
                var
                        $element = $(editor.getElement()),
                        toPost = {
                            fefield: $element.data("fefield"),
                            feid: $element.data("feid"),
                            feclass: $element.data("feclass"),
                            value: editor.getContent()
                        };
                $element.data("originalContent", toPost.value);
                editor.getBody().setAttribute("contenteditable", "false");
                $.post(frontEndAdmin.baseHref + "home/fesave", toPost, function(data) {
                    editor.getBody().setAttribute("contenteditable", "true");
                    editor.setContent(data);
                });
            }
        };
        frontEndAdmin.tinymceVarCharDefaults = {
            plugins: [
                "save "
            ],
            toolbar1: "save cancel undo redo ",
            menubar: false,
            statusbar: false,
            toolbar_items_size: "small",
            inline: true,
            save_enablewhendirty: false,
            save_onsavecallback: function(editor) {
                var
                        $element = $(editor.getElement()),
                        toPost = {
                            fefield: $element.data("fefield"),
                            feid: $element.data("feid"),
                            feclass: $element.data("feclass"),
                            value: editor.getContent()
                        };
                $element.data("originalContent", toPost.value);
                editor.getBody().setAttribute("contenteditable", "false");
                $.post(frontEndAdmin.baseHref + "home/fesave", toPost, function(data) {
                    editor.getBody().setAttribute("contenteditable", "true");
                    editor.setContent(data);
                });
            }
        };

        $(".frontend-editable-varchar").tinymce(frontEndAdmin.tinymceVarCharDefaults);
        $(".frontend-editable-html").tinymce(frontEndAdmin.tinymceDefaults);
    });
})(jQuery);
