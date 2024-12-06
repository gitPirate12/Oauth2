const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');

const app = express();

// set view engine
app.set('view engine', 'ejs');

// Session configuration
app.use(
  session({
      secret: keys.session.cookieKey, // Use a secure secret
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
          mongoUrl: keys.mongodb.dbURI
      }),
      cookie: {
          maxAge: 24 * 60 * 60 * 1000 // 1 day
      }
  })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());


// connect to mongodb
mongoose.connect(keys.mongodb.dbURI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB:', err));

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
  res.render('home', { user: req.user || null }); // Pass the user or null
});


app.listen(3000, () => {
    console.log('app now listening for requests on port 3000');
});