// Import modules
import asap from "fitbit-asap/companion";
import { settingsStorage } from "settings";


// A user changes settings
settingsStorage.onchange = evt => {
  
  //sending to device
  let data = {
    key: evt.key,
    newValue: evt.newValue
  };
  sendVal(data);
};


// Send data to device using ASAP API
function sendVal(data) {
  asap.send(data);
}