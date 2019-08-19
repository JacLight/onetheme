var Websitemint = {};
Websitemint.MessageType = { SYSTEMNOTICE: 10, SYSTEMINFO: 11, SYSTEMWARN: 12, SYSTEMSUCCESS: 13, SYSTEMERROR: 14 };

$(document).ready(function () {
	//$("html").niceScroll();
	$.localScroll({
		offset: { top: -100 }
	});
	$(window).scroll(function () {
		//Sticky Navbar
		if ($('#banner').length > 0) {
			var bannerTop = $('#banner').offset().top;
			var bannerHeight = $('#banner').height();

			if ($(window).scrollTop() > bannerHeight * 0.6) {
				$('body').addClass('sticky-content');
			} else {
				$('body').removeClass('sticky-content');
			}
		}
		if ($(window).scrollTop() > 100) {
			$('#pageToTop').show('fast');
		} else {
			$('#pageToTop').hide('fast');
		}
	});

	jQuery(document).ready(function () {
		$('#ajax-loader').ajaxStart(function () {
			$(this).show();
		}).ajaxStop(function () {
			$(this).hide();
		}).ajaxError(function (event, request, settings) {
			$(this).hide();
			$.xhrPool.abortAll();
		});
	});

	// Track all AJAX Request --%>
	$.xhrPool = [];
	$.xhrPool.abortAll = function (url) {
		$(this).each(function (i, jqXHR) { //  cycle through list of recorded connection
			if (!url || url === jqXHR.requestURL) {
				jqXHR.abort(); //  aborts connection
				$.xhrPool.splice(i, 1); //  removes from list by index
			}
		});
	};
	$.ajaxSetup({
		beforeSend: function (jqXHR) {
			$.xhrPool.push(jqXHR); //  add connection to list
		},
		complete: function (jqXHR) {
			var i = $.xhrPool.indexOf(jqXHR); //  get index for current connection completed
			if (i > -1) $.xhrPool.splice(i, 1); //  removes from list by index
		}
	});
	$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
		jqXHR.requestURL = options.url;
	});
});

function websitemintShowMessage(title, message, type, modal, icon, opacity, nonBlock) {
	if (type == Websitemint.MessageType.SYSTEMINFO || type == Websitemint.MessageType.SYSTEMWARN) {
		new PNotify({
			title: title,
			text: message,
			type: 'info'
		});
	} else if (type == Websitemint.MessageType.SYSTEMSUCCESS) {
		new PNotify({
			title: title,
			text: message,
			type: 'success'
		});
	} else if (type == Websitemint.MessageType.SYSTEMERROR) {
		new PNotify({
			title: title,
			text: message,
			type: 'error'
		});
	} else {
		new PNotify({
			title: title,
			text: message,
		});
	}
	console.log('Type: ' + type + ' Title: ' + title + ' Message: ' + message);
}