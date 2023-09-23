import { ReadlineParser, SerialPort } from 'serialport'
import { Delay, log, PackageExists, Safe, Since } from 'utils'

type iMessage = 'success' | 'info' | 'error' | 'warning' | 'loading'

export class Serial {

    private alias = ``
    public port
    public parser

    public onInfo = (type: iMessage, _log: { type: string, message: string }) => log[_log.type](_log.message)

    constructor() { }

    check = () => Safe(() => {

        log.info(`${this.alias}: Checking required modules ...`)
        log[PackageExists('serialport') ? 'success' : 'warn']('+ SerialPort')

    })

    start = (path: string, baud: number) => {

        this.alias = `Serial [${path}:${baud}]`
        this.onInfo('loading', { type: 'success', message: `${this.alias}: Connecting ...` })

        const restart = new Since(10 * 1000)

        this.port = new SerialPort({ path, baudRate: baud })
        this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

        restart.call(() => Safe(() => {

            Delay(() => this.onInfo('loading', { type: 'warn', message: `${this.alias}: Trying to close ...` }), 1000)
            Delay(() => this.port.close(), 2000)
            Delay(() => this.onInfo('loading', { type: 'info', message: `${this.alias}: Trying to open ...` }), 3000)
            Delay(() => this.port.open(), 4000)

        }))

        this.port.on('open', () => {
            this.onInfo('success', { type: 'success', message: `${this.alias}: On.Open is called!` })
        })

        this.port.on('close', () => {
            this.onInfo('warning', { type: 'warn', message: `${this.alias}: On.Close is called!` })
            restart.add()
        })

        this.port.on('error', (err) => {

            const message = typeof err.message === 'string' ? err.message.replace('Error: ', '') : 'Unknown error'
            this.onInfo('error', { type: 'error', message: `${this.alias}: ${message}` })
            restart.add()

        })

    }

    on = (cb) => {
        try {
            this.parser.on('data', cb)
        } catch (err: any) {
            this.onInfo('error', { type: 'error', message: `${this.alias}: While reading / ${err.message}` })
        }
    }

    emit = (data) => {
        try {
            this.port.write(data)
        } catch (err: any) {
            this.onInfo('error', { type: 'error', message: `${this.alias}: While writing / ${err.message}` })
        }
    }

    close = () => {
        try {
            this.port.close()
        } catch (err: any) {
            this.onInfo('error', { type: 'error', message: `${this.alias}: While closing / ${err.message}` })
        }
    }

}