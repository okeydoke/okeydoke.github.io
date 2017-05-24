function fireCallback(modal, callback) {
	var hoverContainer = modal;

	if (jQuery.browser.msie && jQuery.browser.version < 7) {
		jQuery("select").css("visibility", "hidden");
	}

	if (callback == "homePage") {
		jQuery('body').live('callback', function() {
			window.location = "/index.jsp";
		});
	}

	else if (callback == "refreshCart") {
		jQuery('body').live('callback', function() {
			reloadShoppingCart();
		});
	}

	else if (callback == "shoppingCart") {
		jQuery('body').live('callback', function() {
			window.location = "/shop/shopping-bag.jsp";
		});
	}

	else if (callback == "resetPassword") {
		jQuery(document).ready(function() {
			var emailLogin = jQuery('#emailLogin').attr('value');

			jQuery('body').live('callback', function() {
				window.location = "/secure/account/forgotpassword.jsp?email=" + emailLogin;
			});
		});
	}

	else if (callback.match(/paypalCanadaPostMessage/gi)) {
		var shippingInfo = (callback.split(";")[1] == null) ? "" : callback.split(";")[1];
		paypalSuccess(shippingInfo);
		reloadShoppingCart();
		$.fancybox.close();
	}

	else if (callback == "billingInfoForm") {
		jQuery('body').live('callback', function() {
			jQuery('#step2Header .editLink').click();
			jQuery('#billingInfoForm,#step2').show();
			jQuery('#step2').slideToggle('fast');
		});
	}

	jQuery.fancybox({
		'padding' : 0,
		'transitionIn' : 'none',
		'transitionOut' : 'none',
		'scrolling' : 'no',
		'autoDimensions' : true,
		//'width' : 437,
		'content' : hoverContainer,
		'overlayShow' : true,
		'onComplete' : function() {
			//jQuery("#fancybox-close").css("right","-27px");
			setTimeout("jQuery('#fancybox-overlay').show()", 300);
		}
	});
}

function hoverDecision(msg, title, callback) {
	var type = '';

	var errorWrapper = $('<div/>',{ "class":"errorMessage" });

	errorWrapper.append(
		$('<h2/>',{ "class":"containerTitle", "text":title }),
		$('<p/>',{ "html":msg }),
		$('<div/>',{ "class":"errorConfirmDeny wide" }).append(
			$('<span/>',{ "class":"btn" }).append(
				$('<input/>',{ "class":"btn closeAlert", "type":"button", "value":"ok" })
			),
			$('<div/>', { "class":"errorCloseContainer" }).append(
				$('<span/>',{ "class":"btn" }).append(
					$('<input/>',{ "class":"btn cancelAlert", "type":"button", "value":"close" })
				)
			),
			$('<div/>',{ "class":"clear"})
		)
	);

	var errorModal = $('<div/>', { "id":"pageContent", "class":"errorModal" });

	errorModal.append(
		$('<div/>',{ "id":"container" }).append(
			$('<div/>', { "id":"subContainer" }).append(
				$('<div/>', { "class":"modalOuter" }).append(
					$('<div/>', { "class":"modalContent" }).append(
						$('<div/>', { "class":"t" }),
						errorWrapper
					),
					$('<div/>', { "class":"b" }).append(
						$('<div/>')
					)
				)
			)
		)
	);
	fireCallback(errorModal, callback);
}

function hoverDecisionCancelOrder(msg, title, callback) {
	var type = '';

	var errorWrapper = $('<div/>',{ "class":"errorMessage" });

	errorWrapper.append(
		$('<h2/>',{ "class":"containerTitle", "text":title }),
		$('<p/>',{ "html":msg }),
		$('<div/>',{ "class":"errorConfirmDeny wide" }).append(
			$('<span/>',{ "class":"btn" }).append(
				$('<input/>',{ "class":"btn closeAlert", "type":"button", "value":"ok" })
			),
			$('<div/>', { "class":"errorCloseContainer" }).append(
				$('<span/>',{ "class":"btn" }).append(
					$('<input/>',{ "class":"btn cancelAlert", "type":"button", "value":"close" })
				)
			),
			$('<div/>',{ "class":"clear"})
		)
	);

	var errorModal = $('<div/>', { "id":"pageContent", "class":"errorModal" });

	errorModal.append(
		$('<div/>',{ "id":"container" }).append(
			$('<div/>', { "id":"subContainer" }).append(
				$('<div/>', { "class":"modalOuter" }).append(
					$('<div/>', { "class":"modalContent" }).append(
						$('<div/>', { "class":"t" }),
						errorWrapper
					),
					$('<div/>', { "class":"b" }).append(
						$('<div/>')
					)
				)
			)
		)
	);
	fireCallback(errorModal, callback);
}
function errorDecision(msg, callback) {
	var type = '';
	var errorWrapper = $('<div/>',{ "class":"errorMessage" });

	errorWrapper.append(
		$('<h2/>',{ "class":"containerTitle", "text":"breathe deeply... and try again." }),
		$('<p/>',{ "html":msg }),
		$('<div/>',{ "class":"errorConfirmDeny" }).append(
			$('<span/>',{ "class":"btn" }).append(
				$('<input/>',{ "class":"btn closeAlert", "type":"button", "value":"ok" })
			),
			$('<div/>',{ "class":"clear"})
		)
	);

	var errorModal = $('<div/>', { "id":"pageContent", "class":"errorModal" });

	errorModal.append(
		$('<div/>',{ "id":"container" }).append(
			$('<div/>', { "id":"subContainer" }).append(
				$('<div/>', { "class":"modalOuter" }).append(
					$('<div/>', { "class":"modalContent" }).append(
						$('<div/>', { "class":"t" }),
						errorWrapper
					),
					$('<div/>', { "class":"b" }).append(
						$('<div/>')
					)
				)
			)
		)
	);

	fireCallback(errorModal, callback);
}

jQuery(document).ready(function() {

	jQuery('#pageContent.errorModal .closeContainer a, #pageContent.errorModal .errorCloseContainer input.cancelAlert').live('click', function() {
		$.fancybox.close();
		return false;
	});

	jQuery('.#pageContent.errorModal input.closeAlert').live('click', function() {
		$.fancybox.close();
		$('body').trigger('callback');
		$('body').die('callback');
		return false;
	});

	jQuery('#pageContent.errorModal input.closeAlert').live('click', function() {
		$.fancybox.close();
		$('body').trigger('callback');
		$('body').die('callback');
		return false;
	});
});