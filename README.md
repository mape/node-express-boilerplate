# node-express-boilerplate

node-express-boilerplate gives the developer a clean slate to start with while bundling enough useful features so as to remove all those redundant tasks that can derail a project before it even really gets started.

## So what does node-express-boilerplate do

<img src="http://mape.me/plate.png">

First of all, it is very easy to understand, allowing you to start using it right away. There is minimal need to dig around in files just to get a good idea of how things work. And if you don't like how the boiler plate is set up, just fork it and change it according to your own personal preferences.

### Features include:

* Bundling [socket.io](http://socket.io/) and integrating with the [express](https://github.com/visionmedia/express) session store so data can be shared
* Providing premade hooks to [authenticate](https://github.com/bnoguchi/everyauth) users via facebook/twitter/github
* An [assetmanager](https://github.com/mape/connect-assetmanager/) that concatenates/mangles/compresses your CSS/JS assets to be as small and fast to deliver as possible, as well as cache busting using MD5 hashes
* Auto updates of the browser (inline/refresh) as soon as CSS/JS/template-files are changed in order to remove all those annoying “save, tab, refresh” repetitions
* [Notifications](http://notifo.com/) to your computer/mobile phone on certain user actions
* Sane defaults in regards to productions/development environments
* Logs errors to [Airbrakeapp.com](http://airbrakeapp.com/pages/home) in order to track any errors users are encountering
* Auto matching of urls to templates without having to define a specific route (such as, visiting /file-name/ tries to serve file-name.ejs and fallbacks to index.ejs - this is helpful for quick static info pages)

## Install on dev machine
* git clone https://github.com/mape/node-express-boilerplate myproject
* cd myproject
* npm install
* cp siteConfig.sample.js siteConfig.js
* mate siteConfig.js # update config for your use case
* nodemon server.js

## Install on no.de
* First on node machine
	* ssh node@yourname.no.de
	* pkgin update; pkgin install redis
	* svccfg import /opt/local/share/smf/manifest/redis.xml
	* svcadm enable redis

* Then on local machine
	* git clone [https://github.com/mape/node-express-boilerplate](https://github.com/mape/node-express-boilerplate) myproject
	* cd myproject
	* cp siteConfig.sample.js siteConfig.js
	* edit siteConfig.js settings
	* scp siteConfig.js node@yourname.no.de:~
	* git remote add joyent node@yourname.no.de:repo
	* git push joyent master
	* open http://yourname.no.de