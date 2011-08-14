// In case we leave a console.*** in the code without native support
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info, log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c;})(window.console=window.console||{});

(function ($) {

	// Shorthand jQuery selector cache. Only use on selectors for the DOM that won't change.
	var $$ = (function() {
		var cache = {};
		return function(selector) {
			if (!cache[selector]) {
				cache[selector] = $(selector);
			}
			return cache[selector];
		};
	})();

	var socketIoClient = io.connect(null, {
		'port': '#socketIoPort#'
		, 'rememberTransport': true
		, 'transports': ['websocket', 'xhr-multipart', 'xhr-polling', 'htmlfile', 'flashsocket']
	});
	socketIoClient.on('connect', function () {
		$$('#connected').addClass('on').find('strong').text('Online');
	});

	var image = $.trim($('#image').val());
	var service = $.trim($('#service').val());
	socketIoClient.on('message', function(msg) {
		var $li = $('<li>').text(msg).append($('<img class="avatar">').attr('src', image));
		if (service) {
			$li.append($('<img class="service">').attr('src', service));
		}
		$$('#bubble ul').prepend($li);
		$$('#bubble').scrollTop(98).stop().animate({
			'scrollTop': '0'
		}, 500);
		setTimeout(function() {
			$li.remove();
		}, 5000);

		setTimeout(function() {
			socketIoClient.send('pong');
		}, 1000);
	});

	socketIoClient.on('disconnect', function() {
		$$('#connected').removeClass('on').find('strong').text('Offline');
	});
})(jQuery);
