FROM node:8

# GCP credentials
ENV GOOGLE_CREDENTIALS="/config/google_credentials.json"
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

# Install app dependencies
RUN npm prune --production && npm install --production && npm rebuild grpc --force

EXPOSE 3000

# ENTRYPOINT ["/usr/local/bin/node", "app.js"]
CMD node app.js
