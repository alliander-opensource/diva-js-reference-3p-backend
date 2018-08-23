# diva-js-reference-3p-backend

This repository contains an example/reference backend implementation that uses the DIVA SDK [diva-irma-js](https://github.com/Alliander/diva-irma-js) to easily integrate [IRMA attributes](https://privacybydesign.foundation/irma-verifier/) into NodeJS based applications.

For a compatible frontend example see [diva-js-reference-3p-frontend](https://github.com/Alliander/diva-js-reference-3p-frontend).

IRMA is a decentralized, attribute-based Identity Management protocol that allows easy and fine-grained authentication (and based on specific attributes) authorization. Attributes are issued by trusted issuers and therefore provide easy validation of users.

## Features

This backend in particular demonstrates:
- How attribute based authentication can be integrated into a backend application using [diva-irma-js](https://github.com/Alliander/diva-irma-js).
- How attribute based authorization can be integrated into a backend application using [diva-irma-js](https://github.com/Alliander/diva-irma-js).
- How attribute-based signatures can be integrated into a backend application using [diva-irma-js](https://github.com/Alliander/diva-irma-js).
- How issuing of attributes can be integrated into a backend application using [diva-irma-js](https://github.com/Alliander/diva-irma-js).
- How to integrate DIVA session management with express application session management.

# Using the DIVA Library

Diva-irma-js consists of three main components, see [this repo](https://github.com/Alliander/diva-irma-js) for details, specifically the [README.md](https://github.com/Alliander/diva-irma-js#diva-irma-js).

## DIVA session management

We use DIVA for storing our sessions, as well as a simple session module (see [src/modules/simple-session.js](https://github.com/Alliander/diva-js-reference-3p-backend/blob/master/src/modules/simple-session.js)).

It can make use of Redis for session storage, see below.

We initialize this library in the following way:

```
    const divaSession = require('diva-irma-js/session'); // Import from diva
    const divaStateOptions = {};                         // Set options, see src/config.js / below for Redis ENV vars
    divaSession.init(divaStateOptions);                  // Init module (this will create the actual in-mem or Redis store)
```

## DIVA express middleware components

DIVA Express supplies express middleware to control identity requirements for API endpoints.
For example to require the `irma-demo.MijnOverheid.address.street` and `irma-demo.MijnOverheid.address.city` attributes,

It requires a fully initialized divaSession object, see above. After that, this library can be imported in the following way:

```
    const divaExpress = require('diva-irma-js/express');
```

Then it can be used on endpoint routes like this:

```
    app.use('/api/images/address.jpg', require('./actions/get-address-map'));
```

which becomes:

```
    app.use('/api/images/address.jpg', divaExpress.requireAttributes(divaSession, ['irma-demo.MijnOverheid.address.street', 'irma-demo.MijnOverheid.address.city']), require('./actions/get-address-map'));
```

## DIVA IRMA js

To start IRMA sessions (which require communication with the IRMA Api Server), we use diva-irma-js. This requires a configured IRMA Api Server, see below.

After configuring it correctly, it can be used like this:

```
    const diva = require('diva-irma-js');       // Import diva library
    const divaStateOptions = {};                // divaStateOptions are needed here as well
    const divaOptions = {                       // Options for ApiServer communication
      ...divaStateOptions,
    };
    diva.init(divaOptions);                     // Init Diva library
```

Then, it can be used in an endpoint, see [src/actions/start-irma-session.js](https://github.com/Alliander/diva-js-reference-3p-backend/blob/develop/src/actions/start-irma-session.js) for an example, which is simplified:

```
    const diva = require('diva-irma-js');
    function(req,res) {
      return diva.startDisclosureSession(content, 'Attribute label', req.sessionId)  // See http://credentials.github.io/protocols/irma-protocol/#verification on how to define content,
        .then(irmaSessionData => res.json(irmaSessionData));                         //  req.sessionId can be any string to recognize this session.
    }
```

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
    -----END RSA PRIVATE KEY-----"    # Only needed for signed requests, the default Docker Irma Api Server doesn't need this!
    export BING_MAPS_API_KEY='key'    # Optional if you don't want to see a nice Map
```

### IRMA API server

This DIVA reference implementation requires an instance of the [IRMA API server](https://github.com/credentials/irma_api_server) to be started as a separate application alongside it. Configure the communication between the IRMA API server and the DIVA reference implementation by setting the following environment variables:

- `IRMA_API_SERVER_URL`: the url where the api server is reachable
- `IRMA_API_SERVER_PUBLIC_KEY`: the public key of the IRMA API server (as configured in the IRMA API server)
- `IRMA_API_SERVER_KEY`: the private key of the DIVA reference implementation (the corresponding public key should be added to the IRMA API server configuration)

To run your own local IRMA API SERVER, see its [README](https://github.com/privacybydesign/irma_api_server/blob/master/README.md). We recommend running it with [Docker](https://github.com/privacybydesign/irma_api_server#running-with-docker), because that saves a lot of configuration. The 'Running With Docker tutorial' also shows a script that will generate the required public key.

### Redis

By default, the DIVA reference implementation runs with `in memory` session management. In order to make the DIVA reference implementation stateless, a [Redis](https://redis.io/) instance can be used for state management. To configure communication with Redis, set the following environment variables:

- `USE_REDIS`: "true"
- `REDIS_HOST`: the url where the redis instance can be reached
- `REDIS_PORT`: the port where the redis instance can be reached
- `REDIS_PASSWORD`: the password as configured in redis

### Bing maps API key

The MyHome example in the [diva-js-reference-3p-frontend](https://github.com/Alliander/diva-js-reference-3p-frontend) frontend displays a map image that uses the Bing maps API through this backend. To make it work, provide your own private bing maps api key as an export, or set a placeholder (of course then the Bing API won't work correctly). A Bing maps key can be obtained from [Bing](https://msdn.microsoft.com/en-us/library/ff428642.aspx).

## Logging

Both this reference implementation as well as diva-irma-js use [log4js](https://www.npmjs.com/package/log4js) as a logger. By default no logs are printed. By setting `LOG_LEVEL` and `DIVA_LOG_LEVEL` (or by setting their values in `src/config.js`), both this reference implementation and the Diva library can be set to log events to stdout. See [here](https://www.npmjs.com/package/log4js#usage) for the available log levels, where TRACE will provide the most fine-grained debug statements.

## Tests

The tests for the backend require a working and configured IRMA Api Server, which is hard to do in a CI-environment. Therefore, tests aren't run yet automatically yet. To some degree, basic tests for the backend are possible. We could also create a mock client, but that would require hooking in to [irmago](https://github.com/privacybydesign/irmago) for the client part. Scanning QR codes is hard to test and brittle in CI.

## IRMA

For more information about IRMA, see: https://privacybydesign.foundation/irma/

The IRMA client apps can be downloaded from their respective app stores:

- [Apple App Store](https://itunes.apple.com/nl/app/irma-authentication/id1294092994?mt=8)
- [Google Play Store](https://play.google.com/store/apps/details?id=org.irmacard.cardemu)

Other components in the IRMA ecosystem include:

- [IRMA Android/iOS app](https://github.com/privacybydesign/irma_mobile)
- [IRMA API server](https://github.com/privacybydesign/irma_api_server)
