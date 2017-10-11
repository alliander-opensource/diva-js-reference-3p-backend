const express = require('express');
const passport = require('passport');
const diva = require('diva-irma-js');
const DivaCookieStrategy = require('passport-diva');
const cookieParser = require('cookie-parser');
const cookieEncrypter = require('cookie-encrypter');

const port = 4000;
const secretKey = 'StRoNGs3crE7'; // TODO: use secure password from config
const divaCookieName = 'diva-session';
const cookieSettings = {
  httpOnly: true,
  maxAge: 300000,
  sameSite: true,
  signed: true,
  secure: false, // TODO: NOTE: must be set to true and be used with HTTPS only!
};

const app = express();
app.use(cookieParser(secretKey));
app.use(cookieEncrypter(secretKey));

app.use(passport.initialize());
passport.use(new DivaCookieStrategy());
app.use(passport.authenticate('diva', { session: false }));
// Note: session is set to false to be stateless.
// Optionally passport provides ways to serialize session data so the cookies are smaller.

app.get('/authenticate', (req, res) => {
  // Process proofs
  let proofs;
  if (req.query.proof) {
    // Force array of proofs
    if (!Array.isArray(req.query.proof)) {
      proofs = [req.query.proof];
    } else {
      proofs = req.query.proof;
    }

    // TODO: Check proofs

    // Add proofs to session sessionState
    proofs.forEach((proof) => {
      diva.addProof(req.divaSessionState, proof);
    });
  }
  res.cookie(divaCookieName, req.divaSessionState, cookieSettings);

  // Display session state
  return res.json(req.divaSessionState);
});

app.listen(port, () => {
  console.log(`Diva Reference Third Party backend listening on port ${port} !`); // eslint-disable-line no-console
  console.log(`Diva version ${diva.version()}`); // eslint-disable-line no-console
});
