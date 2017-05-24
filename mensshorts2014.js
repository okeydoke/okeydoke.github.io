// omniture tracking
function mensshortsOmnitureVirtualLoad(pageName, eVar29, product) {

    s.pageName = "store:men:bottom:shorts:guide:" + pageName;
    s.eVar29 = "guide:mensshorts:" + eVar29;
    s.eVar3 = "guide:mennshorts";
    if( product !== undefined ){
        s.products = ";" + product;
        s.events = "event44";
    } else {
        s.products = "";
        s.events = "";
    }
    void(s.t());
}

function mensshortsOmnitureOnclickEvent(eVar29) {

    var s = s_gi(s_account);
    s.linkTrackVars = "eVar3,eVar29";
    s.eVar29 = "guide:mensshorts:back:" + eVar29;
    s.eVar3 = "guide:mensshorts";
    s.tl(this,'o','guide:mensshorts:back:' + eVar29);
}

(function(){

    var namespace = "mensshorts2014",
        $container = $("#"+namespace+"-container"),
        nonsensePanels;

    function InteractivePanel( panelConfig ) {
        var self = this, 
            $redline = $('<div id="'+namespace+'-redline"></div>'),
            redlineAppendedTo = null, // keep track of whether or not the redline has been appended to another element
            panelHeight = $container.height(),
            currentPanelId = "",
            panelHTMLCache = {},
            animationDuration = 400,
            animationEasing = 'easeOutCubic',
            animationRunning = false,
            _panels;

        $container.append($redline);
        _panels = flatten( panelConfig );
        currentPanelId = panelConfig.id;

        this.setAnimDuration = function( val ) {
            animationDuration = +val;
        };

        this.setAnimEasing = function( val ) {
            animationEasing = val;
        };

        function animationComplete() {
            animationRunning = false;
            $(self).trigger("animationComplete");
        }

        function animationStarted() {
            animationRunning = true;
        }

        var $currentPanel;
        function openPanel( panelId, direction, omnitureLink ) {
            if( animationRunning ) {
                return; // prevent double clicks from messing with the animation
            }
            // cleanup the redline incase it doesnt get removed properly
            $redline.removeClass("fadeInUp " +namespace+"-redline-active");

            var currentPanel = getPanelById( currentPanelId );

            if( omnitureLink ) {
                mensshortsOmnitureVirtualLoad( "activity", omnitureLink );
            } else if( direction === "back" && currentPanel.hasOwnProperty( "omniture" ) && currentPanel.omniture.product === undefined ) {
                mensshortsOmnitureOnclickEvent( currentPanel.omniture.back );
            } else if( direction === "back" && panelId === "home"){
                mensshortsOmnitureOnclickEvent( "startover" );
            } 

            // fire any onClose functions the panel has
            if( currentPanel.hasOwnProperty("onClose") ) {
                currentPanel.onClose();
            }

            var newPanel = getPanelById( panelId ),
                currentId = currentPanelId,
                newPanelId = newPanel.id,
                currentPanelTop = direction === "back" ? panelHeight : -panelHeight,
                newPanelTop = direction === "back" ? -panelHeight : panelHeight;

            // this is a NonsensePanel so we need to randomize
            var $panel;
            if( newPanel instanceof NonsensePanel) {
                var nonsensePanel = nonsensePanels[ Math.floor( Math.random() * nonsensePanels.length )];

                $panel = $("#" + namespace + "-panel-nonsense-" + nonsensePanel.id);
                newPanelId = "nonsense-" + nonsensePanel.id;
                // set forward links
                $panel.find("div."+namespace+"-link").data("linkid", newPanel.linkid);
                $panel.find("."+namespace+"-nonsense-q1").one("click", function() {
                    mensshortsOmnitureVirtualLoad("nonsense" + nonsensePanel.id, "nonsense" + nonsensePanel.id + ":" + nonsensePanel.button1.q );
                });
                $panel.find("."+namespace+"-nonsense-q2").one("click", function() {
                    mensshortsOmnitureVirtualLoad("nonsense" + nonsensePanel.id, "nonsense" + nonsensePanel.id + ":" + nonsensePanel.button2.q );
                });

                // set parent link
                $panel.find("span."+namespace+"-parent").data("linkid", newPanel.parentId)
                $panel.find("span."+namespace+"-nonsense-activity").html(newPanel.parentTitle);
            } 

            currentPanelId = newPanel.id;

            if( newPanel.hasOwnProperty("onOpen") ) {
                newPanel.onOpen();
            }

            animationStarted();

            if( newPanel.hasOwnProperty("animationComplete") ) {
                $(self).one( "animationComplete", function(){
                    newPanel.animationComplete();
                });
            }

            if( !$currentPanel ){
                $currentPanel = $("#" + namespace + "-panel-" + currentId);
            }

            $currentPanel.animate({top: currentPanelTop }, animationDuration, animationEasing);
            $("#" + namespace + "-panel-" + newPanelId).css({top: newPanelTop }).animate({top:0}, animationDuration, animationEasing, animationComplete);
           
            if( newPanel instanceof NonsensePanel) {
                $currentPanel = $panel;
            } else {
                $currentPanel = $("#" + namespace + "-panel-" + newPanelId);
            }
        }

        // returns a Panel object if its id matches the supplied id parameter, null otherwise
        function getPanelById ( id ) {
            var panels = _panels, 
                panel, x;

            for( x in panels ) {
                panel = panels[x];
                if( panels.hasOwnProperty(x) && panel.id == id ) {
                    return panel;
                }
            }
            return null;
        }

        function init() {

            // load the initial panel
            panelHTMLCache[ currentPanelId ] = true;
            $container.append( $( getPanelById( currentPanelId ).getHtml() ) );

            preload( currentPanelId );
        }

        // recursively get all the panel and its children and add their html to the dom
        function preload( panelId ) {

            var panel = getPanelById( panelId ),
                html, 
                p, i;

            for(i = panel.children.length; i--;){
                p = panel.children[i];
                if( !panelHTMLCache[ p.id ] ) {
                    panelHTMLCache[ p.id ] = true;
                    html = p.getHtml();
                    if( html !== null ) {
                        $container.append( $( p.getHtml() ) );
                    }
                }
                preload( p.id ); // recursion ;)
            }
        }

        // recursively loop over a panel object and flatten out its children  
        // into a key->value object to allow for easier lookup & navigation
        function flatten( panel, output ) {
                
            if( typeof output === 'undefined' ) {
                output = {};
                output[panel.id] = panel;
            }
            if( panel.children && panel.children.length > 0) {
                for(var x = panel.children.length; x--; ) {
                    output = flatten( panel.children[x], output );
                }
            }   
            output[ panel.id ] = panel;

            return output;
        }

        // navigation
        $container.on("click touchend", "." + namespace +'-link', function(e){
            e.preventDefault();
            var $this = $(this),
                omniture = $this.data("omniture"),
                direction = $this.data("linkDirection"),
                panelId = $this.data("linkid");

            openPanel( panelId, direction, omniture );

        }).on("mouseenter", "." +namespace+"-redline", function() {

            var $this = $(this),
                $target = $this,
                position = {},
                offset = 4;

            if( $target.data("redlineTarget") ){
                $target = $( $target.data("redlineTarget") );

                if( redlineAppendedTo !== $this ) {
                    redlineAppendedTo = $this.find("." + namespace + "-redline-append");
                    $redline.appendTo( redlineAppendedTo );
                }
            } else if( redlineAppendedTo ) {
                $redline.appendTo( $container );
                redlineAppendedTo = null;
            } 
            position = {top: $target.position().top + $target.height() + offset, left: Math.ceil($target.position().left) };
            
            $redline.width($target.width());
            $redline.css(position);
            $redline.addClass("fadeInUp " + namespace + "-redline-active");

        }).on("mouseleave", "." +namespace+"-redline", function(){
            $redline.removeClass("fadeInUp " + namespace + "-redline-active");
        });

        init();

        return this;
    }

    function Panel(options) {
        this.id = options.id;
        this.title = options.title;
        this.bgimage = options.bgimage;

        this.extraHtml = options.extraHtml || "";

        this.parentId = null;
        this.setParent = function( parentId, parentTitle ){
            this.parentId = parentId;
            this.parentTitle = parentTitle;
        };

        this.children = options.children || [];
        for(var c = this.children.length; c--; ) { 
            this.children[c].setParent( this.id, this.title );
        }

        if( options.hasOwnProperty("omniture")) {
            this.omniture = options.omniture;
        }

        if( options.hasOwnProperty("onOpen")) {
            this.onOpen = options.onOpen;
        }

        if( options.hasOwnProperty("animationComplete")) {
            this.animationComplete = options.animationComplete;
        }
        
        if( options.hasOwnProperty("onClose")) {
            this.onClose = options.onClose;
        }

        this.elements = options.elements || [];

        this.getHtml = function(){
            var html = "",
                style = this.bgimage ? ' style="background-image:url('+this.bgimage+');"' : "",
                elements = "";

            // elements 
            for(var i = 0, l = this.elements.length, el; i < l; i++) {
                el = this.elements[i];
                elements += el.html;
            }

            // back link
            if( this.parentId ) {
                if( this.children.length > 0 ) {
                    html += '<span class="'+namespace+'-parent '+namespace+'-link" data-link-direction="back" data-linkid="'+this.parentId+'">BACK TO '+this.parentTitle+' <span class="'+namespace+'-parent-link-icon"></span></span>';
                } else { // use start over link instead
                    html += '<span class="'+namespace+'-parent '+namespace+'-link" data-link-direction="back" data-linkid="home">START OVER <span class="'+namespace+'-start-over-icon"></span></span>';
                }
            } 

            html += elements;

            html += this.extraHtml;

            return '<div id="'+namespace+"-panel-"+this.id+'" class="'+namespace+'-panel"'+style+'>'+html+'</div>';
        };
        return this;
    }

    function NonsensePanel( options ) {
        Panel.call(this, options); // simple inheritance

        this.linkid = options.linkid;

        this.getHtml = function(){
            return null;
        };

        return this;
    }

    function Element(options) {
        this.id = options.id || null;
        // omniture

        this.html = options.html || "";
        this.position = options.position;

        var styles = ["top", "left", "height", "width"],
            style = [],
            s;
        
        // check the options object for properties that are in the styles array 
        for(var i = styles.length; i--;) {
            s = styles[i];
            if( options.hasOwnProperty(s) ) {
                style.push( s + ":" + options[s] + "px" );
            }
        }

        var link = "",
            classes = [namespace+'-element'],
            id = "",
            redlineTarget = "";

        if(options.linkid) {
            var linkDirection = options.linkDirection || "forward";
            link = ' data-link-direction=' +linkDirection + " data-linkid=" + options.linkid + " " ;
            classes.push(namespace + '-link');
            style.push("cursor:pointer");
        }

        if(options.redline){
            classes.push(namespace+"-redline");
        }
        if(options.redlineTarget) {
           redlineTarget = ' data-redline-target="'+options.redlineTarget+'"'; 
        }

        if( this.id !== null ){
            id = 'id="'+namespace+'-'+this.id+'" ';
        }
        this.html = '<div '+id+redlineTarget+'class="'+classes.join(" ")+'" style="'+style.join(";")+'"'+link+'>' + this.html + '</div>';

        return this;
    }

    var homePageItems =  [
        '<li class="'+namespace+'-home-train '+namespace+'-link '+namespace+'-redline" data-link-direction="forward" data-omniture="gym" data-linkid="training-liner" data-redline-target=".mensshorts2014-activity-redline1"><div class="mensshorts2014-activity mensshorts2014-redline-append"><div class="mensshorts2014-activity-redline mensshorts2014-activity-redline1" style="width:74px;"></div></div> </li>',
        '<li class="'+namespace+'-home-run '+namespace+'-link '+namespace+'-redline" data-link-direction="forward" data-omniture="run" data-linkid="run-liner" data-redline-target=".mensshorts2014-activity-redline2"><div class="mensshorts2014-activity mensshorts2014-redline-append"><div class="mensshorts2014-activity-redline mensshorts2014-activity-redline2" style="width:46px;"></div></div></li>',
        '<li class="'+namespace+'-home-yoga '+namespace+'-link '+namespace+'-redline" data-link-direction="forward" data-omniture="yoga" data-linkid="yoga-for-the-people-nonsense" data-redline-target=".mensshorts2014-activity-redline3"><div class="mensshorts2014-activity mensshorts2014-redline-append"><div class="mensshorts2014-activity-redline mensshorts2014-activity-redline3" style="width:60px;"></div></div></li>',
        '<li class="'+namespace+'-home-anything '+namespace+'-link '+namespace+'-redline" data-link-direction="forward" data-omniture="sport" data-linkid="anything-liner" data-redline-target=".mensshorts2014-activity-redline4"><div class="mensshorts2014-activity mensshorts2014-redline-append"><div class="mensshorts2014-activity-redline mensshorts2014-activity-redline4" style="width:107px;position:relative;left:2px;"></div></div></li>'
    ];

    var shortsPanelConfig = new Panel({
        id: "home",
        title: "Activity",
        title_fr: "",
        extraHtml: '<ul>' + homePageItems.join("") +'</ul>',
        bgimage: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-home-background",
        children: [
            new Panel({
                id: "run-liner",
                title:"Liner",
                bgimage: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-liner1",
                omniture: {
                    back: "activity"
                },
                elements:[ 
                    new Element({
                        linkid: "run-liner-nonsense",
                        redline: true,
                        redlineTarget: "#"+namespace+"-runliner-redline",
                        html: '<div class="'+namespace+'-redline-append" style="width:100%;height:100%;"><div id="'+namespace+'-runliner-redline" style="position:absolute; bottom:0px; height:13px;width:46px;left:38px;"></div></div>',
                        left:153, 
                        top: 70,
                        height: 202,
                        width: 111
                    }), new Element({
                        linkid: "run-length",
                        redline: true,
                        left:396, 
                        top: 70,
                        height: 202,
                        width: 191
                    }), new Element({
                        linkid: "run-surge-7-lux-nonsense",
                        redline: true,
                        left:648,
                        top: 70,
                        height: 202,
                        width: 243
                    })
                ],
                children: [
                    new NonsensePanel({
                        id: "run-liner-nonsense",
                        linkid: "run-hardcore",
                        onOpen: function() {
                            mensshortsOmnitureVirtualLoad("liner", "linerlayer:none");
                        },
                        omniture: {
                            back: "liner" 
                        },
                        children:[  
                            new Panel({
                                id: "run-hardcore",
                                bgimage: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-result-hardcore-run",
                                onOpen: function() {
                                    mensshortsOmnitureVirtualLoad("result", "results:runshardcore", "guide:mennshorts:runhardcore");
                                },
                                elements:[ 
                                    new Element({
                                        html: '<a href="/products/clothes-accessories/mens-shorts-run/Hardcore-Short?icid=guide:mensshorts:run:hardcore" class="'+namespace+'-pdp-link"></a>',
                                        left:534, 
                                        top: 230,
                                        height: 33,
                                        width: 158
                                    })
                                ]
                            })
                        ]
                    }),
                    new Panel({
                        id: "run-length",
                        bgimage: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-run-length",
                        title: "Length",
                        onOpen: function() {
                            mensshortsOmnitureVirtualLoad("liner", "linerlayer:lightsupportbrief");
                        },
                        omniture: {
                            back: "liner"
                        },
                        animationComplete: function() {
                            $("#"+namespace+'-animated-height-run-5').find(".animated-height-body").height(47);
                            $("#"+namespace+'-animated-height-run-7').find(".animated-height-body").height(68);
                        },
                        onClose: function() {
                            $("#"+namespace+'-animated-height-run-5').find(".animated-height-body").height(10);
                            $("#"+namespace+'-animated-height-run-7').find(".animated-height-body").height(10);
                        },
                        elements:[ 
                            new Element({
                                linkid: "run-surge-5-nonsense",
                                id: "runlength-5-redline",
                                redline: true,
                                left:176, 
                                top: 199,
                                height: 35,
                                width: 84
                            }), new Element({
                                linkid: "run-surge-7-nonsense",
                                id: "runlength-7-redline",
                                redline: true,
                                left:512, 
                                top: 199,
                                height: 35,
                                width: 84
                            }),
                            new Element({
                                linkid: "run-surge-5-nonsense",
                                redline: true,
                                redlineTarget: "#"+namespace+"-runlength-5-redline",
                                left:260, 
                                top: 70,
                                height: 240,
                                width: 200
                            }), new Element({
                                linkid: "run-surge-7-nonsense",
                                redline: true,
                                redlineTarget: "#"+namespace+"-runlength-7-redline",
                                left:590, 
                                top: 70,
                                height: 240,
                                width: 230
                            }),
                            new Element({
                                linkid: "run-surge-5-nonsense",
                                id: "animated-height-run-5",
                                redline: true,
                                redlineTarget: "#"+namespace+"-runlength-5-redline",
                                left:280,
                                top:193,
                                height:60,
                                width:100,
                                html: '<div><div class="animated-height-top"></div><div class="animated-height-body"></div><div class="animated-height-bottom"></div></div>'
                            }),
                            new Element({
                                linkid: "run-surge-7-nonsense",
                                id: "animated-height-run-7",
                                redline: true,
                                redlineTarget: "#"+namespace+"-runlength-7-redline",
                                left:622,
                                top:192,
                                height:68,
                                width:100,
                                html: '<div><div class="animated-height-top"></div><div class="animated-height-body"></div><div class="animated-height-bottom"></div></div>'
                            })
                        ], 
                        children: [
                            new NonsensePanel({
                                id: "run-surge-5-nonsense",
                                linkid: "run-surge-5",
                                onOpen: function() {
                                    mensshortsOmnitureVirtualLoad("length", "lengthlayer:5");
                                },
                                omniture: {
                                    back: "length"
                                },
                                children:[  
                                    new Panel({
                                        id: "run-surge-5",
                                        bgimage: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-result-surge-5-run",
                                        onOpen: function() {
                                            mensshortsOmnitureVirtualLoad("result", "results:runsurge5", "guide:mennshorts:runsurge5");
                                        },
                                        elements:[ 
                                            new Element({
                                                html: '<a href="/products/clothes-accessories/mens-shorts-run/Surge-Short-5?icid=guide:mensshorts:run:surge5" class="'+namespace+'-pdp-link"></a>',
                                                left:534, 
                                                top: 248,
                                                height: 33,
                                                width: 158
                                            })
                                        ]
                                    })
                                ]
                            }),
                            new NonsensePanel({
                                id: "run-surge-7-nonsense",
                                linkid: "run-surge-7",
                                 onOpen: function() {
                                    mensshortsOmnitureVirtualLoad("length", "lengthlayer:7");
                                },
                                omniture: {
                                    back: "length"
                                },
                                children:[  
                                    new Panel({
                                        id: "run-surge-7",
                                        bgimage: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-result-surge-7-run",
                                        onOpen: function() {
                                            mensshortsOmnitureVirtualLoad("result", "results:runsurge7", "guide:mennshorts:runsurge7");
                                        },
                                        elements:[ 
                                            new Element({
                                                html: '<a href="/products/clothes-accessories/mens-shorts-run/Surge-Short-7?icid=guide:mensshorts:run:surge7" class="'+namespace+'-pdp-link"></a>',
                                                left:534, 
                                                top: 248,
                                                height: 33,
                                                width: 158
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    new NonsensePanel({
                        id: "run-surge-7-lux-nonsense",
                        linkid: "run-surge-7-lux",
                        onOpen: function() {
                            mensshortsOmnitureVirtualLoad("liner", "linerlayer:highsupportboxerbrief");
                        },
                        omniture: {
                            back: "liner"
                        },
                        children:[  
                            new Panel({
                                id: "run-surge-7-lux",
                                bgimage: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-result-surge-7-lux-run",
                                onOpen: function() {
                                    mensshortsOmnitureVirtualLoad("result", "results:runsurge7lux", "guide:mennshorts:runsurge7lux");
                                },
                                elements:[ 
                                    new Element({
                                        html: '<a href="/products/clothes-accessories/mens-shorts-run/Surge-Short-2-in-1-7in?icid=guide:mensshorts:run:surge7lux" class="'+namespace+'-pdp-link"></a>',
                                        left:534, 
                                        top: 262,
                                        height: 33,
                                        width: 158
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            new Panel({
                id: "anything-liner",
                bgimage: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-liner",
                title: "Liner",
                omniture: {
                    pagename: "activity", 
                    eVar29: "activitylayer:sport",
                    back: "activity"
                },
                elements:[ 
                    new Element({
                        linkid: "anything-core-nonsense",
                        redlineTarget: "#"+namespace+"-runliner-redline",
                        html: '<div class="'+namespace+'-redline-append" style="width:100%;height:100%;"><div id="'+namespace+'-runliner-redline" style="position:absolute; bottom:0px; height:13px;width:46px;left:38px;"></div></div>',
                        redline: true,
                        left:153, 
                        top: 70,
                        height: 202,
                        width: 113
                    }), new Element({
                        linkid: "anything-pace-breaker-nonsense",
                        redline: true,
                        left:365, 
                        top: 70,
                        height: 202,
                        width: 251
                    }), new Element({
                        linkid: "anything-pace-breaker-lux-nonsense",
                        redline: true,
                        left:658,
                        top: 70,
                        height: 202,
                        width: 243
                    })
                ],
                children: [  
                    new NonsensePanel({
                        id: "anything-core-nonsense",
                        linkid: "anything-core",
                        onOpen: function() {
                            mensshortsOmnitureVirtualLoad("liner", "linerlayer:none");
                        },
                        children:[  
                            new Panel({
                                id: "anything-core",
                                bgimage: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-result-core-anything",
                                onOpen: function() {
                                    mensshortsOmnitureVirtualLoad("result", "results:anythingcore", "guide:mennshorts:anythingcore");
                                },
                                elements:[ 
                                    new Element({
                                        html: '<a href="/products/clothes-accessories/mens-shorts-gym/Core-Short-32404?icid=guide:mensshorts:sport:core" class="'+namespace+'-pdp-link"></a>',
                                        left:534, 
                                        top: 248,
                                        height: 33,
                                        width: 158
                                    })
                                ]
                            })
                        ]
                    }),
                    new NonsensePanel({
                        id: "anything-pace-breaker-nonsense",
                        linkid: "anything-pace-breaker",
                        onOpen: function() {
                            mensshortsOmnitureVirtualLoad("liner", "linerlayer:lightsupportboxerbrief");
                        },
                        children:[  
                            new Panel({
                                id: "anything-pace-breaker",
                                bgimage: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-result-pace-breaker-anything",
                                onOpen: function() {
                                    mensshortsOmnitureVirtualLoad("result", "results:anythingpacebreaker", "guide:mennshorts:anythingpacebreaker");
                                },
                                elements:[ 
                                    new Element({
                                        html: '<a href="/products/clothes-accessories/mens-shorts-gym/Pace-Breaker-Short?icid=guide:mensshorts:sport:pacebreaker" class="'+namespace+'-pdp-link"></a>',
                                        left:534, 
                                        top: 243,
                                        height: 33,
                                        width: 158
                                    })
                                ]
                            })
                        ]
                    }),
                    new NonsensePanel({
                        id: "anything-pace-breaker-lux-nonsense",
                        linkid: "anything-pace-breaker-lux",
                        onOpen: function() {
                            mensshortsOmnitureVirtualLoad("liner", "linerlayer:highsupportboxerbrief");
                        },
                        children:[  
                            new Panel({
                                id: "anything-pace-breaker-lux",
                                bgimage: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-result-pace-breaker-lux-anything",
                                onOpen: function() {
                                    mensshortsOmnitureVirtualLoad("result", "results:anythingpacebreakerlux", "guide:mennshorts:anythingpacebreakerlux");
                                },
                                elements:[ 
                                    new Element({
                                        html: '<a href="/products/clothes-accessories/mens-shorts-gym/Pace-Breaker-Short-SE-Silver?icid=guide:mensshorts:sport:pacebreakerlux" class="'+namespace+'-pdp-link"></a>',
                                        left:534, 
                                        top: 261,
                                        height: 33,
                                        width: 158
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            new Panel({
                id: "training-liner",
                title: "Liner",
                bgimage: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-liner",
                omniture: {
                    back: "activity"
                },
                elements:[ 
                    new Element({
                        linkid: "training-feature",
                        redlineTarget: "#"+namespace+"-runliner-redline",
                        html: '<div class="'+namespace+'-redline-append" style="width:100%;height:100%;"><div id="'+namespace+'-runliner-redline" style="position:absolute; bottom:0px; height:13px;width:46px;left:38px;"></div></div>',
                        redline: true,
                        left:153, 
                        top: 70,
                        height: 202,
                        width: 113
                    }), new Element({
                        linkid: "training-pace-breaker-nonsense",
                        redline: true,
                        left:365, 
                        top: 70,
                        height: 202,
                        width: 251
                    }), new Element({
                        linkid: "training-pace-breaker-lux-nonsense",
                        redline: true,
                        left:658,
                        top: 70,
                        height: 202,
                        width: 243
                    })
                ],
                children: [  
                    new Panel({
                        id: "training-feature",
                        title: "ACTIVITY",
                        bgimage: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-train-crossfitvgym",
                        onOpen: function() {
                            mensshortsOmnitureVirtualLoad("liner", "linerlayer:none");
                        },
                        omniture: {
                            back: "liner"
                        },
                        elements:[ 
                            new Element({
                                linkid: "training-assert-nonsense",
                                redline: true,
                                left:261, 
                                top: 160,
                                height: 25,
                                width: 173
                            }), new Element({
                                linkid: "training-core-nonsense",
                                redline: true,
                                left:525, 
                                top: 160,
                                height: 25,
                                width: 192
                            })
                        ], 
                        children: [
                            new NonsensePanel({
                                id: "training-assert-nonsense",
                                linkid: "training-assert",
                                onOpen: function() {
                                    mensshortsOmnitureVirtualLoad("feature", "trainingfeature:crossfit");
                                },
                                omniture: {
                                    back: "feature"
                                },
                                children:[  
                                    new Panel({
                                        id: "training-assert",
                                        bgimage: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-result-assert-gym",
                                        onOpen: function() {
                                            mensshortsOmnitureVirtualLoad("result", "results:gymassert", "guide:mennshorts:gymassert");
                                        },
                                        elements:[ 
                                            new Element({
                                                html: '<a href="/products/clothes-accessories/mens-shorts-gym/Assert-Short?icid=guide:mensshorts:gym:assert" class="'+namespace+'-pdp-link"></a>',
                                                left:534, 
                                                top: 248,
                                                height: 33,
                                                width: 158
                                            })
                                        ]
                                    })
                                ]
                            }),
                            new NonsensePanel({
                                id: "training-core-nonsense",
                                linkid: "training-core",
                                onOpen: function() {
                                    mensshortsOmnitureVirtualLoad("feature", "trainingfeature:gym");
                                },
                                omniture: {
                                    back: "feature"
                                },
                                children:[  
                                    new Panel({
                                        id: "training-core",
                                        bgimage: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-result-core-gym",
                                        onOpen: function() {
                                            mensshortsOmnitureVirtualLoad("result", "results:gymcore", "guide:mennshorts:gymcore");
                                        },
                                        elements:[ 
                                            new Element({
                                                html: '<a href="/products/clothes-accessories/mens-shorts-gym/Core-Short-32404?icid=guide:mensshorts:gym:core" class="'+namespace+'-pdp-link"></a>',
                                                left:534, 
                                                top: 248,
                                                height: 33,
                                                width: 158
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    new NonsensePanel({
                        id: "training-pace-breaker-nonsense",
                        linkid: "training-pace-breaker",
                        onOpen: function() {
                            mensshortsOmnitureVirtualLoad("liner", "linerlayer:lightsupportboxerbrief");
                        },
                        omniture: {
                            back: "liner"
                        },
                        children:[  
                            new Panel({
                                id: "training-pace-breaker",
                                bgimage: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-result-pace-breaker-gym",
                                onOpen: function() {
                                    mensshortsOmnitureVirtualLoad("result", "results:gympacebreaker", "guide:mennshorts:gympacebreaker");
                                },
                                elements:[ 
                                    new Element({
                                        html: '<a href="/products/clothes-accessories/mens-shorts-gym/Pace-Breaker-Short?icid=guide:mensshorts:gym:pacebreaker" class="'+namespace+'-pdp-link"></a>',
                                        left:534, 
                                        top: 241,
                                        height: 33,
                                        width: 158
                                    })
                                ]
                            })
                        ]
                    }),
                    new NonsensePanel({
                        id: "training-pace-breaker-lux-nonsense",
                        linkid: "training-pace-breaker-lux",
                        onOpen: function() {
                            mensshortsOmnitureVirtualLoad("liner", "linerlayer:highsupportboxerbrief");
                        },
                        omniture: {
                            back: "liner"
                        },
                        children:[  
                            new Panel({
                                id: "training-pace-breaker-lux",
                                bgimage: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-result-pace-breaker-lux-gym",
                                onOpen: function() {
                                    mensshortsOmnitureVirtualLoad("result", "results:trainingpacebreakerlux", "guide:mennshorts:trainingpacebreakerlux");
                                },
                                elements:[ 
                                    new Element({
                                        html: '<a href="/products/clothes-accessories/mens-shorts-gym/Pace-Breaker-Short-SE-Silver?icid=guide:mensshorts:gym:pacebreakerlux" class="'+namespace+'-pdp-link"></a>',
                                        left:534, 
                                        top: 261,
                                        height: 33,
                                        width: 158
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            new NonsensePanel({
                id: "yoga-for-the-people-nonsense",
                linkid: "yoga-for-the-people",
                omniture: {
                    pagename: "nonsense", 
                    eVar29: "activitylayer:yoga",
                    back: "activity" 
                },
                children:[  
                    new Panel({
                        id: "yoga-for-the-people",
                        bgimage: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-result-for-the-people-yoga",
                        onOpen: function() {
                            mensshortsOmnitureVirtualLoad("result", "results:yogaforthepeople", "guide:mennshorts:yogaforthepeople");
                        },
                        elements:[ 
                            new Element({
                                html: '<a href="/products/clothes-accessories/mens-shorts-gym/For-The-People-Short?icid=guide:mensshorts:yoga:forthepeople" class="'+namespace+'-pdp-link"></a>',
                                left:534, 
                                top: 241,
                                height: 33,
                                width: 158
                            })
                        ]
                    })
                ]
            })
        ]
    });

    window.SHORTS_PANEL = new InteractivePanel( shortsPanelConfig );
    nonsensePanels = [ 
        { id: "alcohol", bg: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-nonsense-alcohol", button1: { width: 78, height: 26, top: 158, left:330, q:"beer" }, button2: { width: 156, height: 26, top: 158, left:497, q: "whiskey" } },
        { id: "bed", bg: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-nonsense-bed", button1: { left:235, width: 193, height: 26, top: 158, q: "latetobed" }, button2: { left:509, width: 238, height: 26, top: 158, q: "earlytorise" } },
        { id: "books", bg: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-nonsense-books", button1: { left:172, width: 207, height: 26, top: 158, q: "ontheroad" }, button2: { left:468, width: 339, height: 26, top: 158, q: "fearandloathing" } },
        { id: "cars", bg: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-nonsense-cars", button1: { left:124, width: 245, height: 26, top: 158, q: "tesla" }, button2: { left:458, width: 399, height: 26, top: 158, q: "astonmartin" } },
        { id: "johns", bg: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-nonsense-johns", button1: { left:214, width: 250, height: 26, top: 158, q: "mcclane"  }, button2: { left:543, width: 222, height: 26, top: 158, q: "rambo" } },
        { id: "jurassic", bg: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-nonsense-jurrasic", button1: { left:229, width: 246, height: 26, top: 158, q: "jurassicpark"}, button2: { left:554, width: 196, height: 26, top: 158, q: "jurrasicfive" } },
        { id: "paleo", bg: "http://images.lululemon.com/is/image/lululemon/mensshorts2014-nonsense-paleo", button1: { left:145, width: 98, height: 26, top: 158, q: "paleo" }, button2: { left:330, width: 505, height: 26, top: 158, q: "shutup" } }
    ];

    for(var i = nonsensePanels.length; i--; ) {
        $container.append( generateNonsensePanel( nonsensePanels[i] ) );
    }

    function generateNonsensePanel( value ) {
        var html = "",
            link = 'data-link-direction="forward" data-linkid=""',
            classes = [ namespace+'-nonsense-panel' ],
            linkClasses = [namespace+'-link', namespace+'-redline'],
            style;

        function getButtonStyles(object){
            var out = "";
            for(var x in object) {
                if( object.hasOwnProperty(x) ) {
                    out += x + ':' + object[x] + 'px;';
                }
            }
            return out;
        }

        style = 'style="background-image:url('+value.bg+');"';

        // back link
        html += '<span class="'+namespace+'-parent '+namespace+'-link" data-link-direction="back" data-linkid="">BACK TO <span class="'+namespace+'-nonsense-activity"></span> <span class="'+namespace+'-parent-link-icon"></span></span>';
        // buttons 
        html += '<div ' +link+ ' class="'+linkClasses.join(" ")+' ' +namespace+'-nonsense-q1" style="'+getButtonStyles( value.button1 )+'"></div> <div '+link+' class="'+linkClasses.join(" ")+' ' +namespace+'-nonsense-q2" style="'+getButtonStyles( value.button2 )+'"></div>';

        return '<div id="'+namespace+"-panel-nonsense-"+value.id+'" class="'+classes.join(" ")+'"'+style+'>'+html+'</div>';
    }
})();

(function() {

// based on easing equations from Robert Penner (http://www.robertpenner.com/easing)
var baseEasings = {};

$.each( [ "Quad", "Cubic", "Quart", "Quint", "Expo" ], function( i, name ) {
    baseEasings[ name ] = function( p ) {
        return Math.pow( p, i + 2 );
    };
});

$.extend( baseEasings, {
    Sine: function ( p ) {
        return 1 - Math.cos( p * Math.PI / 2 );
    },
    Circ: function ( p ) {
        return 1 - Math.sqrt( 1 - p * p );
    },
    Elastic: function( p ) {
        return p === 0 || p === 1 ? p :
            -Math.pow( 2, 8 * (p - 1) ) * Math.sin( ( (p - 1) * 80 - 7.5 ) * Math.PI / 15 );
    },
    Back: function( p ) {
        return p * p * ( 3 * p - 2 );
    },
    Bounce: function ( p ) {
        var pow2,
            bounce = 4;

        while ( p < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
        return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - p, 2 );
    }
});

$.each( baseEasings, function( name, easeIn ) {
    $.easing[ "easeIn" + name ] = easeIn;
    $.easing[ "easeOut" + name ] = function( p ) {
        return 1 - easeIn( 1 - p );
    };
    $.easing[ "easeInOut" + name ] = function( p ) {
        return p < 0.5 ?
            easeIn( p * 2 ) / 2 :
            1 - easeIn( p * -2 + 2 ) / 2;
    };
});

})();