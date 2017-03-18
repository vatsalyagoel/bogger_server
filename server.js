'use strict';

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

io.on('connection', (socket) => {

  var fuelConsumption = 0.0;
  var tonnage = 0.0;
  var throughput = 0.0;
  var teamTonnage = 1000.0;


  var setFuelConsumption = function () {
      var min = 16.0;
      var max = 30.0;
      fuelConsumption = Math.random() * (max - min) + min;
  };

  var setTonnage = function () {
      var min = 13.0;
      var max = 24.0;
      tonnage = Math.random() * (max - min) + min;
  };

  var setThroughput = function () {
      var min = 350.0;
      var max = 500.0;
      throughput = Math.random() * (max - min) + min;
  };

  var setTeamTonnage = function () {
      teamTonnage += tonnage;
  };

  console.log('user connected');
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  setTimeout(function() {
    setTeamTonnage();
  }, 10000);

  setTimeout(function () {
    setFuelConsumption();
    setTonnage();
    setThroughput();

    io.emit('data', {
        fuelConsumption: fuelConsumption, 
        tonnage: tonnage,
        throughput: throughput,
        teamTonnage: teamTonnage,
        currentTime: new Date().getTime()
    });
    console.log(teamTonnage);    
  }, 500);
    
});

http.listen(5000, () => {
  console.log('started on port 5000');
});