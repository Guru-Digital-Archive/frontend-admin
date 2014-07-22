
(function($) {
    /**
     *
     * Gets the frame element fron the parent which this document is loaded in
     *
     * @see http://stackoverflow.com/questions/4097870/jquery-access-iframe-id-from-iframe-content#4098384
     * @returns {unresolved}
     */
//    function getFrameElement() {
//        var iframes = parent.document.getElementsByTagName("iframe"), iframe = false, i, idoc;
//        for (i = iframes.length; i-- > 0; ) {
//            iframe = iframes[i];
//            try {
//                idoc = "contentDocument" in iframe ? iframe.contentDocument : iframe.contentWindow.document;
//            } catch (e) {
//                continue;
//            }
//            if (idoc === document) {
//                break;
//            }
//        }
//        return  iframe;
//    }

//    function resizeAndCenterDialog() {
//        var
//                iframe = getFrameElement(),
//                $iframe = $(),
//                $mceBody = $(),
//                $mceDialog = $(),
//                p$;
//        if (iframe) {
//// Get a refernce to the parents jquery
//            p$ = parent.jQuery;
//            $iframe = p$(iframe);
//            $mceBody = p$(iframe).closest(".mce-container-body");
//            $mceDialog = p$(iframe).closest(".mce-frontend-editable-dialog");
//            $iframe.height($(".cms.ui-dialog").height());
//            $mceBody.closest(".mce-container-body").height("auto");
//            $mceDialog.closest(".mce-frontend-editable-dialog").height("auto");
//            $mceDialog.position({
//                my: "center",
//                at: "center",
//                of: parent
//            });
//        }
//
//    }
    function isOnlyTextSelected(anchorElm) {
        var editor = top.tinymce.activeEditor,
                selection = editor.selection,
                html = selection.getContent(),
                nodes;

        // Partial html and not a fully selected anchor element
        if (/</.test(html) && (!/^<a [^>]+>[^<]+<\/a>$/.test(html) || html.indexOf("href=") === -1)) {
            return false;
        }

        if (anchorElm) {
            nodes = anchorElm.childNodes, i;

            if (nodes.length === 0) {
                return false;
            }

            for (i = nodes.length - 1; i >= 0; i--) {
                if (nodes[i].nodeType !== 3) {
                    return false;
                }
            }
        }

        return true;
    }
    var tinyMCE = top.tinymce;
    tinyMCE.activeEditor.cleanLink = function(href) {
        return href;
    };
    tinyMCE.activeEditor.repaint = function() {
        //  tinyMCE.execCommand("mceRepaint");
    };
    tinyMCE.activeEditor.addUndo = function() {
        this.undoManager.add();
    };
    tinyMCE.activeEditor.replaceContent = function() {
        this.undoManager.add();
    };
    tinyMCE.activeEditor.replaceContent = function(html, opts) {
        this.execCommand("mceReplaceContent", false, html, opts);
    };
    $.entwine("ss", function($) {
        $("form.htmleditorfield-mediaform").entwine({
            onsubmit: function(e) {
                e.preventDefault();
                var ed = this.getEditor();

//                this.find(".ss-htmleditorfield-file").each(function() {
//                    console.log($(this).getHTML());
//                });
                this.find(".ss-htmleditorfield-file").each(function() {
                    $(this).insertHTML(ed);
                });
                ed.windowManager.close();

            }
        });
        $("form.htmleditorfield-linkform").entwine({
            onsubmit: function(e) {
                var ed = this.getEditor();
                e.preventDefault();
                this.insertLink();
                ed.windowManager.close();
                return false;
            },
            insertLink: function() {
                var editor = this.getEditor(),
                        selection = editor.selection,
                        dom = editor.dom,
                        selectedElm = selection.getNode(),
                        anchorElm = dom.getParent(selectedElm, "a[href]"),
                        text = anchorElm ? (anchorElm.innerText || anchorElm.textContent) : selection.getContent({format: "text"}),
                        linkAttrs = this.getLinkAttributes(),
                        onlyText = isOnlyTextSelected();
                if (anchorElm) {
                    editor.focus();

                    if (onlyText) {
                        if ("innerText" in anchorElm) {
                            anchorElm.innerText = text;
                        } else {
                            anchorElm.textContent = text;
                        }
                    }

                    dom.setAttribs(anchorElm, linkAttrs);

                    selection.select(anchorElm);
                    editor.undoManager.add();
                } else {
                    if (onlyText) {
                        editor.insertContent(dom.createHTML("a", linkAttrs, dom.encode(text)));
                    } else {
                        editor.execCommand("mceInsertLink", false, linkAttrs);
                    }
                }
                this.updateFromEditor();
            }
        });
        $("form.htmleditorfield-form button").entwine({
            onadd: function() {
                this.button().addClass("ss-ui-button");
            }
        });
        $("form.htmleditorfield-form").entwine({
            onadd: function() {
                var ed = this.getEditor(), selection = ed.selection;
                this.setSelection(selection.getNode());
                this.find(":input:not(:submit)[data-skip-autofocus!=true]").filter(":visible:enabled").eq(0).focus();
                this.updateFromEditor();
                this.redraw();
                this._super();
            },
            getEditor: function() {
                return top.tinymce.activeEditor;
            }
        });
    });
})(jQuery);