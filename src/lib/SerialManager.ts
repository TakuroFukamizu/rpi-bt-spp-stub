
const server = new(require('bluetooth-serial-port')).BluetoothSerialPortServer();

export class SerialManager {
    server : any;

    constructor(uuid: string, channel: number) {
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
    sendTextAsync(text : string) {
        return new Promise((resolve, reject) => {
            this.server.write(new Buffer(text), (err:any, bytesWritten:Buffer) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Send ' + bytesWritten + ' to the client!');
                    resolve();
                }
            });
        });
    }
}
