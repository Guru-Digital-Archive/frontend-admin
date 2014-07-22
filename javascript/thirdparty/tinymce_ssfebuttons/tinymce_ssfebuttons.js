//tinymce.PluginManager.add('SSFEButtons', function(editor) {
////    function createLinkList(callback) {
////        return function() {
////            var linkList = editor.settings.link_list;
////
////            if (typeof (linkList) == "string") {
////                tinymce.util.XHR.send({
////                    url: linkList,
////                    success: function(text) {
////                        callback(tinymce.util.JSON.parse(text));
////                    }
////                });
////            } else if (typeof (linkList) == "function") {
////                linkList(callback);
////            } else {
////                callback(linkList);
////            }
////        };
////    }
////
////    function buildListItems(inputList, itemCallback, startItems) {
////        function appendItems(values, output) {
////            output = output || [];
////
////            tinymce.each(values, function(item) {
////                var menuItem = {text: item.text || item.title};
////
////                if (item.menu) {
////                    menuItem.menu = appendItems(item.menu);
////                } else {
////                    menuItem.value = item.value;
////
////                    if (itemCallback) {
////                        itemCallback(menuItem);
////                    }
////                }
////
////                output.push(menuItem);
////            });
////
////            return output;
////        }
////
////        return appendItems(inputList, startItems || []);
////    }
////
////    function showDialog(linkList) {
////        var data = {}, selection = editor.selection, dom = editor.dom, selectedElm, anchorElm, initialText;
////        var win, onlyText, textListCtrl, linkListCtrl, relListCtrl, targetListCtrl, classListCtrl, linkTitleCtrl, value;
////
////        function linkListChangeHandler(e) {
////            var textCtrl = win.find('#text');
////
////            if (!textCtrl.value() || (e.lastControl && textCtrl.value() == e.lastControl.text())) {
////                textCtrl.value(e.control.text());
////            }
////
////            win.find('#href').value(e.control.value());
////        }
////
////        function buildAnchorListControl(url) {
////            var anchorList = [];
////
////            tinymce.each(editor.dom.select('a:not([href])'), function(anchor) {
////                var id = anchor.name || anchor.id;
////
////                if (id) {
////                    anchorList.push({
////                        text: id,
////                        value: '#' + id,
////                        selected: url.indexOf('#' + id) != -1
////                    });
////                }
////            });
////
////            if (anchorList.length) {
////                anchorList.unshift({text: 'None', value: ''});
////
////                return {
////                    name: 'anchor',
////                    type: 'listbox',
////                    label: 'Anchors',
////                    values: anchorList,
////                    onselect: linkListChangeHandler
////                };
////            }
////        }
////
////        function updateText() {
////            if (!initialText && data.text.length === 0 && onlyText) {
////                this.parent().parent().find('#text')[0].value(this.value());
////            }
////        }
////
////        function urlChange(e) {
////            var meta = e.meta || {};
////
////            if (linkListCtrl) {
////                linkListCtrl.value(editor.convertURL(this.value(), 'href'));
////            }
////
////            tinymce.each(e.meta, function(value, key) {
////                win.find('#' + key).value(value);
////            });
////
////            if (!meta.text) {
////                updateText.call(this);
////            }
////        }
////
////        function isOnlyTextSelected(anchorElm) {
////            var html = selection.getContent();
////
////            // Partial html and not a fully selected anchor element
////            if (/</.test(html) && (!/^<a [^>]+>[^<]+<\/a>$/.test(html) || html.indexOf('href=') == -1)) {
////                return false;
////            }
////
////            if (anchorElm) {
////                var nodes = anchorElm.childNodes, i;
////
////                if (nodes.length === 0) {
////                    return false;
////                }
////
////                for (i = nodes.length - 1; i >= 0; i--) {
////                    if (nodes[i].nodeType != 3) {
////                        return false;
////                    }
////                }
////            }
////
////            return true;
////        }
////
////        selectedElm = selection.getNode();
////        anchorElm = dom.getParent(selectedElm, 'a[href]');
////        onlyText = isOnlyTextSelected();
////
////        data.text = initialText = anchorElm ? (anchorElm.innerText || anchorElm.textContent) : selection.getContent({format: 'text'});
////        data.href = anchorElm ? dom.getAttrib(anchorElm, 'href') : '';
////
////        if ((value = dom.getAttrib(anchorElm, 'target'))) {
////            data.target = value;
////        } else if (editor.settings.default_link_target) {
////            data.target = editor.settings.default_link_target;
////        }
////
////        if ((value = dom.getAttrib(anchorElm, 'rel'))) {
////            data.rel = value;
////        }
////
////        if ((value = dom.getAttrib(anchorElm, 'class'))) {
////            data['class'] = value;
////        }
////
////        if ((value = dom.getAttrib(anchorElm, 'title'))) {
////            data.title = value;
////        }
////
////        if (onlyText) {
////            textListCtrl = {
////                name: 'text',
////                type: 'textbox',
////                size: 40,
////                label: 'Text to display',
////                onchange: function() {
////                    data.text = this.value();
////                }
////            };
////        }
////
////        if (linkList) {
////            linkListCtrl = {
////                type: 'listbox',
////                label: 'Link list',
////                values: buildListItems(
////                        linkList,
////                        function(item) {
////                            item.value = editor.convertURL(item.value || item.url, 'href');
////                        },
////                        [{text: 'None', value: ''}]
////                        ),
////                onselect: linkListChangeHandler,
////                value: editor.convertURL(data.href, 'href'),
////                onPostRender: function() {
////                    linkListCtrl = this;
////                }
////            };
////        }
////
////        if (editor.settings.target_list !== false) {
////            if (!editor.settings.target_list) {
////                editor.settings.target_list = [
////                    {text: 'None', value: ''},
////                    {text: 'New window', value: '_blank'}
////                ];
////            }
////
////            targetListCtrl = {
////                name: 'target',
////                type: 'listbox',
////                label: 'Target',
////                values: buildListItems(editor.settings.target_list)
////            };
////        }
////
////        if (editor.settings.rel_list) {
////            relListCtrl = {
////                name: 'rel',
////                type: 'listbox',
////                label: 'Rel',
////                values: buildListItems(editor.settings.rel_list)
////            };
////        }
////
////        if (editor.settings.link_class_list) {
////            classListCtrl = {
////                name: 'class',
////                type: 'listbox',
////                label: 'Class',
////                values: buildListItems(
////                        editor.settings.link_class_list,
////                        function(item) {
////                            if (item.value) {
////                                item.textStyle = function() {
////                                    return editor.formatter.getCssText({inline: 'a', classes: [item.value]});
////                                };
////                            }
////                        }
////                )
////            };
////        }
////
////        if (editor.settings.link_title !== false) {
////            linkTitleCtrl = {
////                name: 'title',
////                type: 'textbox',
////                label: 'Title',
////                value: data.title
////            };
////        }
////
////        win = editor.windowManager.open({
////            title: 'Insert link',
////            url: frontEndAdmin.linkURL,
////            width: 800,
////            height: 600
////        });
////    }
////
////    editor.addButton('ssfelink', {
////        icon: 'link',
////        tooltip: 'Insert/edit link',
////        shortcut: 'Ctrl+K',
////        onclick: createLinkList(showDialog),
////        stateSelector: 'a[href]'
////    });
////
////    editor.addShortcut('Ctrl+K', '', createLinkList(showDialog));
////    editor.addCommand('ssfelink', createLinkList(showDialog));
////
////    this.showDialog = showDialog;
////
////    editor.addMenuItem('ssfelink', {
////        icon: 'link',
////        text: 'Insert link',
////        shortcut: 'Ctrl+K',
////        onclick: createLinkList(showDialog),
////        stateSelector: 'a[href]',
////        context: 'insert',
////        prependToContext: true
//
//
////    });
////
//    editor.on('BeforeExecCommand', function(e) {
//        if (cmd == 'mceLink') {
//            ed.execCommand('ssfelink');
//            e.preventDefault();
//        }
//        else if (cmd == 'mceAdvImage' || cmd == 'mceImage') {
//            ed.execCommand('ssmedia', ui, val, a);
//            a.terminate = true;
//        }
//    });
//});
tinymce.PluginManager.add('SSFEButtons', function(editor) {
    function showLinkDialog() {
        if (linkEnabled()) {
            editor.windowManager.open({
                title: 'Insert link',
                url: frontEndAdmin.linkURL,
                autoScroll: true,
                width: 700,
                height: 500,
                classes: "frontend-editable-dialog"
            });
        } else {
            editor.windowManager.alert('Please make a selection to link');
        }
    }

    function showMediaDialog() {
        editor.windowManager.open({
            title: 'Insert/edit image',
            url: frontEndAdmin.mediaURL,
            autoScroll: true,
            width: 700,
            height: 500,
            classes: "frontend-editable-dialog"
        });
    }
    function linkEnabled() {
        return !editor.selection.isCollapsed() || editor.selection.getNode().nodeName === "A";
    }
    function linkBtnPostRender() {
        var self = this;
        self.disabled(!linkEnabled());
        editor.on('SelectionChange', function() {
            self.disabled(!linkEnabled());
        });

    }

    editor.addShortcut('Ctrl+K', '', showLinkDialog);
    editor.addCommand('ssfelink', showLinkDialog);

    // Add a button that opens a window
    editor.addButton('ssfeLink', {
        icon: 'link',
        tooltip: 'Insert/edit link',
        shortcut: 'Ctrl+K',
        stateSelector: 'a[href]',
        onclick: showLinkDialog,
        onPostRender: linkBtnPostRender
    });

    // Adds a menu item to the tools menu
    editor.addMenuItem('ssfeLink', {
        icon: 'link',
        text: 'Insert link',
        shortcut: 'Ctrl+K',
        onclick: showLinkDialog,
        stateSelector: 'a[href]',
        context: 'insert',
        prependToContext: true,
        onPostRender: linkBtnPostRender
    });


    editor.addButton('ssfeimage', {
        icon: 'image',
        tooltip: 'Insert/edit image',
        onclick: showMediaDialog,
        stateSelector: 'img:not([data-mce-object],[data-mce-placeholder])'
    });

    editor.addMenuItem('ssfeimage', {
        icon: 'image',
        text: 'Insert image',
        onclick: showMediaDialog,
        context: 'insert',
        prependToContext: true
    });

//    editor.addCommand('mceImage', createImageList(showDialog));
});