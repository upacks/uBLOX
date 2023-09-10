import { Safe, log } from 'utils'
import { Serial } from './serial'

Safe(() => {

    const GPS1 = new Serial()
    GPS1.start('/dev/uGPS1', 115200)
    GPS1.on((chunk: any) => { log.info(`GPS1 -> ${chunk}`) })

    const GPS2 = new Serial()
    GPS2.start('/dev/uGPS2', 115200)
    GPS2.on((chunk: any) => { log.info(`GPS2 -> ${chunk}`) })

})