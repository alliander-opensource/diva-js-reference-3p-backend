FROM node:8.6

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./

RUN yarn

RUN npm install -g nodemon

# Bundle app source
COPY . .
