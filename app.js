'use strict';

var express = require('express');
var app = express();

const MODE_UNDEF = 'UNDEFINED';
const MODE_WORK = 'WORK';
const MODE_EVENT = 'EVENT';

let detectorMode = MODE_UNDEF;


///////////////////////////////////////////////////////////
// Request handlers

app.get('/set-work-mode', function (req, res) {
  log('set work mode');
  res.status(200).send('OK');
});

app.get('/reset-work-mode', function (req, res) {
  log('reset work mode');
  res.status(200).send('OK');
});

app.get('/set-event-mode', function (req, res) {
  log('set event mode');
  res.status(200).send('OK');
});

// Request handlers
///////////////////////////////////////////////////////////


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


///////////////////////////////////////////////////////////
// Utils

function log(msg) {
  console.log(msg);
}