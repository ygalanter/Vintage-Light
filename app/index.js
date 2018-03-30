// importing libraries
import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { battery } from "power";
import { me as device } from "device";
import * as messaging from "messaging";
import * as fs from "fs";
import { me } from "appbit";
import { goals, today } from "user-activity";
import dtlib from "../common/datetimelib"

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


// on app exit collect settings 
me.onunload = () => {
  fs.writeFileSync("user_settings.json", userSettings, "json");
}


// Message is received
messaging.peerSocket.onmessage = evt => {
  
  switch (evt.data.key) {
     case "complication1":
     case "complication2":
          userSettings[evt.data.key] = JSON.parse(evt.data.newValue).values[0].value;
          setActivityIcon(evt.data.key);
          updateActivity(evt.data.key);
          break;
  };
}

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.close = () => {
  console.log("App Socket Closed");
};



// trying to get user settings if saved before
let userSettings;
try {
  userSettings = fs.readFileSync("user_settings.json", "json");
} catch (e) {
  userSettings = {complication1: "steps", complication2: "battery"}
}


//trap
if (!userSettings.compication1) {
  userSettings = {complication1: "steps", complication2: "battery"}
}

function setActivityIcon(complication) {
  doc.complication_icon[complication].href = `icons/${userSettings[complication]}.png`;
}


function updateActivity(complication) {
  let activity = userSettings[complication];
  let max, current
  
  if (activity == 'battery') {
    max = 100;
    current = battery.chargeLevel;
  } else {
    max = goals[activity];
    current = today.local[activity];
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
  
  // console.log(activity);
  // console.log(current);
  // console.log(max);
  
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
clock.granularity = "minutes";

// Update the clock every tick event
clock.ontick = (evt) => {
  let today = evt.date;
  
  // getting 0-prepended day of the month
  let day = dtlib.zeroPad(today.getDate());
  doc.datelbl.text = day;
  
  updateActivity("complication1");
  updateActivity("complication2");
  
}
