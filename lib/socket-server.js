var io = require('socket.io');
module.exports = function Server(server) {
	var socket = io.listen(server);
	socket.on('connection', function (client) {
		client.send('welcome');
		//setInterval(function() {
		//	client.send(Date.now());
		//}, 100);
		client.on('message', function (msg) {
			console.log(msg);
		});
		client.on('disconnect', function () {
			console.log('disconnect');
		});
	});
	return this;
};
