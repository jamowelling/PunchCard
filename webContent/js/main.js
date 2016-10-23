var service = null;

function initService() {
  service = new PunchService();
}

document.addEventListener( "DOMContentLoaded", initService);




var tetra = require('./libs/tetra.js'); //includes the tetra library

contactLessService = tetra.service({  //Instantiates service 
  service: 'local.device.contactless0', 
  namespace: 'ingenico.device.contactless'
});

function grabUID() {
  
  contactLessService
    .reset()  //reset service
    .call('GetUid', { requestDelay: 0}) //call the GetUid method
    .success(function(r) {
      console.log(r); //Handle a successful UID retrieval
  })
}