
// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const graph = require('fbgraph');

const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

const MongoStore = require('connect-mongo')(session);

// Get our API routes
const api = require('./server/routes/api');

// Get User model so passport knows what a 'User' is
const User = require('./server/models/user');
const NotificationChecker = require('./server/notificationChecker');

// Tell passport how to write a user
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

// Tell passport how to read a user
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

passport.use(new TwitterStrategy({
    consumerKey: 'GxwxeStKsYqKjhpzYS7Ag8X25',
    consumerSecret: 'AKt7uqDgHjDpMpQwbwWbDwQNgzqTnPTu1EdQUrpBTqQsm2ezF7',
    callbackURL: "https://bill-manager.herokuapp.com/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, cb) {
    User.findOne({ twitterId: profile.id }, function (err, user) {
      // if there is an error, stop everything and return that
      // ie an error connecting to the database
      if (err)
        return done(err);

      // if the user is found then log them in
      if (user) {
        return cb(err, user);
      } else {
        // if there is no user, create them
        let user = new User();
        user.twitterId = profile.id;
        user.username = profile.username;

        // save our user into the database
        user.save(function(err) {
          if (err)
            throw err;

          return cb(err, user);
        });
      }

    });

  }
));

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set up a mlab account to use for mongodb. Connect to that db.
mongoose.connect('mongodb://admin:admin@ds035593.mlab.com:35593/bms'); // Connect to MongoDB database for polling app.

// Make sure mongod is running! If not, log an error and exit.
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

// Must set up a session to use for logging in
app.use(session({
  secret: 'my_precious_l@3',
  cookie: { maxAge: 18000000 }, // Session set to 5 hours, enough for a round of golf
  saveUninitialized: false, // don't create session until something stored
  resave: true, //don't save session if unmodified
  rolling: true,
  name: 'bms-session',
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

const conf = {
  client_id:      '329051680857512',
  client_secret:  '0aadceb2c7e3dbb463731d5f140395f0',
  scope:          'email, user_about_me, user_birthday, user_location, publish_actions',
  access_code: '',
  code:           ''
  // You have to set http://localhost:3000/ as your website
  // using Settings -> Add platform -> Website
  , redirect_uri:   'http://localhost:3000/fb-auth'
};

// initialize the session
app.use(passport.initialize());
// start the session
app.use(passport.session());

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

//let fb = new FB.

// Set our api routes
app.use('/api', api);

const request = require('request');

app.get('/fb-api/groups', function(req, res) {
  graph.setAccessToken(conf.access_code);

  var params = { };

  graph.get("360852310642785/members", params,  function(err, resp) {
    console.log(resp); // { picture: "http://profile.ak.fbcdn.net/..." }
    res.json(resp);
  });
});


app.get('/test', function(req, res) {
  // you need permission for most of these fields
  const userFieldSet = 'id, name, about, email, accounts, link, is_verified, significant_other, relationship_status, website, picture, photos, feed';

  const options = {
    method: 'GET',
    uri: 'https://graph.facebook.com/v2.9/360852310642785/members',
    qs: {
      access_token: conf.access_code,
      fields: userFieldSet
    }
  };

  request.get(options, function(err,response,body) {
    if (err) console.log("Error: ", err);
    else console.log(body);

    res.json(JSON.parse(body));
  });

});

app.get('/fbapi', function(req, res) {

  graph.setAccessToken(conf.access_code);

  var searchOptions = {
    q: "4",
    type: "user",
    limit: 20
  };
  graph.search(searchOptions,function(err, res) {
    if(err) console.log(err);
    else console.log("User Test: ", res);
  });

});


app.get('/fb-auth', function(req, res) {

  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
    console.log("Performing oauth for some user right now.");

    const authUrl = graph.getOauthUrl({
      "client_id":     conf.client_id,
      "redirect_uri":  conf.redirect_uri,
      "scope":         conf.scope
    });

    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
      res.redirect(authUrl);
    } else {  //req.query.error == 'access_denied'
      res.send('access denied');
    }
  }
  // If this branch executes user is already being redirected back with
  // code (whatever that is)
  else {
    console.log("Oauth successful, the code (whatever it is) is: ", req.query.code);
    // code is set
    // we'll send that and get the access token
    graph.authorize({
      "client_id":      conf.client_id,
      "redirect_uri":   conf.redirect_uri,
      "client_secret":  conf.client_secret,
      "code":           req.query.code
    }, function (err, facebookRes) {
      graph.setAccessToken(facebookRes.access_token);
      conf.access_code = facebookRes.access_token;
      console.log("Access code set to: ", conf.access_code);
      res.redirect('/home');
    });
  }
});


app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.

    console.log("Checking for notifications...");
    // Do notification check
    NotificationChecker.checkForNotifications(req);

    res.redirect('/dashboard');
  });

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
