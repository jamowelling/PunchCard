var service = tetra.startEnd()
.on('SE_START',function(tlv,properties) {
  if(properties.isShortMode) {
    //do very short process
    this.sendResponse();
    return;
 }
 //can do long treatment
 else {
  tetra.weblet.show();

   
   // Get Uid
   
   var tetra = require('tetra.js'), // include tetra library     
       contactLessService = tetra.service({ // Instantiate service        
         service: 'local.device.contactless0',        
         namespace: 'ingenico.device.contactless'
       });
   
   function getCardInformations() {
     var aidCommand = ["00", "A4", "04", "00", "07", "A0", "00", "00", "00", "04", "10", "10", "00"];
     var PPSEreponse = [];
     
     contactLessService
        .reset() // Reset service
        .call('GetUid', {requestDelay: 0}) //Call GetUid method
        .success(function(r) {
          console.log(r);
        });
   }
   
 }

});

//  service.sendResponse();
 // tetra.weblet.hide();