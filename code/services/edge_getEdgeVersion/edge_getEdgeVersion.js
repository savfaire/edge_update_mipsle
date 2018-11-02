function edge_getEdgeVersion(req, resp) {
  ClearBlade.init({request:req});

  if(!ClearBlade.isEdge()) {
    log("Returning error: Service must be invoked on Edge");
    resp.success("Service must be invoked on Edge. isEdge() = false.");
  }

  var about = ClearBlade.about();

  //Publish message to platform
  log("Forwarding edge version payload to platform via message relay" );
  ClearBlade.Messaging().publish("edge/version/_platform", JSON.stringify({
    "edgeId": ClearBlade.edgeId(),
    "version": about.version,
    "buildId": about.buildId
    })
  );
  log("Payload sent to platform message relay");
  
  resp.success('Success');
}
