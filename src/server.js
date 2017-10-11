const express = require('express');
const diva = require('diva-irma-js');

const app = express();

const port = 4000;

app.listen(port, () => {
  console.log(`Diva Reference Third Party backend listening on port ${port} !`); // eslint-disable-line no-console
  console.log(`Diva version ${diva.version()}`); // eslint-disable-line no-console
});
