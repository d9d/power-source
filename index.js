#!/usr/bin/env node
var exec = require( 'child_process' ).execSync;
var cbs  = [];

var lastState;
var intervalTime;
var intervalProcess;

function pmset( cb, onchange ){
	var stdout = exec( 'pmset -g ps', {
	    stdio   : 'ignore'
	  , timeout : 2000
	} ) + '';

	var state = ~stdout.indexOf( 'AC Power' ) ? 'AC' : 'Battery';
	var i;
  var l;

	if( lastState !== state ){
		for( i=0, l=cbs.length; i<l; i++ ){
			cbs[ i ]( null, state );
		}

		lastState = state;
	}
}

module.exports.onBatteryChange = function( cb, interval ){
	interval || ( interval = 10 );

	if( !intervalTime || ( intervalTime > interval ) ){
		intervalProcess && clearInterval( intervalProcess );
		intervalProcess = setInterval( pmset, 1000*interval );
		intervalTime    = interval;
	}

	cbs.push( cb );

	pmset();
};

module.exports.bindChildToBatteryState = function( child, batteryState, interval ){
	if( batteryState !== lastState ){ child.kill( 'SIGSTOP' ); }

	module.exports.onBatteryChange( function( err, state ){
		if( !err ){
			child.kill( ( state === batteryState ) ? 'SIGCONT' : 'SIGSTOP' );
		}
	}, interval );
};

// write to stdout if shell script
if( require.main === module ){
	pmset();
    console.log( exec( 'jobs -p', {stdio : 'ignore'}) );
}
