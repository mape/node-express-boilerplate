WEB_SOCKET_SWF_LOCATION = '/swf/WebSocketMain.swf';

if (!window.console) {
	var console = {
		'log': function(){}
		, 'dir': function(){}
		, 'time': function(){}
		, 'timeEnd': function(){}
		, 'profile': function(){}
		, 'profileEnd': function(){}
	};
}

var domCache = {};
function $$(selector) {
	if (!domCache[selector]) {
		domCache[selector] = $(selector);
	}
	return domCache[selector];
}

(function ($) {
	$$('body').removeClass('nojs');
	var server = new io.Socket(null, {
		'port': '#socketIoPort#'
		, 'rememberTransport': true
		, 'transports': [
			'websocket'
			, 'flashsocket'
			, 'htmlfile'
			, 'xhr-multipart'
			, 'xhr-polling'
		]
	}); 
	server.on('connect', function() {
		console.log('connect');
	});
	server.on('message', function(msg) {
		console.log(msg);
	});
	server.on('disconnect', function() {
		console.log('disconnect');
	});
	server.connect();
})(jQuery);