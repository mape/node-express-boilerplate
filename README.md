# node-express-boilerplate
## Short video showing the features
[![Youtube](http://mape.me/node-boilerplate.png "Youtube video")](http://www.youtube.com/watch?v=esKYgej26dw)


## What does node-express-boilerplate do?

node-express-boilerplate is a collection of neat things that makes prototyping dummy frontend fast and streamlined. No more tab+refreshing to see css, javascript eller markup.

* Bundled with socket.io server and socket.io client files (with flashsocket fallback).
* Auto updates the CSS without pageload when CSS files change.
* Auto refreshes the page when markup or javascript files change.
* Auto matches urls to templates without server changes. Visiting /file-name/ tries to serve file-name.ejs and has fallback to index.ejs.
* Use the Sync button to redirect all browsers to the current page. This is handy when you want to test the design on multiple browsers and don't want to navigate to the page with each browser.
* The Validate button shows the current validation status of the current page. If it is green the page validates, if it is red it shows how many errors there are and if you click it you get a list of what errors are present and where they are.
* Overlay images to have a design reference.

## Requires
    npm install connect
    npm install connect-assetmanager
    npm install connect-assetmanager-handlers
    npm install express
    npm install ejs
    npm install socket.io