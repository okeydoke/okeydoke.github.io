	var wwwlocation="info.lululemon.com.au";
	var cdnURL = "cdn.lululemon.com.au/lulustatic/intl";
	
	nextContinue = false;
	prevContinue = false;
	ntm = null;
	ptm = null;
	function scrollPrevImg() {
		if(!prevContinue) {
			return false;
		}
		jQuery('#btnPrev').click();
		ptm = setTimeout('scrollPrevImg();', 350);
	}
	function scrollNextImg() {
		if(!nextContinue) {
			return false;
		}
		jQuery('#btnNext').click();
		ntm = setTimeout('scrollNextImg();', 350);
	}
	function enablePDPCarousel() {	
		
		jQuery('#btnPrev').live('mouseenter', function() {
			prevContinue = true;
			scrollPrevImg();
		});
		jQuery('#btnPrev').live('mouseleave', function() {
			if(ptm != null) {
				clearTimeout(ptm);
			}
			prevContinue = false;
		});
		
		jQuery('#btnNext').live('mouseenter', function() {
			nextContinue = true;
			scrollNextImg();
		});
		jQuery('#btnNext').live('mouseleave', function() {
			if(ntm != null) {
				clearTimeout(ntm);
			}
			nextContinue = false;
		});
		
		//TEASER: PDP vertical carousel
		var carouselPdP = jQuery('body.pdp #carousel ul');
		if(carouselPdP.length > 0){
			var listSize = jQuery('body.pdp #carousel ul li').size();
			jQuery(carouselPdP).carouFredSel({
				circular	: false,
				infinite	: false,
				items		: 7,
				auto		: false,
				direction	: 'up',
				height		: 'auto',
				scroll		: { duration:'100', easing:'linear', wipe:'true', items: 1, onAfter: checkArrows },
				prev		: { button:'#btnPrev' },
				next		: { button:'#btnNext' },
				onCreate	: function() {
					if(listSize < 8) {
						jQuery('.nextContainer').hide();
						jQuery('.prevContainer').hide();
					} else {
						jQuery('.prevContainer').hide();
					}
				}
			});
		}
	}
	function checkArrows() {
		if(jQuery('#btnNext').hasClass('disabled')) {
			jQuery('.nextContainer').hide(); 
		} else {
			jQuery('.nextContainer').show(); 
		}
		if(jQuery('#btnPrev').hasClass('disabled')) {
			jQuery('.prevContainer').hide();
		} else {
			jQuery('.prevContainer').show();
		}
	}
	jQuery(document).ready(function() {
//begin
	var currentURL;

	var currentProtocol;
	try {
		currentURL = window.location;
		currentProtocol = window.location.protocol;
	} catch(err) {
		//do nothing
	}

	if(jQuery('#wwwURL').length && jQuery('#wwwURL').val().length){
		wwwlocation=jQuery('#wwwURL').val();
	}
	
	if(jQuery('#wwwURL').length && jQuery('#wwwURL').val().length){
		cdnURL=jQuery('#cdnURL').val();
	}
	
	
	if(jQuery('#shoppingBagLink').length) {
		if(currentProtocol == 'https:') {
			jQuery('#shoppingBagLink').attr('href', '/secure/shopping-bag.jsp');
		}
	}
	
	//show filters
	if(jQuery('.productFilterForm-field').length) {
		jQuery('.productFilterForm-field').show();
	}
	

	//add all to bag
	jQuery('#addAllToBagButton').click(function(e) {
		e.preventDefault();
		jQuery('#wlProcessing').show();
		jQuery.ajax({
			url:'/shop/gadgets/addAllToBagResult.jsp',
			type: "post",
			data: jQuery('#addToOrderForm').serialize(),
			success: function(data) {
				jQuery('#wlProcessing').hide();
				if(jQuery.trim(data) == 'true') {
					jQuery('#shoppingBagLink').click();
					updateCartNav();
				} else {
					errorDecision(data, '');
				}
			}
		});
	})


	//*** find a store button
	jQuery('#findAStoreButton').click(function() {
		document.location.href= "http://"+wwwlocation+"/stores";
	});


	//STATIC
	jQuery('a.static').live('click', function(event) {
		event.preventDefault();
	});

	jQuery('.hoverImage').hover(
		function(){
			origSrc = this.src;
			newSrc = this.src;
			newSrc = newSrc.substring(0,(newSrc.length-4));
			this.src = newSrc + "-hover.png";
		},
		function(){
			this.src = origSrc;
		}
	);


	//UTILITY NAV
	function openSubMenu() {
		jQuery(this).find('div').prev().addClass('on');
		jQuery(this).find('div').show();
	};
	function closeSubMenu() {
		jQuery(this).find('div').prev().removeClass('on');
		jQuery(this).find('div').hide();
	};
	jQuery('.utilityMenu > li').hover(openSubMenu, closeSubMenu);
	//jQuery('#regionSelector').hover(openSubMenu, closeSubMenu);

	// start new region selector REGION NAV
	function openRegion() {
		jQuery('.regionSelector').addClass('on');
			jQuery('.regionSelector').show();
			jQuery('.regionGrey, .regionGreyIvivva').show();
			var screenTop = $(document).scrollTop();
			jQuery('.regionSelector .regionSelectorStyle').css('top', screenTop);
	};
	function closeRegion() {
		jQuery('.regionSelector').removeClass('on');
		jQuery('.regionSelector').hide();
		jQuery('.regionGrey').hide();
	};
	function toggleSubMenu(){
		var myDiv = jQuery('.regionSelector');
		var x = myDiv.hasClass('on');
		if (x == true){
			closeRegion();
		}else{
			openRegion();
		}
	}
	jQuery('.regionGrey').click(function (e) {
        e.preventDefault();
        closeRegion();
    }); 
	jQuery(".ivivvaRegionGray .regionGreyIvivva").live("click", function (e) {
        e.preventDefault();
        openRegion();
    });
	jQuery(".regionSelectorStyle #fancybox-close").bind("click",function() {
		omnitureReset();
		s=s_gi(s_account);
		s.linkTrackVars="events,prop29, eVar29";
		s.linkTrackEvents="event57";
		s.prop29="glb:intl ship to:pop-up:close-modal";
		s.eVar29="glb:intl ship to:pop-up:close-modal";
		s.events="event57";
		s.tl(this,'o','glb:intl ship to:pop-up:close-modal');
	});
	
	jQuery('#regionSelector').click(function (e) {
		e.preventDefault();
		toggleSubMenu();
	});
	
	jQuery('a.closeRegionSelector').click(function(e) {
		e.preventDefault();
		jQuery('.regionSelector').hide();
		jQuery('.regionSelector').removeClass('on');
		jQuery('.regionGrey').hide();
	});
	
	jQuery('.closeCookieMessage').click(function(e) {
		e.preventDefault();
		jQuery('.regionChange').hide();
		jQuery('.regionCatchAll').hide();
	});
	
	// Commented out since method is getting called twice.
	//try{
	//	countrySelectSetup();
	//}catch(err){}
	
	// end new region selector / UTILITY NAV

	//MEGA-NAV
	function openSubNav() {
		jQuery(this).addClass('on');
		jQuery(this).find('.mnSubMenu').show();
	};
	function closeSubNav() {
		jQuery(this).removeClass('on');
		jQuery(this).find('.mnSubMenu').hide();
	};
	jQuery('#NAV li.mnMain').hover(openSubNav, closeSubNav);
	jQuery('html, #HEADER, #NAV, #MAIN, #FOOTER').click(function() { /* ipad */ });

	var SUBMENU_WIDTH = 174;
	var SUBMENU_HEIGHT_ADJUST = 70;
	//women
	var multiColumnWidthWomen = jQuery('#NAV #women.mnSubMenu .multiColumn ul').length * SUBMENU_WIDTH;
		multiColumnWidthWomen = multiColumnWidthWomen +'px';
		jQuery('#NAV #women.mnSubMenu .multiColumn').css('width',multiColumnWidthWomen);
	var multiColumnWomenHeight = jQuery('#NAV #women.mnSubMenu').height()-SUBMENU_HEIGHT_ADJUST;
		jQuery('#NAV #women.mnSubMenu .multiColumn ul').css('height',multiColumnWomenHeight);
	//men
	var multiColumnWidthMen = jQuery('#NAV #men.mnSubMenu .multiColumn ul').length * SUBMENU_WIDTH;
		multiColumnWidthMen = multiColumnWidthMen +'px';
		jQuery('#NAV #men.mnSubMenu .multiColumn').css('width',multiColumnWidthMen);
	var multiColumnMenHeight = jQuery('#NAV #men.mnSubMenu').height()-SUBMENU_HEIGHT_ADJUST;
		jQuery('#NAV #men.mnSubMenu .multiColumn ul').css('height',multiColumnMenHeight);
	//shop by
	var multiColumnWidthShopBy = jQuery('#NAV #shopBy.mnSubMenu .multiColumn ul').length * SUBMENU_WIDTH;
		multiColumnWidthShopBy = multiColumnWidthShopBy +'px';
		jQuery('#NAV #shopBy.mnSubMenu .multiColumn').css('width',multiColumnWidthShopBy);
	var multiColumnShopByHeight = jQuery('#NAV #shopBy.mnSubMenu').height()-SUBMENU_HEIGHT_ADJUST;
		jQuery('#NAV #shopBy.mnSubMenu .multiColumn ul').css('height',multiColumnShopByHeight);

	//ivivva
		var multiColumnWidthShop = jQuery('#NAV #shop.mnSubMenu .multiColumn ul').length * SUBMENU_WIDTH;
		multiColumnWidthShop = multiColumnWidthShop +'px';
		jQuery('#NAV #shop.mnSubMenu .multiColumn').css('width',multiColumnWidthShop);
	var multiColumnShopHeight = jQuery('#NAV #shop.mnSubMenu').height()-SUBMENU_HEIGHT_ADJUST;
		jQuery('#NAV #shop.mnSubMenu .multiColumn ul').css('height',multiColumnShopHeight);

	//TEASER: homepage teaser carousel
	var carouselHomePage = jQuery('body.home #carousel ul');
	if(carouselHomePage.length > 0){
		jQuery(carouselHomePage).carouFredSel({
			circular	: true,
			infinite	: false,
			items		: 3,
			auto		: false,
			scroll		: { duration:'auto', easing:'easeOutBack', wipe:'true'},
			prev		: { button:'#btnPrev' },
			next		: { button:'#btnNext' }
		});
	}

	if(jQuery('body.cdp').length) {
		jQuery('.productFilterForm-field select').each(function() {
			if(jQuery(this).val() != -1) {
				jQuery(this).next().find('.sbSelector').css('color', '#000000').css('font-weight', 'bold'); 
			}
		});
	}
	//CDP Page filter selectors
	jQuery('#sizeSelector').bind('change', function() {
		var sortparam = '';
		if(jQuery('#sortoption').attr('value') == 'bestSellers' || jQuery('#sortoption').attr('value') == 'newArrivals' || jQuery('#sortoption').attr('value') == 'price') {
			sortparam = '&sort=' + jQuery('#sortoption').attr('value');
		}
		var loc = jQuery(location).attr('pathname') +  '?' + 'categoryId=' + jQuery('#categoryId').attr('value') + sortparam;

		if (!jQuery(this).attr('value').match('-1')) {
			loc = loc + '&filterType1=size' + '&filterValue1=' + jQuery(this).attr('value');
		}
		if(jQuery('#viewAll').length!=0){
			loc = loc +'&viewAll='+ jQuery('#viewAll').attr('value');
		}
		window.location = loc;
	});

	jQuery('#fitSelector').bind('change', function() {
		var sortparam = '';
		if(jQuery('#sortoption').attr('value') == 'bestSellers' || jQuery('#sortoption').attr('value') == 'newArrivals' || jQuery('#sortoption').attr('value') == 'price') {
			sortparam = '&sort=' + jQuery('#sortoption').attr('value');
		}
		var loc = jQuery(location).attr('pathname') +  '?' + 'categoryId=' + jQuery('#categoryId').attr('value') + sortparam;

		if (!jQuery(this).attr('value').match('-1')) {
			loc = loc + '&filterType4=fit' + '&filterValue4=' + jQuery(this).attr('value');
		}
		if(jQuery('#viewAll').length!=0){
			loc = loc +'&viewAll='+ jQuery('#viewAll').attr('value');
		}
		window.location = loc;
	});

	jQuery('#activitySelector').bind('change', function() {
		var sortparam = '';
		if(jQuery('#sortoption').attr('value') == 'bestSellers' || jQuery('#sortoption').attr('value') == 'newArrivals' || jQuery('#sortoption').attr('value') == 'price') {
			sortparam = '&sort=' + jQuery('#sortoption').attr('value');
		}
		var loc = jQuery(location).attr('pathname') +  '?' + 'categoryId=' + jQuery('#categoryId').attr('value') + sortparam;

		if (!jQuery(this).attr('value').match('-1')) {
			loc = loc + '&filterType2=function' + '&filterValue2=' + jQuery(this).attr('value');
		}
		if(jQuery('#viewAll').length!=0){
			loc = loc +'&viewAll='+ jQuery('#viewAll').attr('value');
		}
		window.location = loc;
	});

	//wnp - HOT FIX 11/10/2011
	/*if(jQuery('body').hasClass('wnp')) {
		jQuery('.product').each(function() {
			var prdId = jQuery(this).attr('id');
			jQuery('#' + prdId + '_prodText').attr('href', jQuery('.' + prdId + '_prodImage').eq(0).attr('href'));
		})
	}*/

	//CDP Page swatch click
	jQuery('.switchThumb').bind('click', function() {
		var parentDiv = jQuery(this).closest('.product')
		var	target = jQuery(parentDiv).find(jQuery(this).attr('href'));

		if (target.hasClass('active')) {
			return false;
		}
		else {
			var activeImage = target.parent('.product').children('.active');
			activeImage.toggleClass('active');
			activeImage.fadeOut(500, function() {
				target.fadeIn(250);
				target.toggleClass('active');
			});
			jQuery(this).parent().parent().find('.switchThumb').removeClass('active');
			jQuery(this).addClass('active');
			captureCDPColorClick(jQuery(this).attr('desc'));
		}

		var prodId = jQuery(this).attr('rel');
		var targetProduct = jQuery(jQuery(this).attr('href'));

		var url1 = jQuery(targetProduct).attr('href');
		jQuery(parentDiv).find('#' + prodId + '_prodText').attr('href', url1);

		var url2 = jQuery(parentDiv).find('#' + prodId + '_hdnProdPriceLink').val() + '?cc=' + jQuery(this).attr('cc') + '&skuId=' + jQuery(this).attr('sku');
		jQuery(parentDiv).find('#' + prodId + '_prodPrice').attr('href', url2);

		//var url3 = jQuery('#' + prodId + '_hdnProdTextLink').val() + '?cc=' + jQuery(this).attr('cc') + '&skuId=' + jQuery(this).attr('sku');
		//jQuery('.' + prodId + '_prodImage').attr('href', url3);

		return false;
	});

	//COLOR SWATCHES (hide/show)
	jQuery('.moreColors, .hideColorsLink').hide();
	jQuery('li.moreColorsLink a').click(function(e){
		e.preventDefault();
		var productId = jQuery(this).parent().parent().parent().attr('id');
		jQuery('#'+productId+' .moreColorsLink').hide(-1, function() { 
			jQuery('#'+productId+' .moreColors').slideDown(); 
		});	
	 });


	//WHAT'S NEW: scrolling to mens/women's
	function scrollToElement(thisElement){
		jQuery('html, body').animate({
			scrollTop: jQuery(thisElement).position().top
		}, 2000);
	}
	jQuery('body.wnp #seeMensLink').live('click', function(){
		omnitureReset();
		scrollToElement('#whatsNewForMen');
		s.pageName="store:whats new:men";
		s.channel="store";
		s.prop1="whats new";
		s.prop2="men";
		var s_code=s.t();if(s_code)document.write(s_code);
	});
	jQuery('body.wnp #seeWomensLink').live('click', function(){
		omnitureReset();
		scrollToElement('#whatsNewForWomen');
		s.pageName="store:whats new:women";
		s.channel="store";
		s.prop1="whats new";
		s.prop2="women";
		var s_code=s.t();if(s_code)document.write(s_code);
	});




	//SEARCH
	jQuery('#search').live('click', function() {
		if(jQuery('#searchField').is( ":focus" )==false){
			submitSearch();
		}
	});
	jQuery('#searchField').live('focus', function() {
		if(jQuery(this).val() == 'search') {
			jQuery(this).val('');
		}
	});
	jQuery('#searchField').live('blur', function() {
		if(jQuery(this).val() == '') {
			jQuery(this).val('search');
		}
	});
    jQuery('#searchField').bind('keypress', function(e) {
    	var code = (e.keyCode ? e.keyCode : e.which);
    	if(code == 13) {
    		submitSearch()
    	}
    });

    //Send Gift Receipt Email to User
    jQuery('#sendGiftReceiptSubmit').live('click', function (evt) {
		var giftReceipent = jQuery('#giftReceipent').val();
		var orderId = jQuery('#encryptedOrderId').val();

		if (validateEmail(giftReceipent)) {
			jQuery.ajax({
				type: 'get',
				url: '/secure/orders/giftReceiptEmail.jsp?emailRecepient=' + giftReceipent,
				cache: false,
				success: function() {
	
					$("#tempDiv").empty();
					$("#tempDiv").append('<p> <b>Success!</b> The gift receipt has been sent to ' + giftReceipent + '</p> <br/>' +  
						'<a href="initiategiftreceipt.jsp?orderId=' + orderId +  '"> create another gift receipt from this order </a>  &nbsp;&nbsp; <span class="btn" style="position:absolute;"><input value="print receipt" class="btn" type="button" onclick=printDiv("printableArea")></span>');
				}
			});
		} else {
			errorDecision('Please enter valid email address', '');
		}
	});

	function validateEmail(email) {
	    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	}

	//EMAIL SIGN-UP
	jQuery('.emailSignUpField').live('focus', function() {
		if(jQuery(this).val() == 'enter your email address' || jQuery(this).val() == 'please enter a valid email' || jQuery(this).val() == 'please confirm your age' || jQuery(this).val() == 'error signing up, please try again') {
			jQuery(this).val('');
			jQuery(this).css('color', '#777C84');
		}
	});
	jQuery('.emailSignUpField').live('blur', function() {
		if(jQuery(this).val() == '') {
			jQuery(this).val('enter your email address');
		}
	});

	//PRINT WISHLIST
	jQuery('#printWishList').live('click',function(evt){
		evt.preventDefault();
		window.print();
	});

	//PRINT ORDER CONFIRMATION
	jQuery('#printConfirmation').live('click',function(evt){
		evt.preventDefault();
		window.print();
	});

	//TOOLTIP

	jQuery('#CTAemailSignUpField').live('click', function(evt) {
		showHomePageAgeGate();		
	});

	jQuery('#emailSignUpField').live('click', function(evt) {
		showAgeGate();		
	});

	function hideHomePageAgeGate(){
		if(isAgeGateFlagEnabled == "true"){
			// previous check here:
			// if(jQuery("#CTAemailSignUpField").val() == 'enter your email address' || jQuery("#CTAemailSignUpField").val() == '') 
			jQuery("#ageGateDivId").hide();
		}
	}
	jQuery('.emailSignUp').live('focusout', function() {	
		hideHomePageAgeGate();		
	});

	function showHomePageAgeGate(){
		if(isAgeGateFlagEnabled == "true"){
			jQuery("#ageGateDivId").show();
		}
	}

	function hideAgeGate(){
		if(isAgeGateFlagEnabled == "true"){
			if(jQuery("#emailSignUpField").val() == 'enter your email address' || jQuery("#emailSignUpField").val() == '') {
				jQuery("#ageGateEmailCheckSpan").hide();
			}
		}
	}
	jQuery('#footerLower .lowerImages').live('focusout', function() {	
		hideAgeGate();		
	});
	function showAgeGate(){
		if(isAgeGateFlagEnabled == "true"){
			jQuery("#ageGateEmailCheckSpan").show();
		}
	}


	if(isAgeGateFlagEnabled == "true"){
		jQuery("#ageGateEmailCheckSpan").hide();
		jQuery("#ageGateDivId").hide();
	}else{
	jQuery('.emailSignUpField').qtip({
		content: 'by signing up, you are agreeing to <br/>our <a href="http://'+wwwlocation+'/terms" target="_blank">> terms and conditions</a>',
		show: {
			when: 'focus'
		},
		hide: {
			when: 'blur',
			fixed: true
		},
		style: {
			background: '#fff2cc',
			border: {
				color: '#f4de9f',
				width: 2,
				radius: 2
			},
			color: '#000',
			name: 'cream',
			padding: 10,
			tip: true
		},
		position: {
			corner: {
				target: 'bottomMiddle',
				tooltip: 'topMiddle'
			},
			adjust: {
				y: -10
			}
		}
	});
	}
	

	//TOOLTIP (wishlist add)
	jQuery('.wishlistPublic').qtip({
		content: 'Making your wish list public will allow others to search for your wish list using your email address. Non-public wish lists are not searchable by others but you can email them to friends.',
		show: {
			when: 'click'
		},
		hide: {
			when: 'unfocus',
			fixed: true
		},
		style: {
			background: '#fff2cc',
			border: {
				color: '#f4de9f',
				width: 2,
				radius: 2
			},
			color: '#000',
			name: 'cream',
			padding: 10,
			tip: true
		},
		position: {
			corner: {
				target: 'bottomMiddle',
				tooltip: 'topMiddle'
			}
		}
	});


	//EMAIL SIGN UP ON HOMEPAGE
	jQuery('#CTAemailSignUpField').val('enter your email address');
	jQuery('#CTAsignMeUpButton').click(function(e) {
		hideHomePageAgeGate();
		e.preventDefault();
		var emailAddr = jQuery('#CTAemailSignUpField').val();
		var ageGateCheckValue = jQuery('#ageGateChecked').val();
		//processing
		jQuery('#CTAemailProcessing').show();
		jQuery('#CTAemailSignUpField, #CTAemailSignUpForm span.btn').hide();

		//handler
		jQuery.ajax({
			url: "/elements/emailSignUp.jsp",
			type: "POST",
			data: {email : emailAddr,ageGateVal : ageGateCheckValue},
			dataType: "jsonp",
			jsonpCallback : "emailSignUp",
			success: function(data){
				jQuery('#CTAemailProcessing').hide();
				var messaging  = jQuery.trim(data.formMessage);
				jQuery('#CTAemailMessaging').text(messaging);
				if(data.result == 'success') {
					jQuery('#CTAemailMessaging').fadeIn();
				} else if(data.result == 'exists') {
					jQuery('#CTAemailMessaging').fadeIn();
				} else {
					var ageGateError = messaging.indexOf("age");
					if(ageGateError > 0){
						captureAgeGateErrorEvent();
					}					
					showHomePageAgeGate();
					jQuery("#CTAemailMessaging").hide();
					jQuery("#CTAemailSignUpField").val(messaging);
					jQuery("#CTAemailSignUpField").css('color', '#FF1543');
					jQuery("#CTAemailSignUpField").show();
					jQuery("#CTAsignMeUpButton").show();
					jQuery("#CTAsignMeUpButton").parent().show();
				}
				captureEmailSignUp();
				_gaq.push(['ga._trackEvent', 'User Event', 'Email Signup', 'lululcom']);
				//jQuery('#CTAemailSignUpField, #CTAemailSignUpForm span.btn').fadeIn();
			}
		});
	});

	// Added for age Gate change Start
	jQuery('#ageGateCheckField').click(function(e) {
		if(jQuery('#ageGateCheckField').val() == "false"){
			jQuery('#ageGateCheckField').val("true");
		}else{
			jQuery('#ageGateCheckField').val("false");
		}
			
	});

	jQuery('#ageGateChecked').click(function(e) {
		if(jQuery('#ageGateChecked').val() == "false"){
			jQuery('#ageGateChecked').val("true");
		}else{
			jQuery('#ageGateChecked').val("false");
		}
			
	});
	// Added for age Gate change End

	//FIND A STORE ON HOMEPAGE
	jQuery('#CTAfindAStoreButton').click(function(e) {
			window.location = 'http://'+wwwlocation+'/stores/';
	});

	//EMAIL SIGN UP IN FOOTER
	jQuery('#emailSignUpField').val('enter your email address');
	jQuery('#signMeUpButton').click(function(e) {
		hideAgeGate();
		e.preventDefault();
		var emailAddr = jQuery('#emailSignUpField').val();
		var ageGateCheckValue = jQuery('#ageGateCheckField').val();
		//processing
		jQuery('#emailProcessing').show();
		jQuery('#emailSignUpField, #emailSignUpForm span.btn').hide();

		//handler
		jQuery.ajax({
			url: "/elements/emailSignUp.jsp",
			type: "post",
			data: {email : emailAddr,ageGateVal : ageGateCheckValue},
			dataType: "jsonp",
			jsonpCallback : "emailSignUp",
			success: function(data){
				jQuery('#emailProcessing').hide();
				var messaging  = jQuery.trim(data.formMessage);
				jQuery('#emailMessaging').text(messaging);
				if(data.result == 'success') {
					jQuery('#emailMessaging').fadeIn();
				} else if(data.result == 'exists') {
					jQuery('#emailMessaging').fadeIn();
				} else {
					var ageGateError = messaging.indexOf("age");
					if(ageGateError > 0){
						captureAgeGateErrorEvent();
					}
					showAgeGate();
					jQuery("#emailMessaging").hide();
					jQuery("#emailSignUpField").val(messaging);
					jQuery("#emailSignUpField").css('color', '#FF1543');
					jQuery("#emailSignUpField").show();
					jQuery("#signMeUpButton").show();
					jQuery("#signMeUpButton").parent().show();
				}
				 captureEmailSignUp();
				_gaq.push(['ga._trackEvent', 'User Event', 'Email Signup', 'lululcom']);
				//jQuery('#CTAemailSignUpField, #CTAemailSignUpForm span.btn').fadeIn();
			}
		});
	});

	jQuery(".videoplayer").click(function() {
		jQuery.fancybox({
			'padding' 		: 0,
			'scrolling'		: 'no',
			'autoScale' 	: false,
			'transitionIn'	: 'elastic',
			'transitionOut'	: 'elastic',
			'overlayShow'	: true,
			'href' 			: this.href.replace(new RegExp("watch\\?v=", "i"), 'v/'),
			'type' 			: 'swf',
			'swf' 			: {
				'wmode' : 'transparent',
				'allowfullscreen' : 'true'
			}
		});
		captureVideoView();
		return false;
	});

	jQuery("a.iframe").fancybox({
		'autoDimensions'		: false,
		'autoScale'				: false,
		'autoSizeIframe' 		: false,
		'hideOnContentClick'	: false,
		'height'				: 1500,
		'width'					: 800,
		'transitionIn'			: 'elastic',
		'transitionOut'			: 'elastic',
		'speedIn'				: 600,
		'speedOut'				: 200,
		'overlayShow'			: true,
		'scrolling'				: 'no',
		'onComplete':function() {
		}
	});

	jQuery('#shoppingBag a#shoppingBagLink').live('click',function(event){
		event.preventDefault();
		jQuery('#fancybox-content').css('background-color', '#ffffff');
		jQuery.fancybox({
			'autoDimensions'		: true,
			'autoScale'				: false,
			'hideOnContentClick'	: false,
			'height'				: 870,
			'width'					: 980,
			'transitionIn'			: 'elastic',
			'transitionOut'			: 'elastic',
			'speedIn'				: 600,
			'speedOut'				: 200,
			'overlayShow'			: true,
			'scrolling'				: 'no',
			'modal'					: false,
			'type'					: 'iframe',
			'href'					: jQuery(this).attr('href'),
			'onClosed'				: function() {
				jQuery('#fancybox-content').css('background-color', 'transparent');
				jQuery.ajax({
					url:'/elements/gadgets/shoppingCartItemCount.jsp',
					type:'post',
					dataType:'json',
					data: {buttonCheck : true},
					success: function(data) {
						var allInstock = jQuery.trim(data.allInStock);
						var count = jQuery.trim(data.count);
						if(count > 0 && allInstock) {
							jQuery('#checkoutLink').removeClass('hideCheckoutButton');
						} else {
							jQuery('#checkoutLink').addClass('hideCheckoutButton')
						}
						jQuery('#shoppingBag .itemCount').text(count);
					}
				});
			}
		});
	});

	// CDP
	jQuery("body.cdp div.product a.pic, body.wnp div.product a.pic").hover(
		function() {
			jQuery(this).append("<span class='btn qvbtn'><input type='button' class='btn' value='quick view' /></span>");
		},
		function() {
			jQuery(this).find("span.btn").remove();
		}
	);
	
	jQuery("body.cdp div.product .cdpInstagramTag, body.wnp div.product .cdpInstagramTag").hover(
			function() {
				jQuery(this).next().append("<span class='btn qvbtn'><input type='button' class='btn' value='quick view' /></span>");
			},
			function() {
				jQuery(this).next().find("span.btn").remove();
			}
		);

	jQuery("body.cdp div.product .cdpInstagramTag, body.wnp div.product .cdpInstagramTag").click(function(e) {
		location.href = jQuery(this).next('a').prop('href');
	});

	jQuery('body.cdp div.product a.pic span.btn, body.wnp div.product a.pic span.btn').live('click', function(e) {
		e.preventDefault();
		jQuery('#fancybox-content').css('background-color', '#ffffff');
		var productUrl = jQuery(this).parent().attr('href') + "&isQuickView=true&fullProductUrl=" + escape(jQuery(this).parent().attr('href'));
		jQuery.fancybox({
			'padding' : 0,
			'transitionIn' : 'elastic',
			'transitionOut' : 'elastic',
			'scrolling' : 'no',
			'autoDimensions' : false,
			'autoScale' : false,
			'width' : 980,
			'height' : 670,
			'type' : 'iframe',
			'href' : productUrl,
			'autoSizeIframe' : false,
			'onClosed' : function() {
				jQuery('#fancybox-content').css('background-color', 'transparent');
			}
		});
	});

	//BV: reviews link on QV
	if(jQuery('body.qvpdp').length > 0){
		jQuery('#BVRRCustomReviewCountLinkReadID a').live('click',function(e){
			e.preventDefault();
			parent.window.location.href = jQuery('a.productDetailsLink').attr('href') + "#BVRRWidgetID";
		});
	}
	//BV: scroll to reviews on PDP
	if((jQuery('body.pdp').length > 0) && (jQuery('body.qvpdp').length < 1)){
		jQuery('#BVRRCustomReviewCountLinkReadID a').live('click',function(e){
			e.preventDefault();
			jQuery('html, body').animate({
				scrollTop: jQuery('#BVRRWidgetID').position().top
			}, 2000);
		});
	}

	jQuery('body.qvpdp a.productDetailsLink').live('click', function(e) {
		parent.location.href = jQuery(this).attr('href');
	});


	jQuery("body.cdp div.product a.prodbox").click(function(event) {
		event.preventDefault();
		jQuery.fancybox({
			'padding' : 0,
			'transitionIn' : 'none',
			'transitionOut' : 'none',
			'scrolling' : 'no',
			'autoDimensions' : false,
			'width' : 980,
			'height' : 650,
			'type' : 'iframe',
			'href' : jQuery(this).attr("href"),
			'onComplete' : function() {
			}
		});
	});

	jQuery('body.pdp a#wishListLink').click(function(event) {
		event.preventDefault();

		if(jQuery(this).hasClass('wlLinkDisabled')) {
			return false;
		}
		
		//non-logged in handler
		if(jQuery(this).hasClass('addToWishListLinkNonLoggedIn')) {
			window.location.href = this.href;
			return false;
		}

		var frameWidth = 437;
		var frameHeight;
		if( jQuery(this).attr('href') == "/secure/account/login-modal.jsp") {
			frameWidth = 501;
			frameHeight = 369;
		}
		jQuery.fancybox({
			'padding' : 0,
			'transitionIn' : 'none',
			'transitionOut' : 'none',
			'scrolling' : 'no',
			'autoDimensions' : false,
			'autoScale' : false,
			'width' : frameWidth,
			'height' : frameHeight,
			'type' : 'iframe',
			'href' : jQuery(this).attr("href"),
			'onComplete' : function() {
				$.fancybox.resize();
			}
		});
	});

	//LOGIN, REGISTER
	jQuery("a#signInLink, #fbLoginLink, #registerLink, #loginModalLink, a.signInLink").click(function(event) {
		event.preventDefault();
		if(jQuery(this).hasClass('checkoutSignIn')) {
			var loadUrl = jQuery(this).attr("href");
		} else {
			var loadUrl = jQuery(this).attr("href") + '?=reloadUrl=' + escape(currentURL);
		}
		jQuery.fancybox({
			'padding' : 0,
			'transitionIn' : 'none',
			'transitionOut' : 'none',
			'scrolling' : 'no',
			'autoDimensions' : true,
			'autoScale' : false,
			'width' : 501,
			'height' : 369,
			'type' : 'iframe',
			'href' : loadUrl,
			'onComplete' : function() {
			},
			'onClosed' : function(){
				window.parent.location.reload();
			}
		});
	});
	
	/*jQuery('#gcCheckBalance').click(function(e) {
		e.preventDefault();
		jQuery('#fancybox-content').css('background-color', '#ffffff');
		jQuery.fancybox({
			'autoScale'				: false,
			'hideOnContentClick'	: false,
			'height'				: 360,
			'width'					: 275,
			'transitionIn'			: 'elastic',
			'transitionOut'			: 'elastic',
			'speedIn'				: 400,
			'speedOut'				: 200,
			'overlayShow'			: true,
			'scrolling'				: 'no',
			'centerOnScroll'		: true,
			'type'					: 'iframe',
			'href'					: '/shop/giftcard-balance-check.jsp',
			'onClosed'				: function() {
				jQuery('#fancybox-content').css('background-color', 'transparent');
			}
		});
	});*/

	//validation
	jQuery('#searchField').autotab_filter({format: 'custom', pattern: '[^0-9a-zA-Z!#$%&()+-.;,:=?@*\\[\\]{}~_^/|\\\"`\\\\ \\]]' });
});

function submitSearch(){
	if(jQuery('#searchField').val()!="search"){
		var safeSearch = encodeURIComponent(jQuery('#searchField').val());
		var locale = jQuery('#userRegionForSearch').val()
		parent.location = "//"+searchServer + "/search?region="+locale+"&asug=&w=" + safeSearch;
	}
}

function captureAddToWishlist() {
	//capture omniture var for wishlist
	s.events="event51";
	s.products = ';' + jQuery('#pdpSelectedSku').val();
	var s_code=s.tl();if(s_code)document.write(s_code);
	_gaq.push(['ga._trackEvent', 'User Event', 'Add to Wishlist', '']);

}

function captureCDPColorClick(colorTitle) {
	s.events = "event28";
	s.eVar22=colorTitle;
	var s_code=s.tl();if(s_code)document.write(s_code);
}

function captureVideoView(title) {
	omnitureReset();
	s.events = "event31";
	var s_code=s.tl();if(s_code)document.write(s_code);
}
function updateCartNav() {
	jQuery.ajax({
		url:'/elements/gadgets/shoppingCartItemCount.jsp',
		type:'post',
		dataType:'json',
		data: {buttonCheck : true},
		success: function(data) {
			var allInstock = jQuery.trim(data.allInStock);
			var count = jQuery.trim(data.count);
			if(count > 0 && allInstock) {
				jQuery('#checkoutLink').removeClass('hideCheckoutButton');
			} else {
				jQuery('#checkoutLink').addClass('hideCheckoutButton')
			}
			jQuery('#shoppingBag .itemCount').text(count);
		}
	});

}

//***Popups
function get_cookie ( cookie_name )
{
  var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );

  if ( results )
    return ( unescape ( results[2] ) );
  else
    return null;
}

function set_cookie(cookie_name)
{
	document.cookie = cookie_name+"=true;path=/;domain=lululemon.com.au";

}

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

//start new region selector / Detailed cookie creator
function set_cookieUK(cookie_name,cookie_value,days,domain)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + days);
	if (!domain){var domain = location.hostname}
	document.cookie = cookie_name+"="+cookie_value+";path=/;domain="+domain+";expires="+exdate.toUTCString();
}
 
function shopRegionalizedPopup(region)
{
	$(window).load(function() {
	var popupNoShow = get_cookie("popupNoShow");
	var isNZParam = getURLParameter("country")=="NZ";
	
	if(isNZParam==false)//*** get userregion from form on page and checks to see if the country is NZ... No double popup
	{
		 
		var country = get_cookie("Country");
		var srcContent = null;
		
		if(country==null){country="US"}
		
		if(popupNoShow==null){
			
			set_cookie("popupNoShow");
			
			if(region=="au"){			
				if(country=="NZ"){	
					srcContent = '<iframe width="500" height="400" frameborder="0" src="//'+wwwlocation+'/popups/AU_NZ.php"; scrolling="no" ></iframe>';
					height=400;
				}
				if(country=="HK"){            
					srcContent = '<iframe width="500" height="442" frameborder="0" src="//'+wwwlocation+'/popups/AU_HK.php"; scrolling="no" ></iframe>';
					height=442;
				}

				if(country=="UK"){            
					srcContent = '<iframe width="500" height="442" frameborder="0" src="//'+wwwlocation+'/popups/AU_UK.php"; scrolling="no" ></iframe>';
					height=442;
				}
			}else{ 
				//*** NA Site
					if(country=="NZ"){	
						srcContent = '<iframe width="500" height="400" frameborder="0" src="//'+wwwlocation+'/popups/INT_NZ.php"; scrolling="no" ></iframe>';
						height=400;
					}
					
					if(country=="AU"){
						srcContent = '<iframe width="500" height="400" frameborder="0" src="//'+wwwlocation+'/popups/INT_AU.php"; scrolling="no" ></iframe>';
						height=400;
					}
					if(country=="HK"){            
						srcContent = '<iframe width="500" height="442" frameborder="0" src="//'+wwwlocation+'/popups/AU_HK.php"; scrolling="no" ></iframe>';
						height=442;
					}

					if(country=="UK"){            
						srcContent = '<iframe width="500" height="442" frameborder="0" src="//'+wwwlocation+'/popups/AU_UK.php"; scrolling="no" ></iframe>';
						height=442;
					}
			}
	
			
			if(srcContent!=null){
				
				jQuery.fancybox({
					'hideOnContentClick': false,
                    'titleShow':false,
                    'scrolling':'no',
                    'content' : srcContent,
                    'width' : 500,
                    'height' : height,
                    'autoScale' : false,
                    'autoDimensions' : false ,
                    'scrolling' : 'no',
                    'padding' : 0,
					'margin' : 0
				});
				
			}
		}
	}
	});
	
}

//function updateRegionInt(regId){
//	
//	jQuery('#newLocale').val(regId);
//	jQuery('#changeLocaleButton').click();
//}


function updateRegionAus(regId,shopURL){
	
		if(regId=="en_AU") {
			country = get_cookie("Country");	
			location.href='//'+shopURL+'/?locale='+regId+"&country="+country;	
		} else if(regId =='en_HK') {
			country = get_cookie("Country");	
			location.href='//'+shopURL+'/?locale='+regId+"&country="+country;	
		}else if(regId =='fr_CA') {
			var unifiedUrl=jQuery('#changeCountryUnifiedUrl').val();
			location.href='//'+shopURL+unifiedUrl+'/?locale='+regId;
			
		} else if(regId =='en_CA') {
			var unifiedUrl=jQuery('#changeCountryUnifiedUrl').val();
			location.href='//'+shopURL+unifiedUrl+'/?locale='+regId;
		} else{
		location.href='//'+shopURL+'/?locale='+regId;
		}
}

function captureCreateWishlistClick() {
	var pageName = s.pageName;
	omnitureReset();
	s.pageName = pageName;
	s.events="event49";
	s.eVar16="${selectedCountry}";
	var s_code=s.tl();if(s_code)document.write(s_code);
	_gaq.push(['ga._trackEvent', 'Cart Event', 'Create Wishlist', '']);
}

function captureEmailSignUp() {
	omnitureReset();
	s.pageName="www:Home";
	s.events="event5";
	s.prop1="Home";
	s.prop2="";
	s.prop3="";
	s.prop4="";
	s.channel="www";
	s.prop17="www:Home";
	var s_code=s.tl();if(s_code)document.write(s_code);

}

function captureAgeGateErrorEvent(){
	omnitureReset();
	s.events="event38";
	var s_code=s.tl();if(s_code)document.write(s_code);
}

/* omniture tagging for popup region link */
function captureRegionChange(country) {
	omnitureReset();
	s=s_gi(s_account);
	s.linkTrackVars="events,prop29, eVar29";
	s.linkTrackEvents="event57";
	s.prop29="glb:intl ship to:pop-up:"+ country;
	s.eVar29="glb:intl ship to:pop-up:"+ country;
	s.events="event57";
	s.tl(this,'o','glb:intl ship to:pop-up:'+ country);
}

function omnitureReset() {
	s.pageName="";
	s.products="";
	s.prop1 = "";
	s.prop2 = "";
	s.prop3 = "";
	s.prop4 = "";
	s.prop17 = "";
	s.channel = "";
	s.event="";
}

function removePrefixFromSku(skuId) {
	var imgId = "";
    imgId = skuId.substring(skuId.indexOf("_") + 1, skuId.length);
    return imgId;
}

	// start new region selector / Code to build the region/country list in the region selection box.

// start new region selector / build URL / some urls have more than one URL variable, this finds out if that's true and adds sl variable accordingly
function updateRegionInt(country,regId,regUrl){
	var flagID = regId.split("_")[1];
	var hasUrlVar = regUrl.indexOf("?");
	var preFix = '&sl=';
	if (hasUrlVar < 0){
		preFix = '?sl=';
	}
	if(regUrl.indexOf('sl=') > -1) {
		flagID = '';
		preFix = '';
	}
	// dynamic addition of local, stage or qa if already in test environment
	var currentLocation = new String(window.location.href);
		captureRegionChange(country);
	if (currentLocation.indexOf("dev.") !=-1) {
		regUrl=regUrl.replace("www.","");
		window.location="http://dev."+regUrl+preFix+flagID;
    }else if(currentLocation.indexOf("qa.") !=-1 || currentLocation.indexOf("stage10.") > -1 || currentLocation.indexOf("stage.") > -1 || currentLocation.indexOf("fr-") > -1){
    	var stageUrlPreFix="stage.";
    	if(flagID == 'NZ' || flagID == 'AU'){
    		stageUrlPreFix="stage10.";
    	}
    	if(regUrl=='www.lululemon.com/?locale=en_US'){
    		regUrl=regUrl.replace("www.",stageUrlPreFix);
        	window.location="http://"+regUrl+preFix+flagID;
    	}else if (regUrl=='www.lululemon.com/?locale=en_CA'){
    		regUrl=regUrl.replace("www.",stageUrlPreFix);
        	window.location="http://"+regUrl+preFix+flagID;
    	}else if (regUrl=='fr.shop.lululemon.com'){
    		regUrl = 'fr-stage-shoplululemon.onelink-translations.com/';
    		//regUrl=regUrl.replace("www.","stage.");
        	window.location="http://"+regUrl+preFix+flagID;
    	}
		else if (regUrl=='www.lululemon.co.uk'){
			if(currentLocation.indexOf("qa.") !=-1){
    		regUrl = 'qa.lululemon.co.uk/';
			}
			else{
				regUrl=regUrl.replace("www.","stage.");
			}
    		//regUrl=regUrl.replace("www.","stage.");
        	window.location="http://"+regUrl+preFix+flagID;
    	}
		else{
    		regUrl=regUrl.replace("www.","");
    		if(currentLocation.indexOf("qa.") !=-1){
    			window.location="http://qa."+regUrl+preFix+flagID;
    		}else{
    			window.location="http://"+stageUrlPreFix+regUrl+preFix+flagID;
    		}
    	}
    }else{
    	if(regUrl.indexOf('sl=') > -1) {
    		flagID = '';
    		preFix = '';
    	}
    	window.location="http://"+regUrl+preFix+flagID;
    }
}
// end new region selector / build URL

function countrySelectSetup(){
	// temporary flag reset -- for testing from some other country than the one you're in.
	// set_cookieUK('Country','US',5,'.lululemon.com.hk');
	function omnitureReset() {
	s.pageName="";
	s.products="";
	s.prop1 = "";
	s.prop2 = "";
	s.prop3 = "";
	s.prop4 = "";
	s.prop17 = "";
	s.channel = "";
	s.event="";
}

	function captureRegionPopup(){	
		omnitureReset();
		s=s_gi(s_account);
		s.pageName = "international ship to: pop-up";
		s.t();
	}
	
	// start new /region selector / handle flags & shipping country
	function openRegionwCookie() {
		var cookieShown = get_cookie('regionMsgShown');
		if (cookieShown==null){
			jQuery('.regionSelector').addClass('on');
			jQuery('.regionSelector').show();
			jQuery('.regionGrey').css('display','block');
			var screenTop = $(document).scrollTop();
			jQuery('.regionSelector .regionSelectorStyle').css('top', screenTop);
			set_cookieUK("regionMsgShown",true,365);
			captureRegionPopup();			
			regionFirst = 1; // variable to disable cookie message popup
		}else {regionFirst = 0;}
	};
	function findCountry(arr,obj) {
	    return (arr.indexOf(obj)); // look for country cookie value in set list of active countries for this site.
	}

	// set list to check against for valid sl or country cookie
	var crList;
	var crListCompare;
	if(location.hostname.search(".co.uk") != -1) {
		crList = ['UK'];
		crListCompare = ['UK'];
		defaultFlag = 'UK';
	}
	else if(location.hostname.search(".ch") != -1) {
		crList = ['CH'];
		crListCompare = ['CH'];
		defaultFlag = 'CH';
	}
	else if(location.hostname.search(".com.hk") != -1) {

		crList = ['HK','SG','BD','MY','VN','CN'];
		crListCompare = ['HK','SG','BD','MY','VN','CN'];

		defaultFlag = 'HK';
	}
	else if(location.hostname.search(".com.au") != -1) {
		crList = ['AU'];
		crListCompare = ['AU'];
		defaultFlag = 'AU';
	}else if(location.hostname.search(".co.nz") != -1) {
		crList = ['NZ'];
		crListCompare = ['NZ'];
		defaultFlag = 'NZ';
	}
	else if(location.hostname.search("eu.lululemon.com") != -1) {
		//crList = ['AT','BE','DK','DE','GR','IE','PT','SK','SI','NO','CH','EE','FI','FR','IT','LU','NL','ES','SE'];
		crList = ['AT','BE','CZ','DK','EE','FI','FR','DE','GR','IE','IT','LV','LT','LU','MC','NL','NO','PL','PT','SK','SI','ES','SE'];
		crListCompare = ['AT','BE','CZ','DK','EE','FI','FR','DE','GR','IE','IT','LV','LT','LU','MC','NL','NO','PL','PT','SK','SI','ES','SE'];
		defaultFlag = 'EU';
	}
	else {
		// assume US site
		//crList = ['US','CA','AS','MS','BS','BR','KY','BH','ID','IL','JP','AE','KW','PH','SA','HR','CZ','LV','LI','PL','PR','MX','GU','VI','KR','TW','GL','IS','LT','MC','BM'];
		crList=  ['AS','BS','BH','BM','BR','CA','KY','HR','GL','GU','IS','ID','IL','JP','KR','KW','LI','MX','MS','PH','PR','SA','TW','AE','US','VI','AR','AW','BB','BO','CL','CO','DO','EC','GD','GT','HN','IN','JM','PA','PE','RU','ZA','TZ','TT','TR','TC','UA','VE'];
		if(get_cookie("UsrLocale") == 'en_CA' || get_cookie("UsrLocale") == 'fr_CA') {
			crListCompare = ['CA'];
		} else {
			crListCompare = ['AS','BS','BH','BM','BR','KY','HR','GL','GU','IS','ID','IL','JP','KR','KW','LI','MX','MS','PH','PR','SA','TW','AE','US','VI','AR','AW','BB','BO','CL','CO','DO','EC','GD','GT','HN','IN','JM','PA','PE','RU','ZA','TZ','TT','TR','TC','UA','VE'];
		}
		defaultFlag = 'US';
	}

	
	var currentURL;
	// order of priority for flag sl-URL, sl-Cookie, country-cookie, default
	var slDefined = getURLParameter('sl');
	if(slDefined == 'null' || slDefined == null || slDefined == ''){
		//Set SL parameter when not passed in URL , only locale parameter passed
		var urlLocalParam = getURLParameter("locale");
		if(urlLocalParam != null){
			if(urlLocalParam =="en_US"){
				set_cookieUK("sl","US",365); // set or update cookie
			}else if(urlLocalParam =="en_CA"){
				set_cookieUK("sl","CA",365); // set or update cookie
			}
		}
	}
	var slCook = get_cookie('sl');
	
	var cookFlag = get_cookie("Country");
	var testForFlag = "";

	// if sl isn't passed as url or cookie, use country-cookie
	if((slDefined == 'null' || slDefined == null || slDefined == '') && (slCook == 'null' || slCook == null || slCook == '')){
		// sl not passed in url or empty. try cookie value for flag.
		// cookie value null or same as default. show default flag for this site.
		if (!cookFlag || cookFlag == defaultFlag){
			// nothing needs to happen we're already using default
			testForFlag = defaultFlag;
		}else {
			// set flag to cookie flag value
			testForFlag = cookFlag;
		}
	}else{
		// sl passed in url or cookie. update flag cookie and display correct flag
		if(slDefined == 'null' || slDefined == null || slDefined == ''){
			// sl did not come from URL, come from cookie, define test and update cookie
			testForFlag = slCook;
		}else{
			testForFlag = slDefined;			
		}
	}

	// Setting up the omniture parameter for shipping locator change
	if(defaultFlag == 'HK'){
		s.eVar31=testForFlag;
		s.prop31=testForFlag;
		// Below omniture parameters need to set 
		//when a Visitor selects the Flag to change their Ship To location (first time in visit only).
		if((slCook == 'HK') && (slDefined != 'HK')){
			s.pageName = "international ship to: pop-up";
			s.t();
		}
	}
	
	// test value against valid list
	var flagTest = findCountry(crListCompare,testForFlag);
	if (flagTest !== -1){
		// change flag image
		updateFlag(testForFlag); // update flag
		set_cookieUK("sl",testForFlag,365); // set or update cookie
	}else{
		openRegionwCookie();
	}

	function updateFlag(flagID){
		if(flagID == '') {
			fagID = 'US';
		}
		flagID = flagID.toUpperCase();
		var image = jQuery('#regionSelector a span img');
		var src = image.attr("src");
		// special case for ireland <<removed in case hard coding EU image works
//		if (cookFlag == 'IE' && (((slDefined == 'null' || slDefined == null || slDefined == '') && (slCook == 'null' || slCook == null || slCook == '')) || ((slDefined == 'IE') || slCook =='IE'))){
//			flagID = 'IE2';
//		}
		var newSrc = src.replace(/flag-en_[^.]+/i, 'flag-en_'+flagID);
		image.attr("src", newSrc);
	}
	// end new region selector / handle flags & shipping country

	var cookieShown = get_cookie('cookieMsgShown');
	if (cookieShown==null && regionFirst == 0 && (location.hostname.search(".co.uk") != -1 || location.hostname.search(".com.hk") != -1)){
		jQuery('.regionChange').show();
		set_cookieUK("cookieMsgShown",true,365);
	}
	var countryCookie = get_cookie('Country');
	if (countryCookie == "CH" && cookieShown == null && regionFirst == 0 && (location.hostname.search(".eu.lululemon.com") != -1)){
		jQuery('.regionChange').show();		
		set_cookieUK("cookieMsgShown",true,365);
	}

	// ***** THIS is the area you can edit to add/remove/edit countries or regions *****
	//['region name',[['country name'],['locale for image path'],['complete url minus http://']],[['repeat'],['repeat'],['repeat']]]

	var arr = [['north america',[['canada (english)'],['en_CA'],['www.lululemon.com/?locale=en_CA']],[['canada (français)'],['fr_CA'],['fr.shop.lululemon.com']],[['united states of america'],['en_US'],['www.lululemon.com/?locale=en_US']]],	           
	           ['europe',[['united kingdom'],['en_GB'],['www.lululemon.co.uk']],[['austria'],['en_AT'],['www.eu.lululemon.com']],[['finland'],['en_FI'],['www.eu.lululemon.com']],[['ireland'],['en_IE'],['www.eu.lululemon.com']],[['monaco'],['en_MC'],['www.eu.lululemon.com']],[['slovenia'],['en_SI'],['www.eu.lululemon.com']],[['belgium'],['en_BE'],['www.eu.lululemon.com']],[['france'],['en_FR'],['www.eu.lululemon.com']],[['italy'],['en_IT'],['www.eu.lululemon.com']],[['netherlands'],['en_NL'],['www.eu.lululemon.com']],[['spain'],['en_ES'],['www.eu.lululemon.com']],[['croatia'],['en_HR'],['www.lululemon.com/?locale=en_US']],[['germany'],['en_DE'],['www.eu.lululemon.com']],[['latvia'],['en_LV'],['www.eu.lululemon.com']],[['norway'],['en_NO'],['www.eu.lululemon.com']],[['sweden'],['en_SE'],['www.eu.lululemon.com']],[['czech republic'],['en_CZ'],['www.eu.lululemon.com']],[['greece'],['en_GR'],['www.eu.lululemon.com']],[['liechtenstein'],['en_LI'],['www.lululemon.com/?locale=en_US']],[['poland'],['en_PL'],['www.eu.lululemon.com']],[['switzerland'],['en_CH'],['www.lululemon.ch']],[['denmark'],['en_DK'],['www.eu.lululemon.com']],[['greenland'],['en_GL'],['www.lululemon.com/?locale=en_US']],[['lithuania'],['en_LT'],['www.eu.lululemon.com']],[['portugal'],['en_PT'],['www.eu.lululemon.com']],[['ukraine'],['en_UA'],['www.lululemon.com/?locale=en_US']],[['estonia'],['en_EE'],['www.eu.lululemon.com']],[['iceland'],['en_IS'],['www.lululemon.com/?locale=en_US']],[['luxembourg'],['en_LU'],['www.eu.lululemon.com']],[['slovakia'],['en_SK'],['www.eu.lululemon.com']]],
			   ['australia and new zealand',[['australia'],['en_AU'],['lululemon.com.au']],[['new zealand'],['en_NZ'],['lululemon.co.nz']]],
			   ['asia pacific',[['hong kong'],['en_HK'],['www.lululemon.com.hk']],[['singapore'],['en_SG'],['www.lululemon.com.hk']],
			   [['china'],['en_CN'],['www.lululemon.com.hk']],
			   [['american samoa'],['en_AS'],['www.lululemon.com/?locale=en_US']],[['indonesia'],['en_ID'],['www.lululemon.com/?locale=en_US']],[['korea (republic of)'],['en_KR'],['www.lululemon.com/?locale=en_US']],[['philippines'],['en_PH'],['www.lululemon.com/?locale=en_US']],[['taiwan'],['en_TW'],['www.lululemon.com/?locale=en_US']],[['bangladesh'],['en_BD'],['www.lululemon.com.hk']],[['india'],['en_IN'],['www.lululemon.com/?locale=en_US']],[['malaysia'],['en_MY'],['www.lululemon.com.hk']],[['russia'],['en_RU'],['www.lululemon.com/?locale=en_US']],[['vietnam'],['en_VN'],['www.lululemon.com.hk']],[['guam'],['en_GU'],['www.lululemon.com/?locale=en_US']],[['japan'],['en_JP'],['www.lululemon.com/?locale=en_US']]],
	           ['middle east and africa',[['bahrain'],['en_BH'],['www.lululemon.com/?locale=en_US']],
	           [['kuwait'],['en_KW'],['www.lululemon.com/?locale=en_US']],[['south africa'],['en_ZA'],['www.lululemon.com/?locale=en_US']],[['turkey'],['en_TR'],['www.lululemon.com/?locale=en_US']],[['united arab emirates'],['en_AE'],['www.lululemon.com/home.jsp?locale=en_US']],[['israel'],['en_IL'],['www.lululemon.com/?locale=en_US']],[['saudi arabia'],['en_SA'],['www.lululemon.com/?locale=en_US']],[['tanzania'],['en_TZ'],['www.lululemon.com/?locale=en_US']]],	           
	           ['latin america and caribbean',[['aruba'],['en_AW'],['www.lululemon.com/?locale=en_US']],[['cayman islands'],['en_KY'],['www.lululemon.com/?locale=en_US']],[['honduras'],['en_HN'],['www.lululemon.com/?locale=en_US']],[['montserrat'],['en_MS'],['www.lululemon.com/?locale=en_US']],[['trinidad and tabago'],['en_TT'],['www.lululemon.com/?locale=en_US']],[['bahamas'],['en_BS'],['www.lululemon.com/?locale=en_US']],[['dominican republic'],['en_DO'],['www.lululemon.com/?locale=en_US']],[['jamaica'],['en_JM'],['www.lululemon.com/?locale=en_US']],[['panama'],['en_PA'],['www.lululemon.com/?locale=en_US']],[['turks and caicos islands'],['en_TC'],['www.lululemon.com/?locale=en_US']],[['barbados'],['en_BB'],['www.lululemon.com/?locale=en_US']],[['grenada'],['en_GD'],['www.lululemon.com/?locale=en_US']],[['mexico'],['en_MX'],['www.lululemon.com/?locale=en_US']],[['puerto rico'],['en_PR'],['www.lululemon.com/?locale=en_US']],[['virgin islands'],['en_VI'],['www.lululemon.com/?locale=en_US']],[['bermuda'],['en_BM'],['www.lululemon.com/?locale=en_US']],[['guatemala'],['en_GT'],['www.lululemon.com/?locale=en_US']]],
	           ['south america',[['argentina'],['en_AR'],['www.lululemon.com/?locale=en_US']],[['bolivia'],['en_BO'],['www.lululemon.com/?locale=en_US']],[['colombia'],['en_CO'],['www.lululemon.com/?locale=en_US']],[['peru'],['en_PE'],['www.lululemon.com/?locale=en_US']],[['venezuela'],['en_VE'],['www.lululemon.com/?locale=en_US']],[['brazil'],['en_BR'],['www.lululemon.com/?locale=en_US']],[['chile'],['en_CL'],['www.lululemon.com/?locale=en_US']],[['ecuador'],['en_EC'],['www.lululemon.com/?locale=en_US']]]];


	// ***** End edit for countries & regions *****

	var txt='<div id="regionsCountriesBox" class="regionsCountriesBox">';
	var length = arr.length;
	for (var i = 0; i < length; i++) {
		var ctxt = '';
		txt=txt+'<div class="regionBox'+i+'" id="regionBox"><h2>'+arr[i][0]+'</h2><ul>';
		var x = arr[i].length;
		 var cinr = x - 1;
		 var breakPoint = 4;
		 if (cinr>12){
			 breakPoint = 5;
		 }
		 else if (cinr<5){
			 breakPoint = 2;
		 }
		 var breakTest = 0;
		 var iLength = arr[i].length;
		for (var y = 0; y < iLength; y++) {
				if (y != 0){
					// If list is longer than 12, break
					/*if(breakPoint == breakTest){
						
						breakTest = 0;
					}*/
					breakTest = breakTest + 1;
					var regionUpdate = "'"+arr[i][y][0]+"','"+arr[i][y][1]+"','"+arr[i][y][2]+"'";
				  	ctxt = ctxt+'<li><a href="javascript:updateRegionInt('+regionUpdate+')"><img src="//'+cdnLulustaticUrl+'/hr/img/flag-'+arr[i][y][1]+'.jpg" alt="'+arr[i][y][0]+'""> '+arr[i][y][0]+'</a></li>';
				}
				if(y==(iLength-1))
				ctxt=ctxt+'</ul></div><div class="regionBox" id="regionBox"><ul>';
			}
		txt=txt+ctxt+'</ul></div>';
		if (i == 1 || i == 2 || i ==4){
				// break row for these regions as they finish... if more regions are added these numbers will change
				txt = txt+'</div><div class="regionHR"></div><div id="regionsCountriesBox" class="regionsCountriesBox">';
		}
	  }
	jQuery("#regionsCountriesBoxWrapper").html(txt);
}
	//	end new region selector / Code to build the region/country list in the region selection box.