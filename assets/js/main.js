console.log("in main.js");
(function($) {

    $(function() {

        var $window = $(window),
            $body = $('body'),
            $wrapper = $('#wrapper');
            $comments = $('#comments-section');

        // Add (and later, on load, remove) "loading" class.
            $body.addClass('loading');
            if( document.readyState != 'loading' ) {
                window.setTimeout(function() {
                    $body.removeClass('loading');
                    $comments.removeClass('waiting-for-load');
                    $comments.addClass('ease-in');
                }, 100);
            } else {
                $window.on('load', function() {
                    window.setTimeout(function() {
                        $body.removeClass('loading');
                            while($wrapper.is(':animated')) {
                                console.log('waiting for wrapper to stop animating');
                            }
                            if ($wrapper.is(":before")) {
                                console.log('after')
                            }
                            $comments.removeClass('waiting-for-load');
                            $comments.addClass('ease-in');
                            // window.setTimeout(function() {
                            //     $comments.fadeIn("slow");
                            // }, 700);
                    }, 100);
                });
            }

        // Prevent transitions/animations on resize.
            var resizeTimeout;

            $window.on('resize', function() {

                window.clearTimeout(resizeTimeout);

                $body.addClass('resizing');

                resizeTimeout = window.setTimeout(function() {
                    $body.removeClass('resizing');
                }, 100);

            });

        // Scroll back to top.
            $window.scrollTop(0);

        // Fix: Placeholder polyfill.
            $('form').placeholder();

        // Panels.
            var $panels = $('.panel');

            $panels.each(function() {

                var $this = $(this),
                    $toggles = $('[href="#' + $this.attr('id') + '"]'),
                    $closer = $('<div class="closer" />').appendTo($this);

                // Closer.
                    $closer
                        .on('click', function(event) {
                            $this.trigger('---hide');
                        });

                // Events.
                    $this
                        .on('click', function(event) {
                            event.stopPropagation();
                        })
                        .on('---toggle', function() {

                            if ($this.hasClass('active'))
                                $this.triggerHandler('---hide');
                            else
                                $this.triggerHandler('---show');

                        })
                        .on('---show', function() {

                            // Hide other content.
                                if ($body.hasClass('content-active'))
                                    $panels.trigger('---hide');

                            // Activate content, toggles.
                                $this.addClass('active');
                                $toggles.addClass('active');

                            // Activate body.
                                $body.addClass('content-active');

                        })
                        .on('---hide', function() {

                            // Deactivate content, toggles.
                                $this.removeClass('active');
                                $toggles.removeClass('active');

                            // Deactivate body.
                                $body.removeClass('content-active');

                        });

                // Toggles.
                    $toggles
                        .removeAttr('href')
                        .css('cursor', 'pointer')
                        .on('click', function(event) {

                            event.preventDefault();
                            event.stopPropagation();

                            $this.trigger('---toggle');

                        });

            });

            // Global events.
                $body
                    .on('click', function(event) {

                        if ($body.hasClass('content-active')) {

                            event.preventDefault();
                            event.stopPropagation();

                            $panels.trigger('---hide');

                        }

                    });

                $window
                    .on('keyup', function(event) {

                        if (event.keyCode == 27
                        &&  $body.hasClass('content-active')) {

                            event.preventDefault();
                            event.stopPropagation();

                            $panels.trigger('---hide');

                        }

                    });

        // Footer.
            var $footer = $('#footer');

        // Main.
            var $main = $('#main');

            // Thumbs.
                $main.children('.thumb').each(function() {

                    var $this = $(this),
                        $image = $this.find('.image'), $image_img = $image.children('img'),
                        x;

                    // No image? Bail.
                        if ($image.length == 0)
                            return;

                    // Image.
                    // This sets the background of the "image" <span> to the image pointed to by its child
                    // <img> (which is then hidden). Gives us way more flexibility.

                        // Set background.
                            $image.css('background-image', 'url(' + $image_img.attr('src') + ')');

                        // Set background position.
                            if (x = $image_img.data('position'))
                                $image.css('background-position', x);

                        // Hide original img.
                            $image_img.hide();

                });

            // Thumbs Index.
                $main.children('.thumb').each(function() {

                    var $this = $(this),
                        $link = $this.find('.link'), $link_img = $link.children('img'),
                        x;

                    // No link? Bail.
                        if ($link.length == 0)
                            return;

                    // link.
                    // This sets the background of the "link" <span> to the link pointed to by its child
                    // <img> (which is then hidden). Gives us way more flexibility.

                        // Set background.
                            $link.css('background-image', 'url(' + $link_img.attr('src') + ')');

                        // Set background position.
                            if (x = $link_img.data('position'))
                                $link.css('background-position', x);

                        // Hide original img.
                            $link_img.hide();
                });

                var gallery_items = $(".gallery-item").sort(
                        function(item_a, item_b){
                            return item_a.getAttribute("gallery_index") - 
                                    item_b.getAttribute("gallery_index");
                            }
                    );
                gallery_items.magnificPopup({
                    type: "image",
                    mainClass: "mfp-img-mobile",
                    image: {
                        titleSrc: function(item) {
                            let caption = '';
                            if(item.el.attr("downloadable") == "true"){
                                caption += '<div title="Download" ' +
                                    'class="download-button"><a href="' +
                                    item.el.attr("download_file") + '" download="' +
                                    item.el.attr("orig_name") +
                                    '"><i class="fa fa-download"></i></a></div>' +
                                    '<div class="caption-surround">';
                            }
                            caption += '<div class="caption-surround">';
                            if( item.el.attr("phototitle") != "" ) {
                                caption += "<h2>" + item.el.attr("phototitle") + "</h2>";
                            }
                            if( item.el.attr("description") != "" ) {
                                caption += '<div class="description">' +
                                    item.el.attr("description") + "</div>";
                            }
                            // should be able to add comment modal here
                            let tax_elem = item.el.parent().find(".caption_tax");
                            if( tax_elem.length > 0 ) {
                                caption += tax_elem[0].outerHTML;
                            }
                            caption += "</div>";
                            return caption;
                        },
                    },
                    gallery:{
                        enabled:true,
                        arrowMarkup: '<button title="%title%" class="nav-%dir%"></button>',
                    },
                    callbacks: {
                        change: function() {
                            // Replace the current history state with a URL with
                            // a new hash part.  The hash part tells the site to load
                            // a specific image in fullscreen.  Replacing the history
                            // causes the back and forward buttons to now go to the
                            // URL with the hash version...  Simply changing the URL
                            // will instead cause a browser to add a new URL to the
                            // history with the hash part.  Then if you look at a ton
                            // of images on one page, they'll all clutter up your history
                            // and you'll have to back through them all to get back to
                            // what seems like the previous page.  I think this
                            // replaceState version is a better behavior.
                            const hash = "#" + this.currItem.el.attr("id");
                            window.history.replaceState(undefined, undefined, hash);
                        },
                        close: function() {
                            // Clear the hash part without adding new things to the history
                            window.history.replaceState(undefined, undefined, "");
                        },
                    },
                    fixedContentPos: true,
                });

                // If there's a fragment id, see if it's an image index
                // If it is, and it's really a gallery_item then click on it
                let click_hash = function () {
                    let fid = $(window.location.hash);
                    if( fid.length == 1 &&
                        (
                            fid[0].classList.contains("gallery-item") ||
                            fid[0].classList.contains("gallery-item-marker")
                        )
                    ) {
                        let curr_item = $.magnificPopup.instance.currItem;
                        if( curr_item &&
                            curr_item.el.attr("id") == fid[0].id )
                        {
                            // Nothing needs to happen in this case...
                            return false;
                        } else
                        {
                            // Otherwise we need to update the popup, so click it
                            fid.click();
                            return false;
                        }
                    } else {
                        // Some other hash was present, let the browser handle it
                        $.magnificPopup.close();
                        return true;
                    }
                    return true;
                }

                // Check the fragment id at load
                if( window.location.hash != "" ) {
                    click_hash();
                }

                // Check the fragment id on hashchange
                $(window).on("hashchange", click_hash);
    });

})(jQuery);
