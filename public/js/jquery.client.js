if (!window.console) {
	var console = {
		'log': function(){}
		, 'dir': function(){}
		, 'time': function(){}
		, 'timeEnd': function(){}
		, 'profile': function(){}
		, 'profileEnd': function(){}
	}
}
(function ($) {
	$('body').removeClass('nojs');
})(jQuery.noConflict());