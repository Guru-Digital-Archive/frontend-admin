/*
 *  Silverstripe front end admin  - v0.0.1
 *  Front end admin for Silverstripe
 *  https://github.com/gurudigital/frontend-admin
 *
 *  Made by Corey Sewell - Guru Digital Media
 *  Under BSD-3-Clause License
 *
 */

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
    /**
     *
     * @param {type} anchorElm
     * @returns {Boolean}
     */
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
    ss.editorWrappers.tinyMCE4 = function() {

//        var instance;

        return {
            init: function(/*config*/) {
//			if(!ss.editorWrappers.tinyMCE.initialized) {
//				tinyMCE.init(config);
//
//				ss.editorWrappers.tinyMCE.initialized = true;
//			}
                ss.editorWrappers.tinyMCE4.initialized = true;
            },
            /**
             * @return Mixed Implementation specific object
             */
            getInstance: function() {
                return this.instance;
            },
            setInstance: function(instance) {
                this.instance = instance;
            },
            /**
             * Invoked when a content-modifying UI is opened.
             */
            onopen: function() {
            },
            /**
             * Invoked when a content-modifying UI is closed.
             */
            onclose: function() {
            },
            /**
             * Write the HTML back to the original text area field.
             */
            save: function() {
                tinyMCE.triggerSave();
            },
            /**
             * Create a new instance based on a textarea field.
             *
             * Please proxy the events from your editor implementation into JS events
             * on the textarea field. For events that do not map directly, use the
             * following naming scheme: editor<event>.
             *
             * @param String
             * @param Object Implementation specific configuration
             * @param Function
             */
            create: function(domID, config) {
                $("#" + domID).tinymce(config);
                this.instance = top.tinymce.activeEditor;
            },
            /**
             * Redraw the editor contents
             */
            repaint: function() {
//                tinyMCE.execCommand("mceRepaint");
            },
            /**
             * @return boolean
             */
            isDirty: function() {
                return this.getInstance().isDirty();
            },
            /**
             * HTML representation of the edited content.
             *
             * Returns: {String}
             */
            getContent: function() {
                return this.getInstance().getContent();
            },
            /**
             * DOM tree of the edited content
             *
             * Returns: DOMElement
             */
            getDOM: function() {
                return this.getInstance().dom;
            },
            /**
             * Returns: DOMElement
             */
            getContainer: function() {
                return this.getInstance().getContainer();
            },
            /**
             * Get the closest node matching the current selection.
             *
             * Returns: {jQuery} DOMElement
             */
            getSelectedNode: function() {
                return this.getInstance().selection.getNode();
            },
            /**
             * Select the given node within the editor DOM
             *
             * Parameters: {DOMElement}
             */
            selectNode: function(node) {
                this.getInstance().selection.select(node);
            },
            /**
             * Replace entire content
             *
             * @param String HTML
             * @param Object opts
             */
            setContent: function(html, opts) {
                this.getInstance().execCommand("mceSetContent", false, html, opts);
            },
            /**
             * Insert content at the current caret position
             *
             * @param String HTML
             */
            insertContent: function(html, opts) {
                this.getInstance().execCommand("mceInsertContent", false, html, opts);
            },
            /**
             * Replace currently selected content
             *
             * @param {String} html
             */
            replaceContent: function(html, opts) {
                this.getInstance().execCommand("mceReplaceContent", false, html, opts);
            },
            /**
             * Insert or update a link in the content area (based on current editor selection)
             *
             * Parameters: {Object} attrs
             */
//            insertLink: function(attrs, opts) {
            insertLink: function(attrs) {
                var editor = this.getInstance(),
                        selection = editor.selection,
                        dom = editor.dom,
                        selectedElm = selection.getNode(),
                        anchorElm = dom.getParent(selectedElm, "a[href]"),
                        text = anchorElm ? (anchorElm.innerText || anchorElm.textContent) : selection.getContent({format: "text"}),
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

                    dom.setAttribs(anchorElm, attrs);

                    selection.select(anchorElm);
                    editor.undoManager.add();
                } else {
                    if (onlyText) {
                        editor.insertContent(dom.createHTML("a", attrs, dom.encode(text)));
                    } else {
                        editor.execCommand("mceInsertLink", false, attrs);
                    }
                }
//                this.getInstance().execCommand("mceInsertLink", false, attrs, opts);
            },
            /**
             * Remove the link from the currently selected node (if any).
             */
            removeLink: function() {
                this.getInstance().execCommand("unlink", false);
            },
            /**
             * Strip any editor-specific notation from link in order to make it presentable in the UI.
             *
             * Parameters:
             *  {Object}
             *  {DOMElement}
             */
            cleanLink: function(href, node) {
                if (this.getInstance().settings.urlconverter_callback) {
                    return this.getInstance().execCallback("urlconverter_callback", href, node, true);
                }

//                 Turn into relative
                if (href.match(new RegExp("^" + this.getInstance().settings.document_base_url + "(.*)$"))) {
                    href = RegExp.$1;
                }
//
//                // Get rid of TinyMCE's temporary URLs
//                if (href.match(/^javascript:\s*mctmp/))
//                    href = "";

                return href;
            },
            /**
             * Creates a bookmark for the currently selected range,
             * which can be used to reselect this range at a later point.
             * @return {mixed}
             */
            createBookmark: function() {
                return this.getInstance().selection.getBookmark();
            },
            /**
             * Selects a bookmarked range previously saved through createBookmark().
             * @param  {mixed} bookmark
             */
            moveToBookmark: function(bookmark) {
                this.getInstance().selection.moveToBookmark(bookmark);
                this.getInstance().focus();
            },
            /**
             * Removes any selection & de-focuses this editor
             */
            blur: function() {
                this.getInstance().selection.collapse();
            },
            /**
             * Add new undo point with the current DOM content.
             */
            addUndo: function() {
                this.getInstance().undoManager.add();
            },
            /**
             * Add new undo point with the current DOM content.
             */
            closeDialog: function() {
                this.getInstance().windowManager.close();
            }
        };
    };
    ss.editorWrappers["default"] = ss.editorWrappers.tinyMCE4;
    var editor = new ss.editorWrappers["default"]();
    editor.setInstance(top.tinymce.activeEditor);
    $.entwine("ss", function($) {
        $("form.htmleditorfield-form").entwine({
            close: function() {
                this.getDialog().close();
            },
            getEditor: function() {
                return editor;
            }
        });
        $("form.htmleditorfield-form button").entwine({
            onadd: function() {
                this.button().addClass("ss-ui-button");
            }
        });
        $("form.htmleditorfield-linkform button[name=action_remove]").entwine({
            onclick: function(e) {
                e.preventDefault();
                this.parents("form:first").removeLink();
            }
        });

        $(".htmleditorfield-dialog").entwine({
            onadd: function() {
                this.trigger("ssdialogopen");
                this._super();
            },
            getEditor: function() {
                return editor;
            },
            close: function() {
                this.getEditor().closeDialog();
            }
        });
    });
})(jQuery);