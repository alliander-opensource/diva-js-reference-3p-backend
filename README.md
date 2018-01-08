# diva-js-reference-3p-backend

This repository contains an example/reference backend implementation that uses the DIVA SDK [diva-irma-js](https://github.com/Alliander/diva-irma-js) to easily integrate [IRMA attributes](https://privacybydesign.foundation/irma-verifier/) into NodeJS based applications.

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

Note: for development, use `npm run dev` to run the application in development mode with hot reloading.

Note: To use the map api functionality, the `BING_MAPS_API_KEY` environment variable must be set to a valid Bing maps API key.

## Dependencies

#### T.L.D.R minimal required env var exports:

```
export IRMA_API_SERVER_URL='https://url-to-irma-api-server'
export IRMA_API_SERVER_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
(...)
-----END PUBLIC KEY-----"
export IRMA_API_SERVER_KEY="-----BEGIN RSA PRIVATE KEY-----
(...)
-----END RSA PRIVATE KEY-----"
export BING_MAPS_API_KEY='key'
```

### IRMA API server

This DIVA reference implementation requires and instance of the [IRMA API server](https://github.com/credentials/irma_api_server) to be started as a separate application alongside it. Configure the communication between the IRMA API server and the DIVA reference implementation by setting the following environment variables:

- `IRMA_API_SERVER_URL`: the url where the api server is reachable
- `IRMA_API_SERVER_PUBLIC_KEY`: the public key of the IRMA API server (as configured in the IRMA API server)
- `IRMA_API_SERVER_KEY`: the private key of the DIVA reference implementation (the corresponding public key should be added to the IRMA API server configuration)

To run your own local IRMA API SERVER, see it's [README](https://github.com/privacybydesign/irma_api_server/blob/master/README.md)

### Redis

By default the DIVA reference implementation runs with `in memory` session management. In order to make the DIVA reference implementation stateless, a [Redis](https://redis.io/) instance can be used for state management. To configure communication with Redis, set the following environment variables:

- `USE_REDIS`: "true"
- `REDIS_HOST`: the url where the redis instance can be reached
- `REDIS_PORT`: the port where the redis instance can be reached
- `REDIS_PASSWORD`: the password as configured in redis

### Bing maps API key

The MyHome example in the [diva-js-reference-3p-frontend](https://github.com/Alliander/diva-js-reference-3p-frontend) frontend displays a map image that uses the Bing maps API through this backend. To make it work, provide your own private bing maps api key as an export, or set a placeholder (of course then the Bing API won't work correctly). A Bing maps key can be obtained from [Bing](https://msdn.microsoft.com/en-us/library/ff428642.aspx).

## Tests

There are currently no tests for the backend.

## IRMA

For more information about IRMA, see: https://privacybydesign.foundation/irma/

The IRMA client apps can be downloaded from their respective app stores:

- [Apple App Store](https://itunes.apple.com/nl/app/irma-authentication/id1294092994?mt=8)
- [Google Play Store](https://play.google.com/store/apps/details?id=org.irmacard.cardemu)

Other components in the IRMA ecosystem include:

- [IRMA Android app](https://github.com/credentials/irma_android_cardemu)
- [IRMA iOS app](https://github.com/credentials/irma_mobile)
- [IRMA API server](https://github.com/credentials/irma_api_server)
