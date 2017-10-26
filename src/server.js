const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieEncrypter = require('cookie-encrypter');
const diva = require('diva-irma-js');
const simpleSession = require('./modules/simple-session');
const config = require('./config');

diva.init({
  baseUrl: config.baseUrl,
  apiKey: config.apiKey,
  irmaApiServerUrl: config.irmaApiServerUrl,
  irmaApiServerPublicKey: config.irmaApiServerPublicKey,
  useRedis: config.useRedis,
  redisOptions: {
    host: config.redisHost,
    port: config.redisPort,
    password: config.redisPassword,
  },
});

const app = express();
app.use(cookieParser(config.cookieSecret));
app.use(cookieEncrypter(config.cookieSecret));

app.use(simpleSession);

app.use(bodyParser.text()); // TODO: restrict to one endpoint

app.get('/api/get-session', require('./actions/get-session'));
app.get('/api/deauthenticate', require('./actions/deauthenticate'));

app.get('/api/start-disclosure-session', require('./actions/start-disclosure-session'));
app.get('/api/disclosure-status', require('./actions/disclosure-status'));
app.post('/api/complete-disclosure-session/:sessionToken', require('./actions/complete-disclosure-session'));

app.use('/api/only-for-x', diva.requireAttributes(['pbdf.pbdf.idin.address']), require('./actions/only-for-x'));

app.listen(config.port, () => {
  console.log(`Diva Reference Third Party backend listening on port ${config.port} !`); // eslint-disable-line no-console
  console.log(`Diva version ${diva.version()}`); // eslint-disable-line no-console
});
