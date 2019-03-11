const Serialport = require("serialport");
const Board = require("firmata");


const path = require('path');
const Max = require('max-api');

// This will be printed directly to the Max console
Max.post(`Loaded the ${path.basename(__filename)} script`);

// Use the 'addHandler' function to register a function for a particular message
Max.addHandler("bang", () => {
  Max.post("Who you think you bangin'?");
});

// Use the 'outlet' function to send messages out of node.script's outlet
Max.addHandler("echo", (msg) => {
  Max.outlet(msg);
});


Board.requestPort((error, port) => {
  if (error) {
    console.log(error);
    return;
  }

  const board = new Board(port.comName);

  console.log(__filename);
  console.log("------------------------------");

  Max.outlet('initializing');

  board.on("open", () => {
    Max.outlet('open');
  });

  Max.addHandler("AO", (data1, data2) => {
    board.pinMode(3, board.MODES.PWM);
    board.analogWrite(3, data1)
  });


  var timeout = setTimeout(() => {
    Max.outlet('connecting');
    board.pinMode(7, board.MODES.INPUT);
    board.digitalRead(7, (data) => {
      Max.outlet(`7 DI ${data}`);
    });


    board.pinMode(0, board.MODES.ANALOG);
    board.analogRead(0, (data) => {
      Max.outlet(`0 AI ${data}`);
    });
    Max.outlet('connected');
  }, 4000);

});
