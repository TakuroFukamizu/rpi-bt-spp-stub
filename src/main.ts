'use strict';

const GPIO = require('node-pi-gpio');

import {ButtonBehavior} from './lib/ButtonBehavior';
import {SerialManager} from './lib/SerialManager';


const CHANNEL = 10; // My service channel. Defaults to 1 if omitted.
const UUID = '38e851bc-7144-44b4-9cd8-80549c6f2912'; // My own service UUID. Defaults to '1101' if omitted

const serial = new SerialManager(UUID, CHANNEL);
let buttons : ButtonBehavior[] = [];

let extStartup : () => Promise<any>[];
let extDispose : () => Promise<any>[];

// --------------------------------------------
// YOUR APPLICATION START HERE
// --------------------------------------------

const PIN_LED_S = 14;

let led : any = null;

function sendCommand(text : string) {
    led.value(1);
    serial.sendTextAsync(text).then(() => {
        led.value(0);
    }).catch((e) => {
        console.error(e);
        led.value(0);
    });
}

// -----------

let btn1 = new ButtonBehavior('Button1 use GPIO19', 19);
btn1.setShortEvent((val) => {
    sendCommand('Button1 was clicked.');
});
btn1.setLongEvent(3, (val) => {
    sendCommand('Button1 was long-clicked.');
});
buttons.push(btn1);

let btn2 = new ButtonBehavior('Button2 use GPIO20', 20);
btn2.setShortEvent((val) => {
    sendCommand('Button2 was clicked.');
});
buttons.push(btn2);

extStartup = () => {
    return [ GPIO.open(PIN_LED_S, 'out').then((res:any) => {
        led = res; // LED
    }) ];
};

extDispose = () => {
    led.value(0);

    return [ 
        led.close() // LED
    ];
};

// --------------------------------------------
// YOUR APPLICATION END HERE
// --------------------------------------------

Promise.all(extStartup().concat(buttons.map( (btn) => btn.open() )) ).then(() => {
    // main process is runing...
    process.on('SIGINT', () => {
        Promise.all(extDispose().concat(buttons.map( (btn) => btn.close()) )).then(() => {
            process.exit();
        });
    });
}).catch((err:Error) => {
    console.error('err', err.stack);
});
    

