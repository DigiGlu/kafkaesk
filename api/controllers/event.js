'use strict';

var util = require('util');
const uuidv1 = require('uuid/v1');

module.exports = {
  eventCreate: eventCreate
};

function eventCreate(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var eventObj = req.swagger.params.event.value;

  eventObj.id = uuidv1()

  res.json(eventObj);
}
