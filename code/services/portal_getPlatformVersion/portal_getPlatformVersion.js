//We have to use a service to access the about API because
//the about API is not exposed on the ClearBlade object
//within a portal
function portal_getPlatformVersion(req, resp) {
  resp.success(ClearBlade.about().version);
}
