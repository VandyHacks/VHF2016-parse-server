// Example express application adding the parse-server module to expose Parse
// compatible API routes.

//var express = require('parse-server/node_modules/express');
var express = require('express');
var cors = require('cors') // add this line below it

var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://heroku_wzzzkdwx:35na9jaqrv7kupsou5f0f3qst4@ds019829.mlab.com:19829/heroku_wzzzkdwx',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'DfoMH2OG5zwZ2Fsr0cbcuYkT2NFSrq89zBRIah3H',
  masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'https://cryptic-gorge-28973.herokuapp.com/parse/1',  // Don't forget to change to https if needed
  javascriptKey: process.env.JAVASCRIPT_KEY || '',  //** add this line no need to set values, they will be overwritten by heroku config vars
  restAPIKey: process.env.REST_API_KEY || '', //** add this line
  dotNetKey: process.env.DOT_NET_KEY || '', //** add this line
  clientKey: process.env.CLIENT_KEY || '', //** add this line
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();
app.use(cors()); // add this line below it

// Serve static assets from the /public folder
//app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || 'https://cryptic-gorge-28973.herokuapp.com/parse/1';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('Make sure to star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);

