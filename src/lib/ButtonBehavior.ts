// import * as GPIO from 'node-pi-gpio';
const GPIO = require('node-pi-gpio');

/**
 * ButtonBehavior model
 * GPIOを使用したボタンの操作モデル
 */
export class ButtonBehavior {
    name : string;
    pin : number;
    gpio : any = null; // GPIO instance

    private _shortEvent : ButtonEventCallback | null;
    private _longEvent : ButtonEventCallback | null;
    private _extraLongEvent : ButtonEventCallback | null;

    private _secLongPress : number = 3;
    private _secExtraLongPress : number = 4;

    private _startChangeTime : number = 0;

    constructor(name : string, pin : number) {
        this.name = name;
        this.pin = pin;
    }

    open() {
        return GPIO.open(this.pin, 'in').then((gpio:any) => {
            this.gpio = gpio;
            this.gpio.on('change', (val:number) => {
                console.log('change', val);
                let now = new Date().getTime();
                let elapsed = now - this._startChangeTime;
                if( (this._extraLongEvent !== null) && ((this._secExtraLongPress * 100) <= elapsed) ) { // ExtraLongの定義時間より長い
                    this._extraLongEvent(val);
                } else if( (this._longEvent !== null) && ((this._secLongPress * 100) <= elapsed) )  { // Longの定義時間より長い
                    this._longEvent(val);
                } else {
                    if(this._shortEvent == null) {
                        console.error('event is empty!');
                        return;
                    }
                    this._shortEvent(val);
                }
                this._startChangeTime = new Date().getTime();
            });
        });
    }

    close() {
        return this.gpio.close();
    }

    setShortEvent(callback : ButtonEventCallback) {
        this._shortEvent = callback;
    }

    setLongEvent(sec : number, callback : ButtonEventCallback) {
        this._secLongPress = sec;
        this._longEvent = callback;
    }

    setExtraLongEvent(sec : number, callback : ButtonEventCallback) {
        this._secExtraLongPress = sec;
        this._extraLongEvent = callback;
    }
}

export interface ButtonEventCallback {
    (value : number) : void;
}

