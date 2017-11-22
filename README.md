# diva-js-reference-3p-backend

This repository contains an example/reference backend implementation that uses the DIVA SDK [diva-irma-js](https://github.com/Alliander/diva-irma-js) to easily integrate [IRMA attributes](https://privacybydesign.foundation/irma-controleur/) into NodeJS based applications.

For a compatible frontend example see [diva-js-reference-3p-frontend](https://github.com/Alliander/diva-js-reference-3p-frontend).

IRMA is a decentralized, attribute based Identity Management protocol that allows easy and fine-grained authentication (and based on specific attributes) authorization. Attributes are issued by trusted issuers and therefore provide easy validation of users.

## Features

This backend in particular demonstrates
- How attribute based authentication can be integrated into a backend application using [diva-irma-js](https://github.com/Alliander/diva-irma-js).
- How attribute based authorization can be integrated into a backend application using [diva-irma-js](https://github.com/Alliander/diva-irma-js).
- How to integrate DIVA session management with express application session management.

# DIVA middleware components

DIVA supplies express middleware to control identity requirements for API endpoints.
For example to require the `pbdf.pbdf.idin.address` and `pbdf.pbdf.idin.city` attributes,

```
app.use('/api/images/address.jpg', require('./actions/get-address-map'));
```

becomes

```
app.use('/api/images/address.jpg', diva.requireAttributes(['pbdf.pbdf.idin.address', 'pbdf.pbdf.idin.city']), require('./actions/get-address-map'));
```

Note: for simple use cases there is also the `diva.requireAttribute()` middleware method.

## Running the application

- Checkout the code
- `npm install`
- `npm start`

Note: for development, user `npm run dev` to run the application in development mode with hot reloading.

## Tests

There are currently no tests for the backend.

## IRMA

For more information about IRMA, see: https://privacybydesign.foundation/irma/

Other components in the IRMA ecosystem include:

- [IRMA Android app](https://github.com/credentials/irma_android_cardemu)
- [IRMA iOS app](https://github.com/credentials/irma_mobile)
- [IRMA API server](https://github.com/credentials/irma_api_server)
