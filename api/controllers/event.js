'use strict';

var util = require('util');
const uuidv4 = require('uuid/v4');

const PubSub = require('@google-cloud/pubsub');
const projectId = 'citric-lead-197512';
const pubsubClient = new PubSub({
  projectId: projectId,
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
    console.log(`Message ${messageId} published.`);
    res.json(eventObj);
  })
  .catch(err => {
    console.error('ERROR:', err);
    res.json(err)
  });
}
