const functions = require('firebase-functions');
var admin = require("firebase-admin");


const webpush = require('web-push');
const express = require('express');
const bodyParser = require('body-parser');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

// Fetch the service account key JSON file contents
var serviceAccount = require("./key.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://my-proj-c0a27.firebaseio.com",
});

const app = express();
app.use(bodyParser.json());

webpush.setVapidDetails(
    'mailto:john.gorter@gmail.com',
    "BIhEAaJ_CafHwMzJ4Be3-4oyPTeyQsmND5CL7txodaTE2h85pqxvYConMuRTwUb01ta4SJyou8it8whn77EYvds",
    "ZdsgsCGch7A0lydCVCQwrTRcWAiRbL_E6GIxigB77ZU"
  );


// let registerPushSubscription = functions.https.onRequest((request, response) => {
//     let sub = JSON.parse(request.body);
//     // Get a database reference to our subscriptions
//     var db = admin.database();
//     var ref = db.ref("subscriptions");
//     ref.on('value', s => {
//         console.log("subscriptions gotten");
//         if (s){
//             console.log("data from subscriptions gotten", s);
//             let recordobject = s.val(); 
//             if (recordobject) { 
//                 console.log("recordobject retrieved", recordobject);
//                 let records = Object.keys(recordobject).map(e => recordobject[e]);
//                 records.forEach(record => {
//                     if (record.deviceId == sub.deviceId){
//                         console.log("removing", `subscriptions/${ Object.keys(recordobject)[0]}`);
//                         db.ref(`subscriptions/${ Object.keys(recordobject)[0]}`).remove();
//                     } 
//                 });
//             }
//         }
//         console.log("adding new subscription");
//         ref.push(sub);
//     });
//     console.log('added subscription to list 2');
//     response.end();
// });


let triggerStatus = functions.database.ref("/projects/").onUpdate((event) => {
    var eventSnapshot = event.data;
    console.log('snapshot', eventSnapshot.hasChildren());
    eventSnapshot.forEach((s) => {
        if (s.changed()) {  
            let payload = '' + s.child('title').val() + ' status set to ' + s.child('status').val();
            var db = admin.database();
            var ref = db.ref("subscriptions");
            ref.on('value', snapshot => {
                console.log('entries:', snapshot.val());
                let obj = snapshot.val();
                let subs = Object.keys(obj).map(e => obj[e]);
                subs.forEach(sub => {
                    console.log('sending: '+ payload + ' to: ' + sub.endpoint);
                    webpush.sendNotification(sub, payload); 
                });
            });
        }   
    });
  
    return Promise.resolve();
});

module.exports = {
   // registerPushSubscription, 
    triggerStatus
};