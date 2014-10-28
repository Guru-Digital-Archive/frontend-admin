/*
 *  Silverstripe front end admin  - v0.1
 *  Front end admin for Silverstripe
 *  
 *
 *  Made by Corey Sewell - Guru Digital Media
 *  Under BSD-3-Clause License
 */
(function($) {
    tinymce.PluginManager.add("SSFEButtons", function(editor) {
        function showLinkDialog() {
            if (linkEnabled()) {
                editor.windowManager.open({
                    title: "Insert link",
                    url: frontEndAdmin.linkURL,
                    autoScroll: true,
                    width: 700,
                    height: 500,
                    classes: "frontend-editable-dialog"
                });
            } else {
                editor.windowManager.alert("Please make a selection to insert a link");
            }
        }

        function showMediaDialog() {
            editor.windowManager.open({
                title: "Insert/edit image",
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
            editor.on("SelectionChange", function() {
                self.disabled(!linkEnabled());
            });

        }

        editor.addShortcut("Ctrl+K", "", showLinkDialog);
        editor.addCommand("ssfelink", showLinkDialog);

        // Add a button that opens a window
        editor.addButton("ssfeLink", {
            icon: "link",
            tooltip: "Insert/edit link",
            shortcut: "Ctrl+K",
            stateSelector: "a[href]",
            onclick: showLinkDialog,
            onPostRender: linkBtnPostRender
        });

        // Adds a menu item to the tools menu
        editor.addMenuItem("ssfeLink", {
            icon: "link",
            text: "Insert link",
            shortcut: "Ctrl+K",
            onclick: showLinkDialog,
            stateSelector: "a[href]",
            context: "insert",
            prependToContext: true,
            onPostRender: linkBtnPostRender
        });


        editor.addButton("ssfeimage", {
            icon: "image",
            tooltip: "Insert/edit image",
            onclick: showMediaDialog,
            stateSelector: "img:not([data-mce-object],[data-mce-placeholder])"
        });

        editor.addMenuItem("ssfeimage", {
            icon: "image",
            text: "Insert image",
            onclick: showMediaDialog,
            context: "insert",
            prependToContext: true
        });


        /**
         * Stolen from framework\thirdparty\tinymce_ssbuttons\editor_plugin_src.js and adapted to work with TinyMCE 4
         */
        var shortTagRegex = /(.?)\[embed(.*?)\](.+?)\[\/\s*embed\s*\](.?)/gi;
        editor.on("BeforeSetContent", function(e) {
            var matches = null, content = e.content,
                    prefix, suffix, attributes, attributeString, url,
                    attrs, attr, attribute,
                    imgEl, key;
            // Match various parts of the embed tag
            while ((matches = shortTagRegex.exec(content))) {
                prefix = matches[1];
                suffix = matches[4];
                if (prefix === "[" && suffix === "]") {
                    continue;
                }
                attributes = {};
                // Remove quotation marks and trim.
                attributeString = matches[2].replace(/['"]/g, "").replace(/(^\s+|\s+$)/g, "");

                // Extract the attributes and values into a key-value array (or key-key if no value is set)
                attrs = attributeString.split(/\s+/);
                for (attribute in attrs) {
                    attr = attrs[attribute].split("=");
                    if (attr.length === 1) {
                        attributes[attr[0]] = attr[0];
                    } else {
                        attributes[attr[0]] = attr[1];
                    }
                }

                // Build HTML element from embed attributes.
                attributes.cssclass = attributes["class"];
                url = matches[3];
                imgEl = $("<img/>").attr({
                    "src": attributes.thumbnail,
                    "width": attributes.width,
                    "height": attributes.height,
                    "class": attributes.cssclass,
                    "data-url": url
                }).addClass("ss-htmleditorfield-file embed");
                for (key in attributes) {
                    imgEl.attr("data-" + key, attributes[key]);
                }
//                $.each(attributes, function(key, value) {
//                    imgEl.attr("data-" + key, value);
//                });

                content = content.replace(matches[0], prefix + ($("<div/>").append(imgEl).html()) + suffix);
            }
            e.content = content;
        });
    });
})(jQuery);
