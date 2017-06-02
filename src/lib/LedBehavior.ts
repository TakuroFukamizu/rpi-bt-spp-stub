
const Gpio = require('onoff').Gpio;

/**
 * GPIO操作 LEDクラス
 */
export class LedBehavior {
    gpio : any = null;
    timerIv : any = null;
    enabled : boolean = false;
    pin : number;

    constructor(pin: number) {
        this.pin = pin;
    }
    init() {
        this.timerIv = null;
        this.gpio = new Gpio(this.pin, 'out');
        this.enabled = true;
    }
    /** 点灯させる */
    turnOn() {
        if (!this.enabled) return;
        if (this.timerIv) {
            clearInterval(this.timerIv); // 点滅LEDをストップ
            this.timerIv = null;
        }
        this.gpio.writeSync(1); //ON
    }
    /** 消灯させる */
    turnOff() {
        if (!this.enabled) return;
        if (this.timerIv) {
            clearInterval(this.timerIv); // 点滅LEDをストップ
            this.timerIv = null;
        }
        this.gpio.writeSync(0); //OFF
    }
    /** 点滅させる */
    toggle() {
        if (!this.enabled) return;
        this.gpio.writeSync(this.gpio.readSync() === 0 ? 1 : 0);
    }
    /** 指定ミリ秒で点滅させる */
    startBlink(millisec:number) {
        // 1秒間隔で点滅
        this.timerIv = setInterval(() => {
            this.toggle();
        }, millisec);
    }
    /** 点滅を停止する */
    stopBlink() {
        this.turnOff();
    }
    dispose() {
        this.turnOff(); //OFF
        this.gpio.unexport(); // GPIOポートを解放
        this.enabled = false;
    }
}