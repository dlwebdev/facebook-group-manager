
// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

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
    callbackURL: "http://localhost:3000/auth/twitter/callback"
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

// initialize the session
app.use(passport.initialize());
// start the session
app.use(passport.session());

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);

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
