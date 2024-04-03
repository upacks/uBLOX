"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serial = void 0;
const serialport_1 = require("serialport");
const utils_1 = require("utils");
class Serial {
    alias = ``;
    port;
    parser;
    onInfo = (type, _log) => utils_1.log[_log.type](_log.message);
    constructor() { }
    check = () => (0, utils_1.Safe)(() => {
        utils_1.log.info(`${this.alias}: Checking required modules ...`);
        utils_1.log[(0, utils_1.PackageExists)('serialport') ? 'success' : 'warn']('+ SerialPort');
    });
    start = (path, baud) => {
        this.alias = `Serial [${path}:${baud}]`;
        this.onInfo('loading', { type: 'success', message: `${this.alias}: Connecting ...` });
        const restart = new utils_1.Since(10 * 1000);
        this.port = new serialport_1.SerialPort({ path, baudRate: baud });
        this.parser = this.port.pipe(new serialport_1.ReadlineParser({ delimiter: '\r\n' }));
        restart.call(() => (0, utils_1.Safe)(() => {
            (0, utils_1.Delay)(() => this.onInfo('loading', { type: 'warn', message: `${this.alias}: Trying to close ...` }), 1000);
            (0, utils_1.Delay)(() => this.port.close(), 2000);
            (0, utils_1.Delay)(() => this.onInfo('loading', { type: 'info', message: `${this.alias}: Trying to open ...` }), 3000);
            (0, utils_1.Delay)(() => this.port.open(), 4000);
        }));
        this.port.on('open', () => {
            this.onInfo('success', { type: 'success', message: `${this.alias}: On.Open is called!` });
            restart.last = 0;
        });
        this.port.on('close', () => {
            this.onInfo('warning', { type: 'warn', message: `${this.alias}: On.Close is called!` });
            restart.add();
        });
        this.port.on('error', (err) => {
            const message = typeof err.message === 'string' ? err.message.replace('Error: ', '') : 'Unknown error';
            this.onInfo('error', { type: 'error', message: `${this.alias}: ${message}` });
            restart.add();
        });
    };
    on = (cb) => {
        try {
            this.parser.on('data', cb);
        }
        catch (err) {
            this.onInfo('error', { type: 'error', message: `${this.alias}: While reading / ${err.message}` });
        }
    };
    emit = (data) => {
        try {
            this.port.write(data);
        }
        catch (err) {
            this.onInfo('error', { type: 'error', message: `${this.alias}: While writing / ${err.message}` });
        }
    };
    close = () => {
        try {
            this.port.close();
        }
        catch (err) {
            this.onInfo('error', { type: 'error', message: `${this.alias}: While closing / ${err.message}` });
        }
    };
}
exports.Serial = Serial;
//# sourceMappingURL=serial.js.map