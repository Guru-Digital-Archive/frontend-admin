(function ($) {
    /**
     * Persistent settings
     *
     * @type @exp;cookie@call;substring|_L9@call;prop|_L9@call;val
     */
    var settings = {
        /**
         * Is the CMS in edit mode
         */
        editmode: false,
        /**
         * Should editable areas be highlighted
         */
        highlight: false,
        /**
         * User defined admin panel width
         */
        width: "false",
        /**
         * User defined admin panel height
         */
        height: "false",
        /**
         * User defined admin panel y position
         */
        y: "false",
        /**
         * Load settings from cookies
         *
         * @returns {undefined}"
         */
        load: function () {
            var cookiesSplit = document.cookie.split(";");
            $.each(this, function (key, value) {
                var match, i, cookie;
                if (!$.isFunction(value)) {
                    match = key + "=";
                    for (i = 0; i < cookiesSplit.length; i++) {
                        cookie = cookiesSplit[i];
                        while (cookie.charAt(0) === " ") {
                            cookie = cookie.substring(1, cookie.length);
                        }
                        if (cookie.indexOf(match) === 0) {
                            settings[key] = cookie.substring(match.length, cookie.length);
                        }
                    }
                }
            });
        },
        /**
         * Save settings into a cookie
         *
         * @returns {undefined}
         */
        save: function () {
            var d = new Date();
            d.setTime(d.getTime() + 1209600000);
            $.each(this, function (key, value) {
                if (!$.isFunction(value)) {
                    document.cookie = key + "=" + value + "; expires=" + d.toGMTString() + "; path=/";
                }
            });
        }
    };
    settings.load();

    $(function () {
        var cmsUrl = $("meta[name='x-cms-edit-link']").attr("content");
        if (typeof window.jQuery.fn.button !== "undefined" && typeof window.jQuery.fn.button.noConflict === "function") {
            window.jQuery.fn.bootstrapBtn = window.jQuery.fn.button.noConflict();
        }

        $.entwine("ss.frontEndAdmin", function ($) {
            $("div.admin-panel").entwine({
                OpenPosition: 0,
                ClosedPosition: 0,
                AdminBtn: $("<button>").addClass("btn btn-default").attr("id", "adminToggle").text(frontEndAdmin.toggleLabel),
                AdminBtnWrap: $("<div>").addClass("admin-panel-toggle-wrap"),
                AdminFrame: $("<iframe>").attr("id", "admin-frame").attr("src", frontEndAdmin.editHref + (frontEndAdmin.editHref.split("?")[1] ? "&" : "?") + "frontEndAdmin=true"),
                AdminFrameWrap: $("<div>").addClass("admin-frame-wrap"),
                ToolsWrap: $("<div>").addClass("admin-tools-wrap ui-widget-header ui-corner-all"),
                ToolsEditMode: $("<input type='checkbox' />").data("settings-key", "editmode").attr("id", "admin-tools-editmode").addClass("admin-tools-editmode admin-tools-toggle saveable"),
                ToolsEditModeLabel: $("<label>" + frontEndAdmin.editModeLabel + "</label>").addClass("btn btn-default"),
                ToolsHighlight: $("<input type='checkbox'/>").data("settings-key", "highlight").attr("id", "admin-tools-highlight").addClass("admin-tools-highlight admin-tools-toggle saveable"),
                ToolsHighlightLabel: $("<label>" + frontEndAdmin.highlightLabel + "</label>").addClass("btn btn-default"),
                ToolsCMSLink: $("<a>" + frontEndAdmin.cmsLabelLink + "</a>").attr("href", cmsUrl).attr("target", "_blank").addClass("admin-tools-cmslink admin-tools-link btn btn-default"),
                onmatch: function () {
                    if (!$("body").hasClass("cms-dialog")) {
                        // Save a reference to this for use in callbacks
                        var self = this;

                        // Build and append all the admin elements
                        self
                                .append(
                                        self.getToolsWrap()
                                        .append(
                                                self.getToolsEditModeLabel().attr("for", self.getToolsEditMode().attr("id"))
                                                )
                                        .append(
                                                self.getToolsEditMode()
                                                )
                                        .append(
                                                self.getToolsHighlightLabel().attr("for", self.getToolsHighlight().attr("id"))
                                                )
                                        .append(
                                                self.getToolsHighlight()
                                                )
                                        .append(
                                                self.getToolsCMSLink()
                                                )
                                        );
                        self
                                .append(
                                        self.getAdminFrameWrap()
                                        .append(
                                                self.getAdminFrame()
                                                )
                                        )
                                .append(
                                        self.getAdminBtnWrap()
                                        .append(
                                                self.getAdminBtn()
                                                )
                                        );

                        // Check to see if the user has set a top position for the admin panel
                        if (!isNaN(settings.y)) {
                            self.css({top: settings.y + "px"});
                        }
                        // Check to see if the user has set a width for the admin panel
                        if (!isNaN(settings.width)) {
                            self.getAdminFrameWrap().width(settings.width);
                        }
                        // Check to see if the user has set a width for the admin panel
                        if (!isNaN(settings.height)) {
                            self.getAdminFrameWrap().height(settings.height);
                        }

                        // Position and show the admin panel
                        self.calculatePositions().hide().removeClass("admin-menu-hide").css({left: self.getClosedPosition()}).fadeIn(function () {
                            // Allow the admin panel to be dragged up and down
                            self.draggable({handle: self.getAdminBtnWrap().parent(), axis: "y", stop: function () {
                                    settings.y = $(this).position().top;
                                    settings.save();
                                }
                            });

                            // Allow the admin panel to be resized
                            self.getAdminFrameWrap().resizable({stop: function () {
                                    // Calculate the open and closed positions after resizing
                                    $("div.admin-panel").calculatePositions();
                                    settings.width = $(this).width();
                                    settings.height = $(this).height();
                                    settings.save();
                                }});
                        });
                    }
                },
                /**
                 *
                 * @param {boolean} open
                 * @param {frontEndAdmin~afterAnimate} callback Fired once the open/close animation is complete
                 * @returns {undefined}
                 */
                toggleAdmin: function (open, callback) {
                    var animationTime = 400,
                            self = this,
                            currentPos = parseInt(self.position().left, 10),
                            animateTo = (currentPos >= self.getOpenPosition()) ? self.getClosedPosition() : self.getOpenPosition();
                    if (typeof open !== "undefined") {
                        animateTo = (open) ? self.getOpenPosition() : self.getClosedPosition();
                    }
                    open = (animateTo === self.getOpenPosition());

                    // Change the buttons icon half way though opening the admin panel
                    setTimeout(function () {
                        self.getAdminBtn().setIcon(open ? frontEndAdmin.toggleIconOpen : frontEndAdmin.toggleIconClosed);
                    }, animationTime / 2);

                    // Animate the admin panel open or closed
                    self.animate({left: animateTo}, animationTime, "easeInBack", function () {
                        if ($.isFunction(callback)) {
                            callback.apply(self, open);
                        }
                    });
                },
                /**
                 * Calculate and set the admin panel open and closed positions
                 *
                 * @returns {undefined}
                 */
                calculatePositions: function () {
                    this.setOpenPosition(-((parseInt(this.css("padding-left"), 10) + parseInt(this.css("margin-left"), 10)) - (parseInt(this.css("padding-right"), 10) / 2)));
                    this.setClosedPosition(-(this.outerWidth() + parseInt(this.css("margin-left"), 10)));
                    return this;
                }

            });
            $("#adminToggle").entwine({
                onmatch: function () {
                    this.button({icons: {secondary: frontEndAdmin.toggleIconClosed}});
                },
                onclick: function () {
                    $("div.admin-panel").toggleAdmin();
                },
                setIcon: function (icon) {
                    this.button({icons: {secondary: icon}});
                }
            });
            $(".admin-tools-editmode").entwine({
                onmatch: function () {
                    this.button({icons: {primary: "ui-icon-pencil", secondary: "ui-icon-circle-close"}});
                    this._super();
                },
                onchange: function () {
                    this._super();
                    $(".admin-tools-highlight").button("option", "disabled", !this.prop("checked"));
                },
                onclick: function () {
                    window.location.reload();
                }
            });
            $(".admin-tools-highlight").entwine({
                onmatch: function () {
                    this.button({icons: {primary: "ui-icon-circlesmall-minus", secondary: "ui-icon-circle-close"}});
                    this._super();
                },
                onchange: function () {
                    if (this.prop("checked")) {
                        $("body").addClass("highlight-editable");
                    } else {
                        $("body").removeClass("highlight-editable");
                    }
                    this._super();
                }
            });
            $(".admin-tools-toggle").entwine({
                onchange: function () {
                    var icons = this.button("option", "icons");
                    icons.secondary = this.prop("checked") ? "ui-icon-circle-check" : "ui-icon-circle-close";
                    this.button({icons: icons});
                    this._super();
                }
            });
            $(".admin-tools-cmslink").entwine({
                onmatch: function () {
                    this.button({icons: {primary: "ui-icon-newwin"}});
                }
            });
            $(".saveable").entwine({
                onmatch: function () {
                    this._super();
                    var settingKey = this.data("settings-key"), settingValue;
                    if (typeof settings[settingKey] !== "undefined") {
                        settingValue = settings[settingKey];
                        if (this.is(":checkbox")) {
                            this.prop("checked", settingValue && settingValue !== "false");
                        } else {
                            this.val(settingValue);
                        }
                        this.change();
                    }
                },
                onchange: function () {
                    var settingKey = this.data("settings-key"), settingValue;
                    if (typeof settings[settingKey] !== "undefined") {
                        settingValue = settings[settingKey];
                        if (this.is(":checkbox")) {
                            settings[settingKey] = this.prop("checked");
                        } else {
                            settings[settingKey] = this.val();
                        }
                        settings.save();
                    }
                    this._super();
                }
            });

            // To ensure saving pages from within the admin panel does not overwrite content saved from the front end editor
            // set the X-REMOVE-CONTENT header so FrontendAdminSitePageExtension removes the content field
            $("#admin-frame").entwine({
                onmatch: function () {
                    this.load(function () {
                        var
                                // Get the iframes window
                                fWindow = $(this)[0].contentWindow,
                                // Get the iframes document
//                                fDocument = $(this)[0].contentWindow.document,
                                // Get a refernce to the iframes jquery
                                f$ = fWindow.jQuery;

                        // Remove the preview mode selector as it doesnt make much sense in this context
                        f$("#preview-mode-dropdown-in-content").entwine({
                            onmatch: function () {
                                this.remove();
                            }
                        });

                        // Make the logout link affect the top most window
                        f$(".logout-link").attr("target", "_top");

                        // Append frontEndAdmin=true to URLs for all ajax requests in the admin panel iframe
                        // This ensures saving a page does not overwrite content
                        f$("div.cms-container").entwine({
                            onbeforestatechange: function (e, data) {
                                data.state.url = data.state.url + (data.state.url.split("?")[1] ? "&" : "?") + "frontEndAdmin=true";
                            }
                        });

                    });
                }
            });

            $("<div>").addClass("admin-panel admin-menu-hide").appendTo($("body"));
        });
    });
})(jQuery);