'use strict';

var express = require('express');
var app = express();

const MODE_UNDEF = 'UNDEFINED';
const MODE_WORK = 'WORK';
const MODE_EVENT = 'EVENT';

let detectorMode = MODE_UNDEF;
let timerOn = null;
let timerOff = null;
let timerDelay = null;


///////////////////////////////////////////////////////////
// Request handlers

app.get('/set-work-mode', function (req, res) {
  setWorkMode();
  res.status(200).send('OK');
});

app.get('/reset-work-mode', function (req, res) {
  resetWorkMode();
  res.status(200).send('OK');
});

app.get('/set-event-mode', function (req, res) {
  log('set event mode');
  res.status(200).send('OK');
});

// Request handlers
///////////////////////////////////////////////////////////


function setWorkMode() {
  if (detectorMode == MODE_WORK) { // already there
    return;
  }
  clearTimers();
  detectorMode = MODE_WORK;
  switchIndicatorOn();
  timerOn = setInterval(switchIndicatorOn, 3000);
  timerDelay = setTimeout(function () {
    timerOff = setInterval(switchIndicatorOff, 3000)
  }, 500);
  log('set work mode - DONE');
}

function resetWorkMode() {
  if (detectorMode == MODE_UNDEF) { // already there
    return; // do nothing
  }
  clearTimers();
  detectorMode = MODE_UNDEF;
  switchIndicatorOff();
  log('reset work mode - DONE');
}

function clearTimers() {
  if (timerDelay) {
    clearTimeout(timerDelay);
    timerDelay = null;
  }
  if (timerOn) {
    clearInterval(timerOn);
    timerOn = null;
  }
  if (timerOff) {
    clearInterval(timerOff);
    timerOff = null;
  }
}

function switchIndicatorOn() {
  log('ON');
}

function switchIndicatorOff() {
  log('OFF');
}


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


///////////////////////////////////////////////////////////
// Utils

function log(msg) {
  console.log(msg);
}
