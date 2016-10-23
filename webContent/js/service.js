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
   
   function moveOn() {
     service.sendResponse();
     tetra.weblet.hide();
   }
   
   document.getElementById("opt-out").addEventListener("mouseup", function(e) {
     moveOn();
   });
   
   // Get Uid
   
   var contactLessService = tetra.service({ // Instantiate service
     service: 'local.device.contactless0', 
     namespace: 'ingenico.device.contactless'
   });
   
   function uidFormat(uidArr) {
     var uid = uidArr.join("");
     console.log(uid);
   }
   
   function isCustomerLoyal () {
     // Using our API
   }
   
   function punchCard(r) {
     var number = uidFormat(r['uid']);
     console.log(number);
//     service.sendResponse();
//     tetra.weblet.hide();
     moveOn();
   }
   
   function getCardInformations() {
     contactLessService
       .reset() // Reset service
       .call('GetUid', {requestDelay: 250}) //Call GetUid method
       .success(function(r) {
          punchCard(r);
//          service.sendResponse();
//          tetra.weblet.hide();
       })
       .close()
       .disconnect()
   }
   
   contactLessService     
     .reset() // Reset service     
     .disconnect() // Disconnect from s`  ervice     
     .connect() // Connect to service     
     .close() // Close service     
     .open() // Open service     
     .on('ClessDetectedEvent', function (r)  { // Listen to ClessDetectedEvent
      console.log('Card detected');
      return getCardInformations();
     })     
     .call('StartDetection', {data: {timeout: 10000}}) // Call start detection method
     .then(function (r) {        
          console.log('Please approach your card');     
      }, function (e) {        
          console.log(e)     
   });
//  service.sendResponse();
//  tetra.weblet.hide(); 
 }
});
//  service.sendResponse();
 // tetra.weblet.hide();