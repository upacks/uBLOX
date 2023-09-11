/**
 * Linux: https://github.com/linux-can/can-utils
 * Node: https://github.com/sebi2k1/node-can
 */
/* import can from 'socketcan'
import { CommandExists, log, Safe } from 'utils'

export class Can {

    public channel

    constructor(path: string, baud: number) {

        this.channel = can.createRawChannel(path, true)
        this.channel.start()

    }

    check = () => Safe(() => {

        log.info(`${this.alias}: Just checking the modules ...`)
        log[CommandExists('python') ? 'success' : 'warn']('+ Python')
        log[CommandExists('python3') ? 'success' : 'warn']('+ Python3')
        log[CommandExists('gcc') ? 'success' : 'warn']('+ GCC')
        log[PackageExists('serialport') ? 'success' : 'warn']('+ SerialPort')

    })

    on = (cb) => this.channel.addListener("onMessage", (msg) => cb(msg))

    emit = (data) => this.channel.addListener("onMessage", this.channel.send, this.channel)

    close = () => this.channel.stop()

} */ 
//# sourceMappingURL=canbus.js.map