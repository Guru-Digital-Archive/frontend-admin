
(function($) {
    //Title fix, detect html
    if ($("title").text().search("<") !== -1) {
        var originalTitle = $($("title").text());
        $("title").html(originalTitle.text());
    }
    $(function() {
        frontEndAdmin.$fileBrowser = null;
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
        $(".frontend-editable-html").tinymce(frontEndAdmin.tinymceDefaults);
//        $("<div class='mce-frontend-editable-dialog'></div>").appendTo($("body"));
//        $("<iframe src='#' class='mce-frontend-editable-dialog' />").appendTo($(".mce-frontend-editable-dialog"));

//        $(document).on("FrontEndEditorToolbar.setHeight", function(e, a, b, c) {
//            console.log(e);
//            console.log(a);
//            console.log(b);
//            console.log(c);
//        });

//        $.entwine("ss.frontEndEditor", function($) {
//            console.log("Bind to iframe entwine");
//            $(".mce-frontend-editable-dialog iframe").entwine({
//                onmatch: function() {
//                    console.log("Font iframe");
//                    this.load(function() {
//                        var
//                                // Get the iframes window
//                                fWindow = $(this)[0].contentWindow,
//                                // Get the iframes document
//                                fDocument = $(this)[0].contentWindow.document,
//                                // Get a refernce to the iframes jquery
//                                f$ = fWindow.jQuery;
//                        console.log(f$(fDocument));
//                    });
//                }
//            });
//
//            $(".mce-frontend-editable-dialog").entwine({
//                onmatch: function() {
//                    console.log("we have a dialog");
//                }
//            });
//
//        });
    });
})(jQuery);


//$(document).ready(function() {
//    (function($, frontEndAdmin) {
//
////        $(".htmleditorfield-dialog").entwine({
////            onadd: function() {
////                // Create jQuery dialog
////                if (!this.is(".ui-dialog-content")) {
////                    this.ssdialog({autoOpen: false});
////
////                }
////
////                this._super();
////            },
////            getForm: function() {
////                return this.find("form");
////            },
////            open: function() {
////                this.ssdialog("open");
////                var highest = -999;
////                $("*").each(function() {
////                    var current = parseInt($(this).css("z-index"), 10);
////                    if (current && highest < current) {
////                        highest = current;
////                    }
////                });
////                $(this.parent()).css("z-index", highest);
////            },
////            close: function() {
////                this.ssdialog("close");
////            },
////            toggle: function(bool) {
////                if (this.is(":visible")) {
////                    this.close();
////                } else {
////                    this.open();
////                }
////            }
////        });
//    })(jQuery, frontEndAdmin);
//});
