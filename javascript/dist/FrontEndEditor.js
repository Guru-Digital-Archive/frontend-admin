/*
 *  Silverstripe front end admin  - v0.1
 *  Front end admin for Silverstripe
 *  
 *
 *  Made by Corey Sewell - Guru Digital Media
 *  Under BSD-3-Clause License
 */
var frontEndAdmin = frontEndAdmin || {};
(function ($) {
    frontEndAdmin.baseHref = $("base").attr("href");
    $(function () {
        if (typeof toastr === "undefined") {
            $.getScript(frontEndAdmin.baseHref + "silverstripe-frontend-admin/javascript/thirdparty/toastr.min.js");
        }
    });
    //Title fix, detect html
    if ($("title").text().search("<") !== -1) {
        var originalTitle = $($("title").text());
        $("title").html(originalTitle.text());
    }
    function saveFromEditor(editor) {
        var
                $content = "",
                $element = $(editor.getElement()),
                toPost = {
                    fefield: $element.data("fefield"),
                    feid: $element.data("feid"),
                    feclass: $element.data("feclass"),
                    value: editor.getContent()
                },
        loadingMsg = showMessage({content: "Saving " + toPost.fefield + "", type: "loading"});
        /**
         * Stolen from framework\thirdparty\tinymce_ssbuttons\editor_plugin_src.js and adapted to work with TinyMCE 4
         */
        $element.data("originalContent", editor.getContent());
        $content = $(toPost.value);
        $content.find(".ss-htmleditorfield-file.embed").each(function () {
            var
                    el = $(this),
                    shortCode = "[embed width='" + el.attr("width") + "'" +
                    " height='" + el.attr("height") + "'" +
                    " class='" + el.data("cssclass") + "'" +
                    " thumbnail='" + el.data("thumbnail") + "'" +
                    "]" + el.data("url") +
                    "[/embed]";
            el.replaceWith(shortCode);
        });
        if ($content.length) {
            toPost.value = $("<div />").append($content).html(); // Little hack to get outerHTML string
        }
        editor.getBody().setAttribute("contenteditable", "false");
        $.post(frontEndAdmin.baseHref + "home/fesave", toPost, function (data) {
            loadingMsg.hide();
            editor.getBody().setAttribute("contenteditable", "true");
            showMessage(data);
        });
    }
    function saveFromSelect() {
        var $select = $(this),
                toPost = {
                    fefield: $select.data("fefield"),
                    feid: $select.data("feid"),
                    feclass: $select.data("feclass"),
                    value: this.val()
                },
        loadingMsg = showMessage({content: "Saving " + toPost.fefield, type: "loading"});
        $select.prop("disabled", true);
        $.post(frontEndAdmin.baseHref + "home/fesave", toPost, function (data) {
            loadingMsg.hide();
            $select.prop("disabled", false);
            showMessage(data);
        });
    }
    function showMessage(msg) {
        var result;
        if (typeof (msg) === "string") {
            msg = {content: msg};
        }
        if (typeof (msg.content) !== "string") {
            return;
        }
        if (typeof (msg.type) !== "string") {
            msg.type = "info";
        }
        switch (msg.type) {
            case "good":
            case "success":
                result = toastr.success(msg.content, msg.title, msg.options);
                break;

            case "bad":
            case "error":
                result = toastr.error(msg.content, msg.title, msg.options);
                break;

            case "warning":
            case "warn":
                result = toastr.warning(msg.content, msg.title, msg.options);
                break;

            case "loading":
                msg.options = {extendedTimeOut: 0, timeOut: 0, iconClass: "toast-info toast-icon-loading"};
                result = toastr.warning(msg.content, msg.title, msg.options);
                break;

            default:
                result = toastr.info(msg.content, msg.title, msg.options);
        }
        return  result;
    }

    frontEndAdmin.tinymceGlobalDefaults = {
        inline: true,
        save_enablewhendirty: false,
        save_onsavecallback: saveFromEditor,
        script_url: frontEndAdmin.baseHref + "silverstripe-frontend-admin/javascript/thirdparty/tinymce/js/tinymce/tinymce.min.js"
    };
    frontEndAdmin.tinymceDefaults = $.extend({}, frontEndAdmin.tinymceGlobalDefaults, {
        plugins: [
            "save advlist autolink lists image charmap print preview hr anchor pagebreak",
            "searchreplace wordcount visualblocks visualchars code fullscreen",
            "insertdatetime media nonbreaking save table contextmenu directionality",
            "emoticons template paste textcolor  nonbreaking SSFEButtons"
        ],
        toolbar1: "save undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ssfeLink ssfeimage",
        toolbar2: "print preview media | forecolor backcolor emoticons",
        contextmenu: "ssfeLink ssfeimage inserttable | cell row column deletetable",
        image_advtab: true,
        remove_script_host: true,
        convert_urls: true,
        relative_urls: true,
        document_base_url: frontEndAdmin.baseHref,
        extended_valid_elements: "-p[style|class]"
//            content_css: frontEndAdmin.settings.cssFiles.join(),
//            font_formats: frontEndAdmin.settings.wysiswgFontFormats,
//            fontsize_formats: frontEndAdmin.settings.wysiswgFontSizes,
//            style_formats: frontEndAdmin.settings.wysiswgStyles,
//            formats: frontEndAdmin.settings.wysiswgFormats,
//            templates: frontEndAdmin.settings.linkBase + "tinymcetemplates.json",
    });
    frontEndAdmin.tinymceVarCharDefaults = $.extend({}, frontEndAdmin.tinymceGlobalDefaults, {
        plugins: [
            "save "
        ],
        toolbar1: "save cancel undo redo ",
        menubar: false,
        statusbar: false,
        toolbar_items_size: "small"
    });

    $(".frontend-editable-varchar").entwine({onmatch: function () {
            this.tinymce(frontEndAdmin.tinymceVarCharDefaults);
        }});
    $(".frontend-editable-html").entwine({onmatch: function () {
            this.tinymce(frontEndAdmin.tinymceDefaults);
        }});
    $(".frontend-editable-enum").entwine({onchange: saveFromSelect});
    $(".frontend-editable-boolean").entwine({onchange: saveFromSelect});

})(jQuery);