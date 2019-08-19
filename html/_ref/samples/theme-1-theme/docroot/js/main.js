AUI().ready(
	'liferay-hudcrumbs', 'liferay-navigation-interaction', 'liferay-sign-in-modal',
	function(A) {
		var navigation = A.one('#navigation');

		if (navigation) {
			navigation.plug(Liferay.NavigationInteraction);
		}

		var siteBreadcrumbs = A.one('#breadcrumbs');

		if (siteBreadcrumbs) {
			siteBreadcrumbs.plug(A.Hudcrumbs);
		}

		var signIn = A.one('li.sign-in a');

		if (signIn && signIn.getData('redirect') !== 'true') {
			signIn.plug(Liferay.SignInModal);
		}
	}
);

Liferay.Portlet.ready(

	/*
	This function gets loaded after each and every portlet on the page.

	portletId: the current portlet's id
	node: the Alloy Node object of the current portlet
	*/

	function(portletId, node) {
	}
);

Liferay.on(
	'allPortletsReady',

	/*
	This function gets loaded when everything, including the portlets, is on
	the page.
	*/

	function() {
	}
);

AUI().ready(
	'liferay-sign-in-modal',
	function(A) {
		var signIn = A.one('li.cd-navigation-sign-in a');
			if (signIn){
				signIn.plug(Liferay.SignInModal);
			}
	}
);

jQuery(document).ready(function($){
	var $lateral_wrapper = $('#cd-lateral-nav-wrapper');
	if ( $lateral_wrapper.length ){
			var $lateral_menu_trigger = $('#cd-lateral-nav-wrapper .cd-nav-trigger'),
				$content_wrapper = $('#wrapper'),
				$navigation = $('div#cd-header');

			//open-close lateral menu clicking on the menu icon
			$lateral_menu_trigger.on('click', function(event){
				event.preventDefault();

				$lateral_menu_trigger.toggleClass('navigation-is-open');
				$lateral_menu_trigger.toggleClass('is-clicked');
				$navigation.toggleClass('lateral-menu-is-open');
				$content_wrapper.toggleClass('lateral-menu-is-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
					// firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
					$('body').toggleClass('overflow-hidden');
				});
				$('#cd-lateral-nav').toggleClass('lateral-menu-is-open');

				//check if transitions are not supported - i.e. in IE9
				if($('html').hasClass('no-csstransitions')) {
					$('body').toggleClass('overflow-hidden');
				}
			});

			//close lateral menu clicking outside the menu itself
			$content_wrapper.on('click', function(event){
				if( !$(event.target).is('#cd-menu-trigger, #cd-menu-trigger span') ) {
					$lateral_menu_trigger.removeClass('is-clicked');
					$lateral_menu_trigger.removeClass('navigation-is-open');
					$navigation.removeClass('lateral-menu-is-open');
					$content_wrapper.removeClass('lateral-menu-is-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
						$('body').removeClass('overflow-hidden');
					});
					$('#cd-lateral-nav').removeClass('lateral-menu-is-open');

					//check if transitions are not supported
					if($('html').hasClass('no-csstransitions')) {
						$('body').removeClass('overflow-hidden');
					}

				}
			});

			//open (or close) submenu items in the lateral menu. Close all the other open submenu items.
			$('.item-has-children').children('a').on('click', function(event){
				event.preventDefault();
				$(this).toggleClass('submenu-open').next('.sub-menu').slideToggle(200).end().parent('.item-has-children').siblings('.item-has-children').children('a').removeClass('submenu-open').next('.sub-menu').slideUp(200);
			});
	}
});
