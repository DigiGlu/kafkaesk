'use strict';

var util = require('util');
const uuidv4 = require('uuid/v4');

const PubSub = require('@google-cloud/pubsub');
const projectId = 'citric-lead-197512';
const pubsubClient = new PubSub({
  projectId: projectId,
});

// LOGGING with WinstonJS
const winston = require('winston');
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      timestamp: true,
      handleExceptions: true,
      colorize: false,
    })
  ]
});

module.exports = {
  eventCreate: eventCreate
};

function eventCreate(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var eventObj = req.swagger.params.event.value;
  var topic = req.swagger.params.topic.value;

  eventObj.id = uuidv4()

  const dataBuffer = Buffer.from(JSON.stringify(eventObj));

  pubsubClient.topic(topic)
  .publisher()
  .publish(dataBuffer)
  .then(messageId => {
    logger.info("Message published", {messageId: messageId});
    res.json(eventObj);
  })
  .catch(err => {
    console.error('ERROR:', err);
    res.json(err)
  });
}
