
$(function() {
    
    if( $.browser && $.browser.msie && parseInt( $.browser.version, 10) <= 8) {
        $(".bts-tooltip-container").addClass("bts-tooltip-container-ie8");

        $(".ie8-remove").remove();

        // change the z-index of the parent container so the hotspot content doesn't get clipped when near the edge
        $(".bts-tooltip").mouseover( function(e) {
            $(this).parents(".bts-lookbook-panel").css({zIndex: 20 });
        }).mouseleave( function(e) {
            $(this).parents(".bts-lookbook-panel").css({zIndex: 1 });
        });

    }

    function assetWidth() {
        // subtract the width of the left nav from the "window"
        return (windowWidth - $("#bts-nav").width() ) / originalAssetWidth; 
    }

    var throttleDelay = 16, // delay in ms between scroll events firing
        throttle,
        originalAssetWidth = 1440,
        minWindowWidth = 998, // the minimum width before horizontal scroll bars appear
        originalLayeringContentHeight = 3000,
        originalLookbookContentHeight = 5040,
        $window = $(window),
        windowWidth = $window.width(),
        windowHeight = $window.height(),

        fixedContainerTopOffSet,

        storyContentStart,
        storyContentEnd,
        
        layeringContentStart,
        layeringContentEnd,

        layeringHeight,
        layeringImageCount,
        layeringContentHeight,
        lookbookContentHeight,

        navbarHeight,
        megaNavHeight,
        scrollTopNavSection = "",

        $container = $("#bts-container"),

        $navBar = $("#bts-nav"),
        $navActiveItem,

        $fixedContainer = $("#bts-fixed-container"),
        $fixedContent = $("#bts-fixed-content"),

        pxRegex = /px/g, // remove px from string

        $storyContent = $("#bts-story-content"),
        storyContentOffsetTop,

        $layering = $("#bts-layering"),
        $layeringImages = $("#bts-layering-images"),
        
        $lookbookContent = $("#bts-lookbook-content"),
        $lookbookViewport = $("#bts-lookbook-viewport"),

        lookbookViewportHeight,
        lookbookViewportStart,
        lookbookViewportEnd,

        lookbookPanelLeftHeight,
        lookbookPanelRightHeight,

        $lookbookPanelLeft = $("#bts-lookbook-left-panel"),
        lookbookPanelLeftOriginalTop = +($lookbookPanelLeft.css("top").replace(pxRegex, "")), // convert to integer

        $lookbookPanelRight = $("#bts-lookbook-right-panel"),
        lookbookPanelRightOriginalTop = +($lookbookPanelRight.css("top").replace(pxRegex, "")), // convert to integer
        
        lookbookPanelInitialOffset = 0,

        $olapic = $("#olapic_specific_widget"),
        $footer = $("#FOOTER"),

        scrollTop,
        scrollSection = "story", // keep track of which scroll section we're in for performance

        ratio = assetWidth(),

        // tooltips
        $activeTooltip,
        $activeTooltipPoint,
        tooltipTimeoutInterval = 200, // in milliseconds
        tooltipTimeout,
        hideTooltip = function() { 
            if( $activeTooltip ) {
                $activeTooltip.css({
                    opacity: 0
                }).removeClass("bts-tooltip-active");
            }

            $activeTooltip = null;
        },
        displayTooltip = function( $this ){
            
            if( $activeTooltip && $activeTooltip == $( "#" + $this.data("tooltipId") ) ) {
                clearTimeout( tooltipTimeout );
            } else {
                clearTimeout( tooltipTimeout );
                $(".bts-tooltip-active-point").removeClass("bts-tooltip-active-point");
                hideTooltip();
            }
            $this.addClass("bts-tooltip-active-point");

            var offsets = $this.position(),
                openOnRight = $this.hasClass("bts-tooltip-right");

            $activeTooltip = $( "#" + $this.data("tooltipId") );

            if( openOnRight ) {

                $activeTooltip.css({
                    top: offsets.top - ($activeTooltip.height() / 2) + ($this.height() / 2),
                    left: offsets.left + ( $this.width() / 2 ) - $activeTooltip.width() ,
                    opacity: 1
                }).addClass("bts-tooltip-active");

            } else {

                $activeTooltip.css({
                    top: offsets.top - ($activeTooltip.height() / 2) + ($this.height() / 2),
                    left: offsets.left + ( $this.width() / 2 ) ,
                    opacity: 1
                }).addClass("bts-tooltip-active");
            }
        };

    if( window.bts2014NoTooltipEvents === undefined ) {

        $(".bts-tooltip").mouseover( function(e) {
            displayTooltip( $(this) ); 
        }).mouseleave( function(e) {
           tooltipTimeout = setTimeout( hideTooltip , tooltipTimeoutInterval );
        });

        // make it so you can close the tooltip on touch devices when clicking on it
        if("ontouchstart" in document.documentElement) {
            $(".bts-tooltip").each( function(i, el) {
               if(el && el.addEventListener ){

                    el.addEventListener('touchstart', function( e ) {
                        if( $activeTooltip ) {
                            clearTimeout( tooltipTimeout );
                            hideTooltip();
                        } else {
                            displayTooltip( $(this) );
                        }
                    });
                }
            });
        }

        $(".bts-tooltip-content").mouseenter( function(e) {
            if( $activeTooltip ) {
                clearTimeout( tooltipTimeout );
            }
        }).mouseleave( function(e) { 
            if( $activeTooltip) {
               tooltipTimeout = setTimeout( hideTooltip , tooltipTimeoutInterval );
            }
        });
    }

    var max = lookbookContentHeight - lookbookViewportHeight,
        leftPanelTop,
        rightPanelTop,
        i,
        $layeringActiveImage;

    function onScroll( e ) {

        if( throttle || window.bts2014NoScrollEvent !== undefined ) { //prevent firing this to often
            return;
        }

        throttle = true;

        var tempScollTop = $window.scrollTop();

        // scrollDelta = (scrollTop - tempScollTop) * -1,
        // scrollDirection = +( scrollTop < tempScollTop ); // 1 down, 0 up

        fixedContainerTopOffSet = $fixedContainer.offset().top; 
        storyContentOffsetTop = $storyContent.offset().top;

        storyContentStart = storyContentOffsetTop - navbarHeight;
        storyContentEnd = storyContentOffsetTop + $storyContent.outerHeight() - navbarHeight;

        layeringContentStart = storyContentEnd ;
        layeringContentEnd = layeringContentStart + layeringContentHeight;
        layeringHeight = $layering.outerHeight();

        lookbookViewportStart = layeringContentEnd + layeringHeight;
        lookbookViewportEnd = lookbookViewportStart + lookbookContentHeight ;

        lookbookViewportHeight   =  $lookbookViewport.height();
        lookbookPanelLeftHeight  =  $lookbookPanelLeft.height();
        lookbookPanelRightHeight =  $lookbookPanelRight.height();

        max = lookbookContentHeight - lookbookViewportHeight;

        scrollTop = $window.scrollTop();

        // menu nav        
        if(scrollTop > megaNavHeight ) {
            if( scrollTopNavSection != "fixed" ) {
                $navBar.addClass("bts-nav-fixed");
                scrollTopNavSection = "fixed";
            } 
        } else {
            if( scrollTopNavSection != "unfixed" ) {
                $navBar.removeClass("bts-nav-fixed");
                scrollTopNavSection = "unfixed";
            }
        }

        if( scrollTop >= 0 && scrollTop < storyContentEnd ) {
            // story section

            if( scrollSection != "scroll" ){
                scrollSection = "scroll"; 

                $fixedContent.removeClass("bts-fixed")
                             .removeClass("bts-absolute")
                             .css({top: 0 });

                $lookbookPanelLeft.css( {top: Math.ceil( - lookbookPanelLeftHeight + lookbookViewportHeight ) });
                $lookbookPanelRight.css( {top: 0 });
            }
            
            if( $navActiveItem != $("#bts-nav-story") ) {
                if( $navActiveItem ) {
                    $navActiveItem.removeClass("bts-nav-active");
                }
                $navActiveItem = $("#bts-nav-story");
                $navActiveItem.addClass("bts-nav-active");
            }

        } 
        if(scrollTop >= layeringContentStart && scrollTop < layeringContentEnd ) {
            // layering section

            if( scrollSection != "layering" ){
                scrollSection = "layering"; 

                $fixedContent
                    .addClass("bts-fixed")
                    .removeClass("bts-absolute")
                    .css({top: navbarHeight });

                if( $navActiveItem != $("#bts-nav-layering") ) {
                    if( $navActiveItem ) {
                        $navActiveItem.removeClass("bts-nav-active");
                    }
                    $navActiveItem = $("#bts-nav-layering");
                    $navActiveItem.addClass("bts-nav-active");
                }

                $lookbookPanelLeft.css( {top: Math.ceil( - lookbookPanelLeftHeight + lookbookViewportHeight ) });
                $lookbookPanelRight.css( {top: 0 });
            }
       
            tempScollTop = scrollTop + navbarHeight - fixedContainerTopOffSet;

            imageId =  Math.ceil((tempScollTop / layeringContentHeight) * layeringImageCount);

            if( $layeringActiveImage != $("#bts-layering-image" +imageId ) ) {
                $(".bts-layering-active").removeClass("bts-layering-active");

                $layeringActiveImage = $("#bts-layering-image" +imageId );
                $layeringActiveImage.addClass("bts-layering-active");
            }
            
        } 
        if( scrollTop >= layeringContentEnd && scrollTop < lookbookViewportStart ) {
            // between layering and lookbook section

            if( scrollSection != "layeringSub" ){
                scrollSection = "layeringSub"; 

                $fixedContent
                    .removeClass("bts-fixed")
                    .addClass("bts-absolute")
                    .css({top: layeringContentHeight });

                $lookbookPanelLeft.css( {top: Math.ceil( - lookbookPanelLeftHeight + lookbookViewportHeight ) });
                $lookbookPanelRight.css( {top: 0 });
            }

        } 
        if(scrollTop >= lookbookViewportStart && scrollTop <= lookbookViewportEnd ) {
            // lookbook section

            if( scrollSection != "lookbook" ) {
                scrollSection = "lookbook"; 

                $fixedContent
                    .addClass("bts-fixed")
                    .removeClass("bts-absolute")
                    .css({top: - layeringHeight + navbarHeight });

                if( $navActiveItem != $("#bts-nav-lookbook") ) {
                    if( $navActiveItem ) {
                        $navActiveItem.removeClass("bts-nav-active");
                    }
                    $navActiveItem = $("#bts-nav-lookbook");
                    $navActiveItem.addClass("bts-nav-active");
                }

            }

            tempScollTop = Math.ceil(scrollTop - lookbookViewportStart - 1);

            leftPanelTop = Math.ceil( -lookbookPanelLeftHeight + lookbookViewportHeight)  + tempScollTop;
            rightPanelTop = (lookbookPanelRightOriginalTop * ratio) -  tempScollTop ;

            $lookbookPanelLeft.css( { top: Math.ceil( leftPanelTop  ) } );
            $lookbookPanelRight.css( { top: Math.floor( rightPanelTop  ) } );

        }  
        if( scrollTop > lookbookViewportEnd  ){
            // after lookbook section
            if( scrollSection != "olapic" ) {
                scrollSection = "olapic";

                $fixedContent
                    .removeClass("bts-fixed")
                    .css({top:  (layeringContentHeight + lookbookContentHeight ) });

                $lookbookPanelLeft.css( {top: 0 } );
                $lookbookPanelRight.css( {top: Math.ceil( - lookbookPanelRightHeight + lookbookViewportHeight ) } );

                // add back in if olpaic widget is added back in
                // if( $navActiveItem != $("#bts-nav-social") ) {
                //     if( $navActiveItem ) {
                //         $navActiveItem.removeClass("bts-nav-active");
                //     }
                //     $navActiveItem = $("#bts-nav-social");
                //     $navActiveItem.addClass("bts-nav-active");
                // }
            }
        } 

        setTimeout( function(){
            throttle = false;
        }, throttleDelay );

    } 

    function scale( axis, $el, floor ) {
        
        var elWidth,
            elHeight,
            method = (typeof floor !== "undefined" ? Math.floor : Math.ceil ),
            originalWidth = $el.data("bts-original-width"),
            originalHeight = $el.data("bts-original-height");

        if( axis == "both" || axis == "width" ) {
            if( originalWidth ){
                $el.width( method(originalWidth * ratio) );
            } else {
                elWidth = $el.width();
                $el.data("bts-original-width", elWidth );
                $el.width( method(elWidth * ratio)  );
            }
        }
        if( axis == "both" || axis == "height" ){
            if( originalHeight ){
                $el.height( method(originalHeight * ratio) );
            } else {
                elHeight = $el.height();
                $el.data("bts-original-height", elHeight );
                $el.height( method(elHeight * ratio) );
            }
        }
    }

    function onResize() {
        // update the "global" values
        windowWidth = $window.width();
        if( windowWidth < minWindowWidth ) {
            windowWidth = minWindowWidth; // dont allow the width to go below header/footer widths
        }
        windowHeight = $window.height();
        ratio = assetWidth();

        layeringImageCount = parseInt($layeringImages.data("count"), 10);

        layeringHeight = $layering.outerHeight();
        layeringContentHeight = originalLayeringContentHeight * ratio;
        lookbookContentHeight = originalLookbookContentHeight * ratio;
        navbarHeight = $("#HEADER").outerHeight();
        megaNavHeight = $("#NAV").outerHeight() + 5;
        storyContentOffsetTop = $storyContent.offset().top;
        fixedContainerTopOffSet = $fixedContainer.offset().top; 

        var $el;

        $container.css("margin-left", "38px");

        $(".bts-scale").each(function( i, el ){
            scale("both", $(el) );
        });

        // scale with floor
        $(".bts-scale-down").each(function( i, el ){ 
            scale("both", $(el), true);
        });

        $(".bts-scale-width").each(function( i, el ){
            scale("width", $(el) );
        });
    
        $(".bts-scale-height, .bts-story-row-viewport").each(function( i, el ){
            scale("height", $(el) );
        });

        $fixedContainer.outerHeight( 
            layeringContentHeight +
            lookbookContentHeight  +
            $layering.outerHeight() + 
            $lookbookContent.outerHeight() + 
            $olapic.outerHeight() + 
            $footer.outerHeight() 
        );

        onScroll();
    }

    // move the footer into the fixed container
    if( window.bts2014DontMoveFooter === undefined ) {
        $olapic.after( $footer );
    }

    if( window.bts2014NoScrollEvent === undefined ){
        $window.scroll( onScroll ); 
    }

    if( window.bts2014NoResizeEvent === undefined ){
        $window.resize( onResize );
        onResize(); // fire on initial page load this also fires an onScroll function call
    }

    function omnitureNav( value ) {
        s=s_gi(s_account);
        s.linkTrackVars="eVar53,eVar29,events";
        s.linkTrackEvents="event53";
        s.eVar29="bts:left-nav:" + value;
        s.tl(this,'o','bts:left-nav:' + value);
    }

    $navBar.on("click", ".bts-nav-link", function( e ){

        var $this = $(this),
            scrollTo;
        
        switch( $this[0].id ) {
            case "bts-nav-story": 
                scrollTo = megaNavHeight; 
                omnitureNav( "essentials" );
            break;

            case "bts-nav-layering":
                scrollTo = fixedContainerTopOffSet - navbarHeight + 1;
                omnitureNav( "layers" );
            break;

            case "bts-nav-lookbook":
                scrollTo = lookbookViewportStart + 1; 
                omnitureNav( "lookbook" );
            break;

            case "bts-nav-social":
                location.href = 'http://instagram.com/ivivva';
                omnitureNav( "newyearnextlevel" );
                return;
                // scrollTo = lookbookViewportStart + lookbookContentHeight + $lookbookViewport.height();
            break;
        }

        e.preventDefault();

        $window.scrollTop( scrollTo );
        onScroll();
    });

    $container.on("mouseenter", ".bts-product", function(){
        $(this).find(".bts-product-hover").show();
        $(this).find(".bts-product-cta").hide();
    });

    $container.on("mouseleave", ".bts-product", function(){
        $(this).find(".bts-product-hover").hide();
        $(this).find(".bts-product-cta").show();
    });

    // left nav share button
    $("#bts-nav-facebook").live('click',function(e){
        s=s_gi(s_account);
        s.linkTrackVars="eVar53,eVar29,events";
        s.linkTrackEvents="event53";
        s.eVar29="bts:social-share:facebook";
        s.eVar53="facebook";
        s.events="event53";
        s.tl(this,'o','bts:social-share:facebook');

        var link = window.location.href.replace(/#[A-z0-9]*/,""),
            url = 'https://www.facebook.com/sharer/sharer.php?u='+ link ;                                

        window.open(url, 'sharer','width=626,height=436,left='+((window.screen.width - 626) / 3) + ',top=' + ((window.screen.height - 436) / 3));
    }); 
    
    $("#bts-nav-twitter").live('click',function(e){
        e.preventDefault();
        s=s_gi(s_account);
        s.linkTrackVars="eVar56,eVar29,events";
        s.linkTrackEvents="event53";
        s.eVar29="bts:social-share:twitter";
        s.eVar53="twitter";
        s.events="event53"; 
        s.tl(this,'o','bts:social-share:twitter');

        var link = "http://bit.ly/nextlevel_",
            text = "taking it to the next level with @ivivva #newyearnextlevel",
            url ='http://twitter.com/share?url='+ link + '&text='+ escape(text); 

        window.open(url,'tweetPop','height=300,width=700,left='+ ((window.screen.width - 700) / 3) +',top='+ ((window.screen.height - 300) / 3) );
    });

});