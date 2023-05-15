import can from 'socketcan'
import { CommandExists, log, Safe } from 'utils'

/**
 * Linux: https://github.com/linux-can/can-utils
 * Node: https://github.com/sebi2k1/node-can
 */

export class Can {

    public channel

    constructor(path: string, baud: number) {

        this.channel = can.createRawChannel(path, true)
        this.channel.start()

    }

    check = () => Safe(() => {

        const python = CommandExists('python')
        const python3 = CommandExists('python3')
        const gcc = CommandExists('gcc')

        log[python ? 'success' : 'warn']('Python')
        log[python3 ? 'success' : 'warn']('Python3')
        log[gcc ? 'success' : 'warn']('GCC')

    })

    on = (cb) => this.channel.addListener("onMessage", (msg) => cb(msg))

    emit = (data) => this.channel.addListener("onMessage", this.channel.send, this.channel)

    close = () => this.channel.stop()

}