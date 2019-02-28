// importing libraries
import clock from "clock";
import document from "document";
import { battery } from "power";
import { goals, today } from "user-activity";
import dtlib from "../common/datetimelib";
import { preferences } from "fitbit-preferences";
import asap from "fitbit-asap/app";

//getting UI elements
const doc = {
  complication_icon: {
    complication1: document.getElementById("complication1icon"),
    complication2: document.getElementById("complication2icon")
  },
  complication_dial: {
    complication1: document.getElementById("compl1"),
    complication2: document.getElementById("compl2")
  },
  complication_dial_back: {
    complication1: document.getElementById("compl1back"),
    complication2: document.getElementById("compl2back")
  }, 
  complication_dial_center: {
    complication1: {x:66, y:150, r:35},
    complication2: {x:231, y:150, r:35}
  },   
  complication_circle: {
    complication1: document.getElementById("compl1circle"),
    complication2: document.getElementById("compl2circle")
  },
  datelbl: document.getElementById("date")
}

const second_hand = document.getElementById("second-hand");

// *** Begin Sweeeping animation of second hand

let callback = (timestamp) => {
  second_hand.groupTransform.rotate.angle = timestamp % 60000 * 3 / 500;
  requestAnimationFrame(callback);
}
requestAnimationFrame(callback);
// *** End Sweeeping animation of second hand

requestAnimationFrame(callback);
// *** End Sweeeping animation of second hand
// Message is received
asap.onmessage = data => {
  
  switch (data.key) {
     case "complication1":
     case "complication2":
          let newActivity = JSON.parse(data.newValue).values[0].value

          // skip unsupported activities, e.g. elevationGain on VL GM
          if (newActivity !== "battery" && today.adjusted[newActivity] === undefined) {
            return
          }

          preferences[data.key] = newActivity;
          setActivityIcon(data.key);
          updateActivity(data.key);
          break;
  };
}




// trying to get user settings if saved before
if (!preferences.complication1) {
  preferences.complication1 = "steps";
  preferences.complication2 = "battery";
}


function setActivityIcon(complication) {
  doc.complication_icon[complication].href = `icons/${preferences[complication]}.png`;
}


function updateActivity(complication) {
  let activity = preferences[complication];
  let max, current
  
  if (activity == 'battery') {
    max = 100;
    current = battery.chargeLevel;
  } else {
    max = goals[activity];
    current = today.adjusted[activity];
  }
  
  if (current >= max) {
    max = current
    doc.complication_dial[complication].style.fill = "#E24534";
    doc.complication_circle[complication].style.fill = "#E24534";
  } else {
    doc.complication_dial[complication].style.fill = "black";
    doc.complication_circle[complication].style.fill = "black";
  }
  let angle = 2*Math.PI*current/max - Math.PI/2;

  doc.complication_dial_back[complication].x1 = doc.complication_dial_center[complication].x + 
    doc.complication_dial_center[complication].r*Math.cos(angle);
  doc.complication_dial_back[complication].y1 = doc.complication_dial_center[complication].y + 
    doc.complication_dial_center[complication].r*Math.sin(angle);
  doc.complication_dial[complication].x1 = doc.complication_dial_center[complication].x +
    doc.complication_dial_center[complication].r*Math.cos(angle);
  doc.complication_dial[complication].y1 = doc.complication_dial_center[complication].y + 
    doc.complication_dial_center[complication].r*Math.sin(angle);
  
}

// setting initial activity icons
setActivityIcon("complication1");
setActivityIcon("complication2");


// Update the clock every minute
clock.granularity = "seconds";

// Update the clock every tick event
clock.ontick = (evt) => {
  let today = evt.date;
  
  // getting 0-prepended day of the month
  let day = dtlib.zeroPad(today.getDate());
  doc.datelbl.text = day;
  
  updateActivity("complication1");
  updateActivity("complication2");
  
}
