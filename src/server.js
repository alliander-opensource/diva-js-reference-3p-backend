const express = require('express');
const cookieParser = require('cookie-parser');
const cookieEncrypter = require('cookie-encrypter');
const diva = require('diva-irma-js');

// TODO: get these from config
const port = 4000;
const cookieSecret = 'StRoNGs3crE7';

const app = express();
app.use(cookieParser(cookieSecret));
app.use(cookieEncrypter(cookieSecret));
app.use(diva);


app.get('/api/authenticate', require('./actions/authenticate'));
app.get('/api/get-session', require('./actions/get-session'));
app.get('/api/deauthenticate', require('./actions/deauthenticate'));

app.get('/api/attributes-required', require('./actions/attributes-required'));

app.use('/api/only-for-x', diva.requireAttribute('pbdf.pbdf.idin.gender'), require('./actions/only-for-x'));

app.listen(port, () => {
  console.log(`Diva Reference Third Party backend listening on port ${port} !`); // eslint-disable-line no-console
  console.log(`Diva version ${diva.version()}`); // eslint-disable-line no-console
});
