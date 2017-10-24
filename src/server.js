const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieEncrypter = require('cookie-encrypter');
const diva = require('diva-irma-js');
const simpleSession = require('./modules/simple-session');
const config = require('./config');

const app = express();
app.use(cookieParser(config.cookieSecret));
app.use(cookieEncrypter(config.cookieSecret));

app.use(simpleSession);

app.use(bodyParser.text()); // TODO: restrict to one endpoint

app.get('/api/get-session', require('./actions/get-session'));
app.get('/api/deauthenticate', require('./actions/deauthenticate'));
app.post('/api/complete-disclosure-session/:sessionToken', require('./actions/complete-disclosure-session'));

app.get('/api/start-disclosure-session', require('./actions/start-disclosure-session'));

app.use('/api/only-for-x', diva.requireAttribute('pbdf.pbdf.idin.gender'), require('./actions/only-for-x'));

app.listen(config.port, () => {
  console.log(`Diva Reference Third Party backend listening on port ${config.port} !`); // eslint-disable-line no-console
  console.log(`Diva version ${diva.version()}`); // eslint-disable-line no-console
});
