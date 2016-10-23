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
   
   function updateLoyaltyPoints(covered, amountDue, vaultID) {
     fetch('https://loyaltyprogram.herokuapp.com/memberships', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({covered, amountDue, vaultId})
    })
    .then((response) => {
      return response.json()})
    .then((responseJson) => {
      return responseJson.complete
    })
    .catch((error) => {
      console.error(error);
    }); 
   }
   
   function moveOn() {
     service.sendResponse();
     tetra.weblet.hide();
   }
   
//   document.getElementById("opt-out").addEventListener("mouseup", function(e) {
//     moveOn();
//   });
   
   // Get Uid
   
   var contactLessService = tetra.service({ // Instantiate service
     service: 'local.device.contactless0', 
     namespace: 'ingenico.device.contactless'
   });
   
   function uidFormat(uidArr) {
     var uid = uidArr.join("");
     console.log(uid);
     fetch('https://loyaltyprogram.herokuapp.com/users', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(uid)
    })
    .then((response) => {
      return response.json()})
    .then((responseJson) => {
      if (responseJson.covered === "yes") {
        // render pay with loyalties page
        // send back covered, amount_due, vault_id

      } else if (responseJson.covered === "no") {
        // render tap to pay
      } else {
        // render Your account has been created and rewards have been updated
      }
    })
    .catch((error) => {
      console.error(error);
    });
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