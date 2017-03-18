'use strict';

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let rand = new Random();

var fuelConsumption = 0.0;
var tonnage = 0.0;
var throughput = 0.0;
var teamTonnage = 1000.0;


var setFuelConsumption = function () {
    var min = 16.0;
    var max = 30.0;
    this.fuelConsumption = rand.nextFloat() * (max - min) + min;
};

var setTonnage = function () {
    var min = 13.0;
    var max = 24.0;
    this.tonnage = rand.nextFloat() * (max - min) + min;
};

var setThroughput = function () {
    var min = 350.0;
    var max = 500.0;
    this.throughput = rand.nextFloat() * (max - min) + min;
};

var teamTonnage = function () {
    this.teamTonnage += this.tonnage;
};

io.on('connection', (socket) => {
  console.log('user connected');
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  setTimeout(setTeamTonnage, 10000);

  setTimeout(function () {
    this.setFuelConsumption();
    this.setTonnage();
    this.setThroughput();

    io.emit('data', {
        fuelConsumption: this.fuelConsumption, 
        tonnage: this.tonnage,
        throughput: this.throughput,
        teamThroughput: this.teamThroughput,
        currentTime: new Date().getTime()
    });    
  }, 500);
    
});

http.listen(5000, () => {
  console.log('started on port 5000');
});