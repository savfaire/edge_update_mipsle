function saveEdgeVersion(req, resp) {
  ClearBlade.init(
    {
      systemKey:req.systemKey,
      systemSecret:req.systemSecret,
      authToken:req.userToken,
      email:req.userEmail,
      URI: UPDATE_PLATFORM_URI
    }
  );

  var payload;

  //We need special handling to correctly build the payload for messages
  //received from triggers.
  if (!!req.params.trigger && !!req.params.body) {
    if (req.params.body === "{}") {
      resp.success("noop - body empty, datasource emptied in portal");
      //return;
    } else {
      payload = JSON.parse(req.params.body)

      //Add the edgeId from the topic into the payload
      if (!!req.params.topic) {
        var match = req.params.topic.match(/edge\/update\/(.+)\/response/);
        if (match != null) {
          payload.edgeId = match[1];
        }
      }
    }
  } else {
    payload = req.params;
  }

  //get a Requests object
  var requestObject = Requests();

  //Login to the platform anonymously to get an auth token
  ClearBlade.loginAnon(function(err, body) {
		if(err) {
			resp.error("Anonymous login failure: " + JSON.stringify(body));
		} else {
			
      //Update the edge using the REST API
      var options = {
        "uri":ClearBlade.URI + "/api/v/3/edges/" + req.systemKey + "/" + payload.edgeId,
        "body": {"last_seen_version":payload.version},
        "headers": {"Content-Type" : "application/json","ClearBlade-UserToken": body.authToken},
        "timeout":30,
        "strictSSL":false,
        "full": true  
      }

      requestObject.put(options,function(err, data){
        if(err){
          resp.error("Unable to update Edge: " + JSON.stringify(err))
        }
        resp.success(data)
      });
		}
	});
}

