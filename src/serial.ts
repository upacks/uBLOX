import { ReadlineParser, SerialPort } from 'serialport'
import { CommandExists, log, PackageExists, Safe, Since } from 'utils'

export class Serial {

    public port
    public parser

    constructor(path: string, baud: number) {

        log.success(`Serial: Creating / ${path} / ${baud}`)

        this.port = new SerialPort({ path, baudRate: baud })
        this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
        const restart = new Since(5000)

        restart.call(() => this.port.open())

        this.port.on('open', () => log.success(`Serial: Open / ${path} / ${baud}`))

        this.port.on('close', () => {
            log.warn(`Serial: Close / ${path} / ${baud}`)
            restart.add()
        })

        this.port.on('error', (err) => {
            log.error(`Serial: Error / ${path} / ${baud} / ${err.message ?? 'UNK'}`)
            restart.add()
        })

    }

    check = () => Safe(() => {

        const python = CommandExists('python')
        const python3 = CommandExists('python3')
        const gcc = CommandExists('gcc')
        const serial = PackageExists('serialport')

        log[python ? 'success' : 'warn']('Python')
        log[python3 ? 'success' : 'warn']('Python3')
        log[gcc ? 'success' : 'warn']('GCC')
        log[serial ? 'success' : 'warn']('SerialPort')

    })

    on = (cb) => { this.parser.on('data', cb) }

    emit = (data) => this.port.write(data)

    close = () => this.port.close()

}