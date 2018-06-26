'use strict';

var util = require('util');
const uuidv4 = require('uuid/v4');

const PubSub = require('@google-cloud/pubsub');
const projectId = 'citric-lead-197512';
const pubsubClient = new PubSub({
  projectId: projectId,
});

module.exports = {
  subscriptionCreate,
  subscriptionPull
};

function subscriptionCreate(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var subscriptionObj = req.swagger.params.subscription.value;
  var topic = req.swagger.params.topic.value;

  subscriptionObj.id = uuidv4()

  // Creates a new subscription
  pubsubClient.topic(topic)
  .createSubscription(subscriptionObj.name)
  .then(results => {
    const subscription = results[0];
    console.log(`Subscription ${subscription.name} created.`);
    res.json(subscriptionObj);
  })
  .catch(err => {
    console.error('ERROR:', err);
    res.json(err)
  });
}

function subscriptionPull(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var subscriptionName = req.swagger.params.subscription.value;
  var topic = req.swagger.params.topic.value;

  var events = [];

  const subscription = pubsubClient.subscription(subscriptionName);

  let messageCount = 0;
  const messageHandler = message => {
    console.log("msg received", message.data.toString())
    events.push(JSON.parse(message.data.toString()));
    message.ack();
  };

  // Listen for new messages until timeout is hit
  subscription.on(`message`, messageHandler);
  setTimeout(() => {
    subscription.removeListener('message', messageHandler);

    res.json(events);

  }, 1000);
}
