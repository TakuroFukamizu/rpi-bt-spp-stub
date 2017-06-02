const Gpio = require('onoff').Gpio;

/**
 * ButtonBehavior model
 * GPIOを使用したボタンの操作モデル
 */
export class ButtonBehavior {
    name : string;
    pin : number;
    gpio : any = null; // GPIO instance

    private _shortEvent : ButtonEventCallback | null = null;
    private _longEvent : ButtonEventCallback | null = null;
    private _extraLongEvent : ButtonEventCallback | null = null;

    private _secLongPress : number = 3;
    private _secExtraLongPress : number = 4;

    private _startChangeTime : number = 0;

    private _prevValue : number | null = null;

    constructor(name : string, pin : number) {
        this.name = name;
        this.pin = pin;
    }

    async open() {
        try {
            this.gpio = new Gpio(this.pin, 'in', 'both');
            this._prevValue = this.gpio.readSync();
        } catch (e) {
            throw e;
        }

        this.gpio.watch((err: any, val: number) => {
            this._watch(err, val);
        });
        return this;
    }

    close() {
        this.gpio.unexport(); // GPIOポートを解放
    }

    _watch(err: any, val: number) {
        if (err) {
            console.error(this.name, this.pin, err);
            return;
        }

        console.log(`${this.pin} is changed : ${this._prevValue} -> ${val}`);

        if (this._prevValue === 0 && val === 1) { // not push -> push
            this._onPushStart();
        } else if (this._prevValue === 1 && val === 0) { // push -> not push
            this._onPushEnd();
        } else {
            console.error(`unhandled status`);
        }
        this._prevValue = val;
    }

    _onPushStart() {
        this._startChangeTime = new Date().getTime();
    }
    _onPushEnd() {
        let now = new Date().getTime();
        let elapsed = now - this._startChangeTime; // onPushStartからの経過時間(millisecs)
        try {
            if( (this._extraLongEvent !== null) && ((this._secExtraLongPress * 100) <= elapsed) ) { // ExtraLongの定義時間より長い
                this._extraLongEvent(this);
            } else if( (this._longEvent !== null) && ((this._secLongPress * 100) <= elapsed) )  { // Longの定義時間より長い
                this._longEvent(this);
            } else {
                if(this._shortEvent == null) {
                    console.error('event is empty!');
                    return;
                }
                this._shortEvent(this);
            }
        } catch (e) {
            console.error('internal error on button event : ', e.stacTrace() || e.name || e.toString() );
            // 握りつぶす
        } finally {
            this._startChangeTime = 0;
        }
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
    (self : ButtonBehavior) : void;
}

