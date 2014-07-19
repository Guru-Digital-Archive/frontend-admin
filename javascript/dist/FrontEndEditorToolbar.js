/*
 *  Silverstripe front end admin  - v0.1
 *  Front end admin for Silverstripe
 *  
 *
 *  Made by Corey Sewell
 *  Under BSD License
 */
(function($) {
    $.entwine("ss", function($) {
        $("form.htmleditorfield-mediaform").entwine({
            getSelection: function() {
                return $("#imageHolder");
            },
            onsubmit: function(e) {
                e.preventDefault();
                this.find(".ss-htmleditorfield-file").each(function() {
                    console.log($(this).getAttributes());
                });
            }
        });
        $("form.htmleditorfield-linkform").entwine({
            getSelection: function() {
                return $("#linkHolder");
            },
            getEditor: function() {
                return null;
            },
            onsubmit: function(e) {
                e.preventDefault();
                console.log($(this).getLinkAttributes());
            }
        }).redraw();
        $("form.htmleditorfield-form").entwine({
            modifySelection: function() {
            },
            getEditor: function() {
            }
        }).updateFromEditor();
    });
})(jQuery);