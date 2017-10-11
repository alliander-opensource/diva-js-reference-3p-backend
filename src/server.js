const express = require('express');
const passport = require('passport');
const diva = require('diva-irma-js');
const DivaCookieStrategy = require('passport-diva');
const cookieParser = require('cookie-parser');
const cookieEncrypter = require('cookie-encrypter');

// TODO: get these from config
const port = 4000;
const cookieSecret = 'StRoNGs3crE7';

const app = express();
app.use(cookieParser(cookieSecret));
app.use(cookieEncrypter(cookieSecret));

app.use(passport.initialize());
passport.use(new DivaCookieStrategy());
app.use(passport.authenticate('diva', { session: false }));
// Note: session is set to false to be stateless.
// Optionally passport provides ways to serialize session data so the cookies are smaller.


app.get('/api/authenticate', require('./actions/authenticate'));
app.get('/api/get-session', require('./actions/get-session'));
app.get('/api/deauthenticate', require('./actions/deauthenticate'));

app.use('/api/only-for-x', diva.requireAttribute("x"), require('./actions/only-for-x'));

app.listen(port, () => {
  console.log(`Diva Reference Third Party backend listening on port ${port} !`); // eslint-disable-line no-console
  console.log(`Diva version ${diva.version()}`); // eslint-disable-line no-console
});
