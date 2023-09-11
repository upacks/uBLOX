import { Loop, Safe, log } from 'utils'
import { Serial } from './serial'
import { F9P_Parser } from './parser'

Safe(() => {

    const GPS1 = new Serial()
    const Parser_1 = new F9P_Parser()

    GPS1.start('/dev/uGPS1', 115200)
    GPS1.on((chunk: any) => { log.info(`GPS1 -> ${chunk}`) })
    // Loop(() => console.log(Parser_1.getParsedSample('/dev/uGPS1')), 2000)

    const GPS2 = new Serial()
    const Parser_2 = new F9P_Parser()

    GPS2.start('/dev/uGPS2', 115200)
    GPS2.on((chunk: any) => { log.info(`GPS2 -> ${chunk}`) })
    // Loop(() => console.log(Parser_1.getParsedSample('/dev/uGPS2')), 2000)

})