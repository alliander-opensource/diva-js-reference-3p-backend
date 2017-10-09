const express = require('express');
const cookieParser = require('cookie-parser');
const cookieEncrypter = require('cookie-encrypter');

const diva = require('diva-irma-js');

const port = 4000;
const generateSessionId = () => 1; // TODO: generate sensible session ids
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

app.get('/authenticate', (req, res) => {
  // Load session state from encrypted cookie
  // NOTE: does some naive structural checks
  let sessionState;
  if (typeof req.signedCookies[divaCookieName] === 'undefined' ||
      typeof req.signedCookies[divaCookieName].user === 'undefined' ||
      typeof req.signedCookies[divaCookieName].user.sessionId === 'undefined' ||
      typeof req.signedCookies[divaCookieName].user.attributes === 'undefined') {
    sessionState = {
      user: {
        sessionId: generateSessionId(),
        attributes: [],
      },
    };
  } else {
    sessionState = req.signedCookies[divaCookieName];
  }

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
      sessionState.user.attributes.push(proof);
    });
  }
  res.cookie(divaCookieName, sessionState, cookieSettings);

  // Display session state
  return res.json(sessionState);
});

app.listen(port, () => {
  console.log(`Diva Reference Third Party backend listening on port ${port} !`); // eslint-disable-line no-console
  console.log(`Diva version ${diva.version()}`); // eslint-disable-line no-console
});
