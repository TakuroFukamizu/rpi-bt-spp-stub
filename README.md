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

### Build and run

build scripts

```bash
$ npm run build
```

run script

```bash
$ node dist/main.js
```