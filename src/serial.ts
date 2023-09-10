import { ReadlineParser, SerialPort } from 'serialport'
import { CommandExists, log, PackageExists, Safe, Since } from 'utils'

type iMessage = 'success' | 'info' | 'error' | 'warning' | 'loading'

export class Serial {

    private alias = ``
    public port
    public parser

    public onInfo = (msg: iMessage) => { }

    constructor() {
        // this.start(path, baud)
    }

    start = (path: string, baud: number) => {

        this.alias = `Serial [${path}:${baud}]`
        log.success(`${this.alias}: Connecting ...`) && this.onInfo('loading')

        const restart = new Since(5000)

        this.port = new SerialPort({ path, baudRate: baud })
        this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

        restart.call(() => Safe(() => {
            this.port.close()
            this.port.open()
        }))

        this.port.on('open', () => log.success(`${this.alias}: On.Open is called!`) && this.onInfo('success'))

        this.port.on('close', () => {
            log.warn(`${this.alias}: On.Close is called!`) && this.onInfo('warning')
            restart.add()
        })

        this.port.on('error', (err) => {
            log.error(`${this.alias}: On.Error is called / ${err.message ?? 'Unknown'}`) && this.onInfo('error')
            restart.add()
        })

    }

    on = (cb) => { this.parser.on('data', cb) }

    emit = (data) => this.port.write(data)

    check = () => Safe(() => {

        log.info(`${this.alias}: Just checking the modules ...`)
        log[CommandExists('python') ? 'success' : 'warn']('+ Python')
        log[CommandExists('python3') ? 'success' : 'warn']('+ Python3')
        log[CommandExists('gcc') ? 'success' : 'warn']('+ GCC')
        log[PackageExists('serialport') ? 'success' : 'warn']('+ SerialPort')

    })

    close = () => {
        try {
            this.port.close()
            log.success(`${this.alias}: Close(x) is executed!`)
        } catch (err: any) {
            log.success(`${this.alias}: While executing Close(x) / ${err.message}`)
        }
    }

}