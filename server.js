'use strict';

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

var fuelConsumption = 0.0;
var tonnage = 0.0;
var throughput = 0.0;
var teamTonnage = 1000.0;
var totalTonage = 0;
var currentCycleTimeMin = 0;
var currentCycleTimeSec = 0;
var avgCycleTimeMin = 0;
var avgCycleTimeSec = 0;
var cycleCount = 0;

function setFuelConsumption() {
    var min = 0.0;
    var max = 100.0;
    fuelConsumption = Math.random() * (max - min) + min;
}

function setTonnage() {
    var min = 13.0;
    var max = 24.0;
    tonnage = Math.random() * (max - min) + min;;
};

function setTotalTonnage() {
    totalTonage += tonnage;
}

function setThroughput() {
    var min = 350.0;
    var max = 500.0;
    throughput = Math.random() * (max - min) + min;
    setTimeout(setThroughput, 10000);
};

function setTeamTonnage() {
    teamTonnage += tonnage;
    setTotalTonnage();
    setCurrentCycleTimeMin();
    setTimeout(setTeamTonnage, 5000);
};

function setCurrentCycleTimeMin() {
    currentCycleTimeSec += 1;
    if (currentCycleTimeSec > 60) {
        currentCycleTimeSec = 0;
        currentCycleTimeMin += 1;
    } 
};

function emitData() {
    setFuelConsumption();
    setTonnage();


    io.sockets.emit('data', {
        fuelConsumption: fuelConsumption, 
        tonnage: tonnage,
        totalTonage: totalTonage / 3,
        throughput: throughput,
        teamTonnage: teamTonnage,
        currentCycleTimeMin : currentCycleTimeMin,
        currentCycleTimeSec: currentCycleTimeSec,
        avgCycleTimeMin: avgCycleTimeMin,
        avgCycleTimeSec: avgCycleTimeSec,
        currentTime: new Date().getTime()
    });
    setTimeout (emitData, 1000);  
  }

io.sockets.on('connection', (socket) => {

  console.log('user connected');
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  setThroughput();
  setTeamTonnage();
  emitData();
});

http.listen(5000, () => {
  console.log('started on port 5000');
});