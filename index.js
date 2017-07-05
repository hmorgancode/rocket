var five = require("johnny-five");
var board = new five.Board({
  // repl: false,
  // debug: false
});

board.on("ready", function() {

  // this.pinMode(3, five.Pin.INPUT);
  // this.digitalRead(3, function(value) {
  //   // board.info(value);
  //   console.log(value);
  // });

  // Output 5V via pin 4 to short transistor circuit
  const powerPin = new five.Pin(13);
  powerPin.write(1); // HIGH, 5V

  // const sensorPin = new five.Pin('A0');
  this.analogRead(0, (voltage) => console.log(voltage));
  // this.pinMode(4, five.Pin.OUTPUT);
  // powerPin.query((state) => console.log(state));

  // this.pinMode('A0', five.Pin.ANALOG);
  // this.analogRead('A0', (voltage) => console.log(voltage));



  /*
    Initialize pin 13, which
    controls the built-in LED
  */
  var led = new five.Led(13);
  led.on();
  // this.repl.inject({
  //   led: led
  // });

});
