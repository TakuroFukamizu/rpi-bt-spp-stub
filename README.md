# RPI-BT-SPP-STUB

## What?
Bluetooth SPP Profile Stub work on Raspberry Pi 3

```
+-----------------+     +------------+      +------------------+
|  Button (GPIO)  +---->+  THIS APP  +----->+  Bluetooth(SPP)  |
+-----------------+     +------------+      +------------------+
```

## Requirements
- Raspberry Pi 3
- node.js v6
- npm

## How to use

### Preparation

install packages
```bash
$ apt-get install build-essential libbluetooth-dev
$ npm i
```

```bash
$ sudo vi /lib/systemd/system/bluetooth.service
```

and adding the --compat flag to the ExecStart value:

```
ExecStart=/usr/lib/bluetooth/bluetoothd--compat
```

```
$ sudo systemctl daemon-reload
$ sudo systemctl restart bluetooth
$ sudo chmod 777 /var/run/sdp
$ sudo hciconfig hci0 up
$ sudo hciconfig hci0 piscan
```

### Build and run

build scripts

```bash
$ npm run build
```

run script

```bash
# execute generated script.
$ npm run start
```