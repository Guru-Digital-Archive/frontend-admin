/*
 *  Silverstripe front end admin  - v0.0.1
 *  Front end admin for Silverstripe
 *  https://github.com/gurudigital/frontend-admin
 *
 *  Made by Corey Sewell - Guru Digital Media
 *  Under BSD-3-Clause License
 *
 */

var frontEndAdmin = frontEndAdmin || {};
(function ($) {
    frontEndAdmin.baseHref = $("base").attr("href");
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
                };
        /**
         * Stolen from framework\thirdparty\tinymce_ssbuttons\editor_plugin_src.js and adapted to work with TinyMCE 4
         */
        $element.data("originalContent", editor.getContent());
        if ($element.hasClass("frontend-editable-html")) {
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
        }
        editor.getBody().setAttribute("contenteditable", "false");
        saveFromFrontend(toPost, $element, function () {
            editor.getBody().setAttribute("contenteditable", "true");
        });
    }
    function saveFromSelect($select) {
        var toPost = {
            fefield: $select.data("fefield"),
            feid: $select.data("feid"),
            feclass: $select.data("feclass"),
            value: $select.val()
        };
        $select.prop("disabled", true);
        saveFromFrontend(toPost, $select, function () {
            $select.prop("disabled", false);
        });
    }
    function saveFromFrontend(toPost, $element, callback) {
        var onBeforeSaveEvent = $.Event("FrontEndEditor:onBeforeSave"), loadingMsg, callbacks;
        $(document).trigger(onBeforeSaveEvent, [toPost, $element]);
        if (!onBeforeSaveEvent.isDefaultPrevented()) {
            loadingMsg = SS_StatusMessage.loading("Saving " + toPost.fefield, "Saving", {sticky: true});
            callbacks = $.Callbacks();
            if ($.isFunction(callback)) {
                callbacks.add(callback);
            }
            callbacks.add(function (response) {
                SS_StatusMessage.create(response.content, SS_StatusMessageTypes.fromForm(response.type), response.title, response.options);
            });

            $.post(frontEndAdmin.baseHref + "home/fesave", toPost).done(function (response) {
                var onAfterSaveEvent = $.Event("FrontEndEditor:onAfterSave");
                $(document).trigger(onAfterSaveEvent, [response, $element]);
                if (!onAfterSaveEvent.isDefaultPrevented()) {
                    callbacks.fire(response, $element);
                }
            }).fail(function (e) {
                SS_StatusMessage.danger("Unexpected error occurred<br/>" + e.responseText, "error");
            }).always(function () {
                loadingMsg.hide();
            });
        }
    }

    frontEndAdmin.tinymceGlobalDefaults = {
        inline: true,
        save_enablewhendirty: false,
        save_onsavecallback: saveFromEditor,
        script_url: frontEndAdmin.baseHref + "silverstripe-frontend-admin/bower_components/tinymce/tinymce.min.js",
        external_plugins: {
            "SSFEButtons": frontEndAdmin.baseHref + "silverstripe-frontend-admin/javascript/dist/tinymce_ssfebuttons.min.js"
        }
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
    frontEndAdmin.tinymceTextDefaults = frontEndAdmin.tinymceVarCharDefaults;

    // Prevent editable elements within an anchor navigation to the anchors href
    $("a .frontend-editable").click(function (e) {
        e.preventDefault();
    });

    $(".frontend-editable-varchar, .frontend-editable-text, .frontend-editable-html").entwine({
        onmatch: function () {
            var onBeforeInitEvent = $.Event("FrontEndEditor:onBeforeInitEditor"), options, onAfterInitEvent, $label = $("<span class='fe-label' style='position: absolute'><span class='fe-label-text'></span></span>"), offset = this.offset();
            $label.css({top: offset.top - $label.outerHeight(), left: offset.left}).find(".fe-label-text")
                    .text(this.data("feclass") + " (ID: " + this.data("feid") + ") - " + this.data("fefield"));
            this.data("fe-label", $label);
            $label.data("fe-field", this);
            $("body").append($label);
//            $label.show();
//            this.positionLabel();
//            $label.hide();

            if (this.hasClass("frontend-editable-varchar")) {
                options = $.extend({}, frontEndAdmin.tinymceVarCharDefaults);
                onAfterInitEvent = $.Event("FrontEndEditor:onAfterInitVarChar");
            } else if (this.hasClass("frontend-editable-text")) {
                options = $.extend({}, frontEndAdmin.tinymceTextDefaults);
                onAfterInitEvent = $.Event("FrontEndEditor:onAfterInitVarChar");
            } else if (this.hasClass("frontend-editable-html")) {
                options = $.extend({}, frontEndAdmin.tinymceDefaults);
                onAfterInitEvent = $.Event("FrontEndEditor:onAfterInitHTML");
            }
            $(document).trigger(onBeforeInitEvent, [this, options]);
            if (!onBeforeInitEvent.isDefaultPrevented() && options) {
                this.tinymce(options);
                $(document).trigger(onAfterInitEvent, [this]);
            }
        },
        onmouseenter: function () {
            this.showLabel();
        },
        onmouseleave: function () {
            this.hideLabel();
        },
        onfocusin: function () {
            this.showLabel();
        },
        onfocusout: function () {
            this.hideLabel();
        },
        showLabel: function () {
            var $label = this.data("fe-label");
            if ($label) {
                this.positionLabel();
                $label.addClass("fe-label-show");
            }
        },
        hideLabel: function () {
            var $label = this.data("fe-label");
            if ($label && !this.is(":focus")) {
                $label.removeClass("fe-label-show");
            }
        },
        positionLabel: function () {
            var
                    $label = this.data("fe-label"),
                    offset = this.offset(),
                    padLeft = parseInt($label.css("padding-left"), 10),
                    offsetTop = offset.top, offsetLeft = offset.left;
            if ($label) {
                offsetTop = offsetTop - $label.outerHeight();
                if (padLeft) {
                    offsetLeft = offsetLeft - padLeft;
                }
                $label.css({top: offsetTop, left: offsetLeft});
            }
        }
    });
    $(".frontend-editable-enum, .frontend-editable-boolean").entwine({
        SaveEnabled: true,
        onmatch: function () {
            var onBeforeInitEvent = $.Event("FrontEndEditor:onBeforeInitEditor");
            $(document).trigger(onBeforeInitEvent, [this, options]);
            this.setSaveEnabled(!onBeforeInitEvent.isDefaultPrevented());
        },
        onchange: function () {
            if (this.getSaveEnabled()) {
                saveFromSelect(this);
            }
        }
    });
})(jQuery);