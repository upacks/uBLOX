import { Safe, log } from 'utils'
import { Serial } from './serial'

Safe(() => {

    const serial = new Serial()
    serial.onInfo = (sms) => {
        log.info(` ---> ${sms}`)
    }
    serial.start('/dev/ttyS0', 115200)
    serial.check()

})
