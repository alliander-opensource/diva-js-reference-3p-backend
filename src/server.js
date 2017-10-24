const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieEncrypter = require('cookie-encrypter');
const diva = require('diva-irma-js');
const simpleSession = require('./modules/simple-session');
const config = require('./config');

diva.init({
  baseUrl: 'http://localhost:4000',
  apiKey: 'FILL_IN',
  irmaApiServerUrl: 'https://dev-diva-irma-api-server.appx.cloud',
  irmaApiServerPublicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAql7fb0EMMkqKcXIuvCVb
P+V1qV6AIzhxFlBO8k0GLogMUT6UXJSnXQ3P7iTIfr+/5+yf4dfKNHhalphe+2OB
zspt6zymteKAuQ9/NwUNGTSP4l8mD8wQb5ZyiNMUt6leu42SPe/7uOtcRA6AzN2L
6eKNqUGpNvQZTVwEFNNNiChqrkmQVnoyWVe6fHHooxTCtIyXWJY2WqC8lYStIbZc
NP5xwUdLGOuGo41T7Q+wkR5KqXDif+FKoR7qlG7jEUHcbd1OQe7b6DxzSHCI65Bw
TIZwMj2LtEwB6Op7vemHkeNaPAYK33t5kdyq+P55KMDuJgj+nxpFO00U4msD+CRa
7QIDAQAB
-----END PUBLIC KEY-----`,
});

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
