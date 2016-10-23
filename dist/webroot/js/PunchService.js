var tetra = require('./libs/tetra/tetra.js'), //includes the tetra library
contactLessService = tetra.service({  //Instantiates service 
  service: 'local.device.contactless0', 
  namespace: 'ingenico.device.contactless'
});

function PunchService() {
  this._txnTotal = 0;
  this._points = 0;
  this._customer = null;
  this._uid = null;
  
  // Call parent class init method
  this.init();
  
  // For customized feedback / view manipulation
  this._postCreate();
  
  // Pretty self-explanatory
//  this._grabUID();
}

PunchService.prototype = new StartEndService();

//PunchService.prototype._grabUID = function() {
//  
//}

PunchService.prototype._postCreate = function() {
  
  document.getElementById("the_button").addEventListener( "mouseup", function() {
    contactLessService
      .reset() // Reset service
      .call('GetUid', { requestDelay: 0 }) // Call the GetUid method
      .success(function(r) {
        //Handle a successful UID retrieval
        console.log(r);
        window.print();
      });
  });
}

PunchService.prototype.showView = function(viewID) {
  var views = ["listening", "on-start", "on-end"];
  
  for(var v = 0; v < views.length; v++) {
    document.getElementById(views[v]).className = (viewID == views[v] ? "" : "hidden");
  }
}