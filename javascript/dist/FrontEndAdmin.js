(function($) {
    $(function() {
        $.entwine("ss.frontEndAdmin", function($) {
            $("div.admin-panel").entwine({
                OpenPosition: 0,
                ClosedPosition: 0,
                AdminBtn: $("<button>").addClass("btn btn-default").attr("id", "adminToggle").text(frontEndAdmin.toggleLabel),
                AdminBtnWrap: $("<div>").addClass("admin-panel-taggle-wrap"),
                AdminFrame: $("<iframe>").attr("id", "admin-frame").attr("src", frontEndAdmin.editHref + "?removeContent=true"),
                AdminFrameWrap: $("<div>").addClass("admin-frame-wrap"),
                onmatch: function() {
                    var self = this;
                    self.append(self.getAdminFrameWrap().append(self.getAdminFrame())).append(self.getAdminBtnWrap().append(self.getAdminBtn()));
                    self.calculatePositions().hide().removeClass("admin-menu-hide").css({left: self.getClosedPosition()}).fadeIn(function() {
                        // Allow the admin panel to be dragged up and down
                        self.draggable({handle: self.getAdminBtnWrap().parent(), axis: "y"});

                        // Allow the admin panel to be resized
                        self.getAdminFrameWrap().resizable({stop: function() {
                                // Calculate the open and closed positions after resizing
                                $("div.admin-panel").calculatePositions();
                            }});
                    });
                },
                /**
                 *
                 * @param {boolean} open
                 * @param {frontEndAdmin~afterAnimate} callback Fired once the open/close animation is complete
                 * @returns {undefined}
                 */
                toggleAdmin: function(open, callback) {
                    var animationTime = 400,
                            self = this,
                            currentPos = parseInt(self.position().left, 10),
                            animateTo = (currentPos >= self.getOpenPosition()) ? self.getClosedPosition() : self.getOpenPosition();
                    if (typeof open !== "undefined") {
                        animateTo = (open) ? self.getOpenPosition() : self.getClosedPosition();
                    }
                    open = (animateTo === self.getOpenPosition());

                    // Change the buttons icon half way though opening the admin panel
                    setTimeout(function() {
                        self.getAdminBtn().setIcon(open ? frontEndAdmin.toggleIconOpen : frontEndAdmin.toggleIconClosed);
                    }, animationTime / 2);

                    // Animate the admin panel open or closed
                    self.animate({left: animateTo}, animationTime, "easeInBack", function() {
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
                calculatePositions: function() {
                    this.setOpenPosition(-((parseInt(this.css("padding-left"), 10) + parseInt(this.css("margin-left"), 10)) - (parseInt(this.css("padding-right"), 10) / 2)));
                    this.setClosedPosition(-(this.outerWidth() + parseInt(this.css("margin-left"), 10)));
                    return this;
                }

            });
            $("#adminToggle").entwine({
                onmatch: function() {
                    this.button({icons: {secondary: frontEndAdmin.toggleIconClosed}});
                },
                onclick: function() {
                    $("div.admin-panel").toggleAdmin();
                },
                setIcon: function(icon) {
                    this.button({icons: {secondary: icon}});
                }
            });

            // To ensure saving pages from within the admin panel does not overwrite content saved from the front end editor
            // set the X-REMOVE-CONTENT header so FrontendAdminSitePageExtension removes the content field
            $("#admin-frame").entwine({
                onmatch: function() {
                    $("#admin-frame").load(function() {
                        // Get the iframes window
                        var fWindow = $(this)[0].contentWindow,
                                // Get the iframes document
//                                fDocument = $(this)[0].contentWindow.document,
                                // Get a refernce to the iframes jquery
                                f$ = fWindow.jQuery;

                        // Set the X-REMOVE-CONTENT for all ajax requests in the admin panel iframe
                        f$.ajaxSetup({
                            beforeSend: function(xmlhttp) {
                                xmlhttp.setRequestHeader("X-REMOVE-CONTENT", "true");
                            }
                        });
//                if (settings.url == "admin/pages/treeview") {
//                    var tree = f$(".jstree");
//                }
//            });
                    });
                }
            });

            $("<div>").addClass("admin-panel admin-menu-hide").appendTo($("body"));
        });
    });
})(jQuery);