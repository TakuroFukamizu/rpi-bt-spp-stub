'use strict';

import {ButtonBehavior} from './lib/ButtonBehavior';
import {SerialManager} from './lib/SerialManager';
import {LedBehavior} from './lib/LedBehavior';


const CHANNEL = 10;
const UUID = '00001101-0000-1000-8000-00805F9B34FB'; //Bluetooth SPP generic

const serial = new SerialManager(UUID, CHANNEL);
let buttons : ButtonBehavior[] = [];

let extStartup : () => Promise<any>;
let extDispose : () => Promise<any>;

// --------------------------------------------
// YOUR APPLICATION START HERE
// --------------------------------------------

// Pin assigns
const PIN_BTN_B = 19; // Short(< 3sec), Long(< 5sec), Extra Long(5sec=<) 
const PIN_BTN_R = 20; // All
const PIN_LED_S = 4;

let led = new LedBehavior(PIN_LED_S); // LED // status led

async function sendCommand(text : string) {
    led.turnOn();
    try {
        await serial.sendTextAsync(text);
    } finally {
        led.turnOff();
    }
}

// -----------

let btnB = new ButtonBehavior('ButtonB', PIN_BTN_B);
btnB.setShortEvent(       (val) => { sendCommand('ButtonB Short'); });
btnB.setLongEvent(3,      (val) => { sendCommand('ButtonB Long:3sec'); });
btnB.setExtraLongEvent(5, (val) => { sendCommand('ButtonB ExtraLong:5sec'); });
buttons.push(btnB);

let btnR = new ButtonBehavior('ButtonR', PIN_BTN_R);
btnR.setShortEvent(       (val) => { sendCommand('ButtonR All'); });
buttons.push(btnR);

extStartup = async () => {
    await led.init();
};

extDispose = async () => {
    await led.dispose();
};

// --------------------------------------------
// YOUR APPLICATION END HERE
// --------------------------------------------

// main process
(async () => {
    console.info('start ini...');

    try {
        await extStartup();
        await buttons.forEach( (btn) => btn.open());
    } catch(e) {
        console.error('init is failed', e);
        process.exit(1);
    } 

    // main process is runing...
    console.info('running');

    process.on('SIGINT', async () => {
        await extDispose();
        await buttons.forEach( (btn) => btn.close());
        process.exit();
    });
})();

