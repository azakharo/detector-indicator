'use strict';

const exec = require('child_process').exec;
var express = require('express');
var app = express();

const MODE_UNDEF = 'UNDEFINED';
const MODE_WORK = 'WORK';
const MODE_EVENT = 'EVENT';

const MY_DEBUG = false;

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
  setEventMode();
  res.status(200).send('OK');
});

// Request handlers
///////////////////////////////////////////////////////////


function setWorkMode() {
  if (detectorMode == MODE_WORK) { // already there
    return;
  }
  log('set work mode');
  clearTimers();
  detectorMode = MODE_WORK;
  switchIndicatorOn();
  timerOn = setInterval(switchIndicatorOn, 3000);
  timerDelay = setTimeout(function () {
    switchIndicatorOff();
    timerOff = setInterval(switchIndicatorOff, 3000)
  }, 500);
  log('set work mode - DONE');
}

function resetWorkMode() {
  if (detectorMode == MODE_UNDEF) { // already there
    return; // do nothing
  }
  log('reset work mode');
  clearTimers();
  detectorMode = MODE_UNDEF;
  switchIndicatorOff();
  log('reset work mode - DONE');
}

function setEventMode() {
  if (detectorMode == MODE_UNDEF) { // ignore
    return;
  }
  log('set event mode');
  clearTimers();
  detectorMode = MODE_EVENT;
  switchIndicatorOn();
  timerOn = setInterval(switchIndicatorOn, 650);
  timerDelay = setTimeout(function () {
    let iterCount = 0;
    switchIndicatorOff();
    timerOff = setInterval(function () {
      switchIndicatorOff();
      iterCount += 1;
      if (iterCount === 2) {
        clearTimers();
        setWorkMode();
      }
    }, 600)
  }, 300);
  log('set event mode - DONE');
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


//*********************************************************
// Phys actions for indicator

function switchIndicatorOn() {
  if (MY_DEBUG) {
    log('ON');
  }
  else {
    writeIndicatorState(1);
  }
}

function switchIndicatorOff() {
  if (MY_DEBUG) {
    log('OFF');
  }
  else {
    writeIndicatorState(0);
  }
}

function writeIndicatorState(state) {
  const child = exec(`echo ${state} | sudo tee /sys/class/gpio/gpio4_pi5/value`,
      (error, stdout, stderr) => {
        //console.log(`stdout: ${stdout}`);
        //console.log(`stderr: ${stderr}`);
        if (error !== null) {
          console.log(`exec error: ${error}`);
        }
      });}

// Phys actions for indicator
//*********************************************************


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


///////////////////////////////////////////////////////////
// Utils

function log(msg) {
  console.log(msg);
}
