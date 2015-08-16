# Power Source

Simple utility that triggers a callback whenever a laptop's power source is changed to/from
Battery/AC

## Installation

```bash
$ npm install power-source
$ npm install -g power-source # installs `powersource` command
```

## Usage

```js
var power = require( 'power-source' );

power.on( 'state-change', function( state='AC|Battery' ) {
  ...
} );

// Automatically stops and starts a spawned child process based on the battery state.  Use this to,
// for instance, allow computationally heavy tasks to run on a laptop that auto-pause whenever
// running on battery
battery.bindChildToBatteryState( child_process, state='AC|Battery' );
```

TODO:
Optionally you can run this as a shell script:

```bash
$ batterypower
Battery

$ top | batterypower --state=Battery
```
