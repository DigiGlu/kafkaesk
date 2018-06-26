'use strict';

var util = require('util');
const uuidv4 = require('uuid/v4');

const PubSub = require('@google-cloud/pubsub');
const projectId = 'citric-lead-197512';
const pubsubClient = new PubSub({
  projectId: projectId,
});

module.exports = {
  topicCreate,
  topicFind
};

function topicCreate(req, res) {
  var topicObj = req.swagger.params.topic.value;

  topicObj.id = uuidv4();

  pubsubClient.createTopic(topicObj.name)
  .then(results => {
    const topic = results[0];
    console.log(`Topic ${topicObj.name} created.`);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });

  res.json(topicObj);
}

function topicFind(req, res) {
  var pageno = req.swagger.params.page.value ? parseInt(req.swagger.params.page.value) : 1;
  // Fixed page size for now

  const pagesize = 150

  const firstitem = (pageno-1)*pagesize
  const lastitem = firstitem + pagesize

  let baseUrl = req.url;

  if (req.url.indexOf("?")>1) {
    baseUrl = req.url.slice( 0, req.url.indexOf("?") );
  }

  // Get the documents collection
  pubsubClient.getTopics()
  .then(results => {
    const topics = results[0];
    const totalsize = topics.length

    // create HAL response

    var halresp = {};

    halresp._links = {
        self: { href: req.url },
        item: []
    }

    halresp._embedded = {item: []}
    halresp._embedded.item = topics

    // Add array of links
    topics.forEach( function( item ) {
        halresp._links.item.push( {
              href: baseUrl.concat( "/" ).concat( item.id )
            } )
    });

    // Pagination attributes

    halresp.page = pageno
    halresp.totalrecords = totalsize
    halresp.pagesize = pagesize
    halresp.totalpages = Math.ceil(totalsize/pagesize)

    // Create pagination links

    if ( totalsize > (pageno * pagesize) ) {
      halresp._links.next = { href: baseUrl.concat("?page=").concat(pageno+1)}
    }

    halresp._links.first = { href: baseUrl.concat("?page=1")}

    if ( pageno > 1 ) {
      halresp._links.previous = { href: baseUrl.concat("?page=").concat(pageno-1)}
    }

    halresp._links.last = { href: baseUrl.concat("?page=").concat(Math.ceil(totalsize/pagesize)) }

    res.json( halresp );
  })
  .catch(err => {
    console.error('ERROR:', err);
    res.json(err);
  });
}
