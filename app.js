
/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , cons = require('consolidate')
  , path = require('path')
  , RedisExpress = require('connect-redis')(express)
  , redis = require("redis").createClient()
  , im = require('istanbul-middleware')
  , isCoverageEnabled = (process.env.COVERAGE == "true")
  , app = express()
;

// Make sure redis is alive
//  this will fail async but that's ok we'll get the message
redis.ping(function(err) {
    if (err) {
        console.error('Unable to connect to REDIS - is it running??');
        process.exit(1);
    }
});

if (isCoverageEnabled) {
    im.hookLoader(__dirname);
}

// these need to come AFTER the coverage hook loader to get coverage info for them
var routes = require('./routes')
  , user = require('./routes/user')
;


// all environments
app.engine('dust', cons.dust);
app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || '127.0.0.1');
app.set('views', __dirname + '/views');
app.set('view engine', 'dust');
app.set('redis', redis);
app.use(express.favicon());
app.use(express.logger('dev'));

if (isCoverageEnabled) {
    app.use(im.createClientHandler(path.join(__dirname, 'public'), { 
        matcher: function(req) { return req.url.match(/javascripts/); }
    }));
    app.use('/coverage', im.createHandler());
}

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session({
    secret: "this is a good secret"
    , key: 'sid'
    , store: new RedisExpress({ client: redis })
}));
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

if ('test' == app.get('env')) {
  app.use(express.errorHandler());
  redis.select(15);
}

user.setup(app); // this has to go first!
app.get('/', routes.index);

// run from command line or loaded as a module (for testing)
if (require.main === module) {
    var server = http.createServer(app);
    server.listen(app.get('port'), app.get('host'), function() {
        console.log('Express server listening on http://' + app.get('host') + ':' + app.get('port'));
    });
} else {
    exports = module.exports = app;
}

