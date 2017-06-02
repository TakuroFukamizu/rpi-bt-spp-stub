
const server = new(require('bluetooth-serial-port')).BluetoothSerialPortServer();

export class SerialManager {
    server : any;
    newLine : String;

    constructor(uuid: string, channel: number) {
        this.newLine = '\n';
        this.server = server;
        server.listen((clientAddress:string) => {
            console.log('Client: ' + clientAddress + ' connected!');
            server.on('data', function(buffer : Buffer) {
                console.log('Received data from client: ' + buffer);
            });
        },(error:any) => {
            console.error("Something wrong happened!:" + error);
        },{
            uuid: uuid, 
            channel: channel
        });
    }
    sendTextAsync(text : string, withNewLine=true) {
        if (!this.server.isOpen()) return Promise.reject(new Error('not connected'));
        
        return new Promise((resolve, reject) => {
            let value = withNewLine ? new Buffer(text+this.newLine) : new Buffer(text);
            this.server.write(value, (err:any, bytesWritten:number) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`send message : ${text}`);
                    resolve();
                }
            });
        });
    }
}
