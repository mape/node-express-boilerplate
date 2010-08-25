(function ($) {
	$('body').removeClass('nojs');
	setInterval(function () {
		$('h1').text(new Date().toString());
	}, 500);
})(jQuery.noConflict());