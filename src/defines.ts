
import {ButtonBehavior} from './lib/ButtonBehavior';

// Button Pin assigns
const PIN_BTN_B = 24; // Short = MENU TOGGLE: {B:S}, Long = FUEL ALERT: {B:L} 
const PIN_BTN_R = 24; // All = VOLUME UP: {R:S}
// const PIN_BTN_L = 24; // All = VOLUME DOWN: {L:S} 
// const PIN_BTN_S = 24; // Short = SELECT: {S:S}, Long = BACK: {S:L}, Extra Long = INSURANCE ALERT: {S:E}
// const PIN_BTN_P = 24; // Short = PREVIOUS: {P:S}, Long = ENGINE ALERT: {P:L}
// const PIN_BTN_N = 24; // Short = NEXT: {N:S}, Long = SERVICE ALERT: {N:L}


class Defines {
    buttons() : ButtonBehavior[] {
        let buttons : ButtonBehavior[] = [];

        let btnB = new ButtonBehavior('B', PIN_BTN_B);
        btnB.setShortEvent((val) => {
            sendCommand('{B:S}');
        });
        btnB.setLongEvent(3, (val) => {
            sendCommand('{B:L}');
        });
        buttons.push(btnB);

        let btnR = new ButtonBehavior('R', PIN_BTN_R);
        btnR.setShortEvent((val) => {
            sendCommand('{R:S}');
        });
        buttons.push(btnR);
        
        return buttons;
    }
}


export const defines = new Defines();