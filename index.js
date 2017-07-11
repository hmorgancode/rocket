var five = require("johnny-five");
var board = new five.Board({
  // repl: false,
  // debug: false
});

let enabled = false;

board.on("ready", function() {

  // Get the pins providing power to the terrarium sensors
  // and explicitly turn power off.
  // (If sensors are left powered, they'll corrode.)

  const leftSidePower = new five.Pin(8);
  const rightSidePower = new five.Pin(11);
  if (!enabled) {
    console.log('enabling power');
    leftSidePower.write(1); // LOW, 0V, the default. Just making it explicit here.
    rightSidePower.write(1);
    enabled = true;
  }



  for (let i = 6; i < 10; ++i) {
    // let i = 4;
    this.analogRead(i, (voltage) => console.log(`pin ${i}: ${voltage}`));
  }

  // Water level analog pins:
  // pin 0: wacky
  // pin 1: wacky
  // pin 2: steady - 80
  // pin 3: steady - 80
  // pin 4: steady - 80
  // pin 5: steady - 80

  // Moisture analog pins:
  // pin 6:

  // pin 6: steady
  // pin 7:

  // // Turn sensor power back off
  // leftSidePower.write(0);
  // rightSidePower.write(0);

  // Note: pin 13 appears to output 5V even when you set it to 0.
  // This may have something to do with that time you short-circuited the board.

  // random code from messing around:

  // this.pinMode(3, five.Pin.INPUT);
  // this.digitalRead(3, function(value) {
  //   // board.info(value);
  //   console.log(value);
  // });

  // const sensorPin = new five.Pin('A0');
  // this.analogRead(0, (voltage) => console.log(voltage));
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
